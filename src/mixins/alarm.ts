import BaseAPIHandler from '@handlers/baseApiHandler';
import CommandData from '@interfaces/CommandData';
import { Mixin } from 'ts-mixer';

interface AlarmResponse {
  // Define the structure of the response if known, use any if the structure is dynamic
  [key: string]: any;
}

export interface AlarmAPIMixinParams {
  Alarm: {
    channel: number;
    type: string;
  };
}

export default class AlarmAPIMixin extends Mixin(BaseAPIHandler) {
  getAlarmMotion(): Promise<AlarmResponse> {
    /**
     * Gets the device alarm motion.
     * See examples/response/GetAlarmMotion.json for example response data.
     * @returns response JSON as a Promise
     */
    const body: CommandData[] = [
      {
        cmd: 'GetAlarm',
        action: 1,
        param: {
          Alarm: {
            channel: 0,
            type: 'md', // 'md' indicates motion detection
          },
        },
      },
    ];

    return this.executeCommand('GetAlarm', body);
  }
}
