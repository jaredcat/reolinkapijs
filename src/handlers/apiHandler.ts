import AlarmAPIMixin from "@mixins/alarm";
import DeviceAPIMixin from "@mixins/device";
import DisplayAPIMixin from "@mixins/display";
import DownloadAPIMixin from "@mixins/download";
import ImageAPIMixin from "@mixins/image";
import MotionAPIMixin from "@mixins/motion";
import NetworkAPIMixin from "@mixins/network";
import NvrDownloadAPIMixin from "@mixins/nvrdownload";
import PtzAPIMixin from "@mixins/ptz";
import RecordAPIMixin from "@mixins/record";
import StreamAPIMixin from "@mixins/stream";
import SystemAPIMixin from "@mixins/system";
import UserAPIMixin from "@mixins/user";
import ZoomAPIMixin from "@mixins/zoom";
import { Mixin } from "ts-mixer";

class _APIHandler extends Mixin(
  AlarmAPIMixin,
  DeviceAPIMixin,
  DisplayAPIMixin,
  DownloadAPIMixin,
  ImageAPIMixin,
  MotionAPIMixin,
  NetworkAPIMixin,
  NvrDownloadAPIMixin,
  PtzAPIMixin,
  RecordAPIMixin,
) {}

export default class APIHandler extends Mixin(
  _APIHandler,
  StreamAPIMixin,
  SystemAPIMixin,
  UserAPIMixin,
  ZoomAPIMixin,
) {}
