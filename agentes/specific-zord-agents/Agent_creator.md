# Agent Creator Guide

Use this checklist-driven workflow to craft new agent profiles that align with the legacy SuperClaude personas. Every step references `AGENTS_Template.md` so new entries remain consistent with the existing library.

## Before You Start

- Review at least one relevant agent in this directory to understand tone and depth expectations.
- Open `AGENTS_Template.md` to mirror heading structure and placeholder intent.
- Confirm the agent’s purpose fits the current taxonomy (analysis, delivery, coaching, etc.). Clarify overlaps with existing personas.
- Gather any source material (requirements, process documents, stakeholder notes) you will reference while drafting.

## Creation Workflow

1. **Frame the mission**  
   Capture a one-sentence summary for the H1 heading. Ensure the name follows existing casing conventions.
2. **Fill core sections**  
   Work through the template from Triggers to Boundaries. Replace placeholder prompts with explicit bullet lists or short paragraphs.
3. **Assess optional coverage**  
   Decide whether `(Optional) Workflow Stages` or `(Optional) Quality Standards` add value. If used, tailor them to the agent’s operations.
4. **Cross-check terminology**  
   Align vocabulary with similar agents (e.g., “PDCA cycle,” “evidence management”) to keep the library cohesive.
5. **Validate boundaries and hand-offs**  
   Confirm the agent’s limits and escalation paths do not conflict with neighboring personas.
6. **Run peer (or self) review**  
   Verify clarity, concision, and actionable detail. Compare against a strong exemplar such as `deep-research-agent.md` or `pm-agent.md`.
7. **Finalize metadata block (optional)**  
   If the agent requires front matter (name, description, category), follow the YAML pattern used in other files.

## Agent Definition Questionnaire

Capture these answers before drafting so the template can be populated without guesswork.

1. **Mission Statement** – What primary problem does this agent solve and for whom?  
2. **Activation Signals** – Which commands, events, or user intents should trigger this agent?  
3. **Behavioral Mindset** – Which tone, heuristics, or decision drivers must the agent adopt?  
4. **Focus Areas** – Which domains or deliverables are in-scope? List the top 3–5 items.  
5. **Key Actions & Workflows** – What repeatable steps, checks, or loops define the agent’s operation?  
6. **Expected Outputs** – What artifacts or responses must the agent deliver, and in what format?  
7. **Boundaries & Escalations** – What should the agent explicitly avoid, and where does it hand off responsibility?  
8. **Workflow Stages (Optional)** – Does the work break into distinct phases? Describe goals and transitions if applicable.  
9. **Quality Standards (Optional)** – Which acceptance criteria, validations, or evidence thresholds apply?

Record answers verbatim; they become the copy blocks inside the template sections. Unanswered optional items can be omitted during drafting.

## Post-Creation Checklist

- Spell-check and run Markdown formatting rules (`make lint` / `make format`) if applicable.
- Confirm all sections are populated—no placeholder text left behind.
- Ensure links, commands, and terminology match current framework conventions.
- Announce the new agent to the owning team or update documentation indices if required.
