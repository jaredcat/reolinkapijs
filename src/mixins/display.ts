import BaseAPIHandler from '@handlers/base_api_handler';
import CommandData, { OsdPos } from '../types/CommandData';

export interface SetOsdParams {
  Osd: {
    bgcolor: boolean;
    channel: number;
    osdChannel: {
      enable: boolean;
      name: string;
      pos: OsdPos;
    };
    osdTime: { enable: boolean; pos: OsdPos };
    watermark: boolean;
  };
}

class DisplayAPIMixin extends BaseAPIHandler {
  /**
   * API calls related to the current image (osd, on screen display).
   */

  public async getOsd(): Promise<any> {
    /**
     * Get OSD information.
     * See examples/response/GetOsd.json for example response data.
     * @returns response json
     */
    const body: CommandData[] = [
      { cmd: 'GetOsd', action: 1, param: { channel: 0 } },
    ];
    return this.executeCommand('GetOsd', body);
  }

  public async getMask(): Promise<any> {
    /**
     * Get the camera mask information.
     * See examples/response/GetMask.json for example response data.
     * @returns response json
     */
    const body: CommandData[] = [
      { cmd: 'GetMask', action: 1, param: { channel: 0 } },
    ];
    return this.executeCommand('GetMask', body);
  }

  public async setOsd(
    bg_color: boolean = false,
    channel: number = 0,
    osd_channel_enabled: boolean = false,
    osd_channel_name: string = '',
    osd_channel_pos: OsdPos = OsdPos['Lower Right'],
    osd_time_enabled: boolean = false,
    osd_time_pos: OsdPos = OsdPos['Lower Right'],
    osd_watermark_enabled: boolean = false,
  ): Promise<boolean> {
    /**
     * Set OSD
     * @returns whether the action was successful
     */
    const body: CommandData[] = [
      {
        cmd: 'SetOsd',
        action: 1,
        param: {
          Osd: {
            bgcolor: bg_color,
            channel: channel,
            osdChannel: {
              enable: osd_channel_enabled,
              name: osd_channel_name,
              pos: osd_channel_pos,
            },
            osdTime: { enable: osd_time_enabled, pos: osd_time_pos },
            watermark: osd_watermark_enabled,
          },
        },
      },
    ];

    try {
      const response = await this.executeCommand('SetOsd', body);
      const r_data = response[0];
      if (r_data?.value?.rspCode === 200) {
        return true;
      }
      console.log(
        'Could not set OSD. Camera responded with status:',
        r_data.error,
      );
      return false;
    } catch (error) {
      console.error('Error setting OSD:', error);
      return false;
    }
  }
}

export default DisplayAPIMixin;
