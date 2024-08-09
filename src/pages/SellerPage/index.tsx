import { Product, Seller, SellerProfile, Social } from '@prisma/client'
import Breadcrumbs from '../../components/Breadcrumbs'
import { Cart } from '../../components/Cart'
import Header from '../../components/Header'
import Profile from '../../components/Profile'
import SocialMediaButton from '../../components/SocialMediaButton'
import { BaseHtml } from '../../components/root'
import ListFilterSection from './ListFilterSection'
import Footer from '../../components/Footer'

interface Props {
  previousProduct?: Product
  seller: Seller & { profile: SellerProfile; social: Social[] }
  products: Product[]
  total: number
}

export default (props: Props) => {
  return (
    <BaseHtml>
      <body
        x-data='{category:null,subcategory:null,priceMin:null,priceMax:null,sortBy:"recent",cartOpen:false}'
        x-init="
        $watch(['category','subcategory','priceMin','priceMax','sortBy'],()=>{
          htmx.trigger('#products-list','inputChange')
        })
        "
      >
        <Header />
        {props.previousProduct
          ? (
            <Breadcrumbs
              lastLabel={props.previousProduct?.title}
              links={[
                { name: 'Home', to: '/' },
                {
                  name: props.previousProduct?.category,
                  to: '/category/' + props.previousProduct?.category,
                },
                {
                  name: props.previousProduct?.subCategory,
                  to: '/category/' + props.previousProduct?.category + '/' +
                    props.previousProduct?.subCategory,
                },
              ]}
            />
          )
          : null}

        <div class='flex items-center justify-center h-46 mt-16 flex-col gap-8'>
          <Profile
            name={props.seller.name || 'No name'}
            createdAt={props.seller.createdAt}
            imageURL={props.seller.profile.imageURL}
            href={`/seller/${props.seller.id}`}
          />

          <div class='flex items-center space-x-4'>
            {props.seller.social.filter((r) => r.link.length > 0).map((r) => (
              <SocialMediaButton platform={r.platform} link={r.link} />
            ))}
          </div>
        </div>
        <p class='text-center font-medium mt-16'>
          <span class='font-bold'>{props.total}</span>{' '}
          products are being sold by this seller.
        </p>

        <ListFilterSection />

        <div
          hx-post={`/seller/${props.seller.id}/products`}
          hx-target='this'
          hx-swap='innerHTML'
          hx-trigger='load,inputChange'
          hx-indicator='.loader'
          hx-include='.inputs'
          id='products-list'
        />
        <div class='inputs'>
          <input type='hidden' name='category' x-model='category' />
          <input type='hidden' name='subcategory' x-model='subcategory' />
          <input type='hidden' name='priceMin' x-model='priceMin' />
          <input type='hidden' name='priceMax' x-model='priceMax' />
          <input type='hidden' name='sortBy' x-model='sortBy' />
        </div>
        <span class='loader htmx-indicator'></span>
        <Footer />
        <Cart />
      </body>
    </BaseHtml>
  )
}
