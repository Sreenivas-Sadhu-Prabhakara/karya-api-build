/* Public, project-neutral walkthrough content. */
globalThis.KARYA_GUIDE = {
  steps: [
    {
      id: 'baseline', short: 'Baseline', title: 'Know what you are building.', phase: 'DISCOVER',
      intro: 'Separate implemented behavior, agreed requirements, and open proposals. A useful baseline keeps the next feature grounded in the project you actually have.',
      action: 'Open Claude Code in the intended repository. Use Plan mode for this first inspection. For an existing project, inspect the real code and test setup; for a new project, bring in the selected product requirements and architecture decisions.',
      command: 'cd /path/to/karya-api-build\nclaude --permission-mode plan',
      prompt: 'Help me establish a spec-driven development baseline for karya-api-build.\n\nRead the repository instructions, product documents, architecture decisions, active feature documents, application code, and test setup.\n\nIdentify:\n1. Implemented behavior, supported by code.\n2. Agreed requirements and architecture decisions.\n3. Proposed or conflicting decisions.\n4. The smallest useful feature we could deliver next.\n\nCite the files supporting your findings. Ask only questions that materially affect scope or architecture. Do not change files yet.',
      newPrompt: 'Help me establish a spec-driven development baseline for a new project called karya-api-build.\n\nReview the product brief and any supplied requirements or architecture decisions. If they are missing, help me define the primary user, problem, intended outcome, and smallest useful API feature.\n\nSeparate agreed decisions from proposals. Present stack options against the actual requirements; do not silently select a framework, vendor, or service.\n\nIdentify the first feature, its dependencies, and the decisions needed before design. Do not generate application code or change files yet.',
      checkpoint: 'Confirm the intended product direction, architecture baseline, and first feature. Record open decisions explicitly instead of treating a proposal as settled.',
      output: 'A clear baseline and a candidate feature',
      tip: 'Plan mode is for inspection and proposals. Leave Plan mode when you are ready to authorize documentation edits.',
      reference: ['Claude Code: plan before editing', 'https://code.claude.com/docs/en/common-workflows#plan-before-editing']
    },
    {
      id: 'instructions', short: 'Instructions', title: 'Make context persistent.', phase: 'PREPARE',
      intro: 'Give Claude the instructions you would otherwise repeat at the start of every session. Keep the file short and point to detailed sources.',
      action: 'Create or refine CLAUDE.md at the repository root. Include the authoritative feature location, existing conventions, the agreed workflow, and real build and test commands. If the project already uses AGENTS.md, a CLAUDE.md import can reference it.',
      prompt: 'Create or refine the root CLAUDE.md for karya-api-build. This step is authorized for documentation changes only.\n\nInspect existing instructions first and preserve useful conventions. Include:\n- Where the authoritative requirements and architecture decisions live.\n- The feature workspace location and existing feature ID convention.\n- A requirement to read the selected spec before implementation.\n- Small, bounded implementation increments.\n- Acceptance-criterion-to-test traceability.\n- Synthetic development and test data.\n- Actual PASS, FAIL, NOT_RUN, or BLOCKED verification results.\n- Updating affected specifications when behavior changes.\n\nDiscover and verify build, test, and lint commands from the repository. If unavailable, mark them as unknown; do not invent commands.\n\nUse an @AGENTS.md import only if that file exists and is relevant. Keep CLAUDE.md concise.',
      checkpoint: 'Check every file path and command. Remove contradictory instructions and avoid copying the entire product or architecture document into CLAUDE.md.',
      output: 'A concise project working agreement',
      tip: 'Instructions guide Claude; they are not a technical enforcement mechanism. Use appropriate tool permissions and review actual changes.',
      reference: ['Claude Code: project instructions', 'https://code.claude.com/docs/en/memory']
    },
    {
      id: 'specify', short: 'Specify', title: 'Choose one complete outcome.', phase: 'SPECIFY',
      intro: 'Write the behavioral contract for a feature small enough to finish and demonstrate. The specification explains what the user can do and why it matters.',
      action: 'For the illustrative BOOK-001 feature, a signed-in member reserves an available resource. Include availability, confirmation, capacity conflicts, and same-request replay. Defer payments, recurring reservations, and real notifications.',
      prompt: 'Draft the specification for the selected resource-booking increment in karya-api-build.\n\nReuse the appropriate feature ID and existing template. If no template exists, use docs/features/BOOK-001/spec.md.\n\nDefine:\n- Primary user and intended outcome.\n- Preconditions, actor permissions, and resource boundaries.\n- Included and excluded behavior.\n- Main journey and failure or recovery paths.\n- Business rules and state transitions.\n- Acceptance criteria with stable IDs.\n- Dependencies and unresolved decisions.\n\nTreat illustrative examples as proposals, not approved requirements. Identify missing decisions rather than inventing them. Write only the feature specification.',
      checkpoint: 'Does this feature solve a real user problem? Can it be delivered as a complete, demonstrable increment? Confirm the scope and identify who owns unresolved decisions.',
      output: 'spec.md with scope and acceptance criteria',
      tip: 'Separate what the feature must do from how it will be implemented. Save deep implementation choices for the technical plan.',
      reference: ['Spec Kit: describing feature behavior', 'https://github.github.com/spec-kit/quickstart.html']
    },
    {
      id: 'clarify', short: 'Clarify', title: 'Make “correct” unambiguous.', phase: 'CLARIFY',
      intro: 'A good acceptance criterion describes an observable result. Work through specific examples until different developers would agree on what passes.',
      action: 'Examine the successful request, two members competing for the final place, a duplicate submission, unauthorized access, and a connection lost after a possible commit. Define recovery behavior as carefully as the happy path.',
      prompt: 'Review the selected feature specification for ambiguity.\n\nExamine concurrency, duplicate submissions, authorization, state transitions, and uncertain network outcomes.\n\nGive concrete examples where two developers could interpret the requirements differently. Identify decisions about capacity, idempotency scope and retention, error behavior, and resource visibility.\n\nResolve material questions with me, then update the acceptance criteria with stable IDs and objective expected outcomes. Link each criterion to a proposed verification method.\n\nDo not silently invent business rules or change application code.',
      checkpoint: 'For each acceptance criterion, explain what would make it pass or fail. Resolve the decisions that block a sound design and keep other assumptions visible.',
      output: 'Testable examples and resolved behavior',
      tip: '“Handle errors gracefully” is incomplete. Specify the message, retained input, available recovery action, and whether the operation might already have succeeded.',
      reference: ['Spec Kit: clarify before planning', 'https://github.github.com/spec-kit/quickstart.html']
    },
    {
      id: 'plan', short: 'Plan', title: 'Connect requirements to work.', phase: 'DESIGN',
      intro: 'Translate reviewed behavior into a technical approach and an ordered task list. Every requirement should have an implementation path and a way to verify it.',
      action: 'Use technical-spec.md for API contracts, data ownership, authorization, transaction boundaries, migrations, and recovery. Capture UI states in ux.md only when relevant. Put ordered implementation tasks in handoff.md.',
      prompt: 'Plan implementation of the reviewed feature in karya-api-build. Write documentation only.\n\nFollow the confirmed stack and existing architecture. Identify affected components, API contracts, database changes, authorization rules, transaction boundaries, failure handling, and migration or recovery needs.\n\nMap every acceptance criterion to its verification approach. Reuse repository test conventions.\n\nAdd ordered tasks to the handoff. Each task must identify the behavior or prerequisite it delivers, acceptance criteria, dependencies, and completion check.\n\nSurface material architecture decisions for review. Explain how the design prevents capacity violations and duplicate business effects. Introduce only the complexity the feature needs.',
      checkpoint: 'Check coverage, dependencies, and technical tradeoffs. Review the feature scope and design once, then authorize the bounded implementation tasks.',
      output: 'Technical design and an actionable handoff',
      tip: 'A cache check alone does not protect a booking invariant. The design must explain how the authoritative data store behaves under competing requests.',
      reference: ['Spec Kit: planning and task generation', 'https://github.github.com/spec-kit/quickstart.html']
    },
    {
      id: 'implement', short: 'Implement', title: 'Build the reviewed slice.', phase: 'BUILD',
      intro: 'Let Claude work through the authorized tasks and routine implementation decisions. Keep changes bounded by the specification and technical plan.',
      action: 'Implement a coherent increment, add meaningful tests, run the relevant checks, and inspect the diff. For a transactional API, verify concurrency and retries against a real test database where practical.',
      prompt: 'Implement the reviewed feature using its spec, technical design, and handoff.\n\nWork through the ordered, authorized tasks. Add meaningful tests for the acceptance criteria. Run the relevant checks and fix failures caused by this change.\n\nKeep changes within the selected scope and preserve unrelated user work. If an unresolved product or architecture decision blocks a task, explain that decision and continue independent authorized work.\n\nDo not weaken acceptance criteria to make a test pass.\n\nFinish with the behavior implemented, files changed, checks actually run and their results, and remaining gaps.',
      checkpoint: 'Inspect the code changes and actual test output. Confirm that the implementation satisfies the intended behavior and does not expand the feature scope.',
      output: 'Working code and real verification output',
      tip: 'A successful interface demo cannot prove concurrency or idempotency. Test those properties at the layer that enforces them.',
      reference: ['Claude Code: common development workflows', 'https://code.claude.com/docs/en/common-workflows']
    },
    {
      id: 'verify', short: 'Verify', title: 'Ask the evidence, not the checklist.', phase: 'VERIFY',
      intro: 'Return to the behavioral contract. For every acceptance criterion, identify the implementation and the evidence that the expected outcome occurred.',
      action: 'Use a fresh review session where helpful. Exercise the user journey, test denied and failure paths, and record relevant regression results. Mark missing execution as NOT_RUN rather than inferring a pass.',
      prompt: 'Review the implementation against the selected feature specification.\n\nFor every acceptance criterion, identify:\n- Relevant implementation.\n- Automated test or manual verification evidence.\n- PASS, FAIL, NOT_RUN, or BLOCKED.\n\nLook for missing behavior and regressions, particularly authorization, concurrency, retries, and recovery. Run the applicable checks where authorized and available.\n\nUpdate qa-report.md using actual evidence and precise remaining gaps. Do not infer success from completed task checkboxes. Distinguish your review from any independent human review still required.',
      checkpoint: 'Confirm acceptance based on evidence and the project’s review policy. Treat production deployment as a separate, explicitly authorized step with operational readiness checked.',
      output: 'qa-report.md linked to acceptance evidence',
      tip: 'A fresh AI review can expose missed assumptions. It does not replace required human or specialist review.',
      reference: ['Spec Kit: assess remaining implementation gaps', 'https://github.github.com/spec-kit/reference/agentic-sdd.html']
    },
    {
      id: 'maintain', short: 'Maintain', title: 'Keep intent and code together.', phase: 'EVOLVE',
      intro: 'Specifications are useful project memory when they reflect the intended behavior. Commit relevant documentation with code and tests, and update affected artifacts as requirements change.',
      action: 'A new rescheduling requirement changes booking states, capacity handling, permissions, interface behavior, and tests. Assess those impacts before implementation. Resume future sessions from the latest feature artifacts and evidence.',
      prompt: 'Read the selected feature’s spec, technical design, handoff, and latest QA report.\n\nSummarize verified progress and outstanding work, distinguishing planned checks from executed results. Continue the next authorized task.\n\nIf a requested change alters behavior, identify the affected acceptance criteria, API or data contracts, implementation, and tests. Update the affected specification and design after the changed behavior is agreed.\n\nPreserve stable feature and acceptance IDs, and record why material decisions changed. Keep unrelated artifacts untouched.',
      checkpoint: 'A future developer should be able to trace the requirement to its code and tests. Keep one authoritative behavioral contract for each feature and record superseded decisions.',
      output: 'A maintained contract for the next increment',
      tip: 'Use proportional documentation. A small correction can need a focused note, a small diff, and verification; it does not need a new architecture package.',
      reference: ['Spec Kit: adopting and maintaining specifications', 'https://github.github.com/spec-kit/guides/existing-projects.html']
    }
  ],
  scenarios: {
    success: {id: 'AC-BOOK-01', title: 'An available slot becomes one reservation.', given: 'A signed-in member is authorized and the slot has capacity.', when: 'The member submits a valid booking request.', then: 'Exactly one reservation is confirmed and its reference is returned.', request: 'POST /api/bookings\nIdempotency-Key: demo-request-001\n\n{\n  "resourceId": "room-01",\n  "slotId": "slot-001"\n}', response: '201 Created\n\n{\n  "bookingId": "booking-001",\n  "status": "confirmed"\n}', test: 'Integration check: one confirmed row, correct owner, and matching API response.'},
    capacity: {id: 'AC-BOOK-02', title: 'Two requests. One remaining place.', given: 'The slot has one remaining place and two authorized members.', when: 'Both submit different booking requests concurrently.', then: 'One request succeeds. The other receives an unavailable outcome. Capacity is never exceeded.', request: 'POST /api/bookings\n\nRequest A → slot-001\nRequest B → slot-001\n\nSubmitted concurrently', response: 'Request A → 201 Created\nRequest B → 409 Conflict\n\nWinner may vary.\nConfirmed count ≤ capacity.', test: 'Database-backed concurrency check: competing requests cannot exceed the configured slot capacity.'},
    retry: {id: 'AC-BOOK-03', title: 'A retry preserves the original result.', given: 'The original booking succeeded within the agreed replay window.', when: 'The same actor resends the same payload with the same idempotency key.', then: 'The original booking is returned and no second booking is created.', request: 'POST /api/bookings\nIdempotency-Key: demo-request-001\n\nSame authorized actor.\nSame request payload.\nWithin replay window.', response: 'Original booking returned\n\n{\n  "bookingId": "booking-001",\n  "status": "confirmed"\n}', test: 'Replay check: the booking ID and stored row count remain unchanged. Define key scope, expiry, and payload mismatch behavior in the spec.'},
    access: {id: 'AC-BOOK-04', title: 'An unrelated member sees no details.', given: 'A member has no permission to access the requested booking.', when: 'They request that booking by its identifier.', then: 'The API denies access without disclosing protected booking details.', request: 'GET /api/bookings/booking-001\n\nAuthenticated actor:\nmember-without-access', response: 'Access denied\n\nNo protected booking data.\nUse the agreed 403 or 404 policy\nconsistently.', test: 'Authorization check: cross-owner and cross-organization requests reveal no protected details.'}
  }
};
