
import CartItem from '../../components/CartItem'
import Header from '../../components/Header'
import { BaseHtml } from '../../components/root'

interface Props {
  data: {
    id: string
    title: string
    quantity: number
    price: number
  }[]
}
export default function (props: Props) {
  return (
    <BaseHtml>
      <body>
        <Header />
        <div class='container mx-auto my-16'>
          <h1 class='text-center text-4xl font-bold'>Order</h1>
          <p class='text-center mt-2'>
            Your order has been placed.
          </p>
          <div class='space-y-4 mt-8'>
            {props.data.map((item) => (
              <CartItem
                class='bg-muted/30 p-4 rounded-lg'
                product={{
                  title: item.title,
                  id: item.id,
                  price: item.price,
                  stockAcquired: item.quantity,
                }}
                disableQuantityChange
                cart={{}}
              />
            ))}
          </div>

          <div class='flex items-center justify-center gap-4 mt-8'>
            <a href='/' class='btn btn-primary'>Go home</a>
            <a href='/orders' class='btn btn-info'>Check orders</a>
          </div>
        </div>
      </body>
    </BaseHtml>
  )
}
