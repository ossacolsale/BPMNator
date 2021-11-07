# Process with implicit gateways

## Description

Look at `implicit-gateway.yaml` file.

```YAML
process: Implicit gateway process
defaultType: human
activities:
  First task:
    xgoto:
      - if: ${condition1}
        then: Condition1 second task
      - if: ${condition2}
        then: Condition2 second task
  Condition1 second task:
  Condition2 second task:
```

In this process we implicitly insert an exclusive gateway between the first task and the second task, by the tag `xgoto`.

The tag `xgoto` must be followed by a list of at least two elements of an structure composed by two fields: `if` and `then`. In this example we state that, once "First task" is completed, `if` the expression `${condition1}` is true, `then` we go to to task `Condition1 second task`, else `if` the expression `${condition2}` is true, `then` we goto to task `Condition2 second task`.

_The same way we can use `pgoto` (parallel gateway goto) and `igoto` (inclusive gateway goto) with one substantial difference: parallel and inclusive gateways must be rejoined at some point with another gateway of the same type (for this purpose we can use the task of type `pgw` - parallel gateway - and `igw` - inclusive gateway)._

The resulting process has this aspect:

![Implicit gateway](implicit-gateway.png?raw=true)

## Example usage
Fastest way to launch this example is through BPMNator CLI:

```BASH
node   dist/bin/bpmnator   examples/implicit\ gateway/implicit-gateway.yaml   examples/implicit\ gateway/implicit-gateway.bpmn
```