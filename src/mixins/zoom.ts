import BaseAPIHandler from '@handlers/baseApiHandler';

interface PtzResponse {
  [key: string]: any;
}

/**
 * API for zooming and changing focus.
 * Note that the API does not allow zooming/focusing by absolute
 * values rather that changing focus/zoom for a given time.
 */
class ZoomAPIMixin extends BaseAPIHandler {
  /**
   * Start a PTZ operation with specified operation type and speed
   * @param operation - The operation to perform
   * @param speed - The speed of the operation
   * @returns Response from the camera
   */
  private async startOperation(
    operation: string,
    speed: number,
  ): Promise<PtzResponse> {
    const data = [
      {
        cmd: 'PtzCtrl',
        action: 0,
        param: {
          channel: 0,
          op: operation,
          speed: speed,
        },
      },
    ];
    return this.executeCommand('PtzCtrl', data);
  }

  /**
   * This command stops any ongoing zooming or focusing actions.
   * @returns Response from the camera
   */
  private async stopZoomingOrFocusing(): Promise<PtzResponse> {
    const data = [
      {
        cmd: 'PtzCtrl',
        action: 0,
        param: {
          channel: 0,
          op: 'Stop',
        },
      },
    ];
    return this.executeCommand('PtzCtrl', data);
  }

  /**
   * The camera zooms in until stopZooming() is called.
   * @param speed - Speed of zooming, defaults to 60
   * @returns Response from the camera
   */
  async startZoomingIn(speed: number = 60): Promise<PtzResponse> {
    return this.startOperation('ZoomInc', speed);
  }

  /**
   * The camera zooms out until stopZooming() is called.
   * @param speed - Speed of zooming, defaults to 60
   * @returns Response from the camera
   */
  async startZoomingOut(speed: number = 60): Promise<PtzResponse> {
    return this.startOperation('ZoomDec', speed);
  }

  /**
   * Stop zooming.
   * @returns Response from the camera
   */
  async stopZooming(): Promise<PtzResponse> {
    return this.stopZoomingOrFocusing();
  }

  /**
   * The camera focuses in until stopFocusing() is called.
   * @param speed - Speed of focusing, defaults to 32
   * @returns Response from the camera
   */
  async startFocusingIn(speed: number = 32): Promise<PtzResponse> {
    return this.startOperation('FocusInc', speed);
  }

  /**
   * The camera focuses out until stopFocusing() is called.
   * @param speed - Speed of focusing, defaults to 32
   * @returns Response from the camera
   */
  async startFocusingOut(speed: number = 32): Promise<PtzResponse> {
    return this.startOperation('FocusDec', speed);
  }

  /**
   * Stop focusing.
   * @returns Response from the camera
   */
  async stopFocusing(): Promise<PtzResponse> {
    return this.stopZoomingOrFocusing();
  }
}

export default ZoomAPIMixin;
