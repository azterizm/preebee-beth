import {
  Ingredient,
  Product,
  Seller,
  SellerProfile,
  Social,
  SuitableFor,
} from '@prisma/client'
import _ from 'lodash'
import Breadcrumbs from '../components/Breadcrumbs'
import Button from '../components/Button'
import { Cart } from '../components/Cart'
import Header from '../components/Header'
import ProductCard from '../components/Product'
import Profile from '../components/Profile'
import QuantityInput from '../components/QuantityInput'
import RatingStars from '../components/RatingStars'
import RenderPrice from '../components/RenderPrice'
import SocialMediaButton from '../components/SocialMediaButton'
import { BaseHtml } from '../components/root'
import { cn } from '../utils/ui'
import shortNumber from 'short-number'
import Footer from '../components/Footer'
import RenderSvg from '../components/RenderSvg'
import { AuthUser } from '../types/api'

export interface Props {
  data: Product & {
    images: { id: string }[]
    seller: Seller & {
      profile: SellerProfile
      social: Social[]
    }
    ingredients: Ingredient[]
    suitableFor: SuitableFor[]
  }
  recommendedProducts: {
    id: string
    title: string
    price: number
    averageReview: number
  }[]
  reviewsCount: number
  user?: AuthUser
  isProductInCart?: boolean
  isFavorite?: boolean
}

export default (props: Props) => {
  const url = encodeURI(
    'website.com/product/' +
      props.data.id,
  )
  const title = encodeURI(
    props.data.title,
  )
  return (
    <BaseHtml stylesheets={['/styles/product_page.css']}>
      <body
        x-data={`{fullscreenImage:false,showShareDialog:false,cartOpen:false,selectedImageIndex:0,images:[${
          [
            `'/product_main_image/${props.data.id}'`,
            ...props.data.images.map((r) =>
              `'/product_image/${r.id}/${props.data.id}'`
            ),
          ].join(',')
        }]}`}
      >
        <Header />
        <Breadcrumbs
          lastLabel={props.data.title}
          links={[
            { name: 'Home', to: '/' },
            {
              name: props.data.category,
              to: '/category/' + props.data.category,
            },
            {
              name: props.data.subCategory,
              to: '/category/' + props.data.category + '?subCategory=' +
                encodeURIComponent(props.data.subCategory),
            },
          ]}
        />
        <div class='grid grid-cols-3 gap-8 my-8 w-full'>
          <div
            class='w-full relative group cursor-pointer'
            x-on:click='fullscreenImage=!fullscreenImage'
          >
            <img
              src={'/product_main_image/' + props.data.id}
              x-bind:src='images[selectedImageIndex]'
              alt=''
              class='w-full group-hover:brightness-75 transition-transform rounded-lg'
            />
            <img
              src='/icons/arrows-out.svg'
              alt='expand icon'
              class='w-16 md:w-20 lg:w-30 invert absolute top-1/4 md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:opacity-100 opacity-0 transition-opacity'
            />
          </div>
          <div class='flex items-start flex-col w-full col-span-2'>
            <div class='w-full'>
              <h1 safe class='text-2xl font-medium font-sans'>
                {props.data.title}
              </h1>
            </div>
            <div class='flex items-center gap-4 justify-end w-full'>
              <button class='cursor-pointer' x-on:click='showShareDialog=true'>
                <img
                  src='/icons/share.svg'
                  class='w-icon hover:brightness-75'
                  alt='share'
                />
              </button>

              <button
                class='like-button'
                x-data={`{isFav:${props.isFavorite},hover:false}`}
                x-on:click='isFav=!isFav'
                x-bind:class='{liked:isFav}'
                hx-post={`/favourite/${props.data.id}`}
                hx-trigger='click delay:500ms'
                hx-swap='none'
              >
                <span class='like-icon'>
                  <div class='heart-animation-1'></div>
                  <div class='heart-animation-2'></div>
                </span>
              </button>
            </div>
            <div class='flex items-start flex-col gap-2 mt-auto' id='quanity'>
              <span class='font-semibold text-lg'>
                Quantity{' '}
                <span class='text-sm'>
                  {props.data.stockAcquired > 0
                    ? `(max. ${props.data.stockAcquired})`
                    : ''}
                </span>
              </span>
              <QuantityInput max={props.data.stockAcquired} />
            </div>
            <div class='w-full mt-8'>
              <div class='flex items-center gap-4'>
                <RenderPrice amount={props.data.price} />
                <p
                  class={cn(
                    'px-5 py-2 rounded-full uppercase font-semibold text-sm',
                    props.data.stockAcquired > 0 ? 'bg-success' : 'bg-error',
                  )}
                >
                  {props.data.stockAcquired > 0 ? 'in stock' : 'out of stock'}
                </p>
              </div>
              <div class='w-full grid grid-cols-2 h-24 gap-2 mt-4'>
                <form
                  hx-post={`/cart/add/${props.data.id}`}
                  hx-swap='outerHTML'
                  hx-indicator='.loader'
                  hx-include='#quantity-input'
                  {...{
                    'hx-on::after-request':
                      'htmx.trigger("#cart" ,\'cartChange\')',
                  }}
                >
                  <Button class='w-full block h-full flex items-center justify-end gap-2 relative'>
                    <img
                      src={props.isProductInCart
                        ? '/icons/check.svg'
                        : '/icons/cart.svg'}
                      class='w-icon block'
                    />
                    <span class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 block'>
                      {props.isProductInCart ? 'Added to cart' : 'Add to cart'}
                    </span>
                    <span class='loader htmx-indicator'></span>
                  </Button>
                </form>
                <form
                  hx-post={`/cart/buy_now/${props.data.id}`}
                  hx-indicator='.loader'
                  hx-include='#quantity-input'
                >
                  <Button
                    type='submit'
                    class={cn(
                      'w-full flex items-center justify-center h-full',
                    )}
                  >
                    Buy now
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class='grid grid-cols-2 gap-2 my-8'>
          <div class='space-y-8'>
            <div class='flex items-center gap-2 flex-wrap mt-4'>
              <button
                x-on:click='selectedImageIndex=0'
                class='hover:contrast-150 hover:shadow-xl cursor-pointer hover:border-2 transition'
              >
                <img
                  src={'/product_main_image/' + props.data.id}
                  alt={`${props.data.title} main image`}
                  class='w-24 aspect-square object-cover rounded-lg bg-muted border-2 border-muted-primary'
                  x-bind:class="{'brightness-75':selectedImageIndex!=0}"
                />
              </button>
              {props.data.images.map((r, i) => (
                <button
                  x-on:click={`selectedImageIndex=${i + 1}`}
                  class='hover:contrast-150 cursor-pointer hover:border-2 transition-all duration-300'
                >
                  <img
                    src={'/product_image/' + r.id + '/' + props.data.id}
                    alt={`${props.data.title} ${i + 1} image`}
                    class='w-24 aspect-square object-cover rounded-lg bg-muted border-2 border-muted-primary'
                    x-bind:class={`{'brightness-75':selectedImageIndex!=${
                      i + 1
                    }}`}
                  />
                </button>
              ))}
            </div>

            {props.data.description
              ? (
                <div>
                  <h1 class='text-2xl mb-2'>Description</h1>
                  <p>
                    {!props.data.description ||
                        props.data.description === 'undefined'
                      ? 'No description was provided.'
                      : props.data.description}
                  </p>
                </div>
              )
              : null}
            {props.data.ingredients.length
              ? (
                <div>
                  <h1 class='text-2xl mb-2'>Ingredients</h1>
                  <p>
                    {new (Intl as any).ListFormat('en', {
                      type: 'conjunction',
                    }).format(
                      props.data.ingredients.map((r) => _.capitalize(r.name)),
                    )}
                  </p>
                </div>
              )
              : null}
            {props.data.suitableFor.length
              ? (
                <div>
                  <h1 class='text-2xl mb-2'>Who can use it?</h1>
                  <div class='flex w-full flex-col gap-2'>
                    {props.data.suitableFor.map((r) => (
                      <div class='flex items-center justify-between border-b-2 border-primary gap-2'>
                        <p class='font-medium capitalize'>{r.key}</p>
                        <p class='capitalize'>{r.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
              : null}
            <div>
              <h1 class='text-2xl mb-2'>Seller</h1>

              <Profile
                name={props.data.seller.name || 'Seller'}
                createdAt={props.data.seller.createdAt}
                imageURL={props.data.seller.profile.imageURL}
                href={'/seller/' + props.data.seller.id}
              />

              <div class='flex items-center flex-wrap mt-2 gap-2'>
                <Button
                  class='flex items-center'
                  href={'/seller/' + props.data.seller.id}
                >
                  <span class='mr-2'>See products</span>
                </Button>
                {props.data.seller.social.filter((r) => r.link && r.platform)
                  .map((r) => (
                    <SocialMediaButton link={r.link} platform={r.platform} />
                  ))}
              </div>
            </div>
            <div>
              <h1 class='text-2xl mb-2'>Reviews</h1>
              <div class='flex items-center'>
                <RatingStars
                  starClass='!w-10'
                  rating={props.data.averageReview}
                />
                <p class='text-sm ml-2'>
                  {shortNumber(props.reviewsCount)} people{' '}
                  {props.reviewsCount === 1 ? ' has' : ' have'} rated this
                </p>
              </div>

              <div
                hx-post={`/reviews/${props.data.id}`}
                hx-swap='innerHTML'
                hx-indicator='.loader'
                hx-trigger='load'
                id='reviews'
              />

              <span class='loader htmx-indicator'></span>

              <form
                hx-post='/reviews/new'
                class='my-4 mt-8 relative'
                x-data='{maxLength: 250}'
                hx-swap='beforebegin'
                hx-indicator='.loader'
                hx-trigger='submit'
                hx-target='#reviews_pagination'
                {...{
                  'hx-on::after-request': 'this.reset()',
                }}
              >
                <p class='mb-2 text-lg font-semibold'>Write your review</p>
                <textarea
                  disabled={!props.user}
                  class={cn(
                    'bg-button w-full p-2 rounded-lg border-primary border-2',
                    !props.user ? 'opacity-50' : '',
                  )}
                  x-bind:maxlength='maxLength'
                  rows='4'
                  placeholder={!props.user
                    ? ''
                    : 'Say something that will help other buyers...'}
                  x-data="{
                  resizeTextarea() {
                    $el.style.height = 'auto';
                    $el.style.height = `${$el.scrollHeight}px`
                  }
                }"
                  x-init='resizeTextarea()'
                  x-on:input='resizeTextarea()'
                  required='true'
                  minlength='10'
                  name='content'
                />
                <div class='flex items-center justify-between my-2 flex-col lg:flex-row'>
                  <RatingStars class='self-start' canSelect rating={0} />
                  <div class='flex items-center gap-2 self-end'>
                    <span class='text-sm font-medium'>
                      max <span x-text='maxLength'>250</span> characters
                    </span>
                    <Button
                      type='submit'
                      disabled={!props.user}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
                {!props.user && (
                  <a
                    href='/auth/login'
                    class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-3/4'
                  >
                    <span>Login to add a review on this product.</span>
                  </a>
                )}
                <input type='hidden' name='productId' value={props.data.id} />
              </form>
            </div>
          </div>
          <div class='grid grid-cols-2 gap-4 ml-8 h-fit'>
            {props.recommendedProducts
              .map((r) => (
                <ProductCard
                  forceMobileLayout
                  imageSrc={'/product_main_image/' + r.id}
                  price={r.price}
                  stars={r.averageReview}
                  title={r.title}
                  to={'/product/' + r.id}
                />
              ))
              .join('')}
          </div>
        </div>
        <div
          class='fixed top-0 left-0 w-screen h-screen'
          x-cloak
          x-show='showShareDialog'
          {...{ 'x-transition.opacity': '' }}
          style='background-color:hsla(54, 100%, 13%, 0.5);'
        >
          <div
            class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg bg-button flex items-center flex-col justify-center max-w-lg'
            {...{ 'x-on:click.outside': 'showShareDialog=false' }}
          >
            <p class='text-xl font-bold mb-4'>Where would you like to share?</p>
            <div class='flex items-center gap-4 flex-wrap justify-center'>
              {[
                {
                  name: 'Facebook',
                  link: `https://www.facebook.com/share.php?u=${url}`,
                  class: '!bg-[#4267B2]',
                },
                {
                  name: 'Twitter',
                  link: `http://twitter.com/share?&url=${url}&text=${title}`,
                  class: '!bg-[#1DA1F2]',
                },
                {
                  name: 'Reddit',
                  link:
                    `http://www.reddit.com/submit?url=${url}&title=${title}`,
                  class: '!bg-red-500',
                },
                {
                  name: 'WhatsApp',
                  link: `https://api.whatsapp.com/send?text=${title}: ${url}`,
                  class: '!bg-green-500',
                },
                {
                  name: 'Telegram',
                  link:
                    `https://telegram.me/share/url?url=${url}&text=${title}`,
                  class: '!bg-blue-500',
                },
              ]
                .map((r) => (
                  <Button
                    href={r.link}
                    class={cn('flex items-center !text-white', r.class)}
                  >
                    <span class='mr-2'>{r.name}</span>
                    <img
                      src='/icons/arrow-up-right-white.svg'
                      class='w-icon'
                      alt='arrow up right'
                    />
                  </Button>
                ))
                .join('')}
            </div>
            <button
              class='absolute top-4 right-4'
              x-on:click='showShareDialog=false'
            >
              <img src='/icons/close.svg' alt='close' class='w-icon' />
            </button>
          </div>
        </div>
        <Cart />
        <div
          x-show='fullscreenImage'
          x-transition
          class='fixed top-0 left-0 w-screen h-screen bg-black/50 backdrop-blur-lg'
          x-cloak
          x-bind:class="{'pointer-events-none':!fullscreenImage}"
        >
          <div class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <img
              src={'/product_main_image/' + props.data.id}
              x-bind:src='images[selectedImageIndex]'
              alt='product full screen image'
              class='w-full'
            />
          </div>
          <button
            x-on:click='fullscreenImage=false'
            class='absolute top-4 right-4'
          >
            <img
              class='invert w-16'
              src='/icons/close.svg'
              alt='close button'
            />
          </button>
          <button
            x-on:click='selectedImageIndex=selectedImageIndex==images.length-1?0:selectedImageIndex+1'
            class='absolute right-8 top-1/2 -translate-y-1/2'
          >
            <RenderSvg
              class='w-32 fill-white hover:scale-125 transition-transform'
              src='/icons/arrow-right.svg'
              alt='close button'
            />
          </button>
          <button
            x-on:click='selectedImageIndex=selectedImageIndex==0?images.length-1:selectedImageIndex-1'
            class='absolute left-4 top-1/2 -translate-y-1/2'
          >
            <RenderSvg
              class='w-32 rotate-180 fill-white transition-transform hover:scale-125'
              src='/icons/arrow-right.svg'
              alt='close button'
            />
          </button>
        </div>
        <Footer />
      </body>
    </BaseHtml>
  )
}
