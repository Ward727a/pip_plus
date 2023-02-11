import fileHelper from "./file";

export default class errorHelper {

    private static instance: errorHelper;

    public static getInstance(): errorHelper {
        if (!errorHelper.instance) {
            errorHelper.instance = new errorHelper();
        }
        return errorHelper.instance;
    }


    private getCaller(e: Error): { filePath: string, line: string, column: string } | null {
        const regex = /\((.*):(\d+):(\d+)\)$/;
        const match = regex.exec(e.stack.split("\n")[2]);
        if (match) {
            return {
                filePath: match[1],
                line: match[2],
                column: match[3]
            }
        } else {
            return null;
        }
        
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private registerInLog(e: Error|{caller: any, error: Error}): void {
        if(e instanceof Error) {
            const caller = this.getCaller(e);

            if (caller) {
                if(fileHelper.getInstance().checkFileExists('error.log')){
                    fileHelper.getInstance().appendFileToUserdir('error.log', `Error in ${caller.filePath} at line ${caller.line}, column ${caller.column}:\n${e.message}\n\n`);
                } else {
                    fileHelper.getInstance().setFileToUserdir('error.log', `Error in ${caller.filePath} at line ${caller.line}, column ${caller.column}:\n${e.message}\n\n`);
                }
            } else {
                if(fileHelper.getInstance().checkFileExists('error.log')){
                    fileHelper.getInstance().appendFileToUserdir('error.log', `Error, cannot get the caller of the error:\n${e.message}\n\n`);
                } else {
                    fileHelper.getInstance().setFileToUserdir('error.log', `Error, cannot get the caller of the error:\n${e.message}\n\n`);
                }
            }
        } else {
            const caller = e.caller;

            if (caller) {
                if(fileHelper.getInstance().checkFileExists('error.log')){
                    fileHelper.getInstance().appendFileToUserdir('error.log', `Error in ${caller.filePath} at line ${caller.line}, column ${caller.column}:\n${e.error.message}\n\n`);
                } else {
                    fileHelper.getInstance().setFileToUserdir('error.log', `Error in ${caller.filePath} at line ${caller.line}, column ${caller.column}:\n${e.error.message}\n\n`);
                }
            } else {
                if(fileHelper.getInstance().checkFileExists('error.log')){
                    fileHelper.getInstance().appendFileToUserdir('error.log', `Error, cannot get the caller of the error:\n${e.error.message}\n\n`);
                } else {
                    fileHelper.getInstance().setFileToUserdir('error.log', `Error, cannot get the caller of the error:\n${e.error.message}\n\n`);
                }
            }
        }
    }


    public logError(e: Error): void {
        const caller = this.getCaller(e);
        if (caller) {
            this.registerInLog({caller: caller, error: e});
            console.error(`Error in ${caller.filePath} at line ${caller.line}, column ${caller.column}:\n${e.message}`);
        } else {
            this.registerInLog(e);
            console.error(`Error, cannot get the caller of the error:\n${e.message}`);
        }
    }

    public logErrorAndThrow(e: Error): void {
        this.logError(e);
        throw e;
    }

}