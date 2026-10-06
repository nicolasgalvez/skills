---
"mattpocock-skills": patch
---

`handoff` now says how to find the OS temp directory (`$TMPDIR`, falling back to `/tmp`, or `%TEMP%` on Windows) and tells you the absolute path of the handoff document it wrote. Agents used to take several attempts to find the temp dir on Windows, and wrote to a different place on each run on macOS. Thanks @hades200082 for reporting it (#272).
