import axios, { AxiosInstance } from 'axios';
import https from 'https';
import Camera from 'reolinkapi';
import tls from 'tls';

// Create custom HTTPS agent with specific SSL/TLS settings
const createCustomHttpsAgent = () => {
  return new https.Agent({
    // Equivalent to ctx.check_hostname = False
    rejectUnauthorized: false,
    // Equivalent to setting specific ciphers
    secureOptions: tls.SSL_OP_NO_TLSv1 | tls.SSL_OP_NO_TLSv1_1,
    ciphers: 'AES128-GCM-SHA256',
  });
};

// Create Axios instance with custom SSL configuration
const createCustomSession = (): AxiosInstance => {
  return axios.create({
    httpsAgent: createCustomHttpsAgent(),
    // Disable SSL certificate validation (equivalent to urllib3.disable_warnings())
    validateStatus: () => true,
  });
};

// Example usage
const session = createCustomSession();
const cam = new Camera(
  'url',
  'user',
  'password',
  true, // https
  false, // deferLogin
  'main', // profile
  { session },
);

// Now you can use the camera instance
cam.reboot_camera();
