import fs from 'fs';
import path from 'path';
import {IQFileOrDir} from './qfuncs.i';
import QTimer from './timer';

class QFileOrDir extends QTimer implements IQFileOrDir {
  delFile (filePath: string, opts?: {isDelEmptyDir?: boolean}, onCb?: (err?: NodeJS.ErrnoException) => void): void {
    this._printlog('debug', 'call delFile', filePath, opts);
    fs.unlink(filePath, (err) => {
      if (err && err.message && err.message.indexOf('no such file or directory') !== -1) {
        // 不存在文件
        this._printlog('debug', 'no such file or directory, delFile ok', filePath);
        opts?.isDelEmptyDir && this.deleteIfEmpty(path.dirname(filePath));
        onCb && onCb();
        return;
      }

      err && this._printlog('error', 'delFile err:', err, ' ,filePath:', filePath);
      !err && this._printlog('debug', 'delFile ok', filePath);
      opts?.isDelEmptyDir && this.deleteIfEmpty(path.dirname(filePath));
      onCb && onCb(err || undefined);
    });
  }

  delFileAsync (filePath: string, opts?: {isDelEmptyDir?: boolean}): Promise<NodeJS.ErrnoException | void> {
    this._printlog('debug', 'call delFileAsync', filePath);
    return new Promise((resolve) => {
      this.delFile(filePath, opts, (err) => {
        resolve(err);
      });
    });
  }

  isDirAddr (url: string): boolean {
    if (!url)
      return false;

    if (/\.[0-9a-z]+$/i.test(url)) {
      return false;
    }

    return true;
  }

  getFileName (filePath: string): string {
    let fileName = '';

    const pos = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
    if (pos !== -1)
      fileName = filePath.substring(pos + 1);

    return fileName;
  }

  getFileSuffix (filePathOrFileName: string): string {
    const pos = filePathOrFileName.lastIndexOf('.');
    if (pos === -1)
      return '';
    return filePathOrFileName.substring(pos); // 例如: .mkv
  }

  isExistsFileOrDir (filePathOrDir: string, onCb: (isExists: boolean) => void): void {
    fs.access(filePathOrDir, (err) => {
      onCb(!err);
    });
  }

  isExistsFileOrDirAsync (filePathOrDir: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.isExistsFileOrDir(filePathOrDir, (isExists) => {
        resolve(isExists);
      });
    });
  }

  deleteIfEmpty (directory: string, onCb?: (err?: Error) => void): void {
    this._printlog('debug', 'call deleteIfEmpty', directory, !!onCb);
    // eslint-disable-next-line no-void
    void this.deleteIfEmptyAsync(directory)
      .then((res) => {
        onCb && onCb(res || undefined);
      });
  }

  async deleteIfEmptyAsync (directory: string): Promise<Error | void> {
    try {
      this._printlog('debug', 'call deleteIfEmptyAsync', directory);
      const files = await fs.promises.readdir(directory);

      // 如果目录为空，则删除
      if (files.length === 0) {
        await fs.promises.rmdir(directory);
        this._printlog('debug', `deleteIfEmptyAsync directory ${directory} deleted.`);
        return;
      }

      this._printlog('debug', `deleteIfEmptyAsync directory ${directory} is not empty. Cannot delete.`);
      return;
    } catch (err) {
      this._printlog('error', 'deleteIfEmptyAsync catch error:', err, ' ,directory:', directory);
      return err as Error;
    }
  }

  getFileSize (filePath: string, onCb: (err?: NodeJS.ErrnoException, fileSize?: number) => void): void {
    fs.stat(filePath, (err, stat) => {
      if (err || !stat) {
        onCb(err || new Error('empty stat'));
        return;
      }

      onCb(undefined, stat.size);
    });
  }

  getFileSizeAsync (filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.getFileSize(filePath, (err, fileSize) => {
        if (fileSize) return reject(err);
        resolve(fileSize as number);
      });
    });
  }

  mkdirsSync (directory: string): boolean {
    try {
      if (fs.existsSync(directory)) {
        return true;
      }

      const prevDirName = path.dirname(directory);

      if (directory !== prevDirName && this.mkdirsSync(prevDirName)) {
        fs.mkdirSync(directory);
        return true;
      }

      return false;
    } catch (err) {
      this._printlog('error', 'mkdirsSync err:', err, directory);
      return true;
    }
  }

  async mkdirsAsync (directory: string): Promise<boolean> {
    try {
      if (await this.isExistsFileOrDirAsync(directory)) {
        return true;
      }

      const prevDirName = path.dirname(directory);

      if (directory !== prevDirName && await this.mkdirsAsync(prevDirName)) {
        await new Promise<void>((resolve) => {
          fs.mkdir(directory, () => {
            resolve();
          });
        });
        return true;
      }

      return false;
    } catch (err) {
      this._printlog('error', 'mkdirsAsync err:', err, directory);
      return true;
    }
  }
}

export default QFileOrDir;
