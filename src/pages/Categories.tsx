import Footer from '../components/Footer'
import Header from '../components/Header'
import { BaseHtml } from '../components/root'
import {
  hairCareCategories,
  makeupCategories,
  skinCareCategories,
} from '../constants/api'

export default function Categories() {
  return (
    <BaseHtml>
      <body x-data='{cartOpen:false}'>
        <Header hidePackages />
        <div class='my-4 min-h-screen'>
          <a href='/' class='btn'>
            <img
              src='/icons/arrow-right.svg'
              alt='go back icon'
              class='rotate-180 fill-white'
              width='20'
              height='20'
            />
            Go back
          </a>

          <h1 class='mt-4 text-2xl font-bold text-center'>Categories</h1>

          <div class='space-y-8 divide-y-2 [&>div]:pt-8 [&>div]:border-primary pb-8'>
            <div>
              <a
                href='/category/makeup'
                class='btn'
              >
                <img
                  src='/icons/brush.svg'
                  alt='makeup icon'
                  class='fill-white'
                  width='20'
                  height='20'
                />
                Makeup
              </a>
              <div class='flex items-center flex-wrap gap-4 mt-4'>
                {makeupCategories.map((item) => (
                  <a
                    href={`/category/makeup?subCategory=${encodeURIComponent(item)
                      }`}
                    class='btn'
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <a
                href='/category/skin_care'
                class='btn'
              >
                <img
                  src='/icons/face.svg'
                  alt='skincare icon'
                  class='fill-white'
                  width='20'
                  height='20'
                />
                Skin care
              </a>
              <div class='flex items-center flex-wrap gap-4 mt-4'>
                {skinCareCategories.map((item) => (
                  <a
                    href={`/category/skin_care?subCategory=${encodeURIComponent(item)
                      }`}
                    class='btn'
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <a
                href='/category/hair_care'
                class='btn'
              >
                <img
                  src='/icons/shower.svg'
                  alt='skincare icon'
                  class='fill-white'
                  width='20'
                  height='20'
                />
                Hair care
              </a>
              <div class='flex items-center flex-wrap gap-4 mt-4'>
                {hairCareCategories.map((item) => (
                  <a
                    href={`/category/hair_care?subCategory=${encodeURIComponent(item)
                      }`}
                    class='btn'
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </body>
    </BaseHtml>
  )
}
