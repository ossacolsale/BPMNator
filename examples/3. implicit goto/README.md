# Process with implicit gotos

## Description

Look at `implicit-goto.yaml` file.

```YAML
process: Implicit goto process
defaultType: human
activities:
  First task:
  Second task:
  Third task:
    type: sub
    activities:
      Subprocess first task:
      Subprocess second task:
  Fourth task:
```

In this process we don't state any goto so the task order will be trivially sequential.

The resulting process has this aspect:

![Implicit goto](implicit-goto.png?raw=true)

## Example usage
Fastest way to launch this example is through BPMNator CLI:

```BASH
node   dist/bin/bpmnator   examples/3.\ implicit\ goto/implicit-goto.yaml   examples/3.\ implicit\ goto/implicit-goto.bpmn
```