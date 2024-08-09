export default () => (
  <div>
    <p class='text-xl mb-1 font-medium'>Price</p>
    <div class='flex items-center gap-4'>
      <input
        type='number'
        placeholder='Min'
        class='input input-bordered w-1/2'
        {...{ 'x-model.debounce.500ms': 'priceMin' }}
      />
      <input
        type='number'
        placeholder='Max'
        class='input input-bordered w-1/2'
        {...{ 'x-model.debounce.500ms': 'priceMax' }}
      />
    </div>
  </div>
)
