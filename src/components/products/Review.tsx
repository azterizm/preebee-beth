import { getRelativeTime } from '../../utils/date'
import { cn } from '../../utils/ui'
import RatingStars from '../RatingStars'

interface Props {
  rating: number
  by: string
  date: Date | string
  comment: string
  id: string
  canDelete?: boolean
  isDeleted?: boolean
}

export default function (props: Props) {
  return (
    <div
      class={cn(
        'p-2 border-2 border-primary rounded-lg relative',
        props.isDeleted ? 'bg-error/30 pointer-events-none' : 'bg-white',
      )}
      id={`review_${props.id}`}
    >
      <div class='flex items-center justify-between'>
        <p class='text-lg font-medium'>{props.by}</p>
        <p class='text-sm'>{getRelativeTime(props.date)}</p>
      </div>
      {props.comment
        ? (
          <p class='my-2'>
            {props.comment}
          </p>
        )
        : null}
      <div class='flex items-center justify-between'>
        <RatingStars rating={props.rating} />
        {props.canDelete
          ? (
            <form
              hx-delete={`/reviews/${props.id}`}
              hx-swap='outerHTML'
              hx-target={`#review_${props.id}`}
            >
              <button
                type='submit'
                class='btn btn-error'
              >
                Delete
              </button>
            </form>
          )
          : props.isDeleted
          ? <p class='text-sm text-red-700'>Deleted</p>
          : null}
      </div>
    </div>
  )
}
