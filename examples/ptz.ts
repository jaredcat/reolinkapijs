import 'dotenv/config';
import Camera from 'reolinkapi';

const { CAMERA_IP, CAMERA_USERNAME, CAMERA_PASSWORD, CAMERA_HTTPS } =
  process.env;

if (!CAMERA_IP) {
  throw new Error('CAMERA_IP environment variable is required');
}

const cam = new Camera(
  CAMERA_IP,
  CAMERA_USERNAME,
  CAMERA_PASSWORD,
  CAMERA_HTTPS === 'true',
);

try {
  // Example of moving the camera
  console.log('Moving camera left...');
  await cam.moveLeft();
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log('Stopping movement...');
  await cam.stopMovement();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Zooming in...');
  await cam.startZoomingIn();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log('Stopping zoom...');
  await cam.stopZooming();
} catch (error) {
  console.error('Error controlling camera:', error);
  process.exit(1);
}
