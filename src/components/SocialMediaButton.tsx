import _ from 'lodash'
import Button from './Button'

interface Props {
  link: string
  platform: string
}
export default function (r: Props) {
  return (
    <Button class='flex items-center' href={r.link}>
      <span class='mr-2'>
        Open {_.capitalize(r.platform)} page
      </span>
      <img
        src='/icons/arrow-up-right.svg'
        class='w-icon'
        alt='arrow up right'
      />
    </Button>
  )
}
