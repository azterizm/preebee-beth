import { formatCurrency } from '../utils/data'
import { cn } from '../utils/ui'
import QuantityInput from './QuantityInput'
import RenderPrice from './RenderPrice'

interface Props {
  product: {
    id: string
    title: string
    price: number
    stockAcquired: number
  }
  cart: Record<string, string>
  disableQuantityChange?: boolean
  class?: string
}
export default function CartItem(
  { product, cart, disableQuantityChange, class: containerClass }: Props,
) {
  return (
    <div
      class={cn(
        'flex items-center gap-4 justify-between mr-4',
        containerClass,
      )}
      x-data={`{quantity:${cart[product.id] || product.stockAcquired}}`}
    >
      <div class='flex items-center gap-4 h-24'>
        <img
          src={`/product_main_image/${product.id}`}
          alt='product image'
          class='h-full aspect-square object-cover rounded-lg'
        />
        <div class='flex items-start flex-col justify-between h-full'>
          <a
            href={`/product/${product.id}`}
            class='font-medium hover:underline'
          >
            {product.title}
          </a>

          <div class='flex items-center gap-2'>
            <RenderPrice
              amount={product.price}
              x-text={`'Rs. ' + Intl.NumberFormat('en-US').format(quantity*${product.price})`}
            />
            <span
              x-cloak
              x-show='quantity>1'
              class='text-sm text-muted'
              x-transition
            >
              Rs. {formatCurrency(product.price)} per unit
            </span>
          </div>
        </div>
      </div>

      {disableQuantityChange
        ? <span>x{product.stockAcquired}</span>
        : (
          <QuantityInput
            removeData
            updateInApi
            productId={product.id}
            max={product.stockAcquired}
          />
        )}
    </div>
  )
}
