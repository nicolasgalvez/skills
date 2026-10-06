---
"mattpocock-skills": patch
---

`research` delegates exactly once. The caller starts one background agent and tells it that it is the one doing the research, and an agent that is already that background agent does the work itself instead of spawning another. Before, the spawned agent read "spin up a background agent" as addressed to itself and nested a duplicate that redid the whole task. Thanks @marcoscale for spotting it (#530).
