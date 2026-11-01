<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- The studio lives in public/studio.html (embedded by src/routes/studio.tsx via features/studio/studio-frame); extensions go in public/studio-suite.js/.css, which read the studio globals (S, running) instead of editing the original script. Why: keeps the uploaded app intact until each screen is ported to React.
- React UI layout: src/components/{ui,layout,motion,brand,three} hold reusable pieces, src/features/<area> holds feature components and hooks, src/content holds static copy/data, routes only compose. Why: keeps pages thin and pieces reusable.
- three.js scenes are lazy modules behind ClientOnly (components/three/lazy-scene.tsx) and read colors from three/palette.ts mirroring the CSS tokens. Why: three must not load during SSR and WebGL cannot read oklch tokens.
- Sign-in state and the sign-in dialog live in features/auth/auth-provider (root); the studio bridge asks it for sign-in and a React consent dialog. Why: one session source for every page and the embedded studio.
- REA agent: the model runs one step per request in /api/rea-agent (src/lib/rea-agent.server.ts); its tools run in the browser (studio-suite.js runTool) on the loaded files and results are sent back. Why: files stay local, only requested snippets leave the device.
- Website targets download in the browser through src/lib/rea-website.ts with CORS, no redirects, no credentials and bounded bytes; /api/rea-fetch fails closed. Why: the server runtime cannot securely pin arbitrary resolved destinations, so it must not act as a URL proxy.
- Practice uses isolated browser-side sessions and local challenge/history storage; expected answers are never included in agent requests. Why: evaluate the existing agent without leaking the answer key or claiming model fine-tuning.
- The parent React shell provides a same-origin bridge for authenticated AI, explicit sharing consent and shared Zod tool validation; raw AI routes independently verify bearer claims. Why: keep the uploaded studio intact without leaving paid AI anonymously accessible.
- Tool contracts live in src/lib/rea-contract.ts and are validated on both sides; browser pure safety helpers retain marked test boundaries in studio-suite.js. Why: catch boundary regressions without a disruptive rewrite of the original application.
- Keep only UI dependencies actually referenced by the app; generated authentication modules and the managed server runtime must remain. Why: reduce orphan scaffolding without breaking platform integration.
