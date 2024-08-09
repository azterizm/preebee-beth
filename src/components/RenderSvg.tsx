import { cn } from '../utils/ui'

export interface RenderSvgProps {
  src: string
  class?: string
  alt?: string
  [x: string]: any
}

export default function RenderSvg(props: RenderSvgProps) {
  return (
    <img
      {...props}
      src={props.src}
      class={cn('w-icon', props.class || '')}
      alt={props.alt || ''}
      {...{ onload: 'SVGInject(this)' }}
    />
  )
}
