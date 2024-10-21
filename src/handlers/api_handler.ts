import { Mixin } from 'ts-mixer';
import {
  AlarmAPIMixin,
  DeviceAPIMixin,
  DisplayAPIMixin,
  DownloadAPIMixin,
  ImageAPIMixin,
} from '../mixins';

export default class APIHandler extends Mixin(
  AlarmAPIMixin,
  DeviceAPIMixin,
  DisplayAPIMixin,
  DownloadAPIMixin,
  ImageAPIMixin,
) {}
