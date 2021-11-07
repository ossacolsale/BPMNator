# Process with explicit gateways

## Description

Look at `explicit-gateway.yaml` file.

```YAML
process: Explicit gateway process
defaultType: human
activities:
  Subprocess1:
    type: sub
    activities:
      xgw1:
        type: xgw
        goto:
          - if: ${condition1}
            then: Subprocess1 condition1-task
          - if: ${condition2}
            then: Subprocess1 condition2-task
      Subprocess1 condition1-task:
      Subprocess1 condition2-task:
    goto: Subprocess2
  Subprocess2:
    type: sub
    activities:
      pgw1:
        type: pgw
        goto:
          - Subprocess2 parallel task1
          - Subprocess2 parallel task2
          - Subprocess2 parallel task3
      Subprocess2 parallel task1:
        goto: pgw2
      Subprocess2 parallel task2:
        goto: pgw2
      Subprocess2 parallel task3:
        goto: pgw2
      pgw2:
        type: pgw
    goto: Subprocess3
  Subprocess3:
    type: sub
    activities:
      igw1:
        type: igw
        goto:
          - if: ${condition1}
            then: Subprocess3 condition1 task1
          - if: ${condition2}
            then: Subprocess3 condition2 task
      Subprocess3 condition1 task1:
        goto: Subprocess3 condition1 task2
      Subprocess3 condition1 task2:
        goto: igw2
      Subprocess3 condition2 task:
        goto: igw2
      igw2:
        type: igw
```

In this process we use all the three gateways available in BPMNator, in an explicit format (that is as an activity):
- exlusive gateway (activity type `xgw`)
- inclusive gateway (activity type `igw`)
- parallel gateway (activity type `pgw`)

In the example we have three sequential subprocess, each of that containing a different kind of gateway:

1. `Subprocess1` starts with an exlusive gateway (named `xgw1`), followed by two alternative tasks. Inside `goto` tag, we write a list of two conditions: `if` the expression `${condition1}` is true, `then` we go to the task `Subprocess1 condition1-task`, else `if` the expression `${condition2}` is true, `then` we go to the task `Subprocess1 condition2-task`.

2. `Subprocess2` starts with a parallel gateway (named `pgw1`), followed by three parallel tasks. Inside goto tag, we write a list of three destinations: 
    - Subprocess2 parallel task1
    - Subprocess2 parallel task2
    - Subprocess2 parallel task3  

    All these three tasks have the value `pgw2` inside `goto` tag. Infact these three tasks rejoin in a second parallel gateway, named `pgw2`.

3. `Subprocess3` starts with a inclusive gateway, (named `igw1`), followed by two alternative flows. Inside `goto` tag, we write a list of two conditions: `if` the expression `${condition1}` is true, `then` we go to the task `Subprocess3 condition1 task1`, else `if` the expression `${condition2}` is true, `then` we go to the task `Subprocess3 condition2 task`. The task `Subprocess3 condition1 task1` goes to the task `Subprocess3 condition1 task2`. Finally tasks `Subprocess3 condition1 task2` and `Subprocess3 condition2 task` both have the value `igw2` inside `goto` tag. Infact these two tasks rejoin in a second inclusive gateway, named `igw2`.

The resulting process has this aspect:

![Explicit gateway](explicit-gateway.png?raw=true)

## Example usage
Fastest way to launch this example is through BPMNator CLI:

```BASH
node   dist/bin/bpmnator   examples/5.\ explicit\ gateway/explicit-gateway.yaml   examples/5.\ explicit\ gateway/explicit-gateway.bpmn
```