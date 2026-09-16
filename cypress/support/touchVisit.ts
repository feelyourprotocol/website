/// <reference types="cypress" />

/**
 * Pixel-ish width plus no-hover matchMedia. Default Cypress/Electron still
 * reports (hover: hover) and (pointer: fine), so touch inline hints never mount.
 */
export function visitAsTouch(path: string) {
  cy.viewport(412, 915)
  cy.visit(path, {
    onBeforeLoad(win) {
      const native = win.matchMedia.bind(win)
      win.matchMedia = ((query: string) => {
        if (query === '(hover: hover) and (pointer: fine)') {
          return {
            matches: false,
            media: query,
            onchange: null,
            addListener() {},
            removeListener() {},
            addEventListener() {},
            removeEventListener() {},
            dispatchEvent() {
              return false
            },
          } as MediaQueryList
        }
        return native(query)
      }) as typeof win.matchMedia
    },
  })
}

export {}
