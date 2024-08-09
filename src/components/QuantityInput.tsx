export interface QuantityInputProps {
  removeData?: boolean
  max?: number
  updateInApi?: boolean
  productId?: string
}

export default function QuantityInput(props: QuantityInputProps) {
  return (
    <div
      class='flex items-center gap-2'
      x-data={props.removeData ? '' : '{quantity: 1}'}
      x-init={`$watch('quantity', (value) => quantity = value < 1 ? 1 : value > ${
        props.max || 99
      } ? ${props.max || 99} : value)`}
      id='quantity-input'
    >
      <button
        class='cursor-pointer bg-button rounded-full select-none w-10 h-10 text-center flex items-center justify-center active:brightness-75'
        x-on:click='quantity=Number(quantity)-1'
        {...(props.updateInApi
          ? {
            'hx-post': `/cart/update_quantity/${props.productId}`,
            'x-bind:hx-vals': 'JSON.stringify({quantity})',
            'hx-swap': 'none',
            'hx-trigger': 'click delay:800ms',
          }
          : {})}
      >
        <img src='/icons/minus.svg' alt='Minus' class='w-icon' />
      </button>
      <input
        type='number'
        name='quantity'
        id='quantity'
        class='text-lg font-semibold p-2 rounded-lg w-10 text-center bg-transparent'
        x-model='quantity'
        {...(props.updateInApi
          ? {
            'hx-post': `/cart/update_quantity/${props.productId}`,
            'hx-trigger': 'keyup changed delay:800ms',
            'hx-swap': 'none',
          }
          : {})}
      />
      <button
        class='cursor-pointer bg-button rounded-full select-none w-10 h-10 text-center flex items-center justify-center active:brightness-75'
        x-on:click='quantity=Number(quantity)+1'
        {...(props.updateInApi
          ? {
            'hx-post': `/cart/update_quantity/${props.productId}`,
            'x-bind:hx-vals': 'JSON.stringify({quantity})',
            'hx-swap': 'none',
            'hx-trigger': 'click delay:800ms',
          }
          : {})}
      >
        <img src='/icons/plus.svg' alt='Plus' class='w-icon' />
      </button>
    </div>
  )
}
