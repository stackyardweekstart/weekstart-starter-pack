# must_ask.py: pattern only. Hard-code the list; a model cannot remove items.
ALWAYS_ASK = {"payment", "refund", "delete", "drop_table", "send_external",
              "change_access", "rotate_credentials", "deploy_prod"}

def needs_person(step):
    return step.get("kind") in ALWAYS_ASK or step.get("irreversible") is True

def run_step(step, execute, ask_person):
    if needs_person(step):
        if ask_person(step) is not True:   # no answer = no
            return "stopped: waiting for a person"
    return execute(step)

if __name__ == "__main__":
    print(run_step({"kind": "delete", "target": "customers"},
                   lambda s: "ran", lambda s: None))
