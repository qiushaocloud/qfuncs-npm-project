export interface IQCheckType {
  isNumber(num: any, isAllowNumStr?: boolean): boolean;
  isString(str: any): boolean;
  isBoolean(bol: any): boolean;
  isNullOrUndefined (arg: unknown, isConsiderStr?: boolean): boolean;
  isPlainObject(obj: any): boolean;
  isJson(json: any): boolean;
  isJsonString(jsonstr: string): boolean;
  // isArray(arr: any): boolean;
  isJsonOrArray(obj: any): boolean;
  isDate(date: any): boolean;
  isFunction(fun: any): boolean;
}

export interface IQToType {
  toJsonStringify (json: Record<string, any>): string;
  toJsonParse (jsonStr: string): Record<string, any>;
  toParseBoolean (bol: unknown): boolean;
}

export interface IQCompare {
  isEqualFunction(fun1: any, fun2: any): boolean;
  isEqualDate(fun1: any, fun2: any): boolean;
  isEqualArray(arr1: any[], arr2: any[], isSimpleCompare?: boolean): boolean;
  isEqualObject(obj1: any, obj2: any): boolean;
  isEqualObjectOrArray(obj1: any, obj2: any, isSimpleCompare?: boolean): boolean;
  isEqualJsonOrArrayByJsonStringify(obj1: any, obj2: any): boolean;
  isEqualAnyValue(val1: any, val2: any, isSimpleCompare?: boolean): boolean;
  /** 浅比较是否相等，相等情况：val1 === val2 ｜ for(val1) === for(val2) */
  isShoalEqual(val1: any, val2: any): boolean;
}

export interface IQDate {
  /** 获取当前时间戳，只支持 get */
  nowTimestamp: number;
  /** 返回校准后的当前时间戳，只支持 get */
  nowCalibrationTimestamp: number;
  /** 时间校准差值，支持 set / get */
  timeCalibrationDiff: number;
  getCurrDateSec (date?: Date | number | string): number;
  toDateSec (dateMsec: number): number;
  getCurrFormatDay (date?: Date | number | string): string;
  getCurrFormatTime (date?: Date | number | string, isGetMs?: boolean): string;
}

export interface IQArray {
  isArrayIncludes<T=any> (arr: T[], searchElement: T, fromIndex?: number, isSimpleCompare?: boolean): boolean;
  arrayIndexOf<T=any> (arr: T[], searchElement: T, fromIndex?: number, isSimpleCompare?: boolean): number;
  removeArrayItem<T=any> (arr: T[], removeItem: T, count?: number, isSimpleCompare?: boolean): number[];
  removeArrayItems<T=any> (arr: T[], removeItems: T[], count?: number, isSimpleCompare?: boolean): number[];
  removeArrayItemsByIndexs<T=any> (arr: T[], removeIndexs: number[] | number): void;
  batchArrayPop<T=any> (arr: T[], count?: number): T[];
  batchArrayShift<T=any> (arr: T[], count?: number): T[];
  findArrayItem<T=any> (arr: T[], findItem: T, count?: number, isSimpleCompare?: boolean): number[];
  findArrayItems<T=any> (arr: T[], findItems: T[], count?: number, isSimpleCompare?: boolean): number[];
  findArrayOneItemByConditions<T=any> (arr: T[], conditionsFn: (item:T) => boolean, isReverse?: boolean): T | undefined;
  findArrayItemsByConditions<T=any> (arr: T[], conditionsFn: (item:T) => boolean, count?: number): {[itemIndex: number]: T};
  removeArrayItemsByConditions<T=any> (arr: T[], conditionsFn: (item:T) => boolean): {removeItemIndexs: number[], removeItems: T[]};
  isArrayIncludesByConditions<T=any> (arr: T[], conditionsFn: (item:T) => boolean): boolean;
  /** 正常数组去重 */
  uniqueArray<T=any> (arr: T[], isSimpleCompare?: boolean): void;
  /** 正常数组去重，返回新数组【即: 原数组不会被修改】 */
  uniqueNewArray<T=any> (arr: T[], isSimpleCompare?: boolean): T[];
  /** 通过规则进行数组去重，且返回删除的下标集
   * @param arr 数组
   * @param rule [可选] 1:去重且位置不变 2:去重且更新位置，默认为1
   * @return 删除的数组下标集
   */
  uniqueArrayByRule<T=any> (arr: T[], rule?: number, isSimpleCompare?: boolean): number[];
  convertSet2Arr<T=any> (set: Set<T>): T[];
  /** 去重 arr2 相对 arr1 而言，多了哪些 items，少了哪些 items */
  diffUniqueArrayItems<T=any> (arr1: T[], arr2: T[], isSimpleCompare?: boolean): {more: T[], less: T[]};
  /** 当 for(items) 不在数组中时 push 到数组中 */
  pushArrayItemsNX<T=any> (arr: T[], items: T[], isSimpleCompare?: boolean): T[];
  /** 当 item 不在数组中时 push 到数组中 */
  pushArrayItemNX<T=any> (arr: T[], item: T, isSimpleCompare?: boolean): T | undefined;
  /** 当 for(items) 不在数组中时 unshift 到数组中 */
  unshiftArrayItemsNX<T=any> (arr: T[], items: T[], isSimpleCompare?: boolean): T[];
  /** 当 item 不在数组中时 unshift 到数组中 */
  unshiftArrayItemNX<T=any> (arr: T[], item: T, isSimpleCompare?: boolean): T | undefined;
}

export interface IQObject {
  deepAssign (sourceObj:QJson, destObj:QJson): QJson;
  deepCopy (obj: QJson, isUseRecursive?: boolean): QJson;
  hasObjKeys (obj: QJson, keys: string[] | string): boolean;
  getObjVals (obj: QJson, keys: string[] | string): QJson;
  getObjVal<T=any> (obj: QJsonT<T>,  key: string): T | undefined;
  getObjValWhenEmptySetDef<T=any> (obj: QJsonT<T>, key: string, defaultVal: T): T;
  delObjItems (obj: QJson, keys: string[] | string): QJson;
}

export interface IQNetwork {
  getIPAddressByNetworkInterface (networkInterface: string, defaultVal?: string, regExpStr?: string): string;
  getNetworkInterfacePrivateIPAddress (networkInterface?: string, defaultVal?: string, regExpStr?: string): string;
  getNetworkInterfacePublicIPAddress (networkInterface?: string, defaultVal?: string, regExpStr?: string): string;
  /** ipv4格式化为数字字符串，例如: 192.168.3.133 转为 192168003133 */
  ipv42NumberStr (ipv4: string): string;
}

export interface IQFileOrDir {
  delFile (filePath: string, opts?: {isDelEmptyDir?: boolean}, onCb?: (err?: NodeJS.ErrnoException) => void): void;
  delFileAsync (filePath: string, opts?: {isDelEmptyDir?: boolean}): Promise<NodeJS.ErrnoException | void>;
  isDirAddr (url: string): boolean;
  getFileName (filePath: string): string;
  getFileSuffix (filePathOrFileName: string): string;
  isExistsFileOrDir (filePathOrDir: string, onCb: (isExists: boolean) => void): void;
  isExistsFileOrDirAsync (filePathOrDir: string): Promise<boolean>;
  deleteIfEmpty (directory: string, onCb?: (err?: Error) => void): void;
  deleteIfEmptyAsync (directory: string): Promise<Error | void>;
  getFileSize (filePath: string, onCb: (err?: NodeJS.ErrnoException, fileSize?: number) => void): void;
  getFileSizeAsync (filePath: string): Promise<number>;
  mkdirsSync (directory: string): boolean;
  mkdirsAsync (directory: string): Promise<boolean>;
}

export interface IQTimer {
  /** 延迟执行,需要用 async 和 await 组合实现 */
  sleep (ts: number): Promise<void>;

  /** 添加到定时队列
   * @param queueId 定时队列 id
   * @param callback 定时器回调函数
   * @param intervalTs 定时器间隔时间，单位：毫秒
  */
  addIntervalQueue (queueId: string, callback: QFnEmptyArgs, intervalTs: number): void;

  /** 从定时队列移除
   * @param queueId 定时队列 id
  */
  removeIntervalQueue (queueId: string): void;

  /** 是否有定时队列任务
   * @param queueId 定时队列 id
  */
  hasIntervalQueue (queueId: string): boolean;

  /** 获取所有定时队列 id
   * @returns 返回所有定时队列 id
   */
  getAllIntervalQueueIds (): string[];
}


export interface IQFunc {
  /** 防抖函数
    * @description 防抖函数，当一个事件频繁触发时，防抖技术确保在事件触发后的特定时间段内只执行一次相应的操作。如果在此时间段内事件再次触发，则重新计时。
    * @param func 原函数
    * @param delay 延迟时间
    * @param immediate 首次触发时是否立即执行
    * @returns 返回防抖后的函数
    */
 debounce(func: QFnAnyArgs, delay: number, immediate?: boolean): QFnAnyArgs;

 /** 节流函数
  * @description 节流函数，节流技术确保在一定时间间隔内只执行一次操作，即使事件频繁触发。
  * @param func 原函数
  * @param delay 延迟时间
  * @returns 返回节流后的函数
  */
 throttle(func: QFnAnyArgs, delay: number): QFnAnyArgs;
}

export interface IQMethods extends
IQFunc, IQCheckType, IQCompare, IQToType, IQDate,
IQTimer, IQArray, IQObject, IQNetwork, IQFileOrDir
{
  getPlatform(): string; // return Windows | Linux | Mac | ?UnsupportedPlatform
  /** 随机获取范围内 count 个值 */
  randomRangeValues (start: number, end: number, count?: number): number[];
  loadJsonFile<T=QJson> (filePath: string): T | undefined;
  generateUuid (): string;
  generateRandomNumberId (): number;
  generateRandomId (isUseNumAndDate?: boolean): string;
  formatError (error: string | Error): QJson;
}

declare global {
  const qFuncs: IQMethods;
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      qFuncs: IQMethods;
    }
  }
}