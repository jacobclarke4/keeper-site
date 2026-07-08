# Redesign rollback plan — "The Current Editorial" (2026-07-08)

**Status: ⏳ TRIAL — full rollback is available.** The site was redesigned from
"Sunlit Stationery" (warm newspaper) to "The Current Editorial" (the outcome
web app's design system applied to the marketing site). The old design is
preserved and the new one can be reverted in one command until the team
accepts it.

## Rollback anchors

- Tag `design/sunlit-stationery-final` (`b3a9e30`) — the last commit of the
  old design, exactly as it was live.
- Tag `design/current-editorial-v1` — the redesign commit itself.

Both tags are pushed to `origin`, so the anchors survive any local clone.

## To roll back (restore the old design)

```sh
git revert --no-edit design/current-editorial-v1
git push origin main
```

That restores Sunlit Stationery as a new commit (no history rewriting) and
GitHub Pages redeploys outcomeco.ai automatically. Nothing else to do.

If the redesign has since been amended by follow-up commits, revert the range
instead: `git revert --no-edit design/current-editorial-v1..HEAD`.

## To accept (we're keeping the redesign)

1. Delete this file: `git rm ROLLBACK.md && git commit -m "Accept The Current Editorial redesign"`
2. Optionally drop the old-design anchor: `git push origin :design/sunlit-stationery-final && git tag -d design/sunlit-stationery-final`
3. `git push origin main`

Keeping the `design/current-editorial-v1` tag is recommended either way — it
marks where the design era changed.
