import { BPMNEntity } from "./BPMNEntity";

export type TBPMNBoolean = 'true' | 'false';

export const BPMNNodeNames = <const> ['bpmn:process' , 'bpmn:startEvent' ,
'bpmn:sequenceFlow' , 'bpmn:userTask' , 'bpmn:incoming' ,
'bpmn:outgoing' , 'bpmn:endEvent' , 'bpmn:exclusiveGateway' , 
'bpmn:subProcess' , 'bpmn:conditionExpression' , 'bpmn:parallelGateway',
'bpmn:task', 'bpmn:sendTask', 'bpmn:receiveTask', 'bpmn:manualTask',
'bpmn:businessRuleTask', 'bpmn:serviceTask', 'bpmn:scriptTask',
'bpmn:callActivity', 'bpmn:inclusiveGateway', 'bpmn:intermediateCatchEvent',
'bpmn:intermediateThrowEvent', 'bpmn:timerEventDefinition', 'bpmn:messageEventDefinition',
'bpmn:escalationEventDefinition', 'bpmn:conditionalEventDefinition',
'bpmn:linkEventDefinition', 'bpmn:compensateEventDefinition', 'bpmn:signalEventDefinition',
'bpmn:condition'];

export type TBPMNNodeNames = typeof BPMNNodeNames[number];

export type TBPMNEntKV = {[key: string]: BPMNEntity[]};
