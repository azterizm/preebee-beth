import Header from '../components/Header'
import { BaseHtml } from '../components/root'
import { getUserById } from '../models/user'
import { DBResult } from '../types/api'

interface Props {
  data: NonNullable<DBResult<typeof getUserById>>
}

export default function (props: Props) {
  return (
    <BaseHtml>
      <body>
        <Header />
        <div class='max-w-xl mx-auto my-16'>
          <h1 class='text-3xl font-bold text-center mb-4'>
            Account
          </h1>

          <div class='flex flex-col space-y-4 justify-center items-center'>
            <img
              src={props.data.profile?.imageURL}
              alt={props.data.name + ' profile image'}
              class='rounded-full object-cover object-center w-40 h-40'
            />
            <p class='text-lg font-medium'>
              {props.data.name}
            </p>
            <p>
              {props.data.email}
            </p>
            <a href='/auth/logout' class='btn btn-error'>
              Logout
              <img src='/icons/out.svg' alt='logout icon' />
            </a>
          </div>
        </div>
      </body>
    </BaseHtml>
  )
}
