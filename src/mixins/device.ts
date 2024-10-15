import { Mixin } from 'ts-mixer';
import { BaseAPIHandler } from '../handlers';

export default class DeviceAPIMixin extends Mixin(BaseAPIHandler) {
  static readonly DEFAULT_HDD_ID = [0];

  async setDeviceName(name: string): Promise<boolean> {
    const body = [
      { cmd: 'SetDevName', action: 0, param: { DevName: { name } } },
    ];
    await this.executeCommand('SetDevName', body);
    console.log(`Successfully set device name to: ${name}`);
    return true;
  }

  getDeviceName(): Promise<any> {
    const body = [{ cmd: 'GetDevName', action: 0, param: {} }];
    return this.executeCommand('GetDevName', body);
  }

  getHddInfo(): Promise<any> {
    const body = [{ cmd: 'GetHddInfo', action: 0, param: {} }];
    return this.executeCommand('GetHddInfo', body);
  }

  async formatHdd(
    hddId: number[] = DeviceAPIMixin.DEFAULT_HDD_ID,
  ): Promise<boolean> {
    const body = [
      { cmd: 'Format', action: 0, param: { HddInfo: { id: hddId } } },
    ];
    const response = await this.executeCommand('Format', body);
    const rData = response[0];
    if (rData.value.rspCode === 200) {
      return true;
    } else {
      console.log(
        'Could not format HDD/SD. Camera responded with:',
        rData.value,
      );
      return false;
    }
  }
}
