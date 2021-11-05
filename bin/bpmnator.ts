import fs from 'fs';
import { YAMLParser } from "../parser/YAMLParser";
import { BPMNBuilder } from "../bpmnbuilder/BPMNBuilder";


export class BPMNator {
    private parser: YAMLParser;
    private builder: BPMNBuilder;
    private _BPMN: string;

    public get BPMN (): string {
        return this._BPMN;
    }

    private async DiagramPreprod() {
        this.builder.BuildBPMNWithoudDiagram();
        const clog = console.log;
        console.log = () => {};
        await this.builder.produceDiagram();
        console.log = clog;
    }

    public async ProduceBPMN (): Promise<string> {
        await this.DiagramPreprod();
        return this._BPMN = this.builder.BPMN;
    }

    public async SaveBPMN (DestinationURI: string, charset: BufferEncoding = 'utf8'): Promise<boolean> {
        await this.DiagramPreprod();
        return this.saveSomethingToURI(this.builder.BPMN, DestinationURI, charset);
    }

    public LoadYAMLbyURI (URI: string, charset: BufferEncoding = 'utf8'): boolean {
        this.parser = new YAMLParser('uri', URI, charset);
        return this.parser.NoError;
    }

    public LoadYAMLbyContent (Content: string): boolean {
        this.parser = new YAMLParser('content', Content);
        return this.parser.NoError;
    }

    public BuildProcess (): boolean {
        this.builder = new BPMNBuilder(this.parser.Process);
        return this.builder.NoError;
    }

    public SaveBPMNWithoutDiagram (DestinationURI: string, charset: BufferEncoding = 'utf8'): boolean {
        const BPMN = this.GetBPMNWithoutDiagram();
        if (BPMN !== null) {
            return this.saveSomethingToURI(BPMN, DestinationURI, charset);
        } else return false;
    }

    public GetBPMNWithoutDiagram (): string {
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
                } else console.log(1);
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
