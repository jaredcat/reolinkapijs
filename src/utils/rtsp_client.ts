import cv, { Mat, VideoCapture } from '@u4/opencv4nodejs';

interface RtspClientOptions {
  proxies?: { host: string; port: number };
  callback?: (frame: Mat) => void;
}

class RtspClient {
  private capture: VideoCapture | null = null;
  private threadCancelled: boolean = false;
  private callback: ((frame: Mat) => void) | null = null;
  private ip: string;
  private username: string;
  private password: string;
  private port: number;
  private url: string;

  constructor(
    ip: string,
    username: string,
    password: string,
    port: number = 554,
    profile: string = 'main',
    useUdp: boolean = true,
    options: RtspClientOptions = {},
  ) {
    this.ip = ip;
    this.username = username;
    this.password = password;
    this.port = port;
    this.callback = options.callback || null;

    // Set up the RTSP URL for accessing the camera feed
    const protocol = useUdp ? 'udp' : 'tcp';
    this.url = `rtsp://${this.username}:${this.password}@${this.ip}:${this.port}//h264Preview_01_${profile}`;

    // Set capture options for OpenCV
    const captureOptions = protocol;
    process.env.OPENCV_FFMPEG_CAPTURE_OPTIONS = captureOptions;

    // Initialize the video capture stream
    this._openVideoCapture();
  }

  private _openVideoCapture() {
    this.capture = new cv.VideoCapture(this.url);
  }

  private async *_streamBlocking() {
    while (true) {
      try {
        const frame = this.capture?.read();
        if (frame && !frame.empty) {
          yield frame;
        } else {
          console.log('Stream closed');
          this.capture?.release();
          this.capture = null;
          return;
        }
      } catch (error) {
        console.error('Error in stream blocking: ', error);
        this.capture?.release();
        this.capture = null;
        return;
      }
    }
  }

  private async _streamNonBlocking() {
    while (!this.threadCancelled) {
      try {
        const frame = this.capture?.read();
        if (frame && !frame.empty && this.callback) {
          this.callback(frame);
        } else {
          console.log('Stream is closed');
          this.stopStream();
        }
      } catch (error) {
        console.error('Thread Error: ', error);
        this.stopStream();
      }
    }
  }

  stopStream() {
    if (this.capture) {
      this.capture.release();
      this.capture = null;
    }
    this.threadCancelled = true;
  }

  openStream() {
    if (this.capture === null) {
      this._openVideoCapture();
    }

    console.log('Opening stream');

    if (this.callback === null) {
      return this._streamBlocking();
    } else {
      this.threadCancelled = false;
      return this._streamNonBlocking();
    }
  }
}

export default RtspClient;
