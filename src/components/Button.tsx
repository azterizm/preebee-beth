import Html from '@kitajs/html'
import { cn } from '../utils/ui'

export interface ButtonProps {
  class?: string
  [x: string]: any
  children?: Html.Children
  href?: string
}

export default function Button(props: ButtonProps) {
  const className = cn(
    'uppercase font-semibold px-6 py-2 rounded-lg bg-button hover:brightness-90',
    props.class,
  )
  if (props.href) {
    return (
      <a {...props} href={props.href} class={className}>
        {props.children}
      </a>
    )
  }
  return (
    <button {...props} class={className}>
      {props.children}
    </button>
  )
}
