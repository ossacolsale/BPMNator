import { KeyTDict, TActivityType, TGoto, TPgoto } from '../entities/SharedTypes';

export interface YAMLstruct {

    version: string,
    process: string,
    activities?: KeyTDict<YAMLactivity>,
    defaultType?: TActivityType
}

export interface YAMLactivity {

    type?: TActivityType,
    goto?: TGoto,
    pgoto?: TPgoto,
    xgoto?: YAMLixgoto[],
    igoto?: YAMLixgoto[],
    activities?: KeyTDict<YAMLactivity>
}

export interface YAMLixgoto {

    if: string,
    then: string
}
