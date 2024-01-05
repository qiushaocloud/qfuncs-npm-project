/* eslint-disable max-lines */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
import {ILog, IProfixLog} from './log.i';

export enum LogLevel {
    TRACE = 1,
    DEBUG = 2,
    LOG = 3,
    INFO = 4,
    WARN = 5,
    ERROR = 6,
    FATAL = 7,
    NONE = 8
}

export const LEVEL_MAP = {
  'TRACE': LogLevel.TRACE,
  'DEBUG': LogLevel.DEBUG,
  'LOG': LogLevel.LOG,
  'INFO': LogLevel.INFO,
  'WARN': LogLevel.WARN,
  'ERROR': LogLevel.ERROR,
  'FATAL': LogLevel.FATAL,
  'NONE': LogLevel.NONE
};
export const DEFAULT_LEVEL = LogLevel.INFO;
export const DEFAULT_LEVEL_STR = 'INFO';

const PID = process.pid;
const logCategoryName2LevelStrs: IQJsonT<string> = {
  'defaultLog': 'INFO'
};

const forceCustomLogModule = ((global as any).forceCustomLogModule || {}) as {
    setLogMyid?: (logMyidArg: string) => void;
    Log?: ILog;
    // logFactory?: LogFactory;
} & IQJson;

let logMyid = ((global as any).defaultLog4jsMyID as string | undefined) || 'unknownMyid';
export const setLogMyid = (logMyidArg: string): void => {
  if (forceCustomLogModule.setLogMyid)
    return forceCustomLogModule.setLogMyid(logMyidArg);

  logMyid = logMyidArg;
};

const getLogMyid = (): string => {
  return logMyid || ((global as any).defaultLog4jsMyID as string | undefined) || 'unknownMyid';
};

/** 获取当前格式化的时间，格式为：YYYY-MM-DD HH:mm:ss.sss ｜ YYYY-MM-DD HH:mm:ss */
const getCurrFormatTime = (isGetMs = true): string => {
  const date = new Date();
  const year = date.getFullYear();
  let month: string | number = date.getMonth() + 1;
  let day: string | number = date.getDate();
  let hours: string | number = date.getHours();
  let minutes: string | number = date.getMinutes();
  let seconds: string | number = date.getSeconds();

  if (month < 10)
    month = '0' + month;
  if (day < 10)
    day = '0' + day;
  if (hours < 10)
    hours = '0' + hours;
  if (minutes < 10)
    minutes = '0' + minutes;
  if (seconds < 10)
    seconds = '0' + seconds;

  if (isGetMs) {
    let milliseconds: string | number = date.getMilliseconds();

    if (milliseconds < 10)
      milliseconds = '00' + milliseconds;
    else if (milliseconds < 100)
      milliseconds = '0' + milliseconds;

    return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
  }

  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
};

class Log implements ILog {
    public currLevel = DEFAULT_LEVEL;
    private loggerCategoryName: string;
    private _profixArg: string | void = ((global as any).defaultLogProfixArg as string | void) || 'null'; // 默认前缀为null

    constructor (loggerCategoryName: string, profixArg?: string) {
      const useLevelKey = logCategoryName2LevelStrs[loggerCategoryName];
      if (useLevelKey && (LEVEL_MAP as IQJsonT<number>)[useLevelKey] !== undefined) {
        this.currLevel = (LEVEL_MAP as IQJsonT<number>)[useLevelKey];
      }

      this.loggerCategoryName = loggerCategoryName;
      if (profixArg !== undefined)
        this._profixArg = profixArg;
    }

    setProfixArg (profixArg: string | void): void {
      this._profixArg = profixArg;
    }

    getProfixArg (): string | void {
      return this._profixArg;
    }

    getCategoryName (): string {
      return this.loggerCategoryName;
    }

    trace (message: any, ...args: any[]): void {
      if (this.currLevel > LogLevel.TRACE)
        return;
      this._printLog('trace', message, args);
    }

    debug (message: any, ...args: any[]): void {
      if (this.currLevel > LogLevel.DEBUG)
        return;
      this._printLog('debug', message, args);
    }

    log (message: any, ...args: any[]): void {
      if (this.currLevel > LogLevel.LOG)
        return;
      this._printLog('log', message, args);
    }

    info (message: any, ...args: any[]): void {
      if (this.currLevel > LogLevel.INFO)
        return;
      this._printLog('info', message, args);
    }

    warn (message: any, ...args: any[]): void {
      if (this.currLevel > LogLevel.WARN)
        return;
      this._printLog('warn', message, args);
    }

    error (message: any, ...args: any[]): void {
      if (this.currLevel > LogLevel.ERROR)
        return;
      this._printLog('error', message, args);
    }

    fatal (message: any, ...args: any[]): void {
      if (this.currLevel > LogLevel.FATAL)
        return;
      this._printLog('fatal', message, args);
    }

    private _printLog (method: string, message: any, args: any[]): void {
      const methodTmp = method === 'fatal' ? 'error' : method;
      // eslint-disable-next-line no-console
      if ((console as any)[methodTmp] && typeof (console as any)[method] === 'function') {
        if (this._profixArg)
          (console as any)[methodTmp](getCurrFormatTime(), Date.now(), getLogMyid(), PID, method.toUpperCase(), this.loggerCategoryName, this._profixArg, message, ...args);
        else
          (console as any)[methodTmp](getCurrFormatTime(), Date.now(), getLogMyid(), PID, method.toUpperCase(), this.loggerCategoryName, message, ...args);
        return;
      }

      if (this._profixArg)
        console.error(getCurrFormatTime(), Date.now(), getLogMyid(), PID, method.toUpperCase(), this.loggerCategoryName, this._profixArg, new Error(`console not found ${methodTmp} function`), message, ...args);
      else
        console.error(getCurrFormatTime(), Date.now(), getLogMyid(), PID, method.toUpperCase(), this.loggerCategoryName, new Error(`console not found ${methodTmp} function`), message, ...args);
    }
}

class LogFactory {
    private _logs:Map<string, ILog> = new Map();

    produceLog (loggerCategoryName: string, profixArg?: string): ILog {
      let log = this._logs.get(loggerCategoryName);
      if (!log) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        log = (forceCustomLogModule.Log ? new (forceCustomLogModule.Log as any)(loggerCategoryName, profixArg) : new Log(loggerCategoryName, profixArg)) as ILog;
        this._logs.set(loggerCategoryName, log);
      }
      return log;
    }

    destroyLog (loggerCategoryName: string): void {
      this._logs.delete(loggerCategoryName);
    }

    destroyAllLog (): void {
      this._logs.clear();
    }

    getLog (loggerCategoryName: string): ILog | void {
      return this._logs.get(loggerCategoryName);
    }

    getAllLog (): Map<string, ILog> {
      return this._logs;
    }
}

export class ProfixLog implements IProfixLog {
    public currLevel = DEFAULT_LEVEL;
    public logInstance?: ILog | void | undefined;
    private _profixArg: string | void;
    private _suffixArg: string | void;
    constructor (logInstance: ILog, profixArg: string, suffixArg?: string) {
      this.logInstance = logInstance;
      this.currLevel = logInstance.currLevel;
      this._profixArg = profixArg;
      this._suffixArg = suffixArg;
    }

    trace (message: unknown, ...args:any[]):void {
      if (!this.logInstance) return;
      if (this.logInstance.currLevel > LogLevel.TRACE)
        return;
      if (this._suffixArg)
        this.logInstance.trace(this._profixArg, message, ...args, this._suffixArg);
      else
        this.logInstance.trace(this._profixArg, message, ...args);
    }

    debug (message: unknown, ...args:any[]):void {
      if (!this.logInstance) return;
      if (this.logInstance.currLevel > LogLevel.DEBUG)
        return;
      if (this._suffixArg)
        this.logInstance.debug(this._profixArg, message, ...args, this._suffixArg);
      else
        this.logInstance.debug(this._profixArg, message, ...args);
    }

    log (message: unknown, ...args:any[]):void {
      if (!this.logInstance) return;
      if (this.logInstance.currLevel > LogLevel.LOG)
        return;
      if (this._suffixArg)
        this.logInstance.log(this._profixArg, message, ...args, this._suffixArg);
      else
        this.logInstance.log(this._profixArg, message, ...args);
    }

    info (message: unknown, ...args:any[]):void {
      if (!this.logInstance) return;
      if (this.logInstance.currLevel > LogLevel.INFO)
        return;
      if (this._suffixArg)
        this.logInstance.info(this._profixArg, message, ...args, this._suffixArg);
      else
        this.logInstance.info(this._profixArg, message, ...args);
    }

    warn (message: unknown, ...args:any[]):void {
      if (!this.logInstance) return;
      if (this.logInstance.currLevel > LogLevel.WARN)
        return;
      if (this._suffixArg)
        this.logInstance.warn(this._profixArg, message, ...args, this._suffixArg);
      else
        this.logInstance.warn(this._profixArg, message, ...args);
    }

    error (message: unknown, ...args:any[]):void {
      if (!this.logInstance) return;
      if (this.logInstance.currLevel > LogLevel.ERROR)
        return;
      if (this._suffixArg)
        this.logInstance.error(this._profixArg, message, ...args, this._suffixArg);
      else
        this.logInstance.error(this._profixArg, message, ...args);
    }

    fatal (message: unknown, ...args:any[]):void {
      if (!this.logInstance) return;
      if (this.logInstance.currLevel > LogLevel.FATAL)
        return;
      if (this._suffixArg)
        this.logInstance.fatal(this._profixArg, message, ...args, this._suffixArg);
      else
        this.logInstance.fatal(this._profixArg, message, ...args);
    }

    getCategoryName (): string {
      if (!this.logInstance) return 'unknown';
      return this.logInstance.getCategoryName();
    }

    setProfixArg (profixArg2: string | void): void {
      this._profixArg = profixArg2;
    }

    getProfixArg (): string | void {
      return this._profixArg;
    }

    setSuffixArg (suffixArg2: string | void): void {
      this._suffixArg = suffixArg2;
    }

    destroy (): void {
      this.logInstance = undefined;
      this.currLevel = DEFAULT_LEVEL;
    }

    setLogInstance (logInstance?: ILog | void | undefined): void {
      if (logInstance) {
        this.logInstance = logInstance;
        this.currLevel = logInstance.currLevel;
        return;
      }
      this.logInstance = undefined;
      this.currLevel = DEFAULT_LEVEL;
    }
}

export const logFactory = (forceCustomLogModule?.logFactory as LogFactory) || new LogFactory();

export const getLogger = (loggerCategoryName: string, profixArg?: string): ILog => {
  const log = logFactory.produceLog(loggerCategoryName, profixArg);
  return log;
};

export const getProfixLog = (logInstance: ILog, profixArg: string, suffixArg?: string): IProfixLog => {
  return new ProfixLog(logInstance, profixArg, suffixArg);
};

export const setLogLevel = (loggerCategoryName: string, logLevelStr: string): void => {
  if (forceCustomLogModule.Log) return;
  const logLevelNum = (LEVEL_MAP as IQJsonT<number>)[logLevelStr];
  if (!logLevelStr && logLevelNum !== undefined) return;
  if (logCategoryName2LevelStrs[loggerCategoryName] === logLevelStr) return;
  logCategoryName2LevelStrs[loggerCategoryName] = logLevelStr;
  const logTmp = logFactory.getLog(loggerCategoryName);
  logTmp && (logTmp.currLevel = logLevelNum);
};

export const setLogLevels = (updateLevels: IQJsonT<string>): void => {
  if (forceCustomLogModule.Log) return;
  for (const loggerCategoryName in updateLevels)
    setLogLevel(loggerCategoryName, updateLevels[loggerCategoryName]);
};

export const delLogLevels = (loggerCategoryNames: string[] | string): void => {
  if (forceCustomLogModule.Log) return;
  if (Array.isArray(loggerCategoryNames)) {
    for (const loggerCategoryName of loggerCategoryNames) {
      delete logCategoryName2LevelStrs[loggerCategoryName];
      const logTmp = logFactory.getLog(loggerCategoryName);
      logTmp && (logTmp.currLevel = DEFAULT_LEVEL);
    }
    return;
  }

  delete logCategoryName2LevelStrs[loggerCategoryNames];
  const logTmp = logFactory.getLog(loggerCategoryNames);
  logTmp && (logTmp.currLevel = DEFAULT_LEVEL);
};

const defaultLog = logFactory.produceLog('defaultLog');
export default defaultLog;