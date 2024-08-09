import { Cart } from '../components/Cart'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { BaseHtml } from '../components/root'
import ListFilterSection from './SellerPage/ListFilterSection'

export default function () {
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

        <h1 class='text-3xl font-bold text-center mb-4 mt-16'>
          Favourites
        </h1>
        <p class='text-center font-medium'>
          Always have your favourite products at hand.
        </p>

        <ListFilterSection />

        <div
          hx-post={`/favourite/products`}
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
        <Cart />

        <Footer />
      </body>
    </BaseHtml>
  )
}
