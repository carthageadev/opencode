# Browser tool labels

This feature gives Code Mode browser calls readable labels in the session timeline.

The label uses the returned browser tab title and falls back to the target host. Examples include:

- `browser.screenshot` becomes `Took a screenshot of <page>` with a photo icon.
- `browser.navigate` becomes `Navigated to <page>` with a browser icon.

The raw Code Mode execution remains available by expanding the tool row.

The source of truth is `packages/session-ui/src/components/browser-tool-label.ts`. The `execute` renderer is registered in `packages/session-ui/src/components/message-part.tsx`.

This branch changes only the session UI. It does not replace or fork AnomalyCo's browser runtime. Keep the branch based on the latest `upstream/dev` and refresh the fork's `dev` branch from upstream before merging new feature work.
