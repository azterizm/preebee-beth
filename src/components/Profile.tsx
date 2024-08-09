import { getRelativeTime } from '../utils/date'

interface Props {
  name: string
  createdAt: string | Date
  imageURL: string
  href: string
}
export default function (props: Props) {
  return (
    <a
      href={props.href}
      class='flex items-center gap-2 justify-between'
    >
      <div class='flex items-start flex-col'>
        <p class='font-semibold'>{props.name}</p>
        <p class='text-sm'>
          Joined {getRelativeTime(props.createdAt)}
        </p>
      </div>
      <img
        src={props.imageURL}
        class='rounded-full w-16'
      />
    </a>
  )
}
