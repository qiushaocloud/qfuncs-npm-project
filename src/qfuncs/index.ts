/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import fs from 'fs';
import {IQMethods} from './qfuncs.i';
import QFileOrDir from './file-dir';

class QMethods extends QFileOrDir implements IQMethods {
  getPlatform (): string {
    if (process.platform === 'win32')
      return 'Windows';

    if (process.platform === 'linux')
      return 'Linux';

    if (process.platform === 'darwin')
      return 'Mac';

    return process.platform;
  }

  sleep (ts: number): Promise<void> {
    return new Promise((resolve)=>{
      setTimeout(()=>{
        resolve();
      }, ts);
    });
  }

  randomRangeValues (start: number, end: number, count = 1): number[] {
    const arr: number[] = [];
    const result: number[] = [];
    if (!count) result;

    for (let i = start; i <= end; i++) {
      arr.push(i);
    }

    if (count >= arr.length) return arr;

    for (let i = 0; i < count; i++) {
      if (!arr.length) break;
      const randomArrIndex = Math.floor(Math.random() * 100000) % arr.length;
      const randomItem = arr[randomArrIndex];
      arr.splice(randomArrIndex, 1);
      result.push(randomItem);
    }

    return result;
  }

  loadJsonFile<T=QJson> (filePath: string): T | undefined {
    try {
      const fileJsonContent: T = (JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T);
      return this.isJson(fileJsonContent) ? fileJsonContent : undefined;
    } catch (err) {
      this._printlog('error', 'loadJsonFile catch err:', err, ' ,filePath:', filePath);
    }
  }

  generateUuid (): string {
    const s: any[] = [];
    const hexDigits = '0123456789abcdef';

    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = '-';
    s[13] = '-';
    s[18] = '-';
    s[23] = '-';

    return s.join('');
  }

  generateRandomNumberId (): number {
    return Math.floor(100000000000000000 + Math.random() * 900000000000000000);
  }

  generateRandomId (isUseNumAndDate?: boolean): string {
    if (isUseNumAndDate)
      return Math.floor(100000000000000000 + Math.random() * 900000000000000000) + '_' + Date.now();

    return this.generateUuid().replace(/-/g, '');
  }

  formatError (error: string | (Error & QJson)): QJson {
    try {
      if (typeof error === 'string') return {message: error};

      const errResData: QJson = {};

      error.name !== undefined && (errResData.name = error.name);
      error.message !== undefined && (errResData.message = error.message);
      error.code !== undefined && (errResData.code = error.code);
      error.errno !== undefined && (errResData.errno = error.errno);
      error.error !== undefined && (errResData.error = error.error);
      error.description !== undefined && (errResData.description = error.description);

      if (error && error.response && error.response.status !== 404) {
        const responseData = error.response.data;

        Object.assign(errResData, {
          responseData: responseData,
          responseStatus: error.response.status,
          statusText: error.response.statusText,
          responseHeaders: error.response.responseHeaders
        });
      }
      return errResData;
    } catch (catCherr) {
      return {catcherr: catCherr, error: error};
    }
  }
}

export {QMethods};

global.qFuncs = new QMethods();
export default global.qFuncs;