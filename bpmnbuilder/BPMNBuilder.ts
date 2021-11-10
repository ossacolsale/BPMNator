import { create } from 'domain';
import { create as xml } from 'xmlbuilder2';
import { Process } from '../entities/Process/Process';
import { KeyObjDict } from '../entities/SharedTypes';
import { BPMNProcessBuilder } from './BPMNProcessBuilder';

export class BPMNBuilder {

    private _mainNodeName: string = 'bpmn:definitions';
    private _processNodeName: string = 'bpmn:process';
    private _xmlObj: any;
    private _error: string = null;
    private _BPMNcomplete: string;
    private _BPMNWithoutDiagram: string;
    private _processXML: {};
    private _TESTDIAG: string = `
    

    `; //put here a diagram to test

    public async produceDiagram () {
        console.log('test');
        const AutoLayout = require('bpmn-auto-layout');    
        const autoLayout = new AutoLayout();
        //const BPMNComplete = await autoLayout.layoutProcess(this._TESTDIAG); //testing purpose
        const BPMNComplete = await autoLayout.layoutProcess(this.BPMNWithoutDiagram);
/*      
        let split1: string = BPMNComplete.split('<'+this._processNodeName+' ')[0];
        let split2: string = BPMNComplete.split('</'+this._processNodeName+'>')[1];
        const processObj: KeyObjDict = {};
        processObj[this._processNodeName] = this._processXML;
        const process = xml(processObj).end();
        const doc = xml(split1 + process + split2);
*/
        const doc = xml(BPMNComplete);
        this._BPMNcomplete = doc.end({ prettyPrint: true });
    }

    public constructor (process: Process) {
        this._xmlObj = {};
        this.mainNode = {
            '@xmlns:bpmn': 'http://www.omg.org/spec/BPMN/20100524/MODEL',
            '@xmlns:bpmndi': 'http://www.omg.org/spec/BPMN/20100524/DI',
            '@xmlns:dc': 'http://www.omg.org/spec/DD/20100524/DC',
            '@xmlns:di': 'http://www.omg.org/spec/DD/20100524/DI',
            '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            '@targetNamespace': 'http://bpmn.io/schema/bpmn'
        };
        
        try {
            const PB = new BPMNProcessBuilder(process);
            this._processXML = PB.BPMN.ToObject();
            this.mainNode[this._processNodeName] = this._processXML;
        } catch (e) {
            this._error = e.message;
            console.log(e);
        }
    }

    public get BPMNWithoutDiagram(): string {
        return this._BPMNWithoutDiagram;
    }

    public BuildBPMNWithoudDiagram(): string | false {
        try {              
            const doc = xml(this._xmlObj);
            this._BPMNWithoutDiagram = doc.end({ prettyPrint: true });
        } catch (e) {
            console.log(e);
            this._error = e.message as string;
            return false;
        }
    }

    public get Error(): string { return this._error; }

    private get mainNode(): any { return this._xmlObj[this._mainNodeName]; }
    private set mainNode(node: any) { this._xmlObj[this._mainNodeName] = node; }

    public get BPMN(): string { return this._BPMNcomplete; }

    private get GotError(): boolean { return this._error !== null; }
    public get NoError(): boolean { return !this.GotError; }

}