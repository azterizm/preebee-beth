import { cn } from '../utils/ui'

export interface BreadcrumbsProps {
  links: { to: string; name: string }[]
  lastLabel?: string
}

export default function Breadcrumbs(props: BreadcrumbsProps) {
  return (
    <nav class='flex mt-8 mb-4' aria-label='Breadcrumb'>
      <ol class='inline-flex items-center space-x-1 md:space-x-3'>
        {props.links.map((link, i) => (
          <li class={cn(i ? '' : 'inline-flex items-center')}>
            <div class='flex items-center'>
              {i
                ? (
                  <img
                    src='/icons/breadcrumb_separator.svg'
                    alt='Breadcrumb separator'
                    class='w-4 mx-2'
                  />
                )
                : null}
              <a
                href={link.to}
                class={cn(
                  i
                    ? 'ml-1 text-sm font-medium text-black hover:text-secondary-foreground md:ml-2'
                    : 'inline-flex items-center text-sm font-medium text-black hover:text-secondary-foreground',
                  'whitespace-nowrap capitalize',
                )}
              >
                {link.name.replace('_', ' ')}
              </a>
            </div>
          </li>
        ))}
        <li aria-current='page'>
          <div class='flex items-center'>
            <img
              src='/icons/breadcrumb_separator.svg'
              alt='Breadcrumb separator'
              class='w-4 mx-2'
            />
            <span class='ml-1 text-sm font-medium text-secondary-foreground md:ml-2'>
              {props.lastLabel}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  )
}
