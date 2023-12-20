declare namespace NodeJS {
    interface Global {
        // appRootDir?: string;
        [propName: string]: any;
    }
}