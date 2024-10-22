import 'dotenv/config';
import { existsSync } from 'fs';
import { mkdirp } from 'mkdirp';
import { beforeAll, beforeEach, describe, expect, test } from 'vitest';
import Camera from './camera';

interface CameraConfig {
  camera: {
    ip: string;
    username: string;
    password: string;
    https?: boolean;
  };
}

describe('Camera', () => {
  let config: CameraConfig;
  let cam: Camera;

  beforeAll(() => {
    config = {
      camera: {
        ip: process.env.CAMERA_IP,
        username: process.env.CAMERA_USERNAME,
        password: process.env.CAMERA_PASSWORD,
        https: process.env.CAMERA_HTTPS === 'true' ? true : false,
      },
    } as CameraConfig;
  });

  beforeEach(() => {
    cam = new Camera(
      config.camera.ip,
      config.camera.username,
      config.camera.password,
      config.camera.https,
    );
  });

  test('camera connects and gets a token', () => {
    expect(cam['ip']).toBe(config.camera.ip);
    expect(cam['token']).not.toBe('');
  });

  test('snapshot functionality', async () => {
    const img = await cam.getSnap();

    // Ensure the directory exists
    const outputPath = '../tmp/snaps/';
    await mkdirp(outputPath);

    const outputFilePath = `${outputPath}camera.jpg`;

    // Using sharp to save the image
    await img?.jpeg().toFile(outputFilePath);

    expect(existsSync(outputFilePath)).toBe(true);
  });
});
