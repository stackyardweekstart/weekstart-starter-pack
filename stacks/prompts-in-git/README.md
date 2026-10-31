# Prompts in Git, Keys Out

**The problem:** A prompt that only lives in a vendor dashboard can't be reviewed or rolled back. A key pasted into a prompt file stays in history for good.

**What it does:** Puts prompts in your repo, keeps local secret files out, and scans each commit for keys.

## Steps

1. Make a `prompts/` folder in your repo. Move dashboard-only prompts into it.
2. Add the ignore lines below.
3. Add a secret scan that runs on every commit (example below), then run `pre-commit install`.
4. In prompts, refer to keys by name (`$MY_API_KEY`), never the value. Load keys from a secret manager or environment variables, not your clipboard.
5. If a key ever lands in a chat or a commit, replace it first, then clean up history.

## Copy-paste `.gitignore` lines

```gitignore
prompts/_local/
.env
.env.*
!.env.example
*.pem
*.key
```

## Copy-paste `.pre-commit-config.yaml`

```yaml
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.30.1   # update with: pre-commit autoupdate
    hooks:
      - id: gitleaks
```
