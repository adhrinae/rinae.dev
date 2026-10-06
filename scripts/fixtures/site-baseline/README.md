# Site baseline fixtures

Captured baseline of the previous (Next.js) site that the migration regression
tests compare the Astro output against. These three files were originally
written to the local-only `docs/planning/reports/02-baseline/` tree, which is
gitignored, so a fresh checkout (and therefore CI) could not run the tests that
read them. They are tracked here so the full `pnpm test` suite runs everywhere.
