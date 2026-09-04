import { describe, expect, test } from "bun:test"
import type { UiI18n } from "@opencode-ai/ui/context/i18n"
import { browserToolInfo } from "./browser-tool-label"

const templates: Record<string, string> = {
  "ui.tool.browser.page": "the browser page",
  "ui.tool.browser.screenshot": "Took a screenshot of {{page}}",
  "ui.tool.browser.tabs": "Managed browser tabs",
  "ui.tool.browser.opened": "Opened {{page}}",
  "ui.tool.browser.navigated": "Navigated to {{page}}",
  "ui.tool.browser.action": "Used browser on {{page}}",
}

const i18n = {
  t: ((key: string, params?: Record<string, string | number | boolean>) =>
    (templates[key] ?? key).replace(/{{\s*([^}]+?)\s*}}/g, (_, name) => String(params?.[name] ?? ""))) as UiI18n["t"],
} satisfies Pick<UiI18n, "t">

describe("browser tool labels", () => {
  test("uses the returned tab title for screenshots", () => {
    const info = browserToolInfo(
      { toolCalls: [{ tool: "browser.screenshot", status: "completed", input: { tabID: "tab_1" } }] },
      JSON.stringify({ tab: { title: "SNS ROMS - lolromsm", url: "https://example.com" }, files: [] }),
      i18n,
    )

    expect(info).toEqual({ icon: "photo", title: "Took a screenshot of SNS ROMS - lolromsm" })
  })

  test("falls back to the target host when no title is returned", () => {
    const info = browserToolInfo(
      { toolCalls: [{ tool: "tools.browser.navigate", status: "completed", input: { url: "https://github.com" } }] },
      undefined,
      i18n,
    )

    expect(info?.title).toBe("Navigated to github.com")
  })
})
