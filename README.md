# Weekstart Starter Pack

**What it is:** 10 small habits for people who run AI agents, each with a short guide and a copy-paste prompt or snippet.
**Who it's for:** Solo operators and small teams whose agents call tools, spend money, or write to real systems.
**What it does:** Helps your agents stop on unknowns, ask before risky steps, retry safely, spend less, stay in a box, and produce changes you can actually review.

Every stack is a pattern, not vendor news, so it should stay useful for a long time. The snippets are patterns to adapt, not finished libraries. Read them before you run them.

## How to use it in 5 steps

1. Skim the table below and pick the one stack that matches your biggest worry today.
2. Open its folder and read the README (about 2 minutes).
3. Copy the prompt or snippet into one real agent or repo.
4. Try it on a single run and check it does what you expect.
5. Come back next week and add one more.

## The 10 stacks

| Stack | What it is | What it does |
|---|---|---|
| [When in Doubt, Stop](stacks/when-in-doubt-stop/) | A small check that runs before your agent calls any tool. | Stops the call when a field is missing or a permission answer is unknown, instead of guessing and letting it through. |
| [Ask Before You Delete](stacks/ask-before-you-delete/) | A short rule list for the steps that always go to a person. | Makes payments, deletes and other can't-undo steps wait for a human yes, whatever the agent or any check says. |
| [Pin Your Tool Definitions](stacks/pin-tool-definitions/) | A fingerprint of each tool you approved. | Notices when a tool's name, description or inputs change after you approved it, and asks again instead of running. |
| [Tool Results Are Data, Not Orders](stacks/tool-results-are-data/) | A system rule plus a cleanup step for anything a tool returns. | Treats web pages, files and tool replies as information to check, so a fetched page can't take over your agent. |
| [Said vs. Did Log](stacks/said-vs-did-log/) | Two separate records for every run. | Lets you prove afterwards whether a bad tool reply turned into an action, and keeps secrets out of what the model sees. |
| [Token Defrag](stacks/token-defrag/) | A checklist for doing the same work with fewer tokens. | Cuts what you pay every turn: keep tool lists steady, drop old tool output, fetch things once, and turn on only the tools this turn needs. |
| [Session Budget Guard](stacks/session-budget-guard/) | A hard ceiling on how many tokens one run can use. | Stops the run with a plain message when it hits the ceiling, instead of retrying forever and running up the bill. |
| [Run It in a Box](stacks/run-it-in-a-box/) | A throwaway container setup plus a check for the command that starts it. | Keeps your agent away from your own files, keys and network: no host folders, no network by default, and a workdir that vanishes on exit. |
| [Retry With a Key](stacks/retry-with-a-key/) | One key per real-world write, reused on every retry. | Stops a timeout-and-retry from creating a second charge, ticket or pull request. |
| [Review in Small Slices](stacks/review-in-small-slices/) | A diff budget, a review checklist and a small script that splits a change into slices. | Turns an agent's too-big change into pieces you can really read, with risky files first, so approve means someone checked it. |

## The machine-readable list

`stacks.json` lists all 10 stacks with a title, a one-line summary and a path, so your own tools can read it.

---

Want a short weekly heads-up on agent tool and API changes? It's at [stackyard.fyi](https://stackyard.fyi).
