/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'fs';

export default class xmlHelper {
    private static instance: xmlHelper;

    /**
     * Returns the instance of xmlHelper
     * @returns {xmlHelper} Instance of xmlHelper
     * @example
     * // IN app.ts
     * xmlHelper.getInstance();
     * // => xmlHelper { app: App { ... } }
     * @example
     * // IN appWindow.ts
     * xmlHelper.getInstance();
     * // => xmlHelper { app: App { ... } }
     */
    static getInstance(): xmlHelper {
        if (!xmlHelper.instance) {
            xmlHelper.instance = new xmlHelper();
        }
        return xmlHelper.instance;
    }

    private getXmlFile(path: string): string {
        return fs.readFileSync(path, 'utf8');
    }

    private getXmlObject(path: string): any {
        return this.parseXml(this.getXmlFile(path));
    }

    private parseXml(xml: string): any {
        const parser = new DOMParser();
        return parser.parseFromString(xml, 'text/xml');
    }

    /**
     * Convert xml to json
     * @param {any} xml - The xml to convert
     * @returns {any} The json in format :
     * @from 
     * ```xml
     *  <root attribute1="value1" attribute2="value2">
     *      <child1 attribute1="value1" attribute2="value2">
     *          <child2 attribute1="value1" attribute2="value2">
     *          </child2>
     *      </child1>
     *  </root>
     * ```
     * @to 
     * ```json
     *  {
     *      "@attributes": {
     *          "attribute1": "value1",
     *          "attribute2": "value2"
     *      },
     *      "child1": {
     *          "@attributes": {
     *              "attribute1": "value1",
     *              "attribute2": "value2"
     *          },
     *          "child2": {
     *              "@attributes": {
     *                  "attribute1": "value1",
     *                  "attribute2": "value2"
     *              },
     *          }
     *      }
     *  }
     * ```
     * 
     * @example
     * // IN app.ts
     * const xml = xmlHelper.getInstance().getXmlObject('path/to/xml');
     * xmlHelper.getInstance().xmlToJson(xml);
     * // => { ... }
     * @example
     * // IN appWindow.ts
     * const xml = xmlHelper.getInstance().getXmlObject('path/to/xml');
     * xmlHelper.getInstance().xmlToJson(xml);
     * // => { ... }
     * 
     * @see https://davidwalsh.name/convert-xml-json
     */
    private xmlToJson(xml: any): any {
        // Create the return object
        let obj:any = {};

        if (xml.nodeType === 1) { // element
            // do attributes
            if (xml.attributes.length > 0) {
                obj['@attributes'] = {};
                for (let j = 0; j < xml.attributes.length; j++) {
                    const attribute = xml.attributes.item(j);
                    obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType === 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for (let i = 0; i < xml.childNodes.length; i++) {
                const item = xml.childNodes.item(i);
                const nodeName = item.nodeName;
                if (typeof (obj[nodeName]) === 'undefined') {
                    obj[nodeName] = this.xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) === 'undefined') {
                        const old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(this.xmlToJson(item));
                }
            }
        }
        return obj;
    }

    public getXmlObjectFromPath(path: string): any {
        return this.getXmlObject(path);
    }

    public getXmlFileFromPath(path: string): string {
        return this.getXmlFile(path);
    }

    public getXmlJsonFromPath(path: string): any {
        return this.xmlToJson(this.getXmlObject(path));
    }

    public getXmlJsonFromXml(xml: string): any {
        return this.xmlToJson(this.parseXml(xml));
    }
    
    public getXmlObjectFromXml(xml: string): any {
        return this.parseXml(xml);
    }

    public getXmlJsonFromObject(xml: any): any {
        return this.xmlToJson(xml);
    }
}
