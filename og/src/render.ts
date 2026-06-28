function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function replaceAll(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (out, [key, value]) => out.replaceAll(`{{${key}}}`, value),
    template,
  )
}

export function renderTemplate(template: string, values: Record<string, string>): string {
  const escaped = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, escapeHtml(value)]),
  )
  return replaceAll(template, escaped)
}

/** Inject raw HTML/CSS fragments (already trusted template output). */
export function renderTemplateWithRaw(template: string, values: Record<string, string>): string {
  return replaceAll(template, values)
}
