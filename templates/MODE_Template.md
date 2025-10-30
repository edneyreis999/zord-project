# [Mode Name] Mode

**Purpose**: Briefly state the mindset and primary objective of this mode. Explain what it optimizes for (e.g., discovery, orchestration, efficiency, research) and when it should be used.

## Activation Triggers

- List specific phrases, flags, or contexts that should activate this mode.
- Include manual flags (e.g., `--flag`) and natural-language cues.
- Mention environmental/resource thresholds if applicable (e.g., context usage).

## Behavioral Changes

- Describe how the assistant’s behavior shifts in this mode.
- Use bolded keywords for major changes (e.g., **Evidence-first**, **Efficiency**, **Socratic**).
- Keep bullets actionable and testable.

## Outcomes

- Enumerate concrete outputs or end states this mode should produce.
- Focus on measurable or verifiable results.
- Tie outcomes to handoff/readiness for the next workflow stage.

## Process / Execution Pattern

1. Outline the step-by-step flow this mode should follow.
2. Include planning, validation, or checkpoint steps if relevant.
3. Note parallelization opportunities or sequencing constraints.

## Examples

```
Standard: "[Describe normal behavior]"
[Mode Name]: "[Show how responses look under this mode: questions, structure, symbols, templates, etc.]"
```

---

## Notes for Authors

- Keep sections concise and scannable (bullets > paragraphs).
- Prefer explicit triggers and verification points over vague guidance.
- Mirror naming and tone used across existing modes.
- Add tables or templates when they meaningfully standardize outputs.

---

## Optional: Integration Points

- Describe how this mode integrates with tools, MCP servers, or personas.
- List auto-activated agents, required capabilities, and any commands/flags.
- Note dependencies and how context/memory should be shared across components.

## Optional: Quality Standards

- Define acceptance criteria for outputs (e.g., citations, confidence, actionability).
- Specify communication standards (tone, format, verbosity) and constraints.
- Add domain-specific requirements (e.g., infrastructure must reference official docs).
