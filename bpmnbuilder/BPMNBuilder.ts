import { create as xml } from 'xmlbuilder2';
import { Process } from '../entities/Process/Process';
import { BPMNProcessBuilder } from './BPMNProcessBuilder';

export class BPMNBuilder {

    private _mainNodeName: string = 'bpmn:definitions';
    private _xmlObj: any;
    private _error: string = null;
    private _BPMNcomplete: string;
    private _BPMNWithoutDiagram: string;
    private _TESTDIAG: string = `
    
    `; //put here a diagram to test

    public async produceDiagram () {
        const AutoLayout = require('bpmn-auto-layout');    
        const autoLayout = new AutoLayout();
        this._BPMNcomplete = await autoLayout.layoutProcess(this.BPMNWithoutDiagram);
        //this._BPMNcomplete = await autoLayout.layoutProcess(this._TESTDIAG);
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
            const processXML = PB.BPMN.ToObject();
            this.mainNode['bpmn:process'] = processXML;
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