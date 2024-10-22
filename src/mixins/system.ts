import BaseAPIHandler from '@handlers/base_api_handler';

class SystemAPIMixin extends BaseAPIHandler {
  async getGeneralSystem(): Promise<Record<string, any>> {
    const body = [
      { cmd: 'GetTime', action: 1, param: {} },
      { cmd: 'GetNorm', action: 1, param: {} },
    ];
    return this.executeCommand('get_general_system', body, true);
  }

  async getPerformance(): Promise<Record<string, any>> {
    const body = [{ cmd: 'GetPerformance', action: 0, param: {} }];
    return this.executeCommand('GetPerformance', body);
  }

  async getInformation(): Promise<Record<string, any>> {
    const body = [{ cmd: 'GetDevInfo', action: 0, param: {} }];
    return this.executeCommand('GetDevInfo', body);
  }

  async rebootCamera(): Promise<Record<string, any>> {
    const body = [{ cmd: 'Reboot', action: 0, param: {} }];
    return this.executeCommand('Reboot', body);
  }

  async getDst(): Promise<Record<string, any>> {
    const body = [{ cmd: 'GetTime', action: 0, param: {} }];
    return this.executeCommand('GetTime', body);
  }
}

export default SystemAPIMixin;
