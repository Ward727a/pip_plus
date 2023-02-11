/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcMain } from 'electron';

type callback = {
	fun: (...args: any[]) => void;
	once: boolean;
}

type event = {
	name: string,
	callbacks: callback[]
	started: boolean
}

export default class mainEventHelper {
	private static instance: mainEventHelper;

	private events: event[];

	constructor() {
		this.events = [];
	}

	/**
	 * Returns the instance of eventHelper
	 * @returns {mainEventHelper} Instance of eventHelper
	 * @example
	 * // IN app.ts
	 * eventHelper.getInstance();
	 * // => eventHelper { app: App { ... } }
	 */
	static getInstance(): mainEventHelper {
		if (!mainEventHelper.instance) {
			mainEventHelper.instance = new mainEventHelper();
		}
		return mainEventHelper.instance;
	}

	private getEvent(name: string) {
		return this.events.find((event) => event.name === name);
	}

	private startEvent(name: string) {

		if (this.isStarted(name)) {
			return;
		}

		// Set the event as started
		this.events.find((event) => event.name === name).started = true;

		ipcMain.on(name, (event, ...args) => {

			// Get the event
			const eventObj = this.getEvent(name);

			// Get the callbacks
			const callbacks = eventObj.callbacks;

			// Execute all callbacks
			callbacks.forEach((callback) => {
				callback.fun(event, ...args);
				if (callback.once) {
					this.unregisterCallback(name, callback.fun);
				}
			});
		});
	}

	private isRegistered(name: string) {
		return this.events.find((event) => event.name === name) !== undefined;
	}

	private isStarted(name: string) {
		return this.events.find((event) => event.name === name).started;
	}

	private hasAnyCallback(name: string) {
		return this.events.find((event) => event.name === name).callbacks.length > 0;
	}

	private hasCallback(name: string, fun: (...args: any[]) => void) {
		return this.events.find((event) => event.name === name).callbacks.find((callback) => callback.fun === fun) !== undefined;
	}
	
	private stopEvent(name: string) {

		// Set the event as stopped
		this.events.find((event) => event.name === name).started = false;

		ipcMain.removeAllListeners(name);
	}

	
	/**
	 * Start all events
	 * @example
	 * // IN app.ts
	 * eventHelper.getInstance().start();
	 * // => Start all events
	 */
	public start() {
		this.events.forEach((event) => {
			if (this.hasAnyCallback(event.name)) {
				this.startEvent(event.name);
			}
		});
	}

	public stop() {
		this.events.forEach((event) => {
			this.stopEvent(event.name);
		});
	}

	public registerEvent(name: string) {
		if (this.isRegistered(name)) {
			return;
		}
		this.events.push({
			name: name,
			callbacks: [],
			started: false
		});
	}

	public listEvents() {
		if (process.env.NODE_ENV === 'development') {
			console.table(this.events);
		}
	}

	public registerCallback(name: string, fun: (...args: any[]) => void, once = false) {

		if (!this.isRegistered(name)) {
			this.registerEvent(name);
		}

		if (this.hasCallback(name, fun)) {
			return;
		}

		this.events.find((event) => event.name === name).callbacks.push({
			fun: fun,
			once: once
		});

		// If the event is not started, start it
		if (!this.isStarted(name)) {
			this.startEvent(name);
		}
	}

	public unregisterCallback(name: string, fun: (...args: any[]) => void) {

		if (!this.isRegistered(name)) {
			return;
		}

		if (!this.hasCallback(name, fun)) {
			return;
		}

		this.events.find((event) => event.name === name).callbacks.splice(this.events.find((event) => event.name === name).callbacks.indexOf(this.events.find((event) => event.name === name).callbacks.find((callback) => callback.fun === fun)), 1);

		// If the event has no more callbacks, stop it
		if (!this.hasAnyCallback(name)) {
			this.stopEvent(name);
		}
	}

	public unregisterAllCallbacks(name: string) {
		
		if (!this.isRegistered(name)) {
			return;
		}

		this.events.find((event) => event.name === name).callbacks = [];

		this.stopEvent(name);
	}
}