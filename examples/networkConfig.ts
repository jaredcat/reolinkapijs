import dotenv from 'dotenv';
import Camera from 'reolinkapi'; // Assuming this is your Camera class

interface CameraConfig {
  ip: string;
  username: string;
  password: string;
}

interface NetworkSettings {
  value: {
    LocalLink: {
      mac: string;
      [key: string]: any;
    };
    [key: string]: any;
  }[];
}

interface NetworkConfigParams {
  ip: string;
  gateway: string;
  mask: string;
  dns1: string;
  dns2: string;
  mac: string;
  use_dhcp: boolean;
  auto_dns: boolean;
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

async function configureNetworkSettings(): Promise<void> {
  // Read in your ip, username, & password
  const config = readConfig();

  // Connect to camera
  const cam = new Camera(config.ip, config.username, config.password);

  try {
    // Get current network settings
    const currentSettings =
      (await cam.get_network_general()) as NetworkSettings;
    console.log('Current settings:', JSON.stringify(currentSettings, null, 2));

    const mac = currentSettings[0].value.LocalLink.mac;

    // Configure DHCP
    await cam.set_network_settings({
      ip: '',
      gateway: '',
      mask: '',
      dns1: '',
      dns2: '',
      mac: mac,
      use_dhcp: true,
      auto_dns: true,
    });

    // Example of configuring static IP (commented out)
    /*
    await cam.set_network_settings({
      ip: "192.168.1.102",
      gateway: "192.168.1.1",
      mask: "255.255.255.0",
      dns1: "8.8.8.8",
      dns2: "8.8.4.4",
      mac: mac,
      use_dhcp: false,
      auto_dns: false
    });
    */

    console.log('Network settings updated successfully');
  } catch (error) {
    console.error('Error configuring network settings:', error);
    throw error;
  }
}

// Execute the script
configureNetworkSettings()
  .then(() => console.log('Network configuration completed'))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
