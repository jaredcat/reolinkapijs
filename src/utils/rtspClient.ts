import cv, { Mat, VideoCapture } from '@u4/opencv4nodejs';
import EventEmitter from 'events';

interface RtspConfig {
  ip: string;
  username: string;
  password: string;
  port?: number;
  profile?: string;
  useUdp?: boolean;
  callback?: (frame: Mat) => void;
  proxies?: {
    host: string;
    port: number;
  };
}

/**
 * This is a wrapper of the OpenCV VideoCapture method for RTSP streaming
 */
class RtspClient extends EventEmitter {
  private capture: VideoCapture | null = null;
  private threadCancelled: boolean = false;
  private callback?: (frame: Mat) => void;
  private url: string;
  private streamOptions: Record<string, string>;

  constructor({
    ip,
    username,
    password,
    port = 554,
    profile = 'main',
    useUdp = true,
    callback,
    proxies,
  }: RtspConfig) {
    super();
    this.callback = callback;

    // Construct RTSP URL
    this.url = `rtsp://${username}:${password}@${ip}:${port}//h264Preview_01_${profile}`;

    // Set streaming options
    this.streamOptions = {
      OPENCV_FFMPEG_CAPTURE_OPTIONS: `rtsp_transport;${useUdp ? 'udp' : 'tcp'}`,
    };

    // If proxy is configured, set up the environment
    if (proxies) {
      process.env.RTSP_PROXY_HOST = proxies.host;
      process.env.RTSP_PROXY_PORT = proxies.port.toString();
    }

    // Set OpenCV environment variables
    Object.entries(this.streamOptions).forEach(([key, value]) => {
      process.env[key] = value;
    });

    // Initialize the video capture
    this.openVideoCapture();
  }

  /**
   * Opens the video capture device
   */
  private openVideoCapture(): void {
    try {
      this.capture = new cv.VideoCapture(this.url);
      // Set buffer size (optional)
      // this.capture.set(cv.CAP_PROP_BUFFERSIZE, 3);
    } catch (error) {
      console.error('Error opening video capture:', error);
      throw error;
    }
  }

  /**
   * Stream frames in blocking mode
   */
  private async *streamBlocking(): AsyncGenerator<Mat> {
    if (!this.capture) {
      throw new Error('Video capture not initialized');
    }

    while (true) {
      try {
        if (this.capture) {
          const frame = this.capture.read();
          if (!frame.empty) {
            yield frame;
          } else {
            console.log('Received empty frame');
            break;
          }
        } else {
          console.log('Stream closed');
          this.capture = null;
          return;
        }
      } catch (error) {
        console.error('Error reading frame:', error);
        this.capture?.release();
        this.capture = null;
        return;
      }
    }
  }

  /**
   * Stream frames in non-blocking mode using callback
   */
  private async streamNonBlocking(): Promise<void> {
    if (!this.callback || !this.capture) {
      throw new Error('Callback not set or video capture not initialized');
    }

    const processFrame = async (): Promise<void> => {
      if (this.threadCancelled) return;

      try {
        if (this.capture) {
          const frame = this.capture.read();
          if (!frame.empty && this.callback) {
            this.callback(frame);
          }
          // Schedule next frame processing
          setImmediate(processFrame);
        } else {
          console.log('Stream is closed');
          this.stopStream();
        }
      } catch (error) {
        console.error('Error in non-blocking stream:', error);
        this.stopStream();
      }
    };

    // Start processing frames
    processFrame();
  }

  /**
   * Stops the stream and releases resources
   */
  public stopStream(): void {
    this.threadCancelled = true;
    if (this.capture) {
      this.capture.release();
      this.capture = null;
    }
  }

  /**
   * Opens the stream in either blocking or non-blocking mode
   * @returns AsyncGenerator for blocking mode, void for non-blocking mode
   */
  public openStream(): AsyncGenerator<Mat> | Promise<void> {
    // Reset the capture if needed
    if (!this.capture) {
      this.openVideoCapture();
    }

    console.log('Opening stream');
    this.threadCancelled = false;

    if (!this.callback) {
      return this.streamBlocking();
    } else {
      return this.streamNonBlocking();
    }
  }

  /**
   * Check if the stream is currently open
   */
  public isStreamOpen(): boolean {
    return this.capture !== null && !this.threadCancelled;
  }
}

export default RtspClient;
