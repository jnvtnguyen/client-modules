export const propMap = {
  fontFamily: 'font-family',
  fontSize: 'font-size',
  fontWeight: 'font-weight',
  textAlign: 'text-align',
  letterSpacing: 'letter-spacing',
  lineHeight: 'line-height',
  fontStyle: 'font-style',
  margin: 'margin',
  padding: 'padding',
  borderWidth: 'border-width',
  borderStyle: 'border-style',
  borderColor: 'border-color',
  borderRadius: 'border-radius',
  display: 'display',
  overflow: 'overflow',
  overflowX: 'overflow-x',
  overflowY: 'overflow-y',
  position: 'position',
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
  zIndex: 'z-index',
} as const;

export type PropAlias = keyof typeof propMap;