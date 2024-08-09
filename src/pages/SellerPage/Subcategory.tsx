import {
  hairCareCategories,
  makeupCategories,
  skinCareCategories,
} from '../../constants/api'
export default function () {
  return (
    <div class='flex items-center justify-between'>
      <p class='mb-1 text-xl font-medium mr-2'>Subcategory</p>
      <div
        class='dropdown dropdown-end dropdown-open'
        x-data='{open:false}'
      >
        <label
          tabindex='0'
          class='btn btn-primary'
          x-text="subcategory===null?'All':subcategory"
          style='font-size: 0.768rem'
          x-on:click='open=!open'
        >
          All
        </label>
        <ul
          x-show='category===0&&open'
          class='shadow menu dropdown-content bg-base-100 rounded-box w-52 z-40'
          x-transition
        >
          <li>
            <button x-on:click={`open=false;subcategory=null`}>
              All
            </button>
          </li>
          {makeupCategories.map((r) => (
            <li>
              <button
                x-on:click={`open=false;subcategory="${r}"`}
              >
                {r}
              </button>
            </li>
          ))}
        </ul>
        <ul
          x-show='category===1&&open'
          class='shadow menu dropdown-content bg-base-100 rounded-box w-52 z-40'
          x-transition
        >
          <li>
            <button x-on:click={`open=false;subcategory=null`}>
              All
            </button>
          </li>
          {skinCareCategories.map((r) => (
            <li>
              <button
                x-on:click={`open=false;subcategory='${r}'`}
              >
                {r}
              </button>
            </li>
          ))}
        </ul>
        <ul
          x-show='category===2&&open'
          class='shadow menu dropdown-content bg-base-100 rounded-box w-52 z-40'
          x-transition
        >
          <li>
            <button x-on:click={`open=false;subcategory=null`}>
              All
            </button>
          </li>
          {hairCareCategories.map((r) => (
            <li>
              <button
                x-on:click={`open=false;subcategory='${r}'`}
              >
                {r}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
