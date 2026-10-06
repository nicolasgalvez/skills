---
"mattpocock-skills": patch
---

`code-review`'s Standards and Spec sub-agent briefs now tell each sub-agent it is the reviewer for its axis and must do the review itself, without invoking `code-review` or spawning further agents. Sub-agents had been rediscovering the skill and fanning out recursively. Thanks @dmmulroy for the report (#573).
