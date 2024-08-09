import { SELLER_APP_ENDPOINT } from '../constants/app'
import { cn } from '../utils/ui'
import Button from './Button'
import { Logo } from './Logo'

interface Props {
  minimal?: boolean
  hidePackages?: boolean
}

export default function Header(props: Props) {
  return (
    <div
      class={cn(
        'flex items-center justify-between gap-4',
        props.minimal ? 'mt-4' : '',
      )}
    >
      <div class='flex items-center gap-8'>
        <Logo />
        {!props.minimal && (
          <div class='flex items-center gap-2 bg-button px-5 py-3 rounded-full'>
            <img
              src='/icons/magnifying-glass.svg'
              width='24'
              height='24'
              alt='Magnifying glass'
            />
            <input
              type='text'
              name='search'
              id='search'
              placeholder='Search...'
              class='placeholder:text-muted bg-button border-none outline-none'
            />
          </div>
        )}
      </div>
      <div class='flex items-center gap-8'>
        {!props.minimal && (
          <Button href={SELLER_APP_ENDPOINT}>Become a seller</Button>
        )}
        <div
          hx-get='/auth/header_user'
          hx-swap='outerHTML'
          hx-trigger='load'
        >
          <div class='w-6 h-6 rounded-full bg-primary animate-pulse' />
        </div>

        {!props.minimal && (
          <>
            <a
              href='/favourite'
              class='tooltip'
              data-tip='Favourites or Wishlist'
            >
              <img
                src='/icons/heart.svg'
                width='24'
                height='24'
                alt='Favourites'
              />
            </a>
            {props.hidePackages
              ? null
              : (
                <a href='/orders' class='relative tooltip' data-tip='Orders'>
                  <img
                    src='/icons/package.svg'
                    width='24'
                    height='24'
                    alt='Packages'
                    class='rounded-full'
                  />
                  <div
                    hx-get='/orders/count'
                    hx-swap='outerHTML'
                    hx-trigger='load'
                  />
                </a>
              )}
            <button
              x-on:click='cartOpen=!cartOpen'
              class='tooltip'
              data-tip='Cart'
            >
              <img src='/icons/cart.svg' width='24' height='24' alt='Cart' />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
