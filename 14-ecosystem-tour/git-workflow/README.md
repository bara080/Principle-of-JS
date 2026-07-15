# Git Workflow

The Git commands and habits you use every day. Not a Git tutorial — focused on
the workflow around your JS projects.

## Daily

```bash
git status                          # what's changed
git diff                            # unstaged diff
git diff --staged                   # staged diff
git add -p                          # stage hunks interactively
git commit -m "..."                 # commit
git push -u origin feature/foo      # push new branch
```

## Branches

```bash
git switch -c feature/foo           # new branch off current
git switch main                     # back to main
git rebase main                     # replay commits on top of main
git merge --ff-only main            # fast-forward only
```

## History hygiene

- Small, focused commits.
- Present-tense imperative messages: "Add cart totals", not "Added" or "Adds".
- Squash trivia (`fixup!`) before merging.

## Common bailouts

```bash
git restore --staged file.js        # unstage
git restore file.js                 # discard unstaged changes
git reset --soft HEAD~1             # undo last commit, keep changes
git commit --amend --no-edit        # tweak the last commit
git stash --include-untracked       # save WIP
```

## Merge conflict shortcut

```bash
git checkout --theirs path/to/file  # accept incoming
git checkout --ours   path/to/file  # keep yours
```

## PR workflow

- Branch per feature.
- Rebase against main before requesting review.
- Squash-merge (or rebase-merge) for a clean history on `main`.

## Interview tips

- Rebase = rewrite; merge = record. Rewriting shared history breaks other people.
- `--force-with-lease` is safer than `--force` — refuses to overwrite unknown changes.
