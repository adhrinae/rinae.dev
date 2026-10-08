# AGENTS.md

Lessons specific to rinae.dev. Generic working rules and lessons that apply to
other projects live in the global agent instructions.

## Lessons

<!-- Newest on top. Delete what no longer applies. -->

- When a user explicitly defers external behavior verification until after deployment, record it as a post-deployment follow-up and keep deployment authorization separate from ticket completion.
- When verifying Astro client scripts, accept inline module output as well as external bundles and use real Playwright CLI interactions to prove UI behavior before calling a script missing.
- When proposing a font provider, explicitly distinguish the build-time source from browser-time delivery and confirm external loading versus self-hosting before implementation.
- When the user asks to keep a ticket's verification plan and execution record in that ticket, update the ticket directly instead of creating PLAN.md.
- When a ticket's deliverable is a visual/style change, confirm the intended layout against a concrete reference (screenshot or mockup) before treating the restyle as done.
