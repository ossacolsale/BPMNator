import { BPMNConditionExpression, BPMNEndEvent, BPMNInclusiveExclusiveGateway, BPMNProcess, BPMNSequenceFlow, BPMNStartEvent, BPMNSubProcess, BPMNUserTask, BPMNParallelGateway, BPMNBusinessRuleTask, BPMNCallActivity, BPMNManualTask, BPMNReceiveTask, BPMNScriptTask, BPMNServiceTask, BPMNTask, BPMNIntermediateThrowEvent, BPMNMessageIntermediateCatchEvent, BPMNMessageIntermediateThrowEvent, BPMNTimerIntermediateCatchEvent, BPMNEscalationIntermediateThrowEvent, BPMNConditionalIntermediateThrowEvent, BPMNCompensateIntermediateThrowEvent, BPMNSignalIntermediateCatchEvent, BPMNSignalIntermediateThrowEvent, BPMNLinkIntermediateThrowEvent, BPMNsendTask as BPMNSendTask } from "../entities/BPMN/BPMNElements";
import { BPMNEntity } from "../entities/BPMN/BPMNEntity";
import { TBPMNNodeNames, BPMNNodeNames } from "../entities/BPMN/BPMNSharedTypes";
import { Activity } from "../entities/Process/Activity";
import { IXgoto } from "../entities/Process/IXgoto";
import { Process } from "../entities/Process/Process";
import { KeyArrDict, KeyNumDict, KeyStrDict, StrOrStrArr } from "../entities/SharedTypes";
import { EntHelper } from "../helpers/EntitiesHelper";
import { ConditionalGotoActivities } from "../parser/SyntaxChecker";

export class BPMNProcessBuilder {

    private _process: Process;
    private _idPrefixes: KeyStrDict;
    private _prefixesProg: KeyNumDict;
    private _BPMN: BPMNProcess;
    private _incomingFlows: KeyArrDict<string>;
    private _outgoingFlows: KeyArrDict<string>;

    public constructor(process: Process) {
        
        this._process = process;
        this._incomingFlows = {};
        this._outgoingFlows = {};
        this.buildIdPrefixes();
        this.buildProcess();
    }

    public get BPMN(): BPMNProcess { return this._BPMN; }

    private buildProcess () {
        this._BPMN = new BPMNProcess(this._process.$id, this._process.process);
        for (let id of this._process.$nodeIds) {
            this._incomingFlows[id] = [];
            this._outgoingFlows[id] = [];
        }
        if (this._process.activities !== undefined) {
            let start = true;
            for (let a of this._process.activities) {
                this.buildActivity(a, start);
                start = false;
            }
        }
    }

    private buildActivity (activity: Activity, start: boolean = false, sub?: BPMNSubProcess): void | BPMNEntity[] {
        let _ref: BPMNEntity;
        if (sub !== undefined)
            _ref = sub;
        else 
            _ref = this._BPMN;
            
        if (start) {
            const startId = this.createId('bpmn:startEvent');
            const flowId = this.createId('bpmn:sequenceFlow');
            _ref.addChild(new BPMNSequenceFlow(flowId,startId,activity.$id));
            _ref.addChild(new BPMNStartEvent(startId,flowId));
            this._incomingFlows[activity.$id].push(flowId);
        }
        if (activity.goto !== undefined) {
            if (ConditionalGotoActivities.includes(activity.type)) {
                const goto = activity.goto as IXgoto[];
                for (let gt of goto) {
                    const flowOutId = this.createId('bpmn:sequenceFlow');
                    let destId: string;
                    //goto -> end
                    if (gt.then === undefined) {
                        destId = this.createId('bpmn:endEvent');
                        _ref.addChild(new BPMNEndEvent(destId,flowOutId));
                    } else {
                        destId = EntHelper.GetIdFromName(gt.then);
                        this._incomingFlows[destId].push(flowOutId);
                    }
                    _ref.addChild(new BPMNSequenceFlow(flowOutId,activity.$id,destId,new BPMNConditionExpression(gt.if)));
                    this._outgoingFlows[activity.$id].push(flowOutId);
                }
            } else {
                const goto = activity.goto as StrOrStrArr;
                for (let gt of EntHelper.StrToStrArray(goto)) {
                    let destId = EntHelper.GetIdFromName(gt);
                    let flowId = this.createId('bpmn:sequenceFlow');
                    _ref.addChild(new BPMNSequenceFlow(flowId,activity.$id,destId));
                    this._outgoingFlows[activity.$id].push(flowId);
                    this._incomingFlows[destId].push(flowId);
                }
            }
        } else if (activity.xgoto !== undefined || activity.igoto !== undefined) {
            const xgt = activity.xgoto !== undefined;
            const ixgwId = this.createId(xgt ? 'bpmn:exclusiveGateway' : 'bpmn:inclusiveGateway');
            this._outgoingFlows[ixgwId] = [];
            const flowInId = this.createId('bpmn:sequenceFlow');
            this._outgoingFlows[activity.$id].push(flowInId);
            _ref.addChild(new BPMNSequenceFlow(flowInId, activity.$id, ixgwId));
            const gotoes = xgt ? activity.xgoto : activity.igoto;
            for (let gt of gotoes) {
                const flowOutId = this.createId('bpmn:sequenceFlow');
                let destId: string;
                //goto -> end
                if (gt.then === undefined) {
                    destId = this.createId('bpmn:endEvent');
                    _ref.addChild(new BPMNEndEvent(destId,flowOutId));
                } else {
                    destId = EntHelper.GetIdFromName(gt.then);
                    this._incomingFlows[destId].push(flowOutId);
                }
                _ref.addChild(new BPMNSequenceFlow(flowOutId,ixgwId,destId,new BPMNConditionExpression(gt.if)));
                this._outgoingFlows[ixgwId].push(flowOutId);
            }
            _ref.addChild(new BPMNInclusiveExclusiveGateway(xgt ? 'exc' : 'inc', ixgwId, flowInId, this._outgoingFlows[ixgwId]));
        } else if (activity.pgoto !== undefined) {
            const pgwId = this.createId('bpmn:parallelGateway');
            this._outgoingFlows[pgwId] = [];
            const flowInId = this.createId('bpmn:sequenceFlow');
            this._outgoingFlows[activity.$id].push(flowInId);
            _ref.addChild(new BPMNSequenceFlow(flowInId, activity.$id, pgwId));
            for (let gt of activity.pgoto) {
                let destId = EntHelper.GetIdFromName(gt);
                let flowOutId = this.createId('bpmn:sequenceFlow');
                _ref.addChild(new BPMNSequenceFlow(flowOutId,pgwId,destId));
                this._outgoingFlows[pgwId].push(flowOutId);
                this._incomingFlows[destId].push(flowOutId);
            }
            _ref.addChild(new BPMNParallelGateway(pgwId, flowInId, this._outgoingFlows[pgwId]));
        } else {
            //final element
            const endId = this.createId('bpmn:endEvent');
            const flowId = this.createId('bpmn:sequenceFlow');
            _ref.addChild(new BPMNSequenceFlow(flowId,activity.$id,endId));
            _ref.addChild(new BPMNEndEvent(endId,flowId));
            this._outgoingFlows[activity.$id].push(flowId);
        }
        let _act: BPMNEntity;
        switch (activity.type) {
            case 'sub':
                let subP = new BPMNSubProcess(activity.$id, activity.name, this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]);
                let start = true;
                activity.activities.forEach(element => { this.buildActivity(element, start, subP); start = false; });
                _ref.addChild(subP);
            break;
            case 'pgw':
                _ref.addChild(new BPMNParallelGateway(activity.$id, this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'xgw':
                _ref.addChild(new BPMNInclusiveExclusiveGateway('exc', activity.$id, this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'igw':
                _ref.addChild(new BPMNInclusiveExclusiveGateway('inc', activity.$id, this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'human':
                _ref.addChild(new BPMNUserTask(activity.$id, activity.name, this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'busin':
                _ref.addChild(new BPMNBusinessRuleTask(activity.$id, activity.name, this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'call':
                _ref.addChild(new BPMNCallActivity(activity.$id, activity.name, this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'manual':
                _ref.addChild(new BPMNManualTask(activity.$id, activity.name, this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'receive':
                _ref.addChild(new BPMNReceiveTask(activity.$id, activity.name, this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'script':
                _ref.addChild(new BPMNScriptTask(activity.$id, activity.name, this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'send':
                _ref.addChild(new BPMNSendTask(activity.$id, activity.name, this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'serv':
                _ref.addChild(new BPMNServiceTask(activity.$id, activity.name, this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'task':
                _ref.addChild(new BPMNTask(activity.$id, activity.name, this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
//#region intermediate events
            case 'inthrow':
                _ref.addChild(new BPMNIntermediateThrowEvent(activity.$id, activity.name, this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'inmcatch':
                _ref.addChild(new BPMNMessageIntermediateCatchEvent(activity.$id, activity.name, this.createId('bpmn:messageEventDefinition'), this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'inmthrow':
                _ref.addChild(new BPMNMessageIntermediateThrowEvent(activity.$id, activity.name, this.createId('bpmn:messageEventDefinition'), this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'intimer':
                _ref.addChild(new BPMNTimerIntermediateCatchEvent(activity.$id, activity.name, this.createId('bpmn:timerEventDefinition'), this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'inescal':
                _ref.addChild(new BPMNEscalationIntermediateThrowEvent(activity.$id, activity.name, this.createId('bpmn:escalationEventDefinition'), this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'incond':
                _ref.addChild(new BPMNConditionalIntermediateThrowEvent(activity.$id, activity.name, this.createId('bpmn:conditionalEventDefinition'), activity.condition, this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'incomp':
                _ref.addChild(new BPMNCompensateIntermediateThrowEvent(activity.$id, activity.name, this.createId('bpmn:compensateEventDefinition'), this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'inscatch':
                _ref.addChild(new BPMNSignalIntermediateCatchEvent(activity.$id, activity.name, this.createId('bpmn:signalEventDefinition'), this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            case 'insthrow':
                _ref.addChild(new BPMNSignalIntermediateThrowEvent(activity.$id, activity.name, this.createId('bpmn:signalEventDefinition'), this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;
            /*case 'inlthrow':
                _ref.addChild(new BPMNLinkIntermediateThrowEvent(activity.$id, activity.name, this.createId('bpmn:linkEventDefinition'), this._incomingFlows[activity.$id], this._outgoingFlows[activity.$id]));
            break;*/
//#endregion
        }
    }

    //#region PrefixesFunctions
    private createId (nodeName: TBPMNNodeNames): string {
        return this._idPrefixes[nodeName] + '_' + (++this._prefixesProg[nodeName]).toString();
    }

    private buildIdPrefixes () {
        this._idPrefixes = {};
        this._prefixesProg = {};
        for (let name of BPMNNodeNames) {
            this._idPrefixes[name] = this.buildPrefix(name);
            this._prefixesProg[name] = 0;
        }
    }

    private buildPrefix (nodeName: TBPMNNodeNames): string {
        let prefix = nodeName.substr('bpmn:'.length);
        const addPrefix = '_';
        
        let collision = true;

        while (collision) {
            for (let id of this._process.$nodeIds) {
                if (id.substr(0,prefix.length) != prefix)
                    collision = false;
                else {
                    collision = true;
                    break;
                }
            }
            if (collision)
                prefix = addPrefix+prefix;
        }
        return prefix;
    }

    //#endregion
}