export interface FeatureButtonProps {
  src?: string
  title: string
  href?: string
}

export default function FeatureButton(props: FeatureButtonProps) {
  return (
    <a
      href={props.href || '#'}
      class='flex flex-col justify-center items-center gap-2 bg-button p-4 rounded-lg h-full hover:bg-button/60 transition-colors'
      x-bind:class={`window.location.href.includes('${props.href}') ? 'bg-primary/40 pointer-events-none' : 'bg-button'`}
    >
      {props.src && <img src={props.src} alt='category icon' width='34' />}
      <span class='text-md font-semibold uppercase'>{props.title}</span>
    </a>
  )
}
