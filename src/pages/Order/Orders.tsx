import { Cart } from '../../components/Cart'
import Footer from '../../components/Footer'
import Header from '../../components/Header'
import { BaseHtml } from '../../components/root'
import { getUserOrders } from '../../models/order'
import { DBResult } from '../../types/api'

interface Props {
  data: DBResult<typeof getUserOrders>
}

export default function({ data }: Props) {
  return (
    <BaseHtml>
      <body x-data='{cartOpen:false}'>
        <Header hidePackages />
        <div class='my-4 min-h-screen'>
          <a href='/' class='btn'>
            <img
              src='/icons/arrow-right.svg'
              alt='go back icon'
              class='rotate-180 fill-white'
              width='20'
              height='20'
            />
            Go back
          </a>

          <h1 class='text-2xl font-bold text-center'>Orders</h1>

          <div class='overflow-x-auto mt-4'>
            {data.length === 0
              ? <p class='text-center mb-4'>You have no orders</p>
              : null}
            <table class='table'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Payment Status</th>
                  <th>Reason</th>
                  <th>Products</th>
                  <th>Ordered At</th>
                </tr>
              </thead>
              <tbody>
                {data.map((order, i) => (
                  <tr>
                    <td>{i + 1}</td>
                    <td>{order.paymentStatus}</td>
                    <td>{order.reason}</td>
                    <td>
                      <ul>
                        {order.productsOrdered.map((product) => (
                          <li class='flex items-center gap-2 justify-between'>
                            <a
                              class='hover:underline'
                              href={`/product/${product.product.id}`}
                            >
                              {product.product.title} x {product.quantity}
                            </a>
                            <p>{product.packageStatus}</p>
                            {product.reason ? <p>{product.reason}</p> : null}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
        <Cart />
      </body>
    </BaseHtml>
  )
}
