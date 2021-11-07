# Tasks overview

## Description

Look at `tasks-overview.yaml` file.

```YAML
process: Tasks overview
activities:
  This is a Subprocess:
    type: sub
    activities:
      This is an activity inside the subprocess:
  This is a User Task:
    type: human
  This is a Manual Task:
    type: manual
  This is a Business Rule Task:
    type: busin
  This is a Call Activity:
    type: call
  This is a Send Task:
    type: send
  This is a Receive Task:
    type: receive
  This is a Script Task:
    type: script
  This is a Service Task:
    type: serv
  This is a Task:
    type: task
```

In this process we have a trivial sequence of all types of tasks supported by BPMNator. The only particular one is the subprocess (`sub`) because it's the only one supporting the tag `activities`, inside which can be listed the subprocess' activities.

Consider also that the following tasks are not execution-ready and they need to be completed with specific attributes inside a visual modeler:

- `send`
- `script`
- `busin`
- `serv`
- `call`

Notice that the activity named `This is an activity inside the subprocess` has no tag `type`. When an activity lacks the tag `type`, if exists a root tag named `defaultType`, BPMNator associates that default type to the activity. Otherwise the default associated type is always `task`.

The resulting process has this aspect:

![Tasks overview](tasks-overview.png?raw=true)

## Example usage
Fastest way to launch this example is through BPMNator CLI:

```BASH
node   dist/bin/bpmnator   examples/tasks\ overview/tasks-overview.yaml   examples/tasks\ overview/tasks-overview.bpmn
```