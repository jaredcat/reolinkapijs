import BaseAPIHandler from '@handlers/baseApiHandler';

export interface SetEncParams {
  Enc: {
    audio: number;
    channel: number;
    mainStream: {
      bitRate: number;
      frameRate: number;
      profile: string;
      size: string;
    };
    subStream: {
      bitRate: number;
      frameRate: number;
      profile: string;
      size: string;
    };
  };
}

class RecordAPIMixin extends BaseAPIHandler {
  async getRecordingEncoding(): Promise<Record<string, any>> {
    const body = [{ cmd: 'GetEnc', action: 1, param: { channel: 0 } }];
    return this.executeCommand('GetEnc', body);
  }

  async getRecordingAdvanced(): Promise<Record<string, any>> {
    const body = [{ cmd: 'GetRec', action: 1, param: { channel: 0 } }];
    return this.executeCommand('GetRec', body);
  }

  async setRecordingEncoding(
    audio: number = 0,
    mainBitRate: number = 8192,
    mainFrameRate: number = 8,
    mainProfile: string = 'High',
    mainSize: string = '2560*1440',
    subBitRate: number = 160,
    subFrameRate: number = 7,
    subProfile: string = 'High',
    subSize: string = '640*480',
  ): Promise<Record<string, any>> {
    const body = [
      {
        cmd: 'SetEnc',
        action: 0,
        param: {
          Enc: {
            audio: audio,
            channel: 0,
            mainStream: {
              bitRate: mainBitRate,
              frameRate: mainFrameRate,
              profile: mainProfile,
              size: mainSize,
            },
            subStream: {
              bitRate: subBitRate,
              frameRate: subFrameRate,
              profile: subProfile,
              size: subSize,
            },
          },
        },
      },
    ];
    return this.executeCommand('SetEnc', body);
  }
}

export default RecordAPIMixin;
