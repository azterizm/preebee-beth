import Category from './Category'
import PriceRangeInput from './PriceRangeInput'
import Subcategory from './Subcategory'

export default function () {
  return (
    <div class='w-full flex items-center justify-between mt-4'>
      <div class='drawer'>
        <input id='filter-drawer' type='checkbox' class='drawer-toggle' />
        <div class='drawer-content'>
          <label for='filter-drawer' class='btn drawer-button'>
            Filter
          </label>
          <span
            x-show='category || subcategory || priceMin || priceMax'
            x-cloak
            class='text-sm ml-2'
          >
            Applied{' '}
            <span x-text='[category,subcategory,priceMin,priceMax].filter(Boolean).length'>
            </span>{' '}
            filter<span x-show='[category,subcategory,priceMin,priceMax].filter(Boolean).length>1'>
              s
            </span>
          </span>
        </div>
        <div class='drawer-side z-40'>
          <label
            for='filter-drawer'
            aria-label='close sidebar'
            class='drawer-overlay'
          >
          </label>
          <ul class='p-4 w-80 min-h-full bg-base-200 text-base-content space-y-4'>
            <li>
              <PriceRangeInput />
            </li>
            <li>
              <Category />
            </li>
            <li>
              <Subcategory />
            </li>
          </ul>
        </div>
      </div>

      <div
        class='dropdown dropdown-end dropdown-open'
        x-data='{open: false}'
      >
        <label
          x-on:click='open=!open'
          tabindex='0'
          class='btn whitespace-nowrap'
        >
          sort by
        </label>
        <ul
          tabindex='0'
          class='p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52'
          x-show='open'
          x-cloak
          x-transition
        >
          <li x-on:click="sortBy='recent';open=false">
            <button x-bind:class="sortBy=='recent' ? 'bg-primary text-white' :''">
              New items
            </button>
          </li>
          <li x-on:click="sortBy='review';open=false">
            <button x-bind:class="sortBy=='review' ? 'bg-primary text-white' :''">
              Review
            </button>
          </li>
          <li x-on:click="sortBy='price';open=false">
            <button x-bind:class="sortBy=='price' ? 'bg-primary text-white' :''">
              Price
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
