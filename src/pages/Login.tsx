import Header from '../components/Header'
import { BaseHtml } from '../components/root'

interface Props {
  hasItemsInCart: any
  error?: string
}
export default function Login(props: Props) {
  return (
    <BaseHtml>
      <body x-data='init'>
        <Header minimal />

        <div class='max-w-xl mx-auto my-16'>
          <h1 class='text-3xl font-bold text-center mb-4'>
            Login on Eros
          </h1>
          <p class='font-medium max-w-md mx-auto text-left'>
            Your account is created when you login with Google or Facebook. We
            don't store any of your data.
          </p>

          <div class='px-6 sm:px-0 max-w-xs mx-auto mt-8' x-data='{}'>
            <button
              type='button'
              class='text-white w-full bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2'
              x-on:click='window.location.href = "/auth/google"'
            >
              <svg
                class='mr-2 -ml-1 w-4 h-4'
                aria-hidden='true'
                focusable='false'
                data-prefix='fab'
                data-icon='google'
                role='img'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 488 512'
              >
                <path
                  fill='currentColor'
                  d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
                >
                </path>
              </svg>Continue with Google<div></div>
            </button>
          </div>

          {props.error ? (
            <p class='font-medium max-w-md mx-auto text-left text-red-600 text-center'>
              Error: {props.error}
            </p>
          ):null}
        </div>
        <script>
          {`
            document.addEventListener('alpine:init', () => {
              Alpine.data('init', () => ({
                init() {
                    const url = new URL(window.location.href)
                    const redirectTo = url.searchParams.get('redirect')
                    if (redirectTo) {
                      window.localStorage.setItem('redirect', redirectTo)
                    }
                    if (${props.hasItemsInCart}) {
                      window.localStorage.setItem('hadItemsInCartBefore', '1')
                    } else {
                      window.localStorage.removeItem('hadItemsInCartBefore')
                    }
                }
              }))
            })
          `}
        </script>
      </body>
    </BaseHtml>
  )
}
