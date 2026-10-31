# Run It in a Box

**What it fixes:** Your agent runs commands on your own laptop, next to your files, your keys and your home network. One bad command or one poisoned page, and it can touch all of them.

**Who it's for:** Anyone letting a coding agent run shell commands, install packages or try code from the internet.

## Example

Before: the usual quick start hands the agent your home folder and a key.
After: `python3 box_check.py` checks the command before the agent gets it.

Run `python3 box_check.py` with no arguments to see a demo. The first sample fails on purpose, and the demo still exits 0. A real command that fails exits 1.

```text
$ docker run -it -v $HOME:/work -e API_KEY my-agent
FAIL
  - -v: mounts a folder from your machine
  - -e: passes a setting in; keep keys out of the box
  - missing --rm: throw the box away when it exits
  - missing --network: set --network none (no internet by default)
  - missing --read-only: keep the box's own files read-only

$ docker run --rm --network none --read-only --tmpfs /work -w /work my-agent
PASS: no host folders, no network, thrown away on exit
```

## Steps

1. Run the agent in a container, never straight on your machine.
2. **No folders from your machine.** No `-v` or `--mount` of your home or project folder. Copy the repo in (or `git clone` it inside), and copy results out only when you're happy with them.
3. **No network by default.** `--network none` leaves only the box's own loopback. If the agent needs its model API, give it one route to that host only, not the open internet.
4. **Throwaway workdir.** `--rm` deletes the box on exit, `--read-only` locks its own files, and `--tmpfs /work` gives it a scratch folder that vanishes with it.
5. **No keys inside.** No `-e API_KEY`, no `--env-file`. If it must call a service, put a small proxy outside the box that holds the key and only allows the calls you list.
6. **Never** `--privileged`, never mount the Docker socket. Either one hands the box your machine.
7. Containers are a fence, not a vault. For code you truly don't trust, use a separate VM or a spare machine.
8. Run `box_check.py` on the exact command before every new setup. It fails on anything it doesn't expect.

## Copy-paste

```bash
# Start a throwaway, offline box with a scratch workdir
docker run --rm -it \
  --network none \
  --read-only \
  --tmpfs /work \
  -w /work \
  --security-opt no-new-privileges \
  my-agent-image
```

Prompt to add to your agent's instructions:

```text
You run inside a throwaway container with no network and no access to the
user's files. Do not ask for host folders, keys or network access to be added.
If a task truly needs one, stop and say exactly what and why.
```

`box_check.py` in this folder checks any `docker run` command line.
