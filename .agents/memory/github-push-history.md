---
name: GitHub push identity and diverged history
description: How to push portfolio changes to the user's GitHub repo without the Replit account's name and without force-pushing.
---

Every commit pushed to GitHub must be authored AND committed as the user's GitHub
identity (pjsk02, GitHub noreply address). Never use the agent's or the Replit
account's name.

Local `main` contains merge commits authored by the Replit account, and GitHub `main`
can be ahead with commits from in-progress background tasks. The two histories diverge.

**Why:** The user insisted, repeatedly and emphatically, that commits use their name.
Force-pushing would overwrite task work already on GitHub.

**How to apply:** Create a temporary git worktree from `origin/main`, apply only the
new diff (`git apply -3`), commit with `-c user.name/-c user.email` plus `--author`,
push `HEAD:main` (no force), then verify the remote SHA and both identities.

Lab performance numbers (Lighthouse, long-task traces) in this container are
unstable: identical builds measured both normal and ~10x slower at different moments.
Compare builds by alternating runs, and don't report a single run as a regression.
