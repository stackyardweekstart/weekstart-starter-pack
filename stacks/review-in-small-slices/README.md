# Review in Small Slices

**What it fixes:** Your agent writes more code than you can read, so you skim a huge diff, click approve, and nobody really checked it.

**Who it's for:** Solo builders and small teams merging agent-written changes faster than they can review them.

## Example

Before: one 403-line change across 7 files lands in a single review.
After: `git diff --numstat main | python3 slice_diff.py 200` cuts it into slices, risky files first.

```text
7 files, 403 changed lines -> 5 slices (max 200 lines each)

Slice 1 (10 lines, RISKY, review first)
  src/auth/session.py (10 lines)

Slice 2 (65 lines, RISKY, review first)
  db/migrations/0042_drop_old_users.sql (65 lines)

Slice 3 (15 lines, normal)
  src/api/routes.py (15 lines)

Slice 4 (240 lines, normal)  <- over budget: split this file or ask for a smaller change
  src/ui/settings_page.tsx (240 lines)

Slice 5 (73 lines, normal)
  tests/test_routes.py (65 lines)
  README.md (8 lines)
  assets/logo.png (binary)
```

## Steps

1. **Set a diff budget.** Pick a size you can really read in one sitting (200 changed lines is a fair start). Tell the agent: one change, under budget, or split it.
2. **Slice before you read.** Run `slice_diff.py` on the change. Risky files (logins, payments, deletes, migrations, deploy files) get their own slice and go first, while you're fresh.
3. **Use the checklist on each slice** (below). Stop at the first "no" and send that slice back.
4. **Check what it did, not what it says.** Run the tests yourself and try the feature. Don't trust the agent's own summary of its work.
5. **Over budget?** Send it back, don't skim it. A slice you can't read is a slice nobody reviewed.
6. Tune the risky word list in the script to your own repo.

## Copy-paste

Review checklist, one pass per slice:

```text
[ ] I can say in one sentence what this slice changes and why.
[ ] Nothing here deletes data, moves money, or changes who can log in,
    unless that was the point, and I checked it line by line.
[ ] New inputs are checked; errors fail loudly, not silently.
[ ] Tests cover the change, and I ran them myself.
[ ] No keys, passwords or personal data in code, logs or tests.
[ ] No new dependency I didn't ask for.
```

Prompt to add to your agent's instructions:

```text
Keep each change under 200 changed lines. If the work is bigger, split it into
separate changes that each make sense alone, and put risky files (auth,
payments, deletes, migrations) in their own change. For each change, list what
you changed and the exact command I can run to check it.
```

`slice_diff.py` in this folder does the slicing.
