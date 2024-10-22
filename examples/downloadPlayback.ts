import dotenv from 'dotenv';
import { homedir } from 'os';
import { join } from 'path';
import Camera from 'reolinkapi'; // Assuming this is your Camera class

interface CameraConfig {
  ip: string;
  username: string;
  password: string;
}

/**
 * Reads camera configuration from .env file
 *
 * Environment variables needed in .env:
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

async function downloadVideos(): Promise<string[]> {
  // Read in your ip, username, & password
  const config = readConfig();

  // Connect to camera
  const cam = new Camera(config.ip, config.username, config.password);

  // Set time range for video download
  const end = new Date();
  const start = new Date(end.getTime() - 10 * 60000); // 10 minutes ago
  const channel = 0;

  // Get video files for the time range
  const files = await cam.get_playback_files({
    start,
    end,
    channel,
  });

  console.log('Found files:', files);

  // Set download directory to user's Downloads folder
  const downloadDir = join(homedir(), 'Downloads');
  const downloadedFiles: string[] = [];

  // Download each file
  for (const fname of files) {
    console.log(`Downloading: ${fname}`);
    const outputPath = join(downloadDir, fname);

    try {
      await cam.get_file(fname, outputPath);
      downloadedFiles.push(outputPath);
    } catch (error) {
      console.error(`Error downloading ${fname}:`, error);
    }
  }

  return downloadedFiles;
}

// Execute the script
downloadVideos()
  .then((files) => {
    console.log('Successfully downloaded files:');
    files.forEach((file) => console.log(file));
  })
  .catch((error) => {
    console.error('Error during video download:', error);
    process.exit(1);
  });
