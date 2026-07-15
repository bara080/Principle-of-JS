# Module 15 — Interview Prep

A structured prep library. Organized by topic, each folder holds:

- Frequently-asked questions with answers you can rehearse.
- Whiteboard exercises with test-driven scaffolding.
- Production scenarios (open-ended, senior-level).
- Common mistakes candidates make.
- Senior-level "one level deeper" answers.

## Layout

```text
15-interview-prep/
├── README.md
├── language/          # var/let/const, hoisting, ==, coercion
├── async/             # event loop, promises, async/await, cancellation
├── objects/           # prototypes, this, classes
├── arrays/            # top-N array algorithms
├── closures/          # closures + scope
├── event-loop/        # deeper event loop patterns
├── dom/               # DOM APIs, events
├── system-design/     # debounce/throttle from scratch, EventEmitter, etc.
├── coding/            # LeetCode-style JS problems
└── behavioral/        # STAR stories, technical communication
```

## How to use this

- **1 week out:** run through `language/`, `async/`, `closures/` — fundamentals
  interviewers reach for first.
- **3 days out:** hit `coding/` daily. Time-box each problem.
- **1 day before:** re-read `behavioral/` and one `system-design/` per level
  you're targeting.

## Format for each folder

Each subfolder README contains:

1. Common questions (with concise, correct answers).
2. Whiteboard exercises (test-driven, `node --test`).
3. Production scenarios.
4. Common mistakes.
5. Senior-level nuances.

## Level targets

- **Junior** — language, arrays, closures, basic DOM.
- **Mid** — everything above + async, objects/prototypes, one system-design piece.
- **Senior** — every folder, with confident senior-level nuances.

Also see [`task.md`](../task.md) in the repo root for output-prediction and
find-the-bug drills.
