import BaseAPIHandler from '@handlers/baseApiHandler';
import CommandData from '@interfaces/CommandData';

export interface SetImageParams {
  Image: {
    bright: number;
    channel: number;
    contrast: number;
    hue: number;
    saturation: number;
    sharpen: number;
  };
}
export interface SetIspParams {
  Isp: {
    channel: 0;
    antiFlicker: string;
    exposure: string;
    gain: { min: number; max: number };
    shutter: { min: number; max: number };
    blueGain: number;
    redGain: number;
    whiteBalance: string;
    dayNight: string;
    backLight: string;
    blc: number;
    drc: number;
    rotation: number;
    mirroring: number;
    nr3d: number;
  };
}

class ImageAPIMixin extends BaseAPIHandler {
  /**
   * API calls for image settings.
   */

  public async setAdvImageSettings(
    anti_flicker: string = 'Outdoor',
    exposure: string = 'Auto',
    gain_min: number = 1,
    gain_max: number = 62,
    shutter_min: number = 1,
    shutter_max: number = 125,
    blue_gain: number = 128,
    red_gain: number = 128,
    white_balance: string = 'Auto',
    day_night: string = 'Auto',
    back_light: string = 'DynamicRangeControl',
    blc: number = 128,
    drc: number = 128,
    rotation: number = 0,
    mirroring: number = 0,
    nr3d: number = 1,
  ): Promise<any> {
    /**
     * Sets the advanced camera settings.
     */
    const body: CommandData[] = [
      {
        cmd: 'SetIsp',
        action: 0,
        param: {
          Isp: {
            channel: 0,
            antiFlicker: anti_flicker,
            exposure: exposure,
            gain: { min: gain_min, max: gain_max },
            shutter: { min: shutter_min, max: shutter_max },
            blueGain: blue_gain,
            redGain: red_gain,
            whiteBalance: white_balance,
            dayNight: day_night,
            backLight: back_light,
            blc: blc,
            drc: drc,
            rotation: rotation,
            mirroring: mirroring,
            nr3d: nr3d,
          },
        },
      },
    ];
    return this.executeCommand('SetIsp', body);
  }

  public async setImageSettings(
    brightness: number = 128,
    contrast: number = 62,
    hue: number = 1,
    saturation: number = 125,
    sharpness: number = 128,
  ): Promise<any> {
    /**
     * Sets the camera image settings.
     */
    const body: CommandData[] = [
      {
        cmd: 'SetImage',
        action: 0,
        param: {
          Image: {
            bright: brightness,
            channel: 0,
            contrast: contrast,
            hue: hue,
            saturation: saturation,
            sharpen: sharpness,
          },
        },
      },
    ];

    return this.executeCommand('SetImage', body);
  }
}

export default ImageAPIMixin;
