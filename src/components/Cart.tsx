export function Cart() {
  return (
    <div
      hx-get='/cart/list'
      hx-trigger='load,cartChange'
      hx-swap='innerHTML'
      class='bg-tint fixed top-0 right-0 p-8 w-full lg:w-1/2 h-full flex flex-col border-l-2 border-primary/30'
      id='cart'
      x-show='cartOpen'
      x-cloak
      {...{
        'x-on:click.outside': 'cartOpen=false',
      }}
      x-transition:enter='transition-transform ease duration-300'
      x-transition:enter-start='translate-x-full'
      x-transition:enter-end='translate-x-0'
      x-transition:leave='transition-transform ease-in duration-500'
      x-transition:leave-start='translate-x-0'
      x-transition:leave-end='translate-x-full'
    />
  )
}
