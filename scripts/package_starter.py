"""Generate public Markdown and a starter ZIP using only standard libraries."""
import json
from pathlib import Path
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]
data = json.loads(subprocess.check_output(
    ['node', '-e', 'require("./content.js"); process.stdout.write(JSON.stringify(globalThis.KARYA_GUIDE));'],
    cwd=ROOT, text=True,
))
docs = [
    '# karya-api-build — The spec-driven build playbook',
    'A practical, project-neutral guide to building APIs with Claude Code.',
    'Define the outcome → clarify rules → design → break into tasks → implement → verify → maintain.',
    'Use the templates proportionally. All resource-booking examples are illustrative and use synthetic data.',
]
for index, step in enumerate(data['steps'], 1):
    docs.extend([f"## {index}. {step['title']}", step['intro'], f"### What to do\n\n{step['action']}"])
    if step.get('command'):
        docs.append(f"```sh\n{step['command']}\n```")
    docs.append(f"### Claude prompt\n\n```text\n{step['prompt']}\n```")
    if step.get('newPrompt'):
        docs.append(f"### Alternative prompt for a new project\n\n```text\n{step['newPrompt']}\n```")
    docs.extend([f"### Review checkpoint\n\n{step['checkpoint']}", f"**Output:** {step['output']}", f"**Field note:** {step['tip']}", f"[Official reference: {step['reference'][0]}]({step['reference'][1]})"])
docs.append('## Worked example: resource booking\n\nOne member reserves an available resource. Defer payments, recurring reservations, and real notifications. These scenarios describe expected behavior; they are not executed API calls or passing-test evidence.')
for scenario in data['scenarios'].values():
    docs.extend([f"### {scenario['id']}: {scenario['title']}", f"**Given** {scenario['given']}\n\n**When** {scenario['when']}\n\n**Then** {scenario['then']}", f"**Verification:** {scenario['test']}"])
docs.append('## Optional: GitHub Spec Kit\n\nAfter installing the Claude integration, run commands individually in Claude Code:\n\n```text\n/speckit-constitution\n/speckit-specify\n/speckit-clarify\n/speckit-plan\n/speckit-tasks\n/speckit-analyze\n/speckit-implement\n/speckit-converge\n```\n\nAdd `/speckit-checklist` when requirements need a deeper quality review. Review each output and keep one authoritative feature specification.\n\n[Claude integration](https://github.github.com/spec-kit/integrations/claude.html) · [Installation](https://github.github.com/spec-kit/installation.html)\n\nOfficial references checked 28 October 2026. This is an independent educational guide.')
guide = '\n\n'.join(docs) + '\n'
(ROOT / 'downloads').mkdir(exist_ok=True)
(ROOT / 'downloads/karya-api-build-guide.md').write_text(guide)

templates = {
    'README.md': '''# karya-api-build starter kit

Use this kit for one bounded API feature in your own repository. Review and adapt the draft templates before implementation. Keep your repository's existing IDs and artifact locations when available.

1. Start with the included guide and select one useful outcome.
2. Adapt CLAUDE.md to actual repository paths and commands.
3. Review spec.md, clarify decisions, and plan the technical approach.
4. Authorize bounded implementation tasks in handoff.md.
5. Implement and verify; record actual results in qa-report.md.

The BOOK-001 example is synthetic and illustrative. No code, executed tests, product approval, or production authorization is implied. These templates do not select a framework or cloud provider.
''',
    'CLAUDE.md': '''# karya-api-build working agreement

- Read the selected feature specification and relevant decisions before implementing.
- Feature artifacts live in docs/features/<FEATURE-ID>/; adapt to existing repository conventions.
- Reuse existing feature and acceptance IDs.
- Keep proposals separate from agreed decisions.
- Work in small, bounded, authorized increments.
- Link acceptance criteria to meaningful verification.
- Use synthetic development and test data.
- Report actual results as PASS, FAIL, NOT_RUN, or BLOCKED.
- Update affected specifications when behavior changes.
- Preserve unrelated user work.

## Repository commands

Discover build, test, lint, and development commands from the actual repository. Record verified commands here. No commands have been verified by this template.

## Sources and decisions

Link the actual product brief and architecture decisions here. Import @AGENTS.md only if the file exists and is relevant.
''',
    'docs/features/BOOK-001/spec.md': '''# BOOK-001 — Reserve an available resource

Status: Draft / illustrative
Owner: To be assigned

## Outcome and actor

A signed-in member reserves an available resource and receives a confirmation.

## Scope

Include availability, confirmation, capacity conflicts, and same-request replay.
Defer payments, recurring reservations, and real notifications.

## Preconditions and state model

Define the authorized actor, resource boundary, slot state, permitted transitions, and input rules before implementation.

## Proposed acceptance criteria

| ID | Expected outcome | Verification |
| --- | --- | --- |
| AC-BOOK-01 | An authorized valid request creates one confirmed reservation. | API/database integration |
| AC-BOOK-02 | Competing requests never exceed approved capacity. | Database-backed concurrency |
| AC-BOOK-03 | Same-key replay returns the original booking without a duplicate. | Idempotency integration |
| AC-BOOK-04 | An unauthorized actor receives no protected booking data. | Authorization negative cases |

## Failure and recovery behavior

Define recovery after a network loss with an uncertain commit outcome. Specify user messages and retained inputs if a UI is in scope.

## Open decisions

| Decision | Owner | Resolution |
| --- | --- | --- |
| Capacity and slot model | Product + Engineering | Pending |
| Actor/resource permissions | Product + Security | Pending |
| Idempotency scope, expiry, payload mismatch | Engineering + Product | Pending |
| Unauthorized response policy | Security + Engineering | Pending |
| Measurable quality targets | Product + Engineering | Pending |

## Traceability and review

Link technical-spec.md, handoff.md, implementation changes, and qa-report.md.
Record the actual scope decision, date, and owner when made.
''',
    'docs/features/BOOK-001/ux.md': '''# BOOK-001 — Interaction notes

Status: Draft; use only if an interface is in scope.

## Entry and preconditions

Document how the user reaches the feature and the required permissions.

## States

- Loading and empty availability.
- Slot selection and submission.
- Confirmed reservation.
- Capacity conflict.
- Unauthorized or expired session.
- Network failure and uncertain result recovery.

## Accessibility and recovery

Define labels, focus behavior, keyboard operation, error announcements, retained inputs, and deliberate retry behavior.
''',
    'docs/features/BOOK-001/technical-spec.md': '''# BOOK-001 — Technical design

Status: Draft

## Confirmed architecture and dependencies

Link actual decisions. Do not infer the stack from these templates.

## API and data contracts

Define request/response schemas, errors, ownership, validation, and authentication.

## Invariants and transactions

Explain capacity enforcement, idempotency, uniqueness, and competing requests at the authoritative data store.

## Authorization

Define actor, resource, and organization checks on the server.

## Failure and recovery

Specify bounded retries, uncertain outcomes, observability, and safe diagnostic data.

## Migrations and operational readiness

Assess compatibility, locking, rollback or forward recovery, and deployment prerequisites when affected.

## Verification mapping

Map AC-BOOK-01 through AC-BOOK-04 to concrete test cases and environments. Tests are planned until executed.
''',
    'docs/features/BOOK-001/handoff.md': '''# BOOK-001 — Implementation handoff

Status: Draft; implementation scope not yet authorized

## Scope and source

Link spec.md and technical-spec.md. Record the reviewed scope and actual authorization.

## Ordered tasks

| Task | Behavior / prerequisite | Acceptance IDs | Dependencies | Completion check | Status |
| --- | --- | --- | --- | --- | --- |
| T-01 | Define from the reviewed plan | TBD | TBD | TBD | Planned |

## Decisions and blockers

Record unresolved decisions, owners, and affected tasks. Continue independent authorized work when possible.

## Verification commands

Insert actual repository commands after inspection. Do not invent passing output.
''',
    'docs/features/BOOK-001/qa-report.md': '''# BOOK-001 — Verification evidence

Status: NOT_RUN
Environment: Not yet selected
Commit: Not yet implemented

| Acceptance ID | Test / method | Result | Evidence |
| --- | --- | --- | --- |
| AC-BOOK-01 | Planned integration test | NOT_RUN | None |
| AC-BOOK-02 | Planned concurrency test | NOT_RUN | None |
| AC-BOOK-03 | Planned replay test | NOT_RUN | None |
| AC-BOOK-04 | Planned authorization test | NOT_RUN | None |

## Commands and observed results

Record execution date, environment, exact command, result, and relevant evidence.

## Defects and remaining gaps

Record failures and unexecuted checks. Distinguish completed AI review from any independent human review still required.

## Acceptance and release

Record actual acceptance separately from production authorization and operational readiness.
''',
    'docs/decisions/README.md': '''# Architecture decisions

For each material decision, record context, considered options, the actual decision, owner/date, consequences, and affected feature IDs. Clearly label proposals and superseded decisions.
''',
    'guide.md': guide,
}
archive = ROOT / 'downloads/karya-api-build-starter.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as output:
    for filename, content in templates.items():
        info = zipfile.ZipInfo('karya-api-build-starter/' + filename, date_time=(2026, 10, 28, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o644 << 16
        output.writestr(info, content)
print(f'Generated guide and {len(templates)} starter files.')
