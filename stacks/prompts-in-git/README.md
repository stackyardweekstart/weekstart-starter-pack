# Prompts in Git, Keys Out

**What it fixes:** Makes prompt changes reviewable and undoable, and blocks commits that contain a key.

**Who it's for:** Anyone whose prompts live only in a dashboard or a loose file.

## Example

Before: a prompt is edited in a dashboard with no history, and a pasted key gets committed.
After: the prompt lives in `prompts/`, changes show up in review, and the secret scan below refuses the commit with the key in it.

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
