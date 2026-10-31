# Contributing

Thanks for helping. Small, focused pull requests are easiest to review.

## Add or change a stack

1. Copy `stacks/_template/` to `stacks/<slug>/`. The slug is lowercase letters, numbers and dashes (for example `support-triage`).
2. Fill in `README.md`: a `# Title`, **The problem:**, **What it does:** and a `## Steps` section. Put any snippet next to it and name it in the README.
3. Add the stack to `stacks.json` with `slug`, `title`, `what_it_is`, `what_it_does` and `path` (`stacks/<slug>/`).
4. Run `node scripts/validate.mjs` (Node 18 or newer, no install needed). It must print `OK`.

## Rules

- Never commit API keys, tokens or passwords. Use environment variable names only (for example `OPENAI_API_KEY`), never values.
- Pin model versions. Don't use "latest" aliases in a stack.
- Snippets are patterns: keep them short, runnable and dependency-free, with a small demo under `if __name__ == "__main__":` (or equivalent).
- Anything that can delete, pay, send or publish needs a human approval step.
- Stick to patterns that last. Leave out dated vendor news.

## License

By contributing you agree that your contribution is licensed under the MIT License in `LICENSE`.
