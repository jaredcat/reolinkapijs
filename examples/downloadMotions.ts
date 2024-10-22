import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';
import Camera from 'reolinkapi'; // Assuming this is your Camera class

interface CameraConfig {
  ip: string;
  username: string;
  password: string;
}

interface MotionFile {
  filename: string;
  // Add other properties that might be in the motion object
}

/**
 * Helper function to get start of day
 */
function getStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * Helper function to get end of day
 */
function getEndOfDay(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

/**
 * Reads camera configuration from .env file
 *
 * NB! this .env file is kept out of commits with .gitignore. The structure of this file is such:
 * # .env
 * CAMERA_IP=your_ip_address
 * CAMERA_USERNAME=your_username
 * CAMERA_PASSWORD=your_password
 */
function readConfig(): CameraConfig {
  const result = dotenv.config();

  if (result.error) {
    throw new Error('Error loading .env file');
  }

  const { CAMERA_IP, CAMERA_USERNAME, CAMERA_PASSWORD } = process.env;

  if (!CAMERA_IP || !CAMERA_USERNAME || !CAMERA_PASSWORD) {
    throw new Error(
      'Missing required environment variables. Please check your .env file',
    );
  }

  return {
    ip: CAMERA_IP,
    username: CAMERA_USERNAME,
    password: CAMERA_PASSWORD,
  };
}

async function downloadMotionEvents(): Promise<string[]> {
  // Read in your ip, username, & password
  const config = readConfig();

  // Connect to camera
  const cam = new Camera(config.ip, config.username, config.password, true);

  // Get today's events
  const now = new Date();
  const startToday = getStartOfDay(now);
  let processedMotions: MotionFile[] = [];

  // Collect motion events between these timestamps for substream
  const motionsChannel0 = await cam.get_motion_files({
    start: startToday,
    end: now,
    streamtype: 'main',
    channel: 0,
  });

  const motionsChannel1 = await cam.get_motion_files({
    start: startToday,
    end: now,
    streamtype: 'main',
    channel: 1,
  });

  // Get yesterday's events
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const endYesterday = getEndOfDay(yesterday);

  const motionsYesterday = await cam.get_motion_files({
    start: yesterday,
    end: endYesterday,
    streamtype: 'main',
    channel: 1,
  });

  processedMotions = [
    ...motionsChannel0,
    ...motionsChannel1,
    ...motionsYesterday,
  ];

  const outputFiles: string[] = [];

  // Download each motion file
  for (const motion of processedMotions) {
    const fname = motion.filename;
    // Download the mp4
    console.log(`Getting ${fname}`);

    const outputPath = join('/tmp', fname.replace(/\//g, '_'));
    outputFiles.push(outputPath);

    if (!existsSync(outputPath)) {
      await cam.get_file(fname, outputPath);
    }
  }

  return outputFiles;
}

// Execute the script
downloadMotionEvents()
  .then((files) => console.log('Downloaded files:', files))
  .catch((error) => console.error('Error:', error));
