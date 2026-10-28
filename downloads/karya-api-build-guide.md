# karya-api-build — The spec-driven build playbook

A practical, project-neutral guide to building APIs with Claude Code.

Define the outcome → clarify rules → design → break into tasks → implement → verify → maintain.

Use the templates proportionally. All resource-booking examples are illustrative and use synthetic data.

## 1. Know what you are building.

Separate implemented behavior, agreed requirements, and open proposals. A useful baseline keeps the next feature grounded in the project you actually have.

### What to do

Open Claude Code in the intended repository. Use Plan mode for this first inspection. For an existing project, inspect the real code and test setup; for a new project, bring in the selected product requirements and architecture decisions.

```sh
cd /path/to/karya-api-build
claude --permission-mode plan
```

### Claude prompt

```text
Help me establish a spec-driven development baseline for karya-api-build.

Read the repository instructions, product documents, architecture decisions, active feature documents, application code, and test setup.

Identify:
1. Implemented behavior, supported by code.
2. Agreed requirements and architecture decisions.
3. Proposed or conflicting decisions.
4. The smallest useful feature we could deliver next.

Cite the files supporting your findings. Ask only questions that materially affect scope or architecture. Do not change files yet.
```

### Alternative prompt for a new project

```text
Help me establish a spec-driven development baseline for a new project called karya-api-build.

Review the product brief and any supplied requirements or architecture decisions. If they are missing, help me define the primary user, problem, intended outcome, and smallest useful API feature.

Separate agreed decisions from proposals. Present stack options against the actual requirements; do not silently select a framework, vendor, or service.

Identify the first feature, its dependencies, and the decisions needed before design. Do not generate application code or change files yet.
```

### Review checkpoint

Confirm the intended product direction, architecture baseline, and first feature. Record open decisions explicitly instead of treating a proposal as settled.

**Output:** A clear baseline and a candidate feature

**Field note:** Plan mode is for inspection and proposals. Leave Plan mode when you are ready to authorize documentation edits.

[Official reference: Claude Code: plan before editing](https://code.claude.com/docs/en/common-workflows#plan-before-editing)

## 2. Make context persistent.

Give Claude the instructions you would otherwise repeat at the start of every session. Keep the file short and point to detailed sources.

### What to do

Create or refine CLAUDE.md at the repository root. Include the authoritative feature location, existing conventions, the agreed workflow, and real build and test commands. If the project already uses AGENTS.md, a CLAUDE.md import can reference it.

### Claude prompt

```text
Create or refine the root CLAUDE.md for karya-api-build. This step is authorized for documentation changes only.

Inspect existing instructions first and preserve useful conventions. Include:
- Where the authoritative requirements and architecture decisions live.
- The feature workspace location and existing feature ID convention.
- A requirement to read the selected spec before implementation.
- Small, bounded implementation increments.
- Acceptance-criterion-to-test traceability.
- Synthetic development and test data.
- Actual PASS, FAIL, NOT_RUN, or BLOCKED verification results.
- Updating affected specifications when behavior changes.

Discover and verify build, test, and lint commands from the repository. If unavailable, mark them as unknown; do not invent commands.

Use an @AGENTS.md import only if that file exists and is relevant. Keep CLAUDE.md concise.
```

### Review checkpoint

Check every file path and command. Remove contradictory instructions and avoid copying the entire product or architecture document into CLAUDE.md.

**Output:** A concise project working agreement

**Field note:** Instructions guide Claude; they are not a technical enforcement mechanism. Use appropriate tool permissions and review actual changes.

[Official reference: Claude Code: project instructions](https://code.claude.com/docs/en/memory)

## 3. Choose one complete outcome.

Write the behavioral contract for a feature small enough to finish and demonstrate. The specification explains what the user can do and why it matters.

### What to do

For the illustrative BOOK-001 feature, a signed-in member reserves an available resource. Include availability, confirmation, capacity conflicts, and same-request replay. Defer payments, recurring reservations, and real notifications.

### Claude prompt

```text
Draft the specification for the selected resource-booking increment in karya-api-build.

Reuse the appropriate feature ID and existing template. If no template exists, use docs/features/BOOK-001/spec.md.

Define:
- Primary user and intended outcome.
- Preconditions, actor permissions, and resource boundaries.
- Included and excluded behavior.
- Main journey and failure or recovery paths.
- Business rules and state transitions.
- Acceptance criteria with stable IDs.
- Dependencies and unresolved decisions.

Treat illustrative examples as proposals, not approved requirements. Identify missing decisions rather than inventing them. Write only the feature specification.
```

### Review checkpoint

Does this feature solve a real user problem? Can it be delivered as a complete, demonstrable increment? Confirm the scope and identify who owns unresolved decisions.

**Output:** spec.md with scope and acceptance criteria

**Field note:** Separate what the feature must do from how it will be implemented. Save deep implementation choices for the technical plan.

[Official reference: Spec Kit: describing feature behavior](https://github.github.com/spec-kit/quickstart.html)

## 4. Make “correct” unambiguous.

A good acceptance criterion describes an observable result. Work through specific examples until different developers would agree on what passes.

### What to do

Examine the successful request, two members competing for the final place, a duplicate submission, unauthorized access, and a connection lost after a possible commit. Define recovery behavior as carefully as the happy path.

### Claude prompt

```text
Review the selected feature specification for ambiguity.

Examine concurrency, duplicate submissions, authorization, state transitions, and uncertain network outcomes.

Give concrete examples where two developers could interpret the requirements differently. Identify decisions about capacity, idempotency scope and retention, error behavior, and resource visibility.

Resolve material questions with me, then update the acceptance criteria with stable IDs and objective expected outcomes. Link each criterion to a proposed verification method.

Do not silently invent business rules or change application code.
```

### Review checkpoint

For each acceptance criterion, explain what would make it pass or fail. Resolve the decisions that block a sound design and keep other assumptions visible.

**Output:** Testable examples and resolved behavior

**Field note:** “Handle errors gracefully” is incomplete. Specify the message, retained input, available recovery action, and whether the operation might already have succeeded.

[Official reference: Spec Kit: clarify before planning](https://github.github.com/spec-kit/quickstart.html)

## 5. Connect requirements to work.

Translate reviewed behavior into a technical approach and an ordered task list. Every requirement should have an implementation path and a way to verify it.

### What to do

Use technical-spec.md for API contracts, data ownership, authorization, transaction boundaries, migrations, and recovery. Capture UI states in ux.md only when relevant. Put ordered implementation tasks in handoff.md.

### Claude prompt

```text
Plan implementation of the reviewed feature in karya-api-build. Write documentation only.

Follow the confirmed stack and existing architecture. Identify affected components, API contracts, database changes, authorization rules, transaction boundaries, failure handling, and migration or recovery needs.

Map every acceptance criterion to its verification approach. Reuse repository test conventions.

Add ordered tasks to the handoff. Each task must identify the behavior or prerequisite it delivers, acceptance criteria, dependencies, and completion check.

Surface material architecture decisions for review. Explain how the design prevents capacity violations and duplicate business effects. Introduce only the complexity the feature needs.
```

### Review checkpoint

Check coverage, dependencies, and technical tradeoffs. Review the feature scope and design once, then authorize the bounded implementation tasks.

**Output:** Technical design and an actionable handoff

**Field note:** A cache check alone does not protect a booking invariant. The design must explain how the authoritative data store behaves under competing requests.

[Official reference: Spec Kit: planning and task generation](https://github.github.com/spec-kit/quickstart.html)

## 6. Build the reviewed slice.

Let Claude work through the authorized tasks and routine implementation decisions. Keep changes bounded by the specification and technical plan.

### What to do

Implement a coherent increment, add meaningful tests, run the relevant checks, and inspect the diff. For a transactional API, verify concurrency and retries against a real test database where practical.

### Claude prompt

```text
Implement the reviewed feature using its spec, technical design, and handoff.

Work through the ordered, authorized tasks. Add meaningful tests for the acceptance criteria. Run the relevant checks and fix failures caused by this change.

Keep changes within the selected scope and preserve unrelated user work. If an unresolved product or architecture decision blocks a task, explain that decision and continue independent authorized work.

Do not weaken acceptance criteria to make a test pass.

Finish with the behavior implemented, files changed, checks actually run and their results, and remaining gaps.
```

### Review checkpoint

Inspect the code changes and actual test output. Confirm that the implementation satisfies the intended behavior and does not expand the feature scope.

**Output:** Working code and real verification output

**Field note:** A successful interface demo cannot prove concurrency or idempotency. Test those properties at the layer that enforces them.

[Official reference: Claude Code: common development workflows](https://code.claude.com/docs/en/common-workflows)

## 7. Ask the evidence, not the checklist.

Return to the behavioral contract. For every acceptance criterion, identify the implementation and the evidence that the expected outcome occurred.

### What to do

Use a fresh review session where helpful. Exercise the user journey, test denied and failure paths, and record relevant regression results. Mark missing execution as NOT_RUN rather than inferring a pass.

### Claude prompt

```text
Review the implementation against the selected feature specification.

For every acceptance criterion, identify:
- Relevant implementation.
- Automated test or manual verification evidence.
- PASS, FAIL, NOT_RUN, or BLOCKED.

Look for missing behavior and regressions, particularly authorization, concurrency, retries, and recovery. Run the applicable checks where authorized and available.

Update qa-report.md using actual evidence and precise remaining gaps. Do not infer success from completed task checkboxes. Distinguish your review from any independent human review still required.
```

### Review checkpoint

Confirm acceptance based on evidence and the project’s review policy. Treat production deployment as a separate, explicitly authorized step with operational readiness checked.

**Output:** qa-report.md linked to acceptance evidence

**Field note:** A fresh AI review can expose missed assumptions. It does not replace required human or specialist review.

[Official reference: Spec Kit: assess remaining implementation gaps](https://github.github.com/spec-kit/reference/agentic-sdd.html)

## 8. Keep intent and code together.

Specifications are useful project memory when they reflect the intended behavior. Commit relevant documentation with code and tests, and update affected artifacts as requirements change.

### What to do

A new rescheduling requirement changes booking states, capacity handling, permissions, interface behavior, and tests. Assess those impacts before implementation. Resume future sessions from the latest feature artifacts and evidence.

### Claude prompt

```text
Read the selected feature’s spec, technical design, handoff, and latest QA report.

Summarize verified progress and outstanding work, distinguishing planned checks from executed results. Continue the next authorized task.

If a requested change alters behavior, identify the affected acceptance criteria, API or data contracts, implementation, and tests. Update the affected specification and design after the changed behavior is agreed.

Preserve stable feature and acceptance IDs, and record why material decisions changed. Keep unrelated artifacts untouched.
```

### Review checkpoint

A future developer should be able to trace the requirement to its code and tests. Keep one authoritative behavioral contract for each feature and record superseded decisions.

**Output:** A maintained contract for the next increment

**Field note:** Use proportional documentation. A small correction can need a focused note, a small diff, and verification; it does not need a new architecture package.

[Official reference: Spec Kit: adopting and maintaining specifications](https://github.github.com/spec-kit/guides/existing-projects.html)

## Worked example: resource booking

One member reserves an available resource. Defer payments, recurring reservations, and real notifications. These scenarios describe expected behavior; they are not executed API calls or passing-test evidence.

### AC-BOOK-01: An available slot becomes one reservation.

**Given** A signed-in member is authorized and the slot has capacity.

**When** The member submits a valid booking request.

**Then** Exactly one reservation is confirmed and its reference is returned.

**Verification:** Integration check: one confirmed row, correct owner, and matching API response.

### AC-BOOK-02: Two requests. One remaining place.

**Given** The slot has one remaining place and two authorized members.

**When** Both submit different booking requests concurrently.

**Then** One request succeeds. The other receives an unavailable outcome. Capacity is never exceeded.

**Verification:** Database-backed concurrency check: competing requests cannot exceed the configured slot capacity.

### AC-BOOK-03: A retry preserves the original result.

**Given** The original booking succeeded within the agreed replay window.

**When** The same actor resends the same payload with the same idempotency key.

**Then** The original booking is returned and no second booking is created.

**Verification:** Replay check: the booking ID and stored row count remain unchanged. Define key scope, expiry, and payload mismatch behavior in the spec.

### AC-BOOK-04: An unrelated member sees no details.

**Given** A member has no permission to access the requested booking.

**When** They request that booking by its identifier.

**Then** The API denies access without disclosing protected booking details.

**Verification:** Authorization check: cross-owner and cross-organization requests reveal no protected details.

## Optional: GitHub Spec Kit

After installing the Claude integration, run commands individually in Claude Code:

```text
/speckit-constitution
/speckit-specify
/speckit-clarify
/speckit-plan
/speckit-tasks
/speckit-analyze
/speckit-implement
/speckit-converge
```

Add `/speckit-checklist` when requirements need a deeper quality review. Review each output and keep one authoritative feature specification.

[Claude integration](https://github.github.com/spec-kit/integrations/claude.html) · [Installation](https://github.github.com/spec-kit/installation.html)

Official references checked 28 October 2026. This is an independent educational guide.
