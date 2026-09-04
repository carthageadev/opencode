# Browser tool labels

This branch gives Code Mode browser calls readable labels in the session timeline.

The label uses the returned browser tab title. For example:

`tools.browser.screenshot` becomes `Took a screenshot of SNS ROMS - lolromsm`.

If a tab has no title, the label uses the target host. The UI also shows a photo icon for screenshots and a browser icon for other browser actions.

## Browser tool names

These are OpenCode tool names, not Puppeteer method names. They are available through Code Mode under `tools.browser`.

- Tabs: `tabs.list`, `tabs.open`, `tabs.focus`, `tabs.close`
- Navigation: `navigate`, `back`, `forward`, `reload`, `stop`, `frames`
- Observation: `snapshot`, `find`, `evaluate`, `wait`, `screenshot`
- Input: `click`, `hover`, `drag`, `fill`, `fill_form`, `select`, `check`, `press`, `scroll`, `dialog`
- Files: `files.upload`, `files.drop`, `files.list`, `files.get`
- Diagnostics: `console`, `network.list`, `network.get`
- Performance: `trace.start`, `trace.stop`, `trace.analyze`, `cpu.start`, `cpu.stop`, `cpu.analyze`
- Memory: `heap.snapshot`, `heap.summary`, `heap.query`, `heap.object`, `heap.compare`
- Audits: `lighthouse`

The source of truth is [`packages/plugin-browser/src/rpc.ts`](../../packages/plugin-browser/src/rpc.ts).

## Feature sources

- [PR #44838](https://github.com/anomalyco/opencode/pull/44838) added the desktop browser surface.
- [PR #46531](https://github.com/anomalyco/opencode/pull/46531) added the public browser plugin surface.
- [PR #46523](https://github.com/anomalyco/opencode/pull/46523) added desktop stability fixes used by the browser build.
- [PR #46530](https://github.com/anomalyco/opencode/pull/46530) added browser permission assertions.
