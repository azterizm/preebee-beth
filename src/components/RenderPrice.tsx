import _ from 'lodash'

import { cn } from '../utils/ui'

export interface RenderPriceProps {
  amount: number
  class?: string
  [x: string]: any
}

export default function RenderPrice(props: RenderPriceProps) {
  return (
    <span
      {..._.omit(props, ['omit'])}
      class={cn('text-lg font-semibold whitespace-nowrap', props.class)}
    >
      Rs. {Intl.NumberFormat('en-US').format(props.amount)}
    </span>
  )
}
