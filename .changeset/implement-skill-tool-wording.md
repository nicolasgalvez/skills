---
"mattpocock-skills": patch
---

`implement` now tells the agent to call the Skill tool with `tdd` and `code-review`, instead of the bare `/tdd` and `/code-review` prose that the other skills dropped in #878. A `/skill` mention in prose does not reliably load the skill.
