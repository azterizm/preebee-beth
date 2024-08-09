export default function () {
  return (
    <div class='flex items-center justify-between'>
      <p class='mb-1 text-xl font-medium'>Category</p>
      <div
        class='dropdown dropdown-end dropdown-open'
        x-data='{open:false}'
      >
        <label
          tabindex='0'
          class='btn btn-primary'
          x-text="category===null?'All':['Makeup', 'Skincare', 'Haircare'][category]"
          x-on:click='open=!open'
        >
          All
        </label>
        <ul
          tabindex='0'
          x-show='open'
          x-transition
          class='shadow menu dropdown-content bg-base-100 rounded-box w-52 z-40'
        >
          <li>
            <button
              x-on:click='category=null;open=false;'
              x-bind:class="category===null?'bg-primary/20':''"
            >
              All
            </button>
          </li>
          {['Makeup', 'Skincare', 'Haircare'].map((
            category,
            i,
          ) => (
            <li>
              <button
                x-on:click={`category=${i};subcategory=null;open=false;`}
                x-bind:class={`category===${i}?'bg-primary/20':''`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
