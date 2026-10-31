# Pin Your Model IDs

**What it fixes:** Keeps your agent on the model you tested instead of whatever the vendor's default is today.

**Who it's for:** Anyone running agents in production.

## Example

Before: config says `model: latest`, and the model can change under you.
After: `./check_models.sh config/` fails the build

```text
Unpinned model found:
config/a.yaml:1:model: latest
```
With an exact model name, it prints `All models pinned.`

## Steps

1. Put the exact model name for each agent in config, in version control.
2. Ban "latest" and empty model fields. The script below fails if it finds them.
3. When you change models on purpose, re-run your tests and compare cost and speed before and after.
4. Read your vendors' deprecation pages now and then. An old name can start answering with a newer model.

## Copy-paste

`check_models.sh` in this folder. Run it in your build: `./check_models.sh config/`.
