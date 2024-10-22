import BaseAPIHandler from '@handlers/base_api_handler';

class PtzAPIMixin extends BaseAPIHandler {
  async getPtzCheckState(): Promise<Record<string, any>> {
    const body = [
      { cmd: 'GetPtzCheckState', action: 1, param: { channel: 0 } },
    ];
    return this.executeCommand('GetPtzCheckState', body);
  }

  async getPtzPresets(): Promise<Record<string, any>> {
    const body = [{ cmd: 'GetPtzPreset', action: 1, param: { channel: 0 } }];
    return this.executeCommand('GetPtzPreset', body);
  }

  async performCalibration(): Promise<Record<string, any>> {
    const data = [{ cmd: 'PtzCheck', action: 0, param: { channel: 0 } }];
    return this.executeCommand('PtzCheck', data);
  }

  private async sendOperation(
    operation: string,
    speed: number,
    index?: number,
  ): Promise<Record<string, any>> {
    const param: { channel: number; op: string; speed: number; id?: number } = {
      channel: 0,
      op: operation,
      speed,
    };
    if (index !== undefined) {
      param.id = index;
    }
    const data = [{ cmd: 'PtzCtrl', action: 0, param }];
    return this.executeCommand('PtzCtrl', data);
  }

  private async sendNoparmOperation(
    operation: string,
  ): Promise<Record<string, any>> {
    const data = [
      { cmd: 'PtzCtrl', action: 0, param: { channel: 0, op: operation } },
    ];
    return this.executeCommand('PtzCtrl', data);
  }

  private async sendSetPreset(
    enable: number,
    preset: number = 1,
    name: string = 'pos1',
  ): Promise<Record<string, any>> {
    const data = [
      {
        cmd: 'SetPtzPreset',
        action: 0,
        param: { channel: 0, enable, id: preset, name },
      },
    ];
    return this.executeCommand('PtzCtrl', data);
  }

  async goToPreset(
    speed: number = 60,
    index: number = 1,
  ): Promise<Record<string, any>> {
    return this.sendOperation('ToPos', speed, index);
  }

  async addPreset(
    preset: number = 1,
    name: string = 'pos1',
  ): Promise<Record<string, any>> {
    return this.sendSetPreset(1, preset, name);
  }

  async removePreset(
    preset: number = 1,
    name: string = 'pos1',
  ): Promise<Record<string, any>> {
    return this.sendSetPreset(0, preset, name);
  }

  async moveRight(speed: number = 25): Promise<Record<string, any>> {
    return this.sendOperation('Right', speed);
  }

  async moveRightUp(speed: number = 25): Promise<Record<string, any>> {
    return this.sendOperation('RightUp', speed);
  }

  async moveRightDown(speed: number = 25): Promise<Record<string, any>> {
    return this.sendOperation('RightDown', speed);
  }

  async moveLeft(speed: number = 25): Promise<Record<string, any>> {
    return this.sendOperation('Left', speed);
  }

  async moveLeftUp(speed: number = 25): Promise<Record<string, any>> {
    return this.sendOperation('LeftUp', speed);
  }

  async moveLeftDown(speed: number = 25): Promise<Record<string, any>> {
    return this.sendOperation('LeftDown', speed);
  }

  async moveUp(speed: number = 25): Promise<Record<string, any>> {
    return this.sendOperation('Up', speed);
  }

  async moveDown(speed: number = 25): Promise<Record<string, any>> {
    return this.sendOperation('Down', speed);
  }

  async stopPtz(): Promise<Record<string, any>> {
    return this.sendNoparmOperation('Stop');
  }

  async autoMovement(speed: number = 25): Promise<Record<string, any>> {
    return this.sendOperation('Auto', speed);
  }
}

export default PtzAPIMixin;
