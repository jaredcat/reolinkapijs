import BaseAPIHandler from "@handlers/baseApiHandler";
import CommandData from "@interfaces/CommandData";

export interface SetLocalLinkParams {
  LocalLink: {
    dns: {
      auto: number;
      dns1: string;
      dns2: string;
    };
    mac: string;
    static: {
      gateway: string;
      ip: string;
      mask: string;
    };
    type: string;
  };
}
export interface SetNetPortParams {
  NetPort: {
    httpPort: number;
    httpsPort: number;
    mediaPort: number;
    onvifPort: number;
    rtmpPort: number;
    rtspPort: number;
  };
}

export interface SetWifiParams {
  Wifi: {
    ssid: string;
    password: string;
  };
}

class NetworkAPIMixin extends BaseAPIHandler {
  /**
   * API calls for network settings.
   */

  public async setNetworkSettings(
    ip: string,
    gateway: string,
    mask: string,
    dns1: string,
    dns2: string,
    mac: string,
    useDhcp: boolean = true,
    autoDns: boolean = true,
  ): Promise<any> {
    const body: CommandData[] = [
      {
        cmd: "SetLocalLink",
        action: 0,
        param: {
          LocalLink: {
            dns: {
              auto: autoDns ? 1 : 0,
              dns1: dns1,
              dns2: dns2,
            },
            mac: mac,
            static: {
              gateway: gateway,
              ip: ip,
              mask: mask,
            },
            type: useDhcp ? "DHCP" : "Static",
          },
        },
      },
    ];

    const result = await this.executeCommand("SetLocalLink", body);
    console.log("Successfully Set Network Settings");
    return result;
  }

  public async setNetPort(
    httpPort: number = 80,
    httpsPort: number = 443,
    mediaPort: number = 9000,
    onvifPort: number = 8000,
    rtmpPort: number = 1935,
    rtspPort: number = 554,
  ): Promise<boolean> {
    const body: CommandData[] = [
      {
        cmd: "SetNetPort",
        action: 0,
        param: {
          NetPort: {
            httpPort: httpPort,
            httpsPort: httpsPort,
            mediaPort: mediaPort,
            onvifPort: onvifPort,
            rtmpPort: rtmpPort,
            rtspPort: rtspPort,
          },
        },
      },
    ];
    await this.executeCommand("SetNetPort", body, true);
    console.log("Successfully Set Network Ports");
    return true;
  }

  public async setWifi(ssid: string, password: string): Promise<any> {
    const body: CommandData[] = [
      {
        cmd: "SetWifi",
        action: 0,
        param: {
          Wifi: {
            ssid: ssid,
            password: password,
          },
        },
      },
    ];
    return this.executeCommand("SetWifi", body);
  }

  public async getNetPorts(): Promise<any> {
    const body: CommandData[] = [
      { cmd: "GetNetPort", action: 1, param: {} },
      { cmd: "GetUpnp", action: 0, param: {} },
      { cmd: "GetP2p", action: 0, param: {} },
    ];
    return this.executeCommand("GetNetPort", body, true);
  }

  public async getWifi(): Promise<any> {
    const body: CommandData[] = [{ cmd: "GetWifi", action: 1, param: {} }];
    return this.executeCommand("GetWifi", body);
  }

  public async scanWifi(): Promise<any> {
    const body: CommandData[] = [{ cmd: "ScanWifi", action: 1, param: {} }];
    return this.executeCommand("ScanWifi", body);
  }

  public async getNetworkGeneral(): Promise<any> {
    const body: CommandData[] = [{ cmd: "GetLocalLink", action: 0, param: {} }];
    return this.executeCommand("GetLocalLink", body);
  }

  public async getNetworkDdns(): Promise<any> {
    const body: CommandData[] = [{ cmd: "GetDdns", action: 0, param: {} }];
    return this.executeCommand("GetDdns", body);
  }

  public async getNetworkNtp(): Promise<any> {
    const body: CommandData[] = [{ cmd: "GetNtp", action: 0, param: {} }];
    return this.executeCommand("GetNtp", body);
  }

  public async getNetworkEmail(): Promise<any> {
    const body: CommandData[] = [{ cmd: "GetEmail", action: 0, param: {} }];
    return this.executeCommand("GetEmail", body);
  }

  public async getNetworkFtp(): Promise<any> {
    const body: CommandData[] = [{ cmd: "GetFtp", action: 0, param: {} }];
    return this.executeCommand("GetFtp", body);
  }

  public async getNetworkPush(): Promise<any> {
    const body: CommandData[] = [{ cmd: "GetPush", action: 0, param: {} }];
    return this.executeCommand("GetPush", body);
  }

  public async getNetworkStatus(): Promise<any> {
    return this.getNetworkGeneral();
  }
}

export default NetworkAPIMixin;
