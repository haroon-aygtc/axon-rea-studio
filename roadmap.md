- [x] Add local practice challenges tied to the loaded code target.
- [x] Run isolated REA sessions with cancellation, evidence grading, and saved history.
- [x] Verify practice on uploaded code and run regression tests.
- [x] Authenticate AI endpoint and close unsafe server website fetching.
- [x] Validate tool requests, add consent and resource bounds, and pass 27 regression tests.
- [x] Add portable formatting, CI and environment guidance; remove 45 unused UI components and 39 dependencies.
- [x] Verify uploaded-code challenge creation, both sign-in gates, denied anonymous AI and disabled proxy; lint and preview pass.
- [ ] Signed-in AI and practice completion: blocked until an account exists; auth-session reported no users.
- [ ] Ignore local environment files: .gitignore is platform read-only; maintainer action required outside this sandbox.
- [ ] Choose redistribution license: requires owner's legal/license choice.
- [ ] Infrastructure-backed rate limiting: platform has no standard primitive; audit recommendations deferred per platform guidance.
- [ ] Full typed scanner/view migration, run persistence and asset extraction: conflicts with preserving the uploaded app; needs approval to replace that architecture.

- [x] React shell: landing with 3D hero and discovery map, studio workspace frame, dashboard, how-it-works, shared sign-in.
- [ ] Port studio screens (scanner, agent, practice, reports) to React one by one: next rounds, per agreed scope.

## Studio React rebuild
- [x] Engine: typed scanner/pipeline + global store (port of studio.html core).
- [x] Studio shell: layout, sidebar, meters, target launcher, one route per screen.
- [ ] Analysis + screens: PRD, user flow, data flow, structure, stack, architecture, reports/export.
- [ ] Agent + practice screens in React (port runTool / practice, tests on TS modules).
- [ ] Visual screens: operations floor, discovery map, second brain, all agents.
- [ ] Keep the classic studio reachable as fallback; verify end to end on sample target.
