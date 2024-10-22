import APIHandler from '@handlers/api_handler';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

class Camera extends APIHandler {
  protected profile: string;

  constructor(
    ip: string,
    username: string = 'admin',
    password: string = '',
    https: boolean = false,
    deferLogin: boolean = false,
    profile: string = 'main',
    options?: { proxy?: AxiosRequestConfig['proxy']; session?: AxiosInstance },
  ) {
    if (!['main', 'sub'].includes(profile)) {
      throw new Error('Profile argument must be either "main" or "sub"');
    }
    super(ip, username, password, https, options);

    this.profile = profile;

    // Automatically login unless deferLogin is true
    if (!deferLogin) {
      super.login();
    }
  }
}

export default Camera;
