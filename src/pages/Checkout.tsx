import CartItem from '../components/CartItem'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { BaseHtml } from '../components/root'
import { formatCurrency } from '../utils/data'
import { cn } from '../utils/ui'

interface Props {
  cartItems: {
    id: string
    name: string
    price: number
    quantity: number
    shippingCost?: number
  }[]
  email?: string
  name?: string
  address?: string
  city?: string
  province?: string
  phone?: string
}
export default function (props: Props) {
  const hasInformation = Boolean(
    props.email &&
      props.name &&
      props.address &&
      props.city &&
      props.province &&
      props.phone,
  )
  return (
    <BaseHtml includeMaskPlugin>
      <body x-data='{}'>
        <Header minimal />
        <form
          action='/checkout/order'
          method='post'
          class='max-w-5xl mx-auto my-16'
        >
          <h1 class='text-3xl font-bold text-center mb-8'>
            Checkout
          </h1>
          <div class='grid grid-cols-2 gap-4'>
            <div class='col-span-1 space-y-8'>
              <div>
                <p class='text-xl font-bold'>Contact</p>
                <div class='flex flex-col space-y-4'>
                  <div class='form-control'>
                    <label for='email' class='label'>
                      <span class='label-text'>Email</span>
                    </label>
                    <input
                      required=''
                      type='email'
                      name='email'
                      class='input input-bordered'
                      placeholder='Type your email'
                      disabled
                      value={props.email}
                    />
                  </div>
                  <div class='form-control'>
                    <label for='phone' class='label'>
                      <span class='label-text'>Phone</span>
                    </label>
                    <input
                      required=''
                      type='text'
                      class='input input-bordered'
                      name='phone'
                      x-mask='0399 9999999'
                      placeholder='0312 3456789'
                      disabled={Boolean(props.phone)}
                      value={props.phone}
                    />
                  </div>
                </div>
              </div>
              <div>
                <p class='text-xl font-bold'>Shipping Address</p>
                <div class='flex flex-col space-y-4'>
                  <div class='form-control'>
                    <label for='name' class='label'>
                      <span class='label-text'>Name</span>
                    </label>
                    <input
                      required=''
                      type='text'
                      class='input input-bordered'
                      name='name'
                      placeholder='Type your name'
                      disabled={Boolean(props.name)}
                      value={props.name}
                    />
                  </div>
                  <div class='form-control'>
                    <label for='address' class='label'>
                      <span class='label-text'>Address</span>
                    </label>
                    <input
                      required=''
                      type='text'
                      class='input input-bordered'
                      name='address'
                      placeholder='Type your address'
                      disabled={Boolean(props.address)}
                      value={props.address}
                    />
                  </div>
                  <div class='grid grid-cols-2 gap-4'>
                    <div class='form-control'>
                      <label for='city' class='label'>
                        <span class='label-text'>
                          City
                        </span>
                      </label>
                      <input
                        type='text'
                        class='input input-bordered'
                        name='city'
                        placeholder='Karachi'
                        disabled={Boolean(props.city)}
                        value={props.city}
                      />
                    </div>
                    <div class='form-control'>
                      <label for='city' class='label'>
                        <span class='label-text'>Province</span>
                      </label>
                      <select
                        required=''
                        class='select select-bordered w-full'
                        name='province'
                        disabled={Boolean(props.province)}
                      >
                        <option
                          value='sindh'
                          {...(props.province === 'sindh'
                            ? { selected: 'true' }
                            : {})}
                        >
                          Sindh
                        </option>
                        <option
                          {...(props.province === 'punjab'
                            ? { selected: 'true' }
                            : {})}
                          value='punjab'
                        >
                          Punjab
                        </option>
                        <option
                          {...(props.province === 'balochistan'
                            ? { selected: 'true' }
                            : {})}
                          value='balochistan'
                        >
                          Balochistan
                        </option>
                        <option
                          {...(props.province === 'kpk'
                            ? { selected: 'true' }
                            : {})}
                          value='kpk'
                        >
                          KPK
                        </option>
                        <option
                          {...(props.province === 'islamabad'
                            ? { selected: 'true' }
                            : {})}
                          value='islamabad'
                        >
                          Islamabad
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class='col-span-1 space-y-4'>
              {props.cartItems.map((item) => (
                <CartItem
                  disableQuantityChange
                  product={{
                    id: item.id,
                    title: item.name,
                    price: item.price,
                    stockAcquired: item.quantity,
                  }}
                  cart={props.cartItems.reduce(
                    (acc, item) => ({
                      ...acc,
                      [item.id]: item.quantity,
                    }),
                    {},
                  )}
                />
              ))}
              <div class='flex flex-col w-full text-lg'>
                <div class='flex items-center justify-between'>
                  <span class='font-medium'>Subtotal</span>
                  <span class='font-semibold'>
                    Rs. {formatCurrency(
                      props.cartItems.reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0,
                      ),
                    )}
                  </span>
                </div>
                <div class='flex items-center justify-between'>
                  <span class='font-medium'>Delivery</span>
                  <span class='font-semibold'>
                    Rs. {formatCurrency(
                      props.cartItems.reduce(
                        (acc, item) => acc + (item.shippingCost || 0),
                        0,
                      ),
                    )}
                  </span>
                </div>
                <div class='h-1 divider bg-primary' />
                <div class='flex items-center justify-between'>
                  <span class='font-medium'>Total</span>
                  <span class='font-semibold'>
                    Rs. {formatCurrency(
                      props.cartItems.reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0,
                      ) + props.cartItems.reduce(
                        (acc, item) => acc + (item.shippingCost || 0),
                        0,
                      ),
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            class={cn(
              'flex mt-8',
              hasInformation ? 'justify-between' : 'justify-end',
            )}
          >
            {hasInformation && (
              <button
                x-on:click="
                $el.disabled = true;
                fetch('/checkout/reset', {
                  method: 'post'
                }).then(() => {
                  window.location.reload()
                })
                "
                type='button'
                class='btn btn-info'
              >
                Change Details
              </button>
            )}
            <button class='btn btn-primary'>Place Order</button>
          </div>
        </form>
        <Footer />
      </body>
    </BaseHtml>
  )
}
