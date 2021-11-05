export type TrueOrStr = true | string;
export type KeyObjDict = { [key: string]: {} };
export type KeyArrDict<T> = { [key: string]: T[] };
export type KeyStrDict = { [key: string]: string };
export type KeyNumDict = { [key: string]: number };
export type KeyTDict<T> = { [key: string]: T };
export type KeyAnyDict = { [key: string]: any };
export type StrOrStrArr = string | string[];


//process types
export const ActivityType = <const> ['sub', 'pgw', 'igw', 'xgw', 'task', 'human', 'serv', 'send', 'receive', 'manual', 'busin', 'script', 'call'];
export type TActivityType = typeof ActivityType[number];
export type TGoto = StrOrStrArr;
export type TPgoto = string[];