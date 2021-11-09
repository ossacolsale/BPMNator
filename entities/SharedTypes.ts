import { IXgoto } from "./Process/IXgoto";

export type TrueOrStr = true | string;
export type KeyObjDict = { [key: string]: {} };
export type KeyArrDict<T> = { [key: string]: T[] };
export type KeyStrDict = { [key: string]: string };
export type KeyNumDict = { [key: string]: number };
export type KeyTDict<T> = { [key: string]: T };
export type KeyAnyDict = { [key: string]: any };
export type StrOrStrArr = string | string[];


//process types
export const ActivityType = <const> ['sub', 'pgw', 'igw', 'xgw', 'task', 'human', 'serv', 'send', 'receive', 'manual', 'busin', 'script', 'call'
,'inthrow', 'inmcatch', 'inmthrow', 'intimer', 'inescal', 'incond', 'incomp', 'inscatch', 'insthrow'//, 'inlthrow'
];

export type TActivityType = typeof ActivityType[number];
export type TGoto = StrOrStrArr | TIXgoto;
export type TPgoto = string[];
export type TIXgoto = IXgoto[];
