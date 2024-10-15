import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import fs from 'fs';
import Request from './rest_handler';

export interface CommandData {
  cmd: string;
  action: number;
  param?: {
    User?: {
      userName: string;
      password: string;
    };
    Alarm?: {
      channel: number;
      type: string;
    };
    DevName?: { name: string };
    HddInfo?: { id: number[] };
  };
  filepath?: string;
}

interface LoginResponse {
  code: string;
  value: {
    Token: {
      name: string;
    };
  };
}

class BaseAPIHandler {
  private url: string;
  private ip: string;
  private token: string | null = null;
  private username: string;
  private password: string;

  constructor(
    ip: string,
    username: string,
    password: string,
    https: boolean = false,
    options?: { proxy?: AxiosRequestConfig['proxy']; session?: AxiosInstance },
  ) {
    const scheme = https ? 'https' : 'http';
    this.url = `${scheme}://${ip}/cgi-bin/api.cgi`;
    this.ip = ip;
    this.username = username;
    this.password = password;
    Request.proxies = options?.proxy;
    Request.session = options?.session;
  }

  async login(): Promise<boolean> {
    try {
      const body: CommandData[] = [
        {
          cmd: 'Login',
          action: 0,
          param: {
            User: {
              userName: this.username,
              password: this.password,
            },
          },
        },
      ];

      const param = { cmd: 'Login', token: 'null' };

      const response = await Request.post(this.url, body, param);
      const data: LoginResponse = response?.data[0];

      if (parseInt(data.code) === 0) {
        this.token = data.value.Token.name;
        console.log('Login success');
        return true;
      } else {
        console.log('Failed to login');
        return false;
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }

  async logout(): Promise<boolean> {
    try {
      const data: CommandData[] = [{ cmd: 'Logout', action: 0 }];
      await this.executeCommand('Logout', data);
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  }

  protected async executeCommand(
    command: string,
    data: CommandData[],
    multi: boolean = false,
  ): Promise<any> {
    if (!this.token) {
      throw new Error('Login first');
    }

    const params: any = { token: this.token, cmd: command };
    if (multi) {
      delete params.cmd;
    }

    try {
      if (command === 'Download') {
        const tgtFilePath = data[0].filepath;
        const response = await axios.get(this.url, {
          params,
          responseType: 'stream',
          proxy: Request.proxies,
        });

        if (response.status === 200 && tgtFilePath) {
          const writer = fs.createWriteStream(tgtFilePath);
          response.data.pipe(writer);
          return true;
        } else {
          console.error(`Error received: ${response.status}`);
          return false;
        }
      } else {
        const response = await axios.post(this.url, data, {
          params,
          proxy: Request.proxies,
        });
        return response.data;
      }
    } catch (error) {
      console.error(`Command ${command} failed:`, error);
      throw error;
    }
  }
}

export default BaseAPIHandler;
