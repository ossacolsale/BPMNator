import { EntHelper } from "../../helpers/EntitiesHelper";
import { TActivityType } from "../SharedTypes";
import { Activity } from "./Activity";

export class Process {

    private _version: string;
    private _activities: Activity[];
    private _process: string;
    private _defaultType: TActivityType;

    //parser-derived attributes
    private _nodeIds: string[];

    //after BPMNProcess fields
    private _startId: string;
    private _startFlowId: string;

    constructor (version?: string, activities?: Activity[], process?: string, defaultType?: TActivityType) {
        this._version = version;
        this._activities = activities;
        this._process = process;
        this._defaultType = defaultType;
    }

    public get version(): string {
        return this._version;
    }

    public set version(aVersion: string) {
        this._version = aVersion;
    }

    public get process(): string {
        return this._process;
    }

    public set process(aProcess: string) {
        this._process = aProcess;
    }

    public get activities(): Activity[] {
        return this._activities;
    }
    public set activities(listOfActivities: Activity[]) {
        this._activities = listOfActivities;
    }

    public get defaultType(): TActivityType {
        return this._defaultType;
    }
    public set defaultType(aDefaultType: TActivityType) {
        this._defaultType = aDefaultType;
    }

    public get $id(): string {
        return EntHelper.GetIdFromName(this.process);
    }

    public get $nodeIds(): string[] { return this._nodeIds; }
    public set $nodeIds(nodeIds: string[]) { if (this._nodeIds === undefined) this._nodeIds = nodeIds; }

}