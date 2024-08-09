import Button from '../components/Button'
import { Cart } from '../components/Cart'
import FeatureButton from '../components/FeatureButton'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { BaseHtml } from '../components/root'
import { cn } from '../utils/ui'

interface Props {
  subCategories?: string[]
  category?: string
  subCategory?: string
}

export default (props: Props) => (
  <BaseHtml>
    <body x-data='init'>
      <Header />
      <div
        hx-boost="true"
        hx-push-url="true"
        class={cn(
          'flex items-center gap-4 my-4 flex-wrap',
          props.subCategories ? '' : 'h-24',
        )}
      >
        {props.subCategories?.length
          ? (
            <>
              <a href='/' class='btn'>
                <img
                  src='/icons/arrow-right.svg'
                  class='rotate-180'
                  width='20'
                  height='20'
                />
                Go back
              </a>
              {props.subCategories.map((category) => (
                <FeatureButton
                  href={'/category/' + props.category + '?subCategory=' +
                    encodeURIComponent(category)}
                  title={category}
                />
              ))}
            </>
          )
          : (
            <>
              <FeatureButton
                href='/category/makeup'
                src='/icons/brush.svg'
                title='Makeup'
              />
              <FeatureButton
                href='/category/skin_care'
                src='/icons/face.svg'
                title='Skin care'
              />
              <FeatureButton
                href='/category/hair_care'
                src='/icons/shower.svg'
                title='Hair care'
              />
              <Button
                href='/category'
                class='flex items-center gap-2 flex-1 justify-center h-full'
              >
                <span>More categories</span>
                <img
                  src='/icons/arrow-right.svg'
                  alt='arrow right'
                  class='w-icon'
                />
              </Button>
            </>
          )}
      </div>
      <div
        hx-post='/products_query'
        hx-target='this'
        hx-swap='outerHTML'
        hx-trigger='load'
        hx-vals={JSON.stringify({
          category: props.category || '',
          subCategory: props.subCategory || '',
        })}
      />
      <Cart />
      <Footer containerClass='mt-8' />
      <script>
        {`
            document.addEventListener('alpine:init', () => {
              Alpine.data('init', () => ({
                init() {

                  const hadPreviousCart = window.localStorage.getItem('hadItemsInCartBefore')
                  if (hadPreviousCart) {
                    window.localStorage.removeItem('hadItemsInCartBefore')
                    fetch('/cart/restore', {method: 'POST', credentials: 'include'}).then(() => window.location.reload())
                  } else {
                    const redirect = window.localStorage.getItem('redirect')
                    if (redirect) {
                      window.localStorage.removeItem('redirect')
                      setTimeout(() => {
                        window.location.href = redirect
                      }, 500)
                    }
                  }
                },
                cartOpen: false
              }))
            })
      `}
      </script>
    </body>
  </BaseHtml>
)
