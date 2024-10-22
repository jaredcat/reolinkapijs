import { AlarmAPIMixinParams } from '../mixins/alarm';
import { DeviceAPIMixinParams } from '../mixins/device';
import { SetOsdParams } from '../mixins/display';
import { SetImageParams, SetIspParams } from '../mixins/image';
import { SearchParams } from '../mixins/motion';
import {
  SetLocalLinkParams,
  SetNetPortParams,
  SetWifiParams,
} from '../mixins/network';
import { NvrDownloadParams } from '../mixins/nvrdownload';
import { SetEncParams } from '../mixins/record';
import { DelUserParams } from '../mixins/user';

type CommandDataParam = {
  channel?: number;
} & (
  | UserParam
  | AlarmAPIMixinParams
  | DeviceAPIMixinParams
  | SetOsdParams
  | SetImageParams
  | SetIspParams
  | SearchParams
  | SetLocalLinkParams
  | SetLocalLinkParams
  | SetWifiParams
  | SetNetPortParams
  | NvrDownloadParams
  | SetEncParams
  | DelUserParams
);

interface UserParam {
  User: {
    userName: string;
    password: string;
  };
}

export default interface CommandData {
  cmd: string;
  action: number;
  filepath?: string;
  source?: string;
  output?: string;
  param?: CommandDataParam;
}

export enum OsdPos {
  'Upper Left',
  'Top Center',
  'Upper Right',
  'Lower Left',
  'Bottom Center',
  'Lower Right',
}
