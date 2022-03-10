import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const appealContainer = style({
  height: 112,
  marginBottom: theme.spacing[2],
})

export const appealInnerWrapper = style({
  display: 'grid',
  gridTemplateColumns: '2fr auto',
  columnGap: theme.spacing[2],
})

export const appealButton = style({
  maxHeight: theme.spacing[8],
})
