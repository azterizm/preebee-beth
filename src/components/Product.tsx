
import { cn } from '../utils/ui'
import RatingStars from './RatingStars'
import RenderPrice from './RenderPrice'

export interface ProductProps {
  imageSrc: string
  to: string
  title: string
  price: number
  stars: number
  bottomClass?: string
  containerClass?: string
  forceMobileLayout?: boolean
}

export default function ProductCard(props: ProductProps) {
  return (
    <a
      href={props.to}
      class={cn(
        'rounded-lg bg-button w-full block h-max hover:brightness-90',
        props.containerClass,
      )}
    >
      <img
        src={props.imageSrc}
        alt={props.title}
        class='w-full aspect-square object-cover rounded-lg'
      />
      <div class='p-4'>
        <p class='font-medium mb-2'>{props.title}</p>
        <div
          class={cn(
            'flex items-center justify-between gap-4 flex-col',
            props.bottomClass,
            props.forceMobileLayout ? '' : 'md:flex-row',
          )}
        >
          <RatingStars class='self-start' rating={props.stars} />
          <RenderPrice class='self-end' amount={props.price} />
        </div>
      </div>
    </a>
  )
}
