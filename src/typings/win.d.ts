/* eslint-disable @typescript-eslint/no-explicit-any */

declare type win = Window & {
    api?: {
        send: (channel: string, data?: any) => void;
        receive: (channel: string, func: (event: any, ...args: any[]) => void) => void;
        receiveOnce: (channel: string, func: (event: any, ...args: any[]) => void) => void;
        invoke: (channel: string, data?: any) => Promise<any>;
        remove: (channel: string, func: (event: any, ...args: any[]) => void) => void;
        removeAll: (channel: string) => void;
    };
}