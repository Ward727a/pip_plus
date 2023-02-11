import fs from 'fs';
import path from 'path';

export default class fileHelper {

  private static instance: fileHelper;

  private app: Electron.App;

  constructor(app: Electron.App) {

    this.app = app;

  }

  /**
   * Returns the instance of fileHelper
   * @param app Electron App
   * @returns {fileHelper} Instance of fileHelper
   * @throws {Error} If app is undefined
   * @example
   * // IN app.ts
   * fileHelper.getInstance(app);
   * // => fileHelper { app: App { ... } }
   * @example
   * // IN app.ts
   * fileHelper.getInstance();
   * // => Error: App is undefined
   * @example 
   * // Here is an example of how to use this method in the app without the need to pass the app instance.
   * 
   * // IN app.ts
   * fileHelper.getInstance(app);
   * // => fileHelper { app: App { ... } }
   * // IN appWindow.ts
   * fileHelper.getInstance();
   * // => fileHelper { app: App { ... } }
   * 
   * // This is because app.ts is the first file to be executed in the main process 
   * // then appWindow.ts so the instance is already created.
   */
  static getInstance(app?: Electron.App): fileHelper {
    if (!fileHelper.instance && app !== undefined) {
      fileHelper.instance = new fileHelper(app);
    } else if (!fileHelper.instance && app === undefined) {
      throw new Error('App is undefined');
    }
    return fileHelper.instance;
  }

  /**
   * Set file to user directory
   * @param filename File name
   * @param _data File data
   * @returns {void}
   * @throws {Error} If file cannot be written
   * @example
   * fileHelper.getInstance(app).setFileToUserdir('test.txt', 'Hello World!');
   * // => void
   * @example
   * fileHelper.getInstance(app).setFileToUserdir('test.txt', 'Hello World!');
   * // => Error: ENOENT: no such file or directory, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).setFileToUserdir('test.txt', 'Hello World!');
   * // => Error: EPERM: operation not permitted, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).setFileToUserdir('test.txt', 'Hello World!');
   * // => Error: EACCES: permission denied, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).setFileToUserdir('test.txt', 'Hello World!');
   * // => Error: EISDIR: illegal operation on a directory, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).setFileToUserdir('test.txt', 'Hello World!');
   * // => Error: EROFS: read-only file system, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).setFileToUserdir('test.txt', 'Hello World!');
   * // => Error: EEXIST: file already exists, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   */
  public setFileToUserdir(filename: string, _data: string): void {

    const userdir = this.app.getPath('userData');
    const filepath = path.join(userdir, filename);

    const data = _data.trim();

    fs.writeFile(filepath,
      data,
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
  }

  /**
   * Read file from user directory
   * @param filename File name
   * @returns {string} File data
   * @throws {Error} If file cannot be read
   * @example
   * fileHelper.getInstance(app).readFileFromUserdir('test.txt');
   * // => 'Hello World!'
   * @example
   * fileHelper.getInstance(app).readFileFromUserdir('test.txt');
   * // => Error: ENOENT: no such file or directory, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).readFileFromUserdir('test.txt');
   * // => Error: EPERM: operation not permitted, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).readFileFromUserdir('test.txt');
   * // => Error: EACCES: permission denied, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).readFileFromUserdir('test.txt');
   * // => Error: EISDIR: illegal operation on a directory, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).readFileFromUserdir('test.txt');
   * // => Error: EROFS: read-only file system, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).readFileFromUserdir('test.txt');
   * // => Error: EEXIST: file already exists, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   */
  public readFileFromUserdir(filename: string): string {
    
    const userdir = this.app.getPath('userData');
    const filepath = path.join(userdir, filename);

    return fs.readFileSync(filepath, 'utf8');
  }

  /**
   * Delete file from user directory
   * @param filename File name
   * @returns {void}
   * @throws {Error} If file cannot be deleted
   * @example
   * fileHelper.getInstance(app).deleteFileFromUserdir('test.txt');
   * // => void
   * @example
   * fileHelper.getInstance(app).deleteFileFromUserdir('test.txt');
   * // => Error: ENOENT: no such file or directory, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).deleteFileFromUserdir('test.txt');
   * // => Error: EPERM: operation not permitted, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).deleteFileFromUserdir('test.txt');
   * // => Error: EACCES: permission denied, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).deleteFileFromUserdir('test.txt');
   * // => Error: EISDIR: illegal operation on a directory, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).deleteFileFromUserdir('test.txt');
   * // => Error: EROFS: read-only file system, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).deleteFileFromUserdir('test.txt');
   * // => Error: EEXIST: file already exists, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   */
  public deleteFileFromUserdir(filename: string): void {

    const userdir = this.app.getPath('userData');
    const filepath = path.join(userdir, filename);

    fs.unlink(filepath,
      (err) => {
        if (err) {
          throw err;
        }
      }
    );
  }

  /**
   * Check if file exists in user directory
   * @param filename File name
   * @returns {boolean} True if file exists
   * @example
   * fileHelper.getInstance(app).checkFileExists('test.txt');
   * // => true
   * @example
   * fileHelper.getInstance(app).checkFileExists('test.txt');
   * // => false
   * @example
   * fileHelper.getInstance(app).checkFileExists('test.txt');
   * // => Error: ENOENT: no such file or directory, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).checkFileExists('test.txt');
   * // => Error: EPERM: operation not permitted, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).checkFileExists('test.txt');
   * // => Error: EACCES: permission denied, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).checkFileExists('test.txt');
   * // => Error: EISDIR: illegal operation on a directory, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   * @example
   * fileHelper.getInstance(app).checkFileExists('test.txt');
   * // => Error: EROFS: read-only file system, open 'C:\Users\username\AppData\Roaming\appname\test.txt'
   **/
  public checkFileExists(filename: string): boolean {
      
    const userdir = this.app.getPath('userData');
    const filepath = path.join(userdir, filename);

    return fs.existsSync(filepath);

  }

  public appendFileToUserdir(filename: string, data: string): void {

    let content = this.readFileFromUserdir(filename);
    content += "\n"+data;

    this.setFileToUserdir(filename, content);
  }

}