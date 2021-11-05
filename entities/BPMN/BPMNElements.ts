import { BPMNEntity } from "./BPMNEntity";
import { BPMNBoolean, BPMNNodeNames } from "./BPMNSharedTypes";
import { EntHelper } from "../../helpers/EntitiesHelper";
import { StrOrStrArr } from "../SharedTypes";

export class BPMNProcess extends BPMNEntity {
    public constructor(id: string, processName: string, isExecutable: BPMNBoolean = 'true') {
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
    public constructor(taskType: BPMNNodeNames, id: string, taskName?: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
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

export class BPMNInclusiveExclusiveGateway extends BPMNEntity {
    public constructor(type: 'inc' | 'exc', id: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super(type == 'exc' ? 'bpmn:exclusiveGateway' : 'bpmn:inclusiveGateway', undefined, {id: id});
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
    }
}

export class BPMNParallelGateway extends BPMNEntity {
    public constructor(id: string, incomingIds?: StrOrStrArr, outgoingIds?: StrOrStrArr) {
        super('bpmn:parallelGateway', undefined, {id: id});
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
    }
}

export class BPMNSubProcess extends BPMNEntity {
    public constructor (id: string, subprocessName: string, incomingIds: string[], outgoingIds: string[]) {
        super('bpmn:subProcess',undefined,{id: id, name: subprocessName});
    }
}

export class BPMNConditionExpression extends BPMNEntity {
    public constructor (expression: string, type: string = 'bpmn:tFormalExpression') {
        super('bpmn:conditionExpression',expression,{'xsi:type': type});
    }
}