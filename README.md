
# BPMNator
BPMNator is a tool to transform a simple YAML file into a simple BPMN 2.0 file.

The BPMNator-YAML format supports a few main features of BPMN standard and is useful basically in two contexts:

1. To accelerate the design of a BPM process when you have a lot of process definitions or SOP to implement (this way you can create the main structure with BPMNator and afterwards refine the details opening the output .BPMN file with your visual editor)
2. To quickly generate a big amount of BPMN files for research and testing purposes

## Installation

BPMNator is made with NodeJS and is written in TypeScript so you need to have both of them installed before you start.

There are two ways to install BPMNator. Via npm repository or cloning git repository e compiling the code.

### Way 1: install via npm

```BASH
# (optionally) init a new NodeJS project:
npm init
# just install bpmnator:
npm i bpmnator
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

You can also use BPMNator, with some limitations, via command line:

```BASH
# go inside "bpmnator" folder in one of two possible ways:
cd node_modules/bpmnator ## if you used npm installation
cd bpmnator              ## if you cloned git repository
# execute main file:
node dist/bin/bmpnator
```



