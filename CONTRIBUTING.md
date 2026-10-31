# Contributing

Thanks for helping. Small, focused pull requests are easiest to review.

## Add or change a stack

1. Copy `stacks/_template/` to `stacks/<slug>/`. The slug is lowercase letters, numbers and dashes (for example `support-triage`).
2. Fill in `README.md` (what it does, who it's for, setup steps, known limits) and `stack.json`.
3. Add the stack to `stacks.json` with `"status": "ready"`.
4. Run `node scripts/validate.mjs` (Node 18 or newer, no install needed). It must print `OK`.

## Rules

- Never commit API keys, tokens or passwords. Use environment variable names only (for example `OPENAI_API_KEY`), never values.
- Pin model versions. Don't use "latest" aliases in a stack.
- Say what the stack does with data: where prompts and outputs are stored, and for how long.
- Anything that can delete, pay, send or publish needs a human approval step.
- Link to official docs for every tool and model you mention.

## License

By contributing you agree that your contribution is licensed under the MIT License in `LICENSE`.
