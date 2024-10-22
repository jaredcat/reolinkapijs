import BaseAPIHandler from '@handlers/baseApiHandler';
import CommandData from '@interfaces/CommandData';

class DownloadAPIMixin extends BaseAPIHandler {
  /**
   * API calls for downloading video files.
   */

  public async getFile(filename: string, outputPath: string): Promise<boolean> {
    /**
     * Download the selected video file
     * @param filename The name of the file to download
     * @param outputPath The path where the file should be saved
     * @returns A boolean indicating whether the download was successful
     */
    const body: CommandData[] = [
      {
        cmd: 'Download',
        action: 0, // action is required in CommandData, but not used in the original Python code
        source: filename,
        output: filename,
        filepath: outputPath,
      },
    ];

    try {
      const resp = await this.executeCommand('Download', body);
      return resp;
    } catch (error) {
      console.error('Error downloading file:', error);
      return false;
    }
  }
}

export default DownloadAPIMixin;
