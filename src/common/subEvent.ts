/* eslint-disable @typescript-eslint/no-explicit-any */

type callback = {
	fun: (...args: any[]) => void;
	once: boolean;
}

type event = {
	name: string,
	callbacks: callback[]
	started: boolean
}

export default class subEventHelper {
  private static instance: subEventHelper;
  
  private window: win;

  private events: event[];

  constructor(window: win) {
      this.window = window;
      this.events = [];
  }
  
  /**
   * Returns the instance of eventHelper
   * @param app Electron App
   * @returns {subEventHelper} Instance of eventHelper
   * @throws {Error} If app is undefined
   * @example
   * // IN app.ts
   * const _window: win = window
   * eventHelper.getInstance(_window);
   * // => eventHelper { app: App { ... } }
   * @example
   * // IN app.ts
   * eventHelper.getInstance();
   * // => Error: App is undefined
   * @example
   * // Here is an example of how to use this method in the app without the need to pass the app instance.
   * 
   * // IN app.ts
   * const _window: win = window
   * eventHelper.getInstance(_window);
   * // => eventHelper { app: App { ... } }
   * // IN appWindow.ts
   * eventHelper.getInstance();
   * // => eventHelper { app: App { ... } }
   * 
   * // This is because app.ts is the first file to be executed in the main process
   * // then appWindow.ts so the instance is already created.
   */
  static getInstance(window?: win): subEventHelper {
    if (!subEventHelper.instance && window !== undefined) {
        subEventHelper.instance = new subEventHelper(window);
    } else if (!subEventHelper.instance && window === undefined) {
        throw new Error('Window is undefined');
    }
    return subEventHelper.instance;
  }

  private getEvent(name: string): event {
    return this.events.find(event => event.name === name);
  }
  
  private startEvent(name: string) {

    if(this.isStarted(name)) return;

    this.getEvent(name).started = true;

    this.window.api.receive(name, (event: any, ...args: any[]) => {
        
        const eventObj = this.getEvent(name);
  
        const callbacks = eventObj.callbacks;
  
        callbacks.forEach(callback => {
          callback.fun(...args);
          if (callback.once) {
            this.unregisterCallback(name, callback.fun);
          }
        });
    });
  }

  private stopEvent(name: string) {
    this.window.api.removeAll(name);
  }

  private isRegistered(name: string): boolean {
    return this.getEvent(name) !== undefined;
  }

  private isStarted(name: string): boolean {
    return this.getEvent(name).started;
  }

  private hasAnyCallback(name: string): boolean {
    return this.getEvent(name).callbacks.length > 0;
  }

  private hasCallback(name: string, fun: (...args: any[]) => void): boolean {
    return this.getEvent(name).callbacks.find(callback => callback.fun === fun) !== undefined;
  }

  public registerEvent(name: string) {
    if (!this.isRegistered(name)) {
      this.events.push({
        name,
        callbacks: [],
        started: false
      });
    }
  }

  public unregisterEvent(name: string) {
    if (this.isRegistered(name)) {
      this.events = this.events.filter(event => event.name !== name);

      if (this.isStarted(name)) {
        this.stopEvent(name);
      }
    }
  }

  public registerCallback(name: string, fun: (...args: any[]) => void, once = false) {
    if(!this.isRegistered(name)) {
      this.registerEvent(name);
    }

    if (!this.hasCallback(name, fun)) {
      this.getEvent(name).callbacks.push({
        fun,
        once
      });
    }

    if (!this.isStarted(name)) {
      this.startEvent(name);
    }
  }

  public unregisterCallback(name: string, fun: (...args: any[]) => void) {
    if (this.isRegistered(name)) {
      this.getEvent(name).callbacks = this.getEvent(name).callbacks.filter(callback => callback.fun !== fun);

      if (!this.hasAnyCallback(name)) {
        this.unregisterEvent(name);
      }
    }
  }

  public unregisterAllCallbacks(name: string) {
    if (this.isRegistered(name)) {
      this.getEvent(name).callbacks = [];

      this.unregisterEvent(name);
    }
  }

  public send(name: string, ...args: any[]) {
    this.window.api.send(name, ...args);
  }
}