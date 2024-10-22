import BaseAPIHandler from '@handlers/base_api_handler';
import CommandData from '../types/CommandData';

export interface NvrDownloadParams {
  NvrDownload: {
    channel: number;
    iLogicChannel: number;
    streamType: string;
    StartTime: TimeParams;
    EndTime: TimeParams;
  };
}

interface TimeParams {
  year: number;
  mon: number;
  day: number;
  hour: number;
  min: number;
  sec: number;
}

class NvrDownloadAPIMixin extends BaseAPIHandler {
  async getPlaybackFiles(
    start: Date,
    end: Date = new Date(),
    channel: number = 0,
    streamType: string = 'sub',
  ): Promise<string[]> {
    const searchParams: NvrDownloadParams = {
      NvrDownload: {
        channel,
        iLogicChannel: 0,
        streamType,
        StartTime: this.dateToParams(start),
        EndTime: this.dateToParams(end),
      },
    };

    const body: CommandData[] = [
      { cmd: 'NvrDownload', action: 1, param: searchParams },
    ];

    try {
      const resp = (await this.executeCommand('NvrDownload', body))[0];
      if (!resp.value?.fileList) {
        return [];
      }
      return resp.value.fileList.map(
        (file: { fileName: string }) => file.fileName,
      );
    } catch (e) {
      console.error(`Error: ${e}`);
      return [];
    }
  }

  private dateToParams(date: Date): TimeParams {
    return {
      year: date.getFullYear(),
      mon: date.getMonth() + 1, // getMonth() returns 0-11, so we add 1
      day: date.getDate(),
      hour: date.getHours(),
      min: date.getMinutes(),
      sec: date.getSeconds(),
    };
  }
}

export default NvrDownloadAPIMixin;
