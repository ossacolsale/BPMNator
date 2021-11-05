import JS_YAML from 'js-yaml';
import fs from 'fs';
import { KeyAnyDict } from '../entities/SharedTypes';
import { SyntaxChecker } from './SyntaxChecker';
import { ProcessBuilder } from './ProcessBuilder';
import { YAMLstruct } from '../entities/YAMLstruct';
import { Process } from '../entities/Process/Process';

export class YAMLParser {

    private _yaml: KeyAnyDict;
    private _process: Process;
    private _error: string = null; 
    private _nodeIds: string[];


    constructor(PassedBy: 'uri' | 'content', YamlRef: string, encoding: BufferEncoding = 'utf8') {
        //lettura del file    
        switch (PassedBy) {
            case 'uri':
                try {
                    YamlRef = fs.readFileSync(YamlRef, encoding);
                }
                catch (e) {
                    this._error = `Error reading file/url ${YamlRef} (${e.message})`;
                    console.log(this._error);
                }
                break;
            case 'content':
                //use YamlRef as passed
                break;
        }
        if (this.GotError) return;
        //parsing dello YAML
        try {
            this._yaml = JS_YAML.load(YamlRef);
        } catch (e) {
            this._error = `YAML file formally incorrect (${e.message})`;
            console.log(this._error);
        }
        if (this.GotError) return;
        //syntax checking
        try {
            const SC = new SyntaxChecker(this._yaml);
            const SC_result = SC.Check();
            if (SC_result !== true) throw new Error(SC_result);
            this._nodeIds = SC.nodeIds;
        } catch (e) {
            this._error = `BPMNator syntax error:\n\n(${e.message})`;
            console.log(this._error);
        }
        if (this.GotError) return;
        //process builder
        try {
            const PB = new ProcessBuilder(this._yaml as YAMLstruct);
            this._process = PB.Builder(this._nodeIds);
        } catch (e) {
            this._error = `Process buidler error:\n\n(${e.message})`;
            console.log(this._error);
        }
        if (this.GotError) return;

    }

    private get GotError(): boolean { return this._error !== null; }
    public get NoError(): boolean { return !this.GotError; }

    public get RawYaml(): KeyAnyDict { return this._yaml; }
    public get Error(): string { return this._error; }
    public get Process(): Process { return this._process; }

}