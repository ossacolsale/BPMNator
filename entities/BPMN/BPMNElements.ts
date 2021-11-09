import { BPMNEntity } from "./BPMNEntity";
import { TBPMNBoolean, TBPMNNodeNames } from "./BPMNSharedTypes";
import { EntHelper } from "../../helpers/EntitiesHelper";
import { StrOrStrArr } from "../SharedTypes";

export class BPMNProcess extends BPMNEntity {
    public constructor(id: string, processName: string, isExecutable: TBPMNBoolean = 'true') {
        super('bpmn:process',undefined,{id: id, name: processName, isExecutable: isExecutable});
    }
}

export class BPMNStartEvent extends BPMNEntity {
    public constructor(id: string, outgoingIds?: StrOrStrArr) {
        super('bpmn:startEvent',undefined,{id: id});
        if (outgoingIds !== undefined) {
            for (let out of EntHelper.StrToStrArray(outgoingIds)) {
                this.addChild(new BPMNOutgoing(out));
            }
        }
    }

}

export class BPMNOutgoing extends BPMNEntity {
    public constructor(value: string) {
        super('bpmn:outgoing',value);
    }
}

export class BPMNIncoming extends BPMNEntity {
    public constructor(value: string) {
        super('bpmn:incoming',value);
    }
}

export class BPMNSequenceFlow extends BPMNEntity {
    public constructor(id: string, sourceRef: string, targetRef: string, condition?: BPMNConditionExpression) {
        super('bpmn:sequenceFlow',undefined,{id: id, sourceRef: sourceRef, targetRef: targetRef});
        if (condition !== undefined)
            this.addChild(condition);
    }
}

//#region tasks

export abstract class BPMNGenericTask extends BPMNEntity {
    public constructor(taskType: TBPMNNodeNames, id: string, taskName?: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super(taskType, undefined, {id: id});
        if (incomingIds !== undefined) {
            for (let inc of EntHelper.StrToStrArray(incomingIds)) {
                this.addChild(new BPMNIncoming(inc));
            }
        }
        if (outgoingIds !== undefined) {
            for (let out of EntHelper.StrToStrArray(outgoingIds)) {
                this.addChild(new BPMNOutgoing(out));
            }
        }
        if (taskName !== undefined) {
            this.setAttribute('name', taskName);
        }
    }
}

export class BPMNUserTask extends BPMNGenericTask {
    public constructor(id: string, taskName?: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super('bpmn:userTask', id, taskName, incomingIds, outgoingIds);
    }
}

export class BPMNTask extends BPMNGenericTask {
    public constructor(id: string, taskName?: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super('bpmn:task', id, taskName, incomingIds, outgoingIds);
    }
}

export class BPMNsendTask extends BPMNGenericTask {
    public constructor(id: string, taskName?: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super('bpmn:sendTask', id, taskName, incomingIds, outgoingIds);
    }
}

export class BPMNReceiveTask extends BPMNGenericTask {
    public constructor(id: string, taskName?: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super('bpmn:receiveTask', id, taskName, incomingIds, outgoingIds);
    }
}

export class BPMNManualTask extends BPMNGenericTask {
    public constructor(id: string, taskName?: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super('bpmn:manualTask', id, taskName, incomingIds, outgoingIds);
    }
}

export class BPMNBusinessRuleTask extends BPMNGenericTask {
    public constructor(id: string, taskName?: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super('bpmn:businessRuleTask', id, taskName, incomingIds, outgoingIds);
    }
}

export class BPMNServiceTask extends BPMNGenericTask {
    public constructor(id: string, taskName?: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super('bpmn:serviceTask', id, taskName, incomingIds, outgoingIds);
    }
}

export class BPMNScriptTask extends BPMNGenericTask {
    public constructor(id: string, taskName?: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super('bpmn:scriptTask', id, taskName, incomingIds, outgoingIds);
    }
}

export class BPMNCallActivity extends BPMNGenericTask {
    public constructor(id: string, taskName?: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super('bpmn:callActivity', id, taskName, incomingIds, outgoingIds);
    }
}

//#endregion

export class BPMNEndEvent extends BPMNEntity {
    public constructor(id: string, incomingIds?: StrOrStrArr) {
        super('bpmn:endEvent', undefined, {id: id});
        if (incomingIds !== undefined) {
            for (let inc of EntHelper.StrToStrArray(incomingIds)) {
                this.addChild(new BPMNIncoming(inc));
            }
        }
    }
}

export class BPMNInclusiveExclusiveGateway extends BPMNGenericTask {
    public constructor(type: 'inc' | 'exc', id: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super(type == 'exc' ? 'bpmn:exclusiveGateway' : 'bpmn:inclusiveGateway', id, undefined, incomingIds, outgoingIds);
    }
}

export class BPMNParallelGateway extends BPMNGenericTask {
    public constructor(id: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super('bpmn:parallelGateway', id, undefined, incomingIds, outgoingIds);
    }
}

export class BPMNSubProcess extends BPMNGenericTask {
    public constructor (id: string, subprocessName: string, incomingIds: string[], outgoingIds: string[]) {
        super('bpmn:subProcess',id,subprocessName,incomingIds,outgoingIds);
    }
}

export class BPMNConditionExpression extends BPMNEntity {
    public constructor (expression: string, type: string = 'bpmn:tFormalExpression') {
        super('bpmn:conditionExpression',expression,{'xsi:type': type});
    }
}

export class BPMNCondition extends BPMNEntity {
    public constructor (expression: string, type: string = 'bpmn:tFormalExpression') {
        super('bpmn:condition',expression,{'xsi:type': type});
    }
}

//#region intermediate events

export class BPMNIntermediateThrowEvent extends BPMNGenericTask {
    public constructor (id: string, name: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super('bpmn:intermediateThrowEvent', id, name, incomingIds, outgoingIds);
    }

}

export class BPMNIntermediateCatchEvent extends BPMNGenericTask {
    public constructor (id: string, name: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super('bpmn:intermediateCatchEvent', id, name, incomingIds, outgoingIds);
    }
}

class BPMNMessageEventDefinition extends BPMNEntity {
    public constructor(id: string) {
        super('bpmn:messageEventDefinition', undefined, {id: id});
    }
}

export class BPMNMessageIntermediateCatchEvent extends BPMNIntermediateCatchEvent {
    public constructor (id: string, name: string, messageEventDefinitionId: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super(id, name, incomingIds, outgoingIds);
        this.addChild(new BPMNMessageEventDefinition(messageEventDefinitionId));
    }
}

export class BPMNMessageIntermediateThrowEvent extends BPMNIntermediateThrowEvent {
    public constructor (id: string, name: string, messageEventDefinitionId: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super(id, name, incomingIds, outgoingIds);
        this.addChild(new BPMNMessageEventDefinition(messageEventDefinitionId));
    }
}

class BPMNTimerEventDefinition extends BPMNEntity {
    public constructor(id: string) {
        super('bpmn:timerEventDefinition', undefined, {id: id});
    }
}

export class BPMNTimerIntermediateCatchEvent extends BPMNIntermediateCatchEvent {
    public constructor (id: string, name: string, timerEventDefinitionId: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super(id, name, incomingIds, outgoingIds);
        this.addChild(new BPMNTimerEventDefinition(timerEventDefinitionId));
    }
}

class BPMNEscalationEventDefinition extends BPMNEntity {
    public constructor(id: string) {
        super('bpmn:escalationEventDefinition', undefined, {id: id});
    }
}

export class BPMNEscalationIntermediateThrowEvent extends BPMNIntermediateCatchEvent {
    public constructor (id: string, name: string, escalationEventDefinitionId: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super(id, name, incomingIds, outgoingIds);
        this.addChild(new BPMNEscalationEventDefinition(escalationEventDefinitionId));
    }
}

class BPMNConditionalEventDefinition extends BPMNEntity {
    public constructor(id: string, condition: string) {
        super('bpmn:conditionalEventDefinition', undefined, {id: id});
        this.addChild(new BPMNCondition(condition));
    }
}

export class BPMNConditionalIntermediateThrowEvent extends BPMNIntermediateThrowEvent {
    public constructor (id: string, name: string, conditionalEventDefinitionId: string, condition: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super(id, name, incomingIds, outgoingIds);
        this.addChild(new BPMNConditionalEventDefinition(conditionalEventDefinitionId, condition));
    }
}

class BPMNLinkEventDefinition extends BPMNEntity {
    public constructor(id: string) {
        super('bpmn:linkEventDefinition', undefined, {id: id});
    }
}

export class BPMNLinkIntermediateThrowEvent extends BPMNIntermediateThrowEvent {
    public constructor (id: string, name: string, linkEventDefinitionId: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super(id, name, incomingIds, outgoingIds);
        this.addChild(new BPMNLinkEventDefinition(linkEventDefinitionId));
    }
}

class BPMNCompensateEventDefinition extends BPMNEntity {
    public constructor(id: string) {
        super('bpmn:compensateEventDefinition', undefined, {id: id});
    }
}

export class BPMNCompensateIntermediateThrowEvent extends BPMNIntermediateThrowEvent {
    public constructor (id: string, name: string, compensateEventDefinitionId: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super(id, name, incomingIds, outgoingIds);
        this.addChild(new BPMNCompensateEventDefinition(compensateEventDefinitionId));
    }
}

class BPMNSignalEventDefinition extends BPMNEntity {
    public constructor(id: string) {
        super('bpmn:signalEventDefinition', undefined, {id: id});
    }
}

export class BPMNSignalIntermediateCatchEvent extends BPMNIntermediateCatchEvent {
    public constructor (id: string, name: string, signalEventDefinitionId: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super(id, name, incomingIds, outgoingIds);
        this.addChild(new BPMNSignalEventDefinition(signalEventDefinitionId));
    }
}

export class BPMNSignalIntermediateThrowEvent extends BPMNIntermediateThrowEvent {
    public constructor (id: string, name: string, signalEventDefinitionId: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super(id, name, incomingIds, outgoingIds);
        this.addChild(new BPMNSignalEventDefinition(signalEventDefinitionId));
    }
}

//#endregion