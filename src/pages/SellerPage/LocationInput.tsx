export default () => (
  <div class="flex items-center justify-between">
    <p class='text-xl font-medium'>Location</p>
    <div class='dropdown dropdown-end'>
      <label tabindex='0' class='btn btn-primary'>
        Hyderabad
      </label>
      <ul
        tabindex='0'
        class='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
      >
        <li>
          <a>Karachi</a>
        </li>
        <li>
          <a>Hyderabad</a>
        </li>
      </ul>
    </div>
  </div>
)
