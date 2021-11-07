# Process overview

## Description

Look at `process-overview.yaml` file.

```YAML
process: This is the process name             # mandatory
defaultType: human                            # optional
activities:                                   # optional
  This is the first activity's name:          # mandatory (no anonym activity admitted)
    type: task                                # optional
    goto: This is the second activity's name  # mandatory or optional, depending on "type" tag
  This is the second activity's name:
```

We'll use this process to describe the basic structure of BPMNator YAML syntax.

The root level admits only three tags: `process`, `defaultType` and `activities`.

- Tag `process` is the only one mandatory. It contains the name of the process and __can assume any string value__.
- Tag `defaultType` is optional. It contains the default type of activity, in case you don't explicitly set the tag `type` for one or more activities. It can assume one of the following values: __`sub`, `human`, `manual`, `receive`, `script`, `send`, `task`, `busin`, `serv`, `call`, `pgw`, `igw`, `xgw`__.
- Tag `activities` is followed by one or more child tags that corresponds to the name of the respective activity. The first one listed, is always the BPM process first activity and automatically BPMNator creates a start event that precedes this activity. Only one start event is admitted.

Every activity is identified with its name. For example the activity _"This is the first activity's name"_ is marked by the tag of the same name (`This is the first activity's name`).

__Process name and every activities name must be uniques__ because BPMNator calculates the respective "id" (used for output BPMN file) from that name. Also note that the names "_Task 1_" and "_\*Task  1\*_" are considered the same. Because field "id" in BPMN format can contain only lower and upper case letters, numbers, underscores, dashes and dots, these two names'll have the same id ("_Task1_").

Under each activity's main tag, only six __optional__ tags are admitted: `type`, `activities`, `goto`, `xgoto`, `pgoto`, `igoto`.

- Tag `type` indicates the activity type and can assume one of the following values: __`sub`, `human`, `manual`, `receive`, `script`, `send`, `task`, `busin`, `serv`, `call`, `pgw`, `igw`, `xgw`__.
- Tag `activities` can be used only when activity type is `sub` (a subprocess) and his content follows the same rules of tag `activities` at root level of YAML file.
- Tags `goto`, `xgoto`, `pgoto`, `igoto` can be used in every activity type but they are mutually exclusive. That is, for example, if you use a `goto` inside an activity, then you cannot use any other tag among `xgoto`, `pgoto` or `igoto`. And so on.
- Tag `goto` can have various contents, depending on activity type:
  - For activities `sub`, `human`, `manual`, `receive`, `script`, `send`, `task`, `busin`, `serv`, `call`, the tag `goto` can only be the name of the activity to go to after their own completion. Infact in above example we have `goto: This is the second activity's name` because we want the first activity to go to the second activity.
  - For activities `xgw` (exclusive gateway) and `igw` (inclusive gateway), the tag `goto` must be followed by a list of two or more "if, then" elements. The tag `if` contains one conditional expression and the tag `then` contains the name of the activity to go to in case that conditional expression be satisfied.
  - For activity `pgw` (parallel gateway) the tag `goto` must be followed by a list of two or more activity names to go to in parallel.
- Tags `xgoto` and `igoto` respectively make BPMNator add a exlusive gateway or inclusive gateway to go to after activity completion. That two tags must be followed by a list of two or more "if, then" elements. The tag `if` contains one conditional expression and the tag `then` contains the name of the activity to go to in case that conditional expression be satisfied.
- Tag `pgoto` make BPMNator add a parallel gateway to go to after activity completion. This tag must be followed by a list of two or more activity names to go to in parallel.
- When none of the activities has whatever `*goto` tag (`goto`, `xgoto`, `pgoto`, `igoto`), the flow direction is merely sequential respect of YAML file.
- When a subset of activity has not whatever `*goto` tag (`goto`, `xgoto`, `pgoto`, `igoto`), each of these activities is considered a final one and will be automatically followed by an "end event".

To see each of these tags and rules in action, take a look to the other examples of this repository.

The resulting process has this aspect:

![Process overview](process-overview.png?raw=true)

## Example usage
Fastest way to launch this example is through BPMNator CLI:

```BASH
node   dist/bin/bpmnator   examples/1.\ process\ overview/process-overview.yaml   examples/1.\ process\ overview/process-overview.bpmn
```