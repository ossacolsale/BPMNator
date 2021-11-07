# Process with explicit gotos

## Description

Look at `explicit-goto.yaml` file.

```YAML
process: Explicit goto process
defaultType: human
activities:
  First task:
    goto: Second task
  Fourth task:
    goto: Fifth task
  Third task:
    type: sub
    activities:
      Subprocess first task:
        goto: Subprocess second task
      Subprocess third task:
      Subprocess second task:
        goto: Subprocess third task
    goto: Fourth task
  Fifth task:
  Second task:
    goto: Third task
```

In this process we explicitly state the goto tags so process' and subprocess' tasks can be listed in any order (except the first one that must be also the first listed) and output bpmn will follow the gotos.

The resulting process has this aspect:

![Explicit goto](explicit-goto.png?raw=true)

## Example usage
Fastest way to launch this example is through BPMNator CLI:

```BASH
node   dist/bin/bpmnator   examples/explicit\ goto/explicit-goto.yaml   examples/explicit\ goto/explicit-goto.bpmn
```