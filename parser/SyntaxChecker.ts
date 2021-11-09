import { KeyAnyDict, KeyArrDict, KeyObjDict, KeyStrDict, KeyTDict, TrueOrStr, ActivityType, TActivityType } from "../entities/SharedTypes";
import { YAMLactivity } from "../entities/YAMLstruct";
import { CheckerHelper } from "../helpers/CheckerHelper";
import { EntHelper } from "../helpers/EntitiesHelper";

type TChildCompos = TChild[];
type TChildPrimitive = 'string' | 'object' | 'number' | 'boolean';
type TChild = TChildPrimitive | TChildCompos;

interface TChildNode {[name: string]: {type: TChild, mandatory: boolean, valueChecker?: (val: any) => boolean, contextChecker?: (node: KeyAnyDict) => TrueOrStr }};

export const Gotos = <const> ['goto','xgoto','pgoto','igoto'];
export type TGotos = typeof Gotos[number];
export const ConditionalGotoActivities: readonly TActivityType[] = <const> ['xgw', 'igw'];
export type TConditionalGotoActivities = typeof Gotos[number];


const AllowedVersions = <const> ['0.0.1'];
type TAllowedVersions = typeof AllowedVersions[number];

export class SyntaxChecker {

    private _yaml: KeyAnyDict;
    private _nodeIdName: KeyStrDict;
    private _activityNodeIdName: KeyTDict<KeyStrDict>;
    
    private _procId: string;
    private _procName: string;

    public constructor (yaml: KeyAnyDict) {

        this._yaml = yaml;
        this._nodeIdName = {};
        this._activityNodeIdName = {};

    }

    public get nodeIds(): string[] { const nodeIds: string[] = []; for (let id in this._nodeIdName) nodeIds.push(id); return nodeIds; }

    private CheckNodeUnicity (name: string, activities: KeyAnyDict): TrueOrStr {
        
        this._activityNodeIdName[name] = {};
        const errPhrase = (aName: string) => 'Activity named "' + aName + '" must be renamed because is too similar or equal to ';
        for (let aName in activities) {
            let aId = EntHelper.GetIdFromName(aName);
            let dup = this._nodeIdName[aId];
            if (dup !== undefined) {
                if (aId == this._procId) {
                    return errPhrase(aName) + 'the process name ("' + this._procName + '")';
                } else {
                    return errPhrase(aName) + 'the activity named "' + dup + '"';
                }
            }
            this._nodeIdName[aId] = aName;
            this._activityNodeIdName[name][aId] = aName;
            
            if (activities[aName] !== null) {
                let subactivities = activities[aName]['activities'];
                if (subactivities !== undefined) {
                    let unicity = this.CheckNodeUnicity(aName,subactivities);
                    if (unicity !== true) return unicity;
                }
            }
        }
        return true;
    }

    private CheckActivities(nodeName: string, activities: KeyAnyDict[]): TrueOrStr {

        if (activities !== undefined) {
            let firstActivity: string;
            let reachedActivities: string[] = [];
    
            for (let aName in activities) {
                if (firstActivity === undefined)
                    firstActivity = aName;
                let act = activities[aName];
                if (act === null) continue;
                let activity = new ActivityChecker(act, aName);
                let actcheck = activity.CheckNode();
                if (actcheck !== true) return actcheck;
                if (act.xgoto !== undefined) {
                    if (CheckerHelper.IsArrayOf(act.xgoto,'object')) {
                        for (let x of act.xgoto as KeyStrDict[]) {
                            let xgoto = new IXGotoChecker(x, aName);
                            let xgotocheck = xgoto.CheckNode();
                            if (xgotocheck !== true) return xgotocheck;
                        }
                    } else return 'The field "xgoto" is not valid in activity "' + aName + '"';
                }
                if (act.igoto !== undefined) {
                    if (CheckerHelper.IsArrayOf(act.igoto,'object')) {
                        for (let i of act.igoto as KeyStrDict[]) {
                            let igoto = new IXGotoChecker(i, aName);
                            let igotocheck = igoto.CheckNode();
                            if (igotocheck !== true) return igotocheck;
                        }
                    } else return 'The field "igoto" is not valid in activity "' + aName + '"';
                }
                if (act.goto !== undefined && ConditionalGotoActivities.includes(act.type)) {
                    if (CheckerHelper.IsArrayOf(act.goto,'object')) {
                        for (let i of act.goto as KeyStrDict[]) {
                            let goto = new IXGotoChecker(i, aName);
                            let gotocheck = goto.CheckNode();
                            if (gotocheck !== true) return gotocheck;
                        }
                    } else return 'The field "goto" is not valid in activity "' + aName + '"';

                }
                
                if (act.activities !== undefined) {
                    let checkactivities = this.CheckActivities(aName, act.activities);
                    if (checkactivities !== true) return checkactivities;
                }
                
                //verifica correttezza delle destinazioni
                let goto: string[] = [];
                let gotoType: TGotos = null;
                if (act.goto !== undefined) {
                    gotoType = 'goto';
                    if (typeof(act.goto) == 'string') goto.push(act.goto);
                    else if (CheckerHelper.IsArrayOf(act.goto, 'string')) goto = act.goto;
                    else if (ConditionalGotoActivities.includes(act.type)) {
                        for (let g of act.goto) {
                            let _goto = act.goto;
                            for (let x in _goto)
                                if (_goto[x].then !== undefined)
                                    goto.push(_goto[x].then);
                        }
                    }
                } else if (act.xgoto !== undefined) {
                    gotoType = 'xgoto';
                    for (let g of act.xgoto) {
                        let xgoto = act.xgoto;
                        for (let x in xgoto)
                            if (xgoto[x].then !== undefined)
                                goto.push(xgoto[x].then);
                    }
                } else if (act.igoto !== undefined) {
                    gotoType = 'igoto';
                    for (let g of act.igoto) {
                        let igoto = act.igoto;
                        for (let i in igoto)
                            goto.push(igoto[i].then);
                    }
                } else if (act.pgoto !== undefined) {
                    gotoType = 'pgoto';
                    goto = act.pgoto;
                }
                    
                if (goto.length > 0) {
                    for (let g of goto) {
                        if (!reachedActivities.includes(g) && /* non considero il loop: */ g != aName)
                            reachedActivities.push(g);
                        let gId = EntHelper.GetIdFromName(g);
                        if (gId === this._procId || this._activityNodeIdName[nodeName][gId] === undefined) {
                            return 'The "' + gotoType + ' ' + g + '" in activity "' + aName + '" is not a valid destination';
                        }
                    }
                }
            }

            //verifica nodi orfani
            if (reachedActivities.length > 0)
                for (let aName in activities) {
                    if (aName != firstActivity) {
                        if (!reachedActivities.includes(aName))
                            return `Activity ${aName} is not reached by any other activities`;
                    }
                }
        }
        
        return true;
    }

    public Check(): TrueOrStr {

        const root = new RootChecker(this._yaml);
        const rootcheck = root.CheckNode();
        if (rootcheck === true) {
            this._procName = root.name;
            this._procId = EntHelper.GetIdFromName(root.name);
            this._nodeIdName[this._procId] = root.name;
            const activities = this._yaml['activities'];
            if (activities !== undefined) {
                //controllo unicità dei nomi
                const unicity = this.CheckNodeUnicity(root.name,activities);
                if (unicity !== true) return unicity;
                //controllo le singole attività
                const checkactivities = this.CheckActivities(root.name,activities);
                if (checkactivities !== true) return checkactivities;
                return true;
            } else return true;
        } else return rootcheck;
    } 
}

abstract class NodeChecker {

    protected _childnodes: TChildNode = {};
    protected _inclusiveConstraints: KeyArrDict<string> = {};
    protected _exclusiveConstraints: KeyArrDict<string> = {};
    protected _mutexContraints: ReadonlyArray<string>[] = [];
    protected _node: KeyAnyDict;
    protected _name: string;

    constructor (node: {}, name: string) {
        this._node = node;
        this._name = name;
    }

    public CheckNode(): TrueOrStr {
        //console.log('I\'m checking node: ',this._node);
        //tutti i nodi sono tra quelli previsti e abbiano il tipo giusto e/o il valore giusto
        for (let n in this._node) {
            //controllo che sia previsto
            if (this._childnodes[n] === undefined) 
                return 'Child "' + n + '" not expected in node "' + this._name + '"';
            //controllo il tipo
            else if (
                (typeof(this._childnodes[n].type) == 'string' && typeof(this._node[n]) != this._childnodes[n].type)
                 || typeof(this._childnodes[n].type) == 'object' && !(this._childnodes[n].type as TChildCompos).includes(typeof(this._node[n]) as TChild)
            )
                return 'Child "' + n + '" must be "' + this._childnodes[n].type + '" in node "' + this._name + '"';
            //controllo il valore
            else if (this._childnodes[n].valueChecker !== undefined && !this._childnodes[n].valueChecker(this._node[n]))
                return 'Child "' + n + '" has an invalid value in node "' + this._name + '"';
            //controllo il contesto
            else if (this._childnodes[n].contextChecker !== undefined) {
                let context = this._childnodes[n].contextChecker(this._node);
                if (context !== true) return context;
            } 
            //la presenza di un nodo esclude quella di uno o più altri
            else if (this._exclusiveConstraints[n] !== undefined) {
                for (let i in this._exclusiveConstraints[n])
                    if (this._childnodes[i] !== undefined) return 'Child "' + n + '" is not compatible with child "' + i + '" (see node "' + this._name + '")';
            }
            //la presenza di un nodo richiede quella di uno o più altri
            else if (this._inclusiveConstraints[n] !== undefined) {
                for (let i in this._inclusiveConstraints[n])
                    if (this._childnodes[i] === undefined) return 'Child "' + n + '" requires the presence of child "' + i + '" (see node "' + this._name + '")';
            }
        }
        //tutti i nodi obbligatori sono presenti
        for (let n in this._childnodes) {
            if (this._childnodes[n].mandatory && this._node[n] === undefined)
                return 'Mandatory child "' + n + '" is not present in node "' + this._name + '"';
        }
        //la verifica di nodi mutuamente esclusivi
        if (this._mutexContraints !== undefined) {
            for (let mutex of this._mutexContraints) {
                let counter = 0;
                for (let c of mutex) {
                    if (this._node[c] !== undefined) ++counter;
                    if (counter > 1) return 'Child nodes "' + mutex.join(', ') + '" are mutually exclusive (see node "' + this._name + '")';
                }
            }
        }
        return true;
    }
}

class RootChecker extends NodeChecker {
    constructor (node: KeyAnyDict) {
        super(node, 'root');
        this._childnodes = {
            //version: { type: 'string', mandatory: true, valueChecker: (val) => AllowedVersions.includes(val) },
            process: { type: 'string', mandatory: true},
            defaultType: { type: 'string', mandatory: false, valueChecker: (val) => ActivityType.includes(val) },
            activities: { type: 'object', mandatory: false}
        };
    }

    public get name() {
        return this._node['process'];
    }
}

class ActivityChecker extends NodeChecker {
    constructor (node: KeyAnyDict, name: string) {
        super(node, name);
        this._childnodes = {
            type: { type: 'string', mandatory: false, valueChecker: (val) => ActivityType.includes(val) },
            activities: { type: 'object', mandatory: false, contextChecker: (node: YAMLactivity) => node.type == 'sub' ? true : 'Child "activities" admitted only on root node or inside a "sub" activity (see node "' + this._name + '")' },
            goto: { type: ['string','object'], mandatory: false, 
             contextChecker: (node: YAMLactivity) => 
                typeof(node.goto) == 'string' 
                || ((node.type == 'pgw') && CheckerHelper.IsArrayOf(node.goto,'string')) ? true : '"goto" field must be a single destination. Only in case of activity type "pgw" it can be a list of destinations (see node "' + this._name + '")'
                || (ConditionalGotoActivities.includes(node.type) && CheckerHelper.IsArrayOf(node.goto,'object') && (node.goto as []).length > 1) ? true : '"goto" field must contain a list of {if, then} structure, with at least two elements, inside xgw or igw tasks (see node "' + this._name + '")',
             valueChecker: (val) => typeof(val) == 'string' || CheckerHelper.IsArrayOf(val,'string') || (CheckerHelper.IsArrayOf(val,'object') && (val as []).length > 1)},
            //goto: { type: ['string'], mandatory: false },
            pgoto: { type: ['object'], mandatory: false, valueChecker: (val) => CheckerHelper.IsArrayOf(val,'string') && (val as string[]).length > 1 },
            xgoto: { type: ['object'], mandatory: false, valueChecker: (val) => CheckerHelper.IsArrayOf(val,'object') && (val as []).length > 1 },
            igoto: { type: ['object'], mandatory: false, valueChecker: (val) => CheckerHelper.IsArrayOf(val,'object') && (val as []).length > 1 },
            condition: { type: 'string', mandatory: false, contextChecker: (node) => node.type as TActivityType == 'incond' ? true : 'Field "condition" is admitted only for "incond" activity type (see node "' + this._name + '")' }
        };
        this._mutexContraints.push(Gotos);
    }

    public HasGoto (): boolean {
        for (let n in this._node) {
            if ((Gotos as ReadonlyArray<string>).includes(n))
                return true;
        }
        return false;
    }

    public get xgotos (): {} {
        return this._node['xgoto'];
    }

    public get igotos (): {} {
        return this._node['igoto'];
    }
}

class IXGotoChecker extends NodeChecker {
    constructor (node: KeyStrDict, name: string) {
        super(node, name);
        this._childnodes = {
            if: { type: ['string'], mandatory: true },
            then: { type: ['string'], mandatory: false }
        };
    }
}