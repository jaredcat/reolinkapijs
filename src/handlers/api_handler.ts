import { Mixin } from 'ts-mixer';
import { AlarmAPIMixin } from '../mixins';
import DeviceAPIMixin from '../mixins/device';

export default class APIHandler extends Mixin(AlarmAPIMixin, DeviceAPIMixin) {}
