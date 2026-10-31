# Pin Your Model IDs

**The problem:** If your config says "latest" or leaves the model blank, the vendor decides what you run. Nothing errors. Output, tool habits, speed and cost can all shift.

**What it does:** Every production agent names an exact model in a file you keep in version control, and a check fails the build if one doesn't.

## Steps

1. Put the exact model name for each agent in config, in version control.
2. Ban "latest" and empty model fields. The script below fails if it finds them.
3. When you change models on purpose, re-run your tests and compare cost and speed before and after.
4. Read your vendors' deprecation pages now and then. An old name can start answering with a newer model.

## Copy-paste

`check_models.sh` in this folder. Run it in your build: `./check_models.sh config/`.
