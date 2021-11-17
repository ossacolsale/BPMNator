#!/usr/bin/env node
import fs from 'fs';
import { YAMLParser } from "../parser/YAMLParser";
import { BPMNBuilder } from "../bpmnbuilder/BPMNBuilder";


export class BPMNator {
    private parser: YAMLParser;
    private builder: BPMNBuilder;
    private _BPMN: string;

    /**
     * @returns a string containing the BPMN output
     */
    public get BPMN (): string {
        return this._BPMN;
    }

    /**
     * To use after calling BuilProcess()
     * Produce the complete BPMN file 
     * @returns a string cointaining the BPMN output
     */
    public async ProduceBPMN (): Promise<string> {
        await this.DiagramPreprod();
        this._BPMN = this.builder.BPMN;
        return this._BPMN;
    }

    /**
     * To use after calling BuildProcess()
     * Produce and save the complete BPMN file
     * @param DestinationURI the complete uri where to save the BPMN file
     * @param charset (optional) encoding of saved file
     * @returns true or false, depending on correct file saving
     */
    public async SaveBPMN (DestinationURI: string, charset: BufferEncoding = 'utf8'): Promise<boolean> {
        await this.DiagramPreprod();
        return this.saveSomethingToURI(this.builder.BPMN, DestinationURI, charset);
    }

    /**
     * Use as first method. Load YAML file passing a uri to read.
     * @param URI complete uri of YAML file
     * @param charset (optional) charset-encoding of the YAML file
     * @returns true or false depending on correct YAML loading and parsing
     */
    public LoadYAMLbyURI (URI: string, charset: BufferEncoding = 'utf8'): boolean {
        this.parser = new YAMLParser('uri', URI, charset);
        return this.parser.NoError;
    }

    /**
     * Use as first method. Load YAML file passed as string.
     * @param Content content of YAML file
     * @returns true or false depending on correct YAML loading and parsing
     */
    public LoadYAMLbyContent (Content: string): boolean {
        this.parser = new YAMLParser('content', Content);
        return this.parser.NoError;
    }

    /**
     * Use after LoadYAMLbyContent() or LoadYAMLbyURI()
     * @returns true of false depending on correct building of BPMN structure
     */
    public BuildProcess (): boolean {
        this.builder = new BPMNBuilder(this.parser.Process);
        return this.builder.NoError;
    }

    /**
     * To use after calling BuildProcess()
     * Produce and save a BPMN file with no "diagram"
     * @param DestinationURI the complete uri where to save the BPMN file
     * @param charset (optional) encoding of saved file
     * @returns true or false, depending on correct file saving
     */
    public SaveBPMNWithoutDiagram (DestinationURI: string, charset: BufferEncoding = 'utf8'): boolean {
        const BPMN = this.ProduceBPMNWithoutDiagram();
        if (BPMN !== null) {
            return this.saveSomethingToURI(BPMN, DestinationURI, charset);
        } else return false;
    }

    /**
     * To use after calling BuilProcess()
     * Produce the BPMN file with no "diagram"
     * @returns a string cointaining the BPMN output
     */
    public ProduceBPMNWithoutDiagram (): string {
        this.builder.BuildBPMNWithoudDiagram();
        if (this.builder.NoError) return this.builder.BPMNWithoutDiagram;
        else return null;
    }

    private saveSomethingToURI (content: string, URI: string, charset: BufferEncoding = 'utf8'): boolean {
        try {
            fs.writeFileSync(URI, content, {encoding: charset});
            return true;
        }
        catch (e) {
            console.log(e.message);
            return false;
        }
    }

    private async DiagramPreprod() {
        this.builder.BuildBPMNWithoudDiagram();
        const clog = console.log;
        console.log = () => {};
        await this.builder.produceDiagram();
        console.log = clog;
    }
}

try {    
    const bpmnator = new BPMNator();
    const argv = process.argv;
    switch (argv.length) {
        case 3:
        case 4:
            if (bpmnator.LoadYAMLbyURI(argv[2])) {
                if (bpmnator.BuildProcess()) {   
                    switch (argv.length) {
                        case 3:
                            bpmnator.ProduceBPMN().then((val) => console.log(val));
                        break;
                        case 4:
                            bpmnator.SaveBPMN(argv[3]);
                        break;
                    }
                } 
            }
        break;
        default:
            console.log(`
            BPMNator -- command line version
            ################################

            Usage: 
                - node dist/bin/bpmnator 'uri-input-yaml'
                (this will print to stdout the bpmn)

                or

                - node dist/bin/bpmnator 'uri-input-yaml' 'uri-output-bpmn'
                (this will save the bpmn)
            `);
        break;
    }
    
} catch (e) {
    console.log(e);
}
