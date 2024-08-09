import { cn } from '../utils/ui'

export interface RatingStarsProps {
  rating: number
  class?: string
  canSelect?: boolean
  starClass?: string
}

export default function RatingStars(props: RatingStarsProps) {
  return (
    <div
      class={cn(
        'flex items-center gap-0 text-primary-foreground [&>svg]:mr-1',
        props.class,
      )}
      x-data={`{rating:${props.rating},setRating:0}`}
    >
      {new Array(5)
        .fill(null)
        .map((_, i) =>
          props.rating > i && props.rating < i + 1
            ? (
              <img
                src='/icons/star-half.svg'
                alt='star'
                class={cn(
                  'w-icon',
                  props.canSelect ? 'cursor-pointer' : '',
                  props.starClass,
                )}
                x-on:mouseover={!props.canSelect ? '' : 'rating=' + (i + 1)}
                x-on:mouseout={!props.canSelect ? '' : 'rating=setRating'}
                x-on:click={!props.canSelect ? '' : 'setRating=' + (i + 1)}
                x-bind:src={`rating>${i}&&rating<${
                  i + 1
                }?'/icons/star-fill.svg':'/icons/star-half.svg'`}
              />
            )
            : (
              <img
                x-on:mouseover={!props.canSelect ? '' : 'rating=' + (i + 1)}
                x-on:mouseout={!props.canSelect ? '' : 'rating=setRating'}
                x-on:click={!props.canSelect ? '' : 'setRating=' + (i + 1)}
                x-bind:src={`rating>=${
                  i + 1
                }?'/icons/star-fill.svg':'/icons/star.svg'`}
                src='/icons/star.svg'
                alt='star'
                class={cn(
                  'w-icon',
                  props.canSelect ? 'cursor-pointer' : '',
                  props.starClass,
                )}
              />
            )
        )
        .join('')}
      {props.canSelect
        ? <input type='hidden' name='stars' x-model='setRating' />
        : null}
    </div>
  )
}
