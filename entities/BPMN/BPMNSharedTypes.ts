import { BPMNEntity } from "./BPMNEntity";

export type BPMNBoolean = 'true' | 'false';

export const BPMNNodeNamesArray = <const> ['bpmn:process' , 'bpmn:startEvent' ,
'bpmn:sequenceFlow' , 'bpmn:userTask' , 'bpmn:incoming' ,
'bpmn:outgoing' , 'bpmn:endEvent' , 'bpmn:exclusiveGateway' , 
'bpmn:subProcess' , 'bpmn:conditionExpression' , 'bpmn:parallelGateway',
'bpmn:task', 'bpmn:sendTask', 'bpmn:receiveTask', 'bpmn:manualTask',
'bpmn:businessRuleTask', 'bpmn:serviceTask', 'bpmn:scriptTask',
'bpmn:callActivity', 'bpmn:inclusiveGateway'];

export type BPMNNodeNames = typeof BPMNNodeNamesArray[number];

export type BPMNEntKV = {[key: string]: BPMNEntity[]};
