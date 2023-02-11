export default class tempHelper {

    private tempData: { [key: string]: unknown };

    private static instance: tempHelper;

    public static getInstance(): tempHelper {
        if (!this.instance) {
            this.instance = new tempHelper();
        }
        return this.instance;
    }

    constructor() {
        this.tempData = {};
    }

    public set(key: string, value: unknown) {
        this.tempData[key] = value;
    }

    public get(key: string) {
        return this.tempData[key];
    }

    public remove(key: string) {
        delete this.tempData[key];
    }

    public clear() {
        this.tempData = {};
    }

    public has(key: string) {
        return Object.hasOwn(this.tempData, key);
    }

    public keys() {
        return Object.keys(this.tempData);
    }

    public values() {
        return Object.values(this.tempData);
    }

    public entries() {
        return Object.entries(this.tempData);
    }

    public length() {
        return this.keys().length;
    }

    public isEmpty() {
        return this.length() === 0;
    }


}