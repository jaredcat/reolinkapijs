import { BaseAPIHandler } from '../handlers';
import CommandData from '../types/CommandData';

export interface SearchParams {
  Search: {
    channel: number;
    streamType: string;
    onlyStatus: 0;
    StartTime: {
      year: number;
      mon: number; // JavaScript months are 0-indexed
      day: number;
      hour: number;
      min: number;
      sec: number;
    };
    EndTime: {
      year: number;
      mon: number;
      day: number;
      hour: number;
      min: number;
      sec: number;
    };
  };
}

// Type definitions
type RawMotionFile = {
  name: string;
  StartTime: { [key: string]: number };
  EndTime: { [key: string]: number };
  [key: string]: any;
};

type ProcessedMotionFile = {
  start: Date;
  end: Date;
  filename: string;
};

type RawMotionList = RawMotionFile[];
type ProcessedMotionList = ProcessedMotionFile[];

class MotionAPIMixin extends BaseAPIHandler {
  /**
   * API calls for past motion alerts.
   */

  public async getMotionFiles(
    start: Date,
    end: Date = new Date(),
    streamtype: string = 'sub',
    channel: number = 0,
  ): Promise<ProcessedMotionList> {
    /**
     * Get the timestamps and filenames of motion detection events for the time range provided.
     */
    const searchParams: SearchParams = {
      Search: {
        channel: channel,
        streamType: streamtype,
        onlyStatus: 0,
        StartTime: {
          year: start.getFullYear(),
          mon: start.getMonth() + 1, // JavaScript months are 0-indexed
          day: start.getDate(),
          hour: start.getHours(),
          min: start.getMinutes(),
          sec: start.getSeconds(),
        },
        EndTime: {
          year: end.getFullYear(),
          mon: end.getMonth() + 1,
          day: end.getDate(),
          hour: end.getHours(),
          min: end.getMinutes(),
          sec: end.getSeconds(),
        },
      },
    };

    const body: CommandData[] = [
      { cmd: 'Search', action: 1, param: searchParams },
    ];

    try {
      const resp = await this.executeCommand('Search', body);
      const result = resp[0]?.value?.SearchResult;
      const files = result?.File || [];
      if (files.length > 0) {
        return this.processMotionFiles(files);
      }
      return [];
    } catch (error) {
      console.error('Error getting motion files:', error);
      return [];
    }
  }

  private processMotionFiles(motion_files: RawMotionList): ProcessedMotionList {
    /**
     * Processes raw list of objects containing motion timestamps
     * and the filename associated with them
     */
    const processedMotions: ProcessedMotionList = [];
    const replaceFields: { [key: string]: string } = {
      mon: 'month',
      sec: 'second',
      min: 'minute',
    };

    for (const file of motion_files) {
      const timeRange: { [key: string]: Date } = {};
      for (const x of ['Start', 'End']) {
        const raw = { ...file[`${x}Time`] };
        for (const [k, v] of Object.entries(replaceFields)) {
          if (k in raw) {
            raw[v] = raw[k];
            delete raw[k];
          }
        }
        // Adjust for JavaScript's 0-indexed months
        if ('month' in raw) {
          raw.month -= 1;
        }
        timeRange[x.toLowerCase()] = new Date(
          raw.year,
          raw.month,
          raw.day,
          raw.hour,
          raw.minute,
          raw.second,
        );
      }
      processedMotions.push({
        start: timeRange.start,
        end: timeRange.end,
        filename: file.name,
      });
    }
    return processedMotions;
  }
}

export default MotionAPIMixin;
