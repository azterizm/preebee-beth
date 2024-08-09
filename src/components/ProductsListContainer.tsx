import Html from '@kitajs/html'
import { cn } from '../utils/ui'

interface Props {
  children: Html.Children
  className?: string
}
export default function ProductsListContainer(
  { children, className }: Props,
) {
  return (
    <div
      class={cn(
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
