import axios from 'axios';
import { BaseAPIHandler } from '../handlers';
import { Image } from './types/image';
import { RtspClient } from './utils/rtsp_client';

class StreamAPIMixin extends BaseAPIHandler {
  private generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from(
      { length },
      () => characters[Math.floor(Math.random() * characters.length)],
    ).join('');
  }

  async openVideoStream(
    callback?: (frame: any) => void,
    proxies?: any,
  ): Promise<any> {
    const rtspClient = new RtspClient({
      ip: this.ip,
      username: this.username,
      password: this.password,
      profile: this.profile,
      proxies,
      callback,
    });
    return rtspClient.openStream();
  }

  async getSnap(timeout: number = 3, proxies?: any): Promise<Image | null> {
    const data = {
      cmd: 'Snap',
      channel: 0,
      rs: this.generateRandomString(10),
      user: this.username,
      password: this.password,
    };

    try {
      const response = await axios.get(this.url, {
        params: data,
        timeout: timeout * 1000,
        proxy: proxies,
        responseType: 'arraybuffer',
      });

      if (response.status === 200) {
        // You'll need to implement this function to create an Image from the response data
        return this.createImageFromBuffer(response.data);
      }

      console.log(
        'Could not retrieve data from camera successfully. Status:',
        response.status,
      );
      return null;
    } catch (e) {
      console.error('Could not get Image data', e);
      throw e;
    }
  }

  private createImageFromBuffer(buffer: ArrayBuffer): Image {
    // Implement this method to create an Image object from the buffer
    // This will depend on how you want to handle images in your TypeScript project
    throw new Error('Method not implemented');
  }
}

export default StreamAPIMixin;
