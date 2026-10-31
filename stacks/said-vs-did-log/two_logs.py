# two_logs.py: pattern only.
import json, re, time
SECRET = re.compile(r"(sk-[A-Za-z0-9_-]{12,}|ghp_[A-Za-z0-9]{20,}|[\w.+-]+@[\w-]+\.[\w.]+)")

def scrub(text):
    return SECRET.sub("[redacted]", text)

def log(path, run_id, kind, body):
    with open(path, "a") as f:
        f.write(json.dumps({"t": time.time(), "run": run_id, "kind": kind, "body": body}) + "\n")

def tool_said(run_id, tool, reply):
    clean = scrub(reply)
    log("tools_said.jsonl", run_id, tool, clean)
    return clean          # only the scrubbed text goes to the model

def agent_did(run_id, action, args):
    log("agent_did.jsonl", run_id, action, args)
