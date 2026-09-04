import type { UiI18n } from "@opencode-ai/ui/context/i18n"
import type { IconProps } from "@opencode-ai/ui/icon"

export type BrowserToolInfo = {
  icon: IconProps["name"]
  title: string
}

type BrowserExecuteCall = {
  tool: string
  input?: Record<string, unknown>
}

type BrowserTab = {
  title?: string
  url?: string
}

function record(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value)
}

function browserOperation(tool: string) {
  const path = tool.startsWith("tools.") ? tool.slice("tools.".length) : tool
  if (!path.startsWith("browser.")) return undefined
  return path.slice("browser.".length)
}

function browserCalls(metadata: Record<string, unknown>) {
  if (!Array.isArray(metadata.toolCalls)) return []
  return metadata.toolCalls.filter((call): call is BrowserExecuteCall => {
    if (!record(call) || typeof call.tool !== "string") return false
    return (call.input === undefined || record(call.input)) && browserOperation(call.tool) !== undefined
  })
}

export function browserExecuteCall(metadata: Record<string, unknown>) {
  return browserCalls(metadata).at(-1)
}

function browserTab(value: unknown): BrowserTab | undefined {
  if (!record(value)) return undefined
  const candidate =
    record(value.tab) || typeof value.title === "string" || typeof value.url === "string"
      ? record(value.tab)
        ? value.tab
        : value
      : undefined
  if (record(candidate)) {
    return {
      title: typeof candidate.title === "string" ? candidate.title : undefined,
      url: typeof candidate.url === "string" ? candidate.url : undefined,
    }
  }

  if (Array.isArray(value.tabs)) {
    const tabs = value.tabs.filter(record)
    const focused = tabs.find((tab) => tab.id === value.focusedTabID)
    const selected = focused ?? tabs.at(-1)
    if (selected) return browserTab(selected)
  }

  if (record(value.value)) return browserTab(value.value)
  return undefined
}

function parseOutput(output: string | undefined) {
  if (!output) return undefined
  try {
    return JSON.parse(output) as unknown
  } catch {
    return undefined
  }
}

function text(value: unknown) {
  if (typeof value !== "string") return undefined
  const normalized = value.trim().replace(/\s+/g, " ")
  return normalized || undefined
}

function pageLabel(call: BrowserExecuteCall, output: string | undefined, i18n: Pick<UiI18n, "t">) {
  const tab = browserTab(parseOutput(output))
  const title = text(tab?.title)
  if (title) return title

  const url = text(tab?.url) ?? text(call.input?.url)
  if (url) {
    try {
      return new URL(url).hostname || url
    } catch {
      return url
    }
  }

  return i18n.t("ui.tool.browser.page")
}

export function browserToolInfo(
  metadata: Record<string, unknown>,
  output: string | undefined,
  i18n: Pick<UiI18n, "t">,
): BrowserToolInfo | undefined {
  const call = browserExecuteCall(metadata)
  if (!call) return undefined
  const operation = browserOperation(call.tool)
  if (!operation) return undefined
  const page = pageLabel(call, output, i18n)

  const title = (() => {
    switch (operation) {
      case "screenshot":
        return i18n.t("ui.tool.browser.screenshot", { page })
      case "tabs.list":
      case "tabs.focus":
      case "tabs.close":
        return i18n.t("ui.tool.browser.tabs")
      case "tabs.open":
        return i18n.t("ui.tool.browser.opened", { page })
      case "navigate":
        return i18n.t("ui.tool.browser.navigated", { page })
      case "back":
        return i18n.t("ui.tool.browser.back", { page })
      case "forward":
        return i18n.t("ui.tool.browser.forward", { page })
      case "reload":
        return i18n.t("ui.tool.browser.reloaded", { page })
      case "stop":
        return i18n.t("ui.tool.browser.stopped", { page })
      case "snapshot":
        return i18n.t("ui.tool.browser.read", { page })
      case "find":
        return i18n.t("ui.tool.browser.searched", { page })
      case "evaluate":
      case "frames":
        return i18n.t("ui.tool.browser.inspected", { page })
      case "wait":
        return i18n.t("ui.tool.browser.waited", { page })
      case "click":
        return i18n.t("ui.tool.browser.clicked", { page })
      case "hover":
        return i18n.t("ui.tool.browser.hovered", { page })
      case "drag":
        return i18n.t("ui.tool.browser.dragged", { page })
      case "fill":
      case "fill_form":
        return i18n.t("ui.tool.browser.filled", { page })
      case "select":
      case "check":
      case "press":
        return i18n.t("ui.tool.browser.interacted", { page })
      case "scroll":
        return i18n.t("ui.tool.browser.scrolled", { page })
      case "dialog":
        return i18n.t("ui.tool.browser.handled", { page })
      case "files.upload":
      case "files.drop":
      case "files.list":
      case "files.get":
        return i18n.t("ui.tool.browser.files", { page })
      case "console":
      case "network.list":
      case "network.get":
        return i18n.t("ui.tool.browser.inspected", { page })
      case "trace.start":
      case "trace.stop":
      case "trace.analyze":
      case "cpu.start":
      case "cpu.stop":
      case "cpu.analyze":
      case "heap.snapshot":
      case "heap.summary":
      case "heap.query":
      case "heap.object":
      case "heap.compare":
      case "lighthouse":
        return i18n.t("ui.tool.browser.analyzed", { page })
      default:
        return i18n.t("ui.tool.browser.action", { page })
    }
  })()

  return { icon: operation === "screenshot" ? "photo" : "window-cursor", title }
}
