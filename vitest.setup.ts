/** jsdom does not implement scrollIntoView — stub for component tests that step bytecode. */
if (typeof Element !== 'undefined' && typeof Element.prototype.scrollIntoView !== 'function') {
  Element.prototype.scrollIntoView = () => {}
}
