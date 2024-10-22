import BaseAPIHandler from "@handlers/baseApiHandler";
import { Mat } from "@u4/opencv4nodejs";
import RtspClient from "@utils/rtspClient";
import axios from "axios";
import sharp from "sharp";

// Type definitions
interface ProxyConfig {
  host: string;
  port: number;
}

type CallbackFunction = (frame: Mat) => void;

interface SnapParams {
  cmd: string;
  channel: number;
  rs: string;
  user: string;
  password: string;
}

/**
 * API calls for opening a video stream or capturing an image from the camera.
 */
class StreamAPIMixin extends BaseAPIHandler {
  protected profile: string = "main"; // Add this property if not in BaseAPIHandler

  /**
   * Generates a random string for request parameters
   * @param length Length of the random string
   * @returns Random string of specified length
   */
  private generateRandomString(length: number): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from(
      { length },
      () => characters[Math.floor(Math.random() * characters.length)],
    ).join("");
  }

  /**
   * Opens a video stream from the camera
   * @see https://support.reolink.com/hc/en-us/articles/360007010473-How-to-Live-View-Reolink-Cameras-via-VLC-Media-Player
   * @param callback Optional callback function to handle frames
   * @param proxies Optional proxy configuration
   * @returns AsyncGenerator that yields video frames
   */
  async *openVideoStream(
    callback?: CallbackFunction,
    proxies?: ProxyConfig,
  ): AsyncGenerator<Mat> | Promise<void> {
    const rtspClient = new RtspClient({
      ip: this.ip,
      username: this.username,
      password: this.password,
      profile: this.profile,
      proxies,
      callback,
    });

    yield* rtspClient.openStream();
  }

  /**
   * Gets a "snap" of the current camera video data
   * @param timeout Request timeout to camera in seconds
   * @param proxies http/https proxies to pass to the request object
   * @returns Promise resolving to Sharp image object or null
   */
  async getSnap(
    timeout: number = 3,
    proxies?: ProxyConfig,
  ): Promise<sharp.Sharp | null> {
    const params: SnapParams = {
      cmd: "Snap",
      channel: 0,
      rs: this.generateRandomString(10),
      user: this.username,
      password: this.password,
    };

    try {
      const response = await axios.get(this.url, {
        params,
        proxy: proxies,
        timeout: timeout * 1000, // Convert to milliseconds
        responseType: "arraybuffer",
      });

      if (response.status === 200) {
        return sharp(Buffer.from(response.data));
      }

      console.log(
        "Could not retrieve data from camera successfully. Status:",
        response.status,
      );
      return null;
    } catch (error) {
      console.error("Could not get Image data\n", error);
      throw error;
    }
  }
}

export default StreamAPIMixin;
