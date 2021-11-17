
# BPMNator

BPMNator is a tool to transform a simple YAML file into a more complex BPMN 2.0 file.

That means, for example, that BPMNator transforms this four-lines simple YAML file:

```YAML
process: My BPM process
activities:
  My first task:
    type: human
```

into the corresponding complex BPMN 2.0 XML standard file:

```XML
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="MyBpmProcess" name="My BPM process" isExecutable="true">
    <bpmn:sequenceFlow id="sequenceFlow_1" sourceRef="startEvent_1" targetRef="MyFirstTask" />
    <bpmn:sequenceFlow id="sequenceFlow_2" sourceRef="MyFirstTask" targetRef="endEvent_1" />
    <bpmn:startEvent id="startEvent_1">
      <bpmn:outgoing>sequenceFlow_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:endEvent id="endEvent_1">
      <bpmn:incoming>sequenceFlow_2</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:userTask id="MyFirstTask" name="My first task">
      <bpmn:incoming>sequenceFlow_1</bpmn:incoming>
      <bpmn:outgoing>sequenceFlow_2</bpmn:outgoing>
    </bpmn:userTask>
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="MyBpmProcess">
      <bpmndi:BPMNEdge id="_BPMNConnection_sequenceFlow_2" bpmnElement="sequenceFlow_2">
        <di:waypoint x="340" y="118" />
        <di:waypoint x="372" y="118" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="_BPMNConnection_sequenceFlow_1" bpmnElement="sequenceFlow_1">
        <di:waypoint x="188" y="118" />
        <di:waypoint x="240" y="118" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNShape id="_BPMNShape_startEvent_1" bpmnElement="startEvent_1" isExpanded="false">
        <dc:Bounds x="152" y="100" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="_BPMNShape_MyFirstTask" bpmnElement="MyFirstTask" isExpanded="false">
        <dc:Bounds x="240" y="78" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="_BPMNShape_endEvent_1" bpmnElement="endEvent_1" isExpanded="false">
        <dc:Bounds x="372" y="100" width="36" height="36" />
      </bpmndi:BPMNShape>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
```

The BPMNator-YAML format supports a few main features of BPMN standard and is useful basically in two contexts:

1. To accelerate the design of a BPM process when you have a lot of process definitions or SOP to implement (this way you can create the main structure with BPMNator and afterwards refine the details opening the output .BPMN file with your visual editor)
2. To quickly generate a big amount of BPMN files for research and testing purposes

## Installation

BPMNator is made with NodeJS and is written in TypeScript so you need to have both of them installed before you start.

There are two ways to install BPMNator. Via npm repository or cloning git repository e compiling the code.

### Way 1: install via npm

If you want to use BPMNator as a library:

```BASH
# (optionally) init a new NodeJS project:
npm init
# just install bpmnator locally:
npm i bpmnator
```
Or if you want to use BPMNator both as a library and as command-line program:

```BASH
# install bpmnator globally
npm i --global bpmnator
```

### Way 2: install from git repository

```BASH
# clone repository:
git clone https://github.com/ossacolsale/bpmnator.git
# go to bpmnator directory:
cd bpmnator
# compile typescript code:
tsc
# you'll find compiled code inside "dist" folder
```

## Usage

This is a quick guideline. **For a complete guideline of BPMNAtor YAML syntax and library methods, visit https://github.com/ossacolsale/bpmnator/wiki.**

Once installed, you need to create one YAML-BPMNator file. For example:

```YAML
name: Example process
activities:
    My first task:
        type: human
        goto: My second task
    My second task:
        type: manual
# and so on...

```

Then you can use BPMNator to parse and transform your YAML in a standard BPMN 2.0 file.

As a library, you can call BPMNator inside your JavaScript or TypeScript code:

```TYPESCRIPT
import { BPMNator } from 'bpmnator';

const bpmnator = new BPMNator();

// and so on with other commands...
```

You can also use BPMNator, with some limitations, via command line.

* If you installed it globally __just type `bpmnator` in your shell console__.

* If you installed it only locally, just make the following steps:

```BASH
# go inside "bpmnator" folder in one of two possible ways:
cd node_modules/bpmnator ## if you used npm installation
cd bpmnator              ## if you cloned git repository
# execute main file:
node dist/bin/bmpnator
```