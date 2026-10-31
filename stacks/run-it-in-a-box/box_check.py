#!/usr/bin/env python3
"""Check a `docker run` command before your agent uses it.

Fails closed: any flag that reaches your own machine is a FAIL.
Usage: python3 box_check.py docker run --rm --network none ... IMAGE CMD
With no arguments it checks two sample commands.
"""
import shlex
import sys

# Flags that break the box open, and why.
RISKY = {
    "-v": "mounts a folder from your machine",
    "--volume": "mounts a folder from your machine",
    "--mount": "mounts a folder from your machine",
    "--volumes-from": "borrows another container's folders",
    "--privileged": "gives the box almost everything your machine can do",
    "--device": "hands a device from your machine to the box",
    "--cap-add": "adds kernel powers back",
    "--pid": "can share your machine's process list",
    "--ipc": "can share your machine's memory channels",
    "--userns": "can turn off user remapping",
    "--use-api-socket": "hands the box control of Docker itself",
    "-p": "opens a port to your network",
    "--publish": "opens a port to your network",
    "-P": "opens ports to your network",
    "--publish-all": "opens ports to your network",
    "--env-file": "copies a file of settings, often secrets, into the box",
}
# Flags that take a value in the next word (unless written as --flag=value).
TAKES_VALUE = {
    "-v", "--volume", "--mount", "--volumes-from", "--device", "--cap-add",
    "--cap-drop", "--pid", "--ipc", "--userns", "-p", "--publish", "--env-file",
    "-e", "--env", "--network", "--net", "--tmpfs", "-w", "--workdir", "-u",
    "--user", "--name", "-m", "--memory", "--cpus", "--pids-limit",
    "--security-opt", "--stop-timeout", "--ulimit",
}
REQUIRED = {
    "--rm": "throw the box away when it exits",
    "--network": "set --network none (no internet by default)",
    "--read-only": "keep the box's own files read-only",
}


def check(args):
    problems, seen = [], {}
    i = 0
    while i < len(args):
        a = args[i]
        if not a.startswith("-"):
            break  # image name reached
        name, _, val = a.partition("=")
        if name in RISKY:
            problems.append(f"{a}: {RISKY[name]}")
        if name in ("--network", "--net"):
            seen["--network"] = val or (args[i + 1] if i + 1 < len(args) else "")
        elif name in REQUIRED:
            seen[name] = True
        if name in ("-e", "--env"):
            problems.append(f"{a}: passes a setting in; keep keys out of the box")
        if name in TAKES_VALUE and not val:
            i += 1  # skip the value word
        i += 1
    for flag, why in REQUIRED.items():
        if flag not in seen:
            problems.append(f"missing {flag}: {why}")
    if seen.get("--network") not in (None, "none"):
        problems.append(f"--network {seen['--network']}: use none unless you allow-list a host")
    return problems


def main(argv):
    samples = [argv] if argv else [
        "docker run -it -v $HOME:/work -e API_KEY my-agent",
        "docker run --rm --network none --read-only --tmpfs /work -w /work my-agent",
    ]
    worst = 0
    for cmd in samples:
        parts = shlex.split(cmd) if isinstance(cmd, str) else cmd
        if parts[:2] == ["docker", "run"]:
            parts = parts[2:]
        problems = check(parts)
        print("$", cmd if isinstance(cmd, str) else " ".join(cmd))
        if problems:
            worst = 1
            print("FAIL")
            for p in problems:
                print("  -", p)
        else:
            print("PASS: no host folders, no network, thrown away on exit")
        print()
    return worst


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
