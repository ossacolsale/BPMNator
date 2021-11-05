import { KeyStrDict, KeyTDict } from '../SharedTypes';
import { BPMNConditionExpression, BPMNEndEvent, BPMNInclusiveExclusiveGateway, BPMNIncoming, BPMNOutgoing, BPMNParallelGateway, BPMNProcess, BPMNSequenceFlow, BPMNStartEvent, BPMNSubProcess, BPMNUserTask } from './BPMNElements';
import { BPMNEntKV, BPMNNodeNames } from './BPMNSharedTypes';

export abstract class BPMNEntity {

    protected _nodeName: BPMNNodeNames;
    protected _children: BPMNEntKV;
    protected _attributes: KeyStrDict;
    protected _value: string;

    public get nodeName(): BPMNNodeNames { return this._nodeName; }
    public set nodeName(aName: BPMNNodeNames) { this._nodeName = aName; }

    public get children(): BPMNEntKV { return this._children; }
    public set children(Children: BPMNEntKV) { this._children = Children; }

    public get attributes(): KeyStrDict { return this._attributes; }

    public get value(): string { return this._value; }
    public set value(val: string) { this._value = val; }

    public constructor(nodeName: BPMNNodeNames, value?: string, attributes?: KeyStrDict, children?: BPMNEntKV) {
        this._nodeName = nodeName;
        this._value = value;
        this._children = children;
        this._attributes = attributes;
    }

    public ToObject(): {} {
        const obj: any = {};

        if (this._value !== undefined) {
            obj['#'] = this._value;
        }
        
        if (this._attributes !== undefined)
            for (let attr in this._attributes) {
                obj['@'+attr] = this._attributes[attr];
            }

        if (this._children !== undefined) {
            for (let child in this._children) {
                obj[child] = new Array<any>();
                for (let c in this._children[child]) {
                    obj[child].push(this._children[child][c].ToObject());
                }
            }

        }
        return obj;
    }

    public setAttribute(key: string, val: string) { if (this._attributes === undefined) this._attributes = {}; this._attributes[key] = val; }

    public addChild(/*nodeName: BPMNNodeNames, */child: BPMNEntity) {
        if (this._children === undefined) this._children = {};
        if (this._children[child.nodeName] === undefined) {            
            this._children[child.nodeName] = new Array<BPMNEntity>();
        }
        this._children[child.nodeName].push(child);
    }

}