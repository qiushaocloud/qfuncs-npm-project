export interface ILog{
    currLevel: number;
    trace(message: any, ...args:any[]):void;
    debug(message: any, ...args:any[]):void;
    log(message: any, ...args:any[]):void;
    info(message: any, ...args:any[]):void;
    warn(message: any, ...args:any[]):void;
    error(message: any, ...args:any[]):void;
    fatal(message: any, ...args:any[]):void;
    getCategoryName(): string;
    setProfixArg(profixArg: string | void): void;
    getProfixArg(): string | void;
    setSuffixArg?: (suffixArg2: string | void)=>void;
}

export interface IProfixLog extends ILog{
    logInstance?: ILog | void | undefined;
    currLevel: number;
    destroy(): void;
    setLogInstance(logInstance?: ILog | void | undefined): void;
}