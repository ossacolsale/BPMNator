# Intermediate events overview

## Description

Look at `intermediate-events-overview.yaml` file.

```YAML
process: Intermediate events overview
activities:
  This is an Intermediate Throw Event:
    type: inthrow
  This is a Conditional Intermediate Throw Event:
    type: incond
    condition: ${conditionExpression}
  This is a Compensate Intermediate Throw Event:
    type: incomp
  This is a Signal Intermediate Throw Event:
    type: insthrow
  This is a Signal Intermediate Catch Event:
    type: inscatch
  This is a Message Intermediate Throw Event:
    type: inmthrow
  This is a Message Intermediate Catch Event:
    type: inmcatch
  This is a Timer Intermediate Catch Event:
    type: intimer
  This is a Escalation Intermediate Throw Event:
    type: inescal
```

In this process we have a trivial sequence of all types of intermediate events supported by BPMNator. The only particular one is the Conditional Intermediate Throw Event (`incond`) because it supports the optional field `condition`, inside which can be stated a condition expression.

Consider also that the following intermediate events are not execution-ready and they need to be completed with specific attributes inside a visual modeler:

- `insthrow`
- `inscatch`
- `inmthrow`
- `inmcatch`
- `intimer`
- `inescal`

The resulting process has this aspect:

![Intermediate events overview](intermediate-events-overview.png?raw=true)

## Example usage
Fastest way to launch this example is through BPMNator CLI:

```BASH
node   dist/bin/bpmnator   examples/7.\ intermediate\ events\ overview/intermediate-events-overview.yaml   examples/7.\ intermediate\ events\ overview/intermediate-events-overview.bpmn
```