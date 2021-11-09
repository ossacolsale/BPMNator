import { EntHelper } from "../../helpers/EntitiesHelper";
import { TActivityType, TGoto, TIXgoto, TPgoto } from "../SharedTypes";
import { IXgoto } from "./IXgoto";




export class Activity {

    private _name: string;
    private _type: TActivityType;
    private _goto: TGoto;
    private _xgoto: TIXgoto;
    private _igoto: TIXgoto;
    private _pgoto: TPgoto;
    private _activities: Activity[];
    private _condition: string;

    public constructor (name?: string, type?: TActivityType, goto?: TGoto, xgoto?: TIXgoto, pgoto?: TPgoto, activities?: Activity[], igoto?:TIXgoto, condition?: string) {
        this._name = name;
        this._type = type;
        this._goto = goto;
        this._xgoto = xgoto;
        this._igoto = igoto;
        this._pgoto = pgoto;
        this._condition = condition;
        this._activities = activities;
    }

    public get name () : string {
        return this._name;
    }
    public set name (aName: string) {
        this._name = aName;
    }

    public get type () : TActivityType {
        return this._type;
    }
    public set type (aType: TActivityType) {
        this._type = aType;
    }

    public get goto () : TGoto {
        return this._goto;
    }
    public set goto (aGoto: TGoto) {
        this._goto = aGoto;
    }

    public get xgoto () : TIXgoto {
        return this._xgoto;
    }
    public set xgoto (aXgoto: TIXgoto) {
        this._xgoto = aXgoto;
    }

    public get igoto () : TIXgoto {
        return this._igoto;
    }
    public set igoto (aIgoto: TIXgoto) {
        this._igoto = aIgoto;
    }

    public get pgoto () : TPgoto {
        return this._pgoto;
    }
    public set pgoto (aPgoto: TPgoto) {
        this._pgoto = aPgoto;
    }

    public get activities () : Activity[] {
        return this._activities;
    }
    public set activities (aActivities: Activity[]) {
        this._activities = aActivities;
    }

    public get condition () : string {
        return this._condition;
    }

    public set condition (aCondition: string) {
        this._condition = aCondition;
    }

    public get $id () : string {
        return EntHelper.GetIdFromName(this.name);
    }
}

