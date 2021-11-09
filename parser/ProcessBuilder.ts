import { Activity } from "../entities/Process/Activity";
import { Process } from "../entities/Process/Process";
import { KeyTDict, TActivityType } from "../entities/SharedTypes";
import { IXgoto } from "../entities/Process/IXgoto";
import { YAMLstruct, YAMLactivity, YAMLixgoto } from '../entities/YAMLstruct';
import { ConditionalGotoActivities } from "./SyntaxChecker";

export class ProcessBuilder {

    private _process: Process;
    private _yaml: YAMLstruct;
    private readonly _defaultType: TActivityType = 'task';

    public constructor (yaml: YAMLstruct) {

        this._yaml = yaml;
        this._process = new Process(yaml.version, new Array<Activity>(), yaml.process, yaml.defaultType);
    }

    public Builder (nodeIds: string[]): Process {

        if (this._yaml.activities !== undefined) {
            this._process.activities = this.ActivityBuilderBase(this._yaml.activities);
        }
        this._process.$nodeIds = nodeIds;
        return this._process;
    }

    private ActivityBuilderBase(acts: KeyTDict<YAMLactivity>): Activity[] {
        const implicitGoto = this.HaveImplicitGoto(acts);
        const activities: Activity[] = [];
        let prevAct: [string, YAMLactivity];
        for (let a in acts) {
            if (acts[a] === null) acts[a] = {};
            if (implicitGoto) {
                if (prevAct !== undefined) {
                    prevAct[1].goto = a;
                    activities.push(this.ActivityBuilder(prevAct[0],prevAct[1]));
                }
                prevAct = [a, acts[a]];
            }
            else activities.push(this.ActivityBuilder(a,acts[a]));
        }
        if (implicitGoto) activities.push(this.ActivityBuilder(prevAct[0],prevAct[1]));
        return activities;
    }

    private HaveImplicitGoto (activities: KeyTDict<YAMLactivity>): boolean {
        for (let a in activities) {
            if (activities[a] !== null && (activities[a].goto !== undefined ||
                activities[a].pgoto !== undefined ||
                activities[a].xgoto !== undefined ||
                activities[a].igoto !== undefined))
                return false;
        }
        return true;
    }

    public ActivityBuilder (name: string, YAMLact: YAMLactivity): Activity {
        const act = new Activity(name);
        if (YAMLact.type !== undefined) {
            act.type = YAMLact.type;
        } else if (this._process.defaultType !== undefined) {
            act.type = this._process.defaultType;
        } else { 
            act.type = this._defaultType; 
        }
        if (YAMLact.goto !== undefined) {
            if (ConditionalGotoActivities.includes(YAMLact.type)) {
                act.goto = new Array<IXgoto>();
                const gotoes = YAMLact.goto as IXgoto[];
                for (let x in gotoes) {
                    act.goto.push(this.IXgotoBuilder(gotoes[x]));
                }
            } else act.goto = YAMLact.goto;
        } else if (YAMLact.pgoto !== undefined) {
            act.pgoto = YAMLact.pgoto;
        } else if (YAMLact.xgoto !== undefined) {
            act.xgoto = new Array<IXgoto>();
            for (let x in YAMLact.xgoto) {
                act.xgoto.push(this.IXgotoBuilder(YAMLact.xgoto[x]));
            }
        } else if (YAMLact.igoto !== undefined) {
            act.igoto = new Array<IXgoto>();
            for (let i in YAMLact.igoto) {
                act.igoto.push(this.IXgotoBuilder(YAMLact.igoto[i]));
            }
        }
        if (YAMLact.activities !== undefined) {
            act.activities = this.ActivityBuilderBase(YAMLact.activities);
        }
        if (YAMLact.condition !== undefined) {
            act.condition = YAMLact.condition;
        }
        return act;
    }

    public IXgotoBuilder (YAMLixgt: YAMLixgoto): IXgoto {
        return new IXgoto(YAMLixgt.if, YAMLixgt.then);
    }
}