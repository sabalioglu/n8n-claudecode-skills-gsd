# Ralph Wiggum Plugin

> Iterative AI development methodology using Claude Code

---

## Overview

The Ralph Wiggum Plugin implements an iterative AI development methodology using Claude Code. Named after the persistent Simpsons character, it automates self-referential feedback loops where an AI agent continuously improves its work until task completion.

---

## Core Mechanism

Ralph operates through a Stop hook that intercepts exit attempts within a single session. Rather than requiring external bash loops, the system re-feeds prompts internally, allowing Claude to:

- Review previous work stored in files
- Examine git history showing past iterations
- Autonomously refine solutions based on accumulated context
- Continue until completion criteria are met

---

## Essential Commands

**Starting a loop:**
```bash
/ralph-loop "task description" --completion-promise "DONE" --max-iterations 50
```

**Canceling active loops:**
```bash
/cancel-ralph
```

---

## IMPORTANT: Always Use --max-iterations

When using Ralph loops, **ALWAYS specify `--max-iterations`** to prevent runaway execution:

```bash
# Good - with iteration limit
/ralph-loop "build feature X" --completion-promise "DONE" --max-iterations 25

# Bad - no limit (can run indefinitely!)
/ralph-loop "build feature X" --completion-promise "DONE"
```

**Recommended limits:**
- Simple tasks: `--max-iterations 10`
- Medium complexity: `--max-iterations 25`
- Complex/overnight: `--max-iterations 50`
- Never exceed 100 iterations without good reason

---

## Key Principles

The methodology prioritizes iteration over initial perfection, treating failures as informative data points. Success depends heavily on:

1. **Prompt engineering quality** - Clear, specific task descriptions
2. **Appropriate iteration limits** - Set realistic bounds
3. **Verifiable completion criteria** - Use automated tests when possible

---

## Appropriate Use Cases

### Good for Ralph:
- Well-defined, verifiable tasks (especially those with automated testing)
- Greenfield projects with clear requirements
- Overnight batch work
- Iterative refinement tasks

### Not suitable for Ralph:
- Subjective decisions requiring human judgment
- Single-operation tasks (overkill)
- Production debugging requiring targeted investigation
- Tasks without clear completion criteria

---

## Notable Applications

The technique has powered:
- Overnight repository generation
- Significantly reduced API costs on contracts
- Multi-month language development projects
- Automated code review and refactoring

---

## Integration with GSD

Ralph integrates well with the GSD (Get Shit Done) workflow:

```
/gsd:plan-phase 1        # Create the plan
/ralph-loop "/gsd:execute-plan" --completion-promise "Phase complete" --max-iterations 30
```

This allows autonomous phase execution with built-in iteration limits.

---

## Safety Considerations

1. **Always set `--max-iterations`** - Prevents infinite loops
2. **Use clear completion promises** - Helps Ralph know when to stop
3. **Monitor first few iterations** - Ensure it's on the right track
4. **Review git history after** - Understand what changes were made

---

## Original Source

For the latest version and updates, see the official Claude Code repository:
https://github.com/anthropics/claude-code/blob/main/plugins/ralph-wiggum/README.md

---

*Part of the n8n-claudecode-skills-gsd toolkit*
