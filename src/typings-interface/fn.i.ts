/** 任意回调参数的回调函数 */
export interface IFnAnyArgs{
    (... args:any[]):void;
}

/** 无回调参数的回调函数 */
export interface IFnEmptyArgs{
    ():void;
}

/** 任意回调参数的回调函数, 返回类型T */
export interface IFnAnyArgsReturnT<T>{
    (... args:any[]): T;
}

/** 是否成功回调函数 */
export interface IFnIsSuccess{
    (isSuccess: boolean):void;
}

/** 是否成功回调函数, 第2个参数开始任意回调参数*/
export interface IFnIsSuccessAnyArgs{
    (isSuccess: boolean, ...args: any[]):void;
}

/** 错误则无result，有result则无错误 */
export interface IFnErrorOrResult{
    (err: Error | any | void, result?: any, ...args: any[]): void;
}

/** 错误描述回调 */
export interface IFnErrorDesc{
    (errDesc: string): void;
}