import { PageSEO } from '@/components/SEO'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import Image from '@/components/Image'
import Img1 from '@/svg/1.svg'
import Img2 from '@/svg/2.svg'
import Img3 from '@/svg/3.svg'
import Img4 from '@/svg/4.svg'
import Img5 from '@/svg/5.svg'
import Img6 from '@/svg/6.svg'
import Img7 from '@/svg/7.svg'
import Img8 from '@/svg/7.svg'
import { useTranslation, LanguageSwitcher } from 'next-export-i18n'

export default function Home() {
  const { t } = useTranslation()

  return (
    <>
      <PageSEO
        title={siteMetadata.title}
        description={siteMetadata.description}
        keywords={siteMetadata.keywords}
      />

      <div className="bg-[#F7F7F7]">
        <div className="mx-auto max-w-[1680px] bg-white">
          <div className="relative h-screen max-h-[900px] min-h-[730px] px-6 py-24 sm:px-12 md:h-[440px] md:min-h-[440px]  md:py-0 lg:px-16 2xl:px-32  ">
            <Image
              className="absolute inset-0 h-screen max-h-[900px] min-h-[730px] object-cover md:h-[440px] md:min-h-[440px]  md:w-screen"
              width="1440"
              height="440"
              alt=""
              src="/images/bg.webp"
              srcSet="/images/bg@2x.webp"
            />

            <div className="absolute right-0 top-0 z-10 mt-[95px] pr-9 font-semibold md:mt-[31px]">
              <LanguageSwitcher lang="zh">
                <span className="text-white">中文</span>
              </LanguageSwitcher>{' '}
              <span className="text-white">|</span>{' '}
              <LanguageSwitcher lang="en">
                <span className="text-white">English</span>
              </LanguageSwitcher>
            </div>
            <div className="relative flex max-w-2xl flex-col pr-8">
              <Link aria-label="logo" href="/" className="mt-1 max-w-xs md:mt-[31px]">
                <Img1 />
              </Link>
              <h2 className="mt-16 pt-1 text-[32px] font-semibold tracking-tight text-white sm:text-4xl md:text-[32px]">
                <span className="block leading-10 sm:inline">{t('title')}</span>
              </h2>
              <h2 className="pt-10 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:pt-4 md:text-[32px]">
                <span className="block sm:inline">{t('subtitle')}</span>
              </h2>

              <p className="pt-10 text-sm leading-7 text-white md:pt-5 md:leading-6">
                {t('description')}
              </p>

              <p className="pt-8 text-sm leading-7 text-white md:leading-6">
                {t('subdescription')}
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse px-6 pt-6 md:mt-[115px] md:gap-2 md:px-0 md:pl-32 md:pr-32 md:pt-0 lg:grid lg:grid-cols-12 lg:items-center">
            <div className="mt-6 lg:col-span-6 lg:col-start-6 lg:row-start-1 lg:mt-0 xl:col-span-8 xl:col-start-5">
              <Img2 />

              <p className="mt-5 text-sm leading-6 text-gray-500">{t('rts con title')}</p>
              <br />
              <p className="pr-10 text-sm leading-6 text-gray-500">{t('rts con description')}</p>

              <div className="mt-4 flex">
                <div>🧨</div>
                <a
                  href="/rts2021.html"
                  target="_blank"
                  className="pl-1 text-[#FF652C] underline"
                  rel="noreferrer"
                >
                  {t('latest new')}
                </a>
              </div>

              <div className="mt-7 flex">
                <a
                  href="http://www.freeswitch.org.cn/fscnds/index.html"
                  target="_blank"
                  className="w-full rounded-sm bg-[#444444] py-4 text-center text-sm text-white md:w-auto md:px-6"
                  rel="noreferrer"
                >
                  {t('all news')}
                </a>
              </div>
            </div>
            <div className="flex-auto lg:col-span-5 lg:col-start-1 lg:row-start-1 xl:col-span-4">
              <Img3 />
            </div>
          </div>

          <div className="mt-[89px] grid grid-cols-1 gap-4 px-6 pt-10 pb-24 md:px-32  xl:grid-cols-3 2xl:mt-24">
            <div className="hover:none relative flex h-[104px] items-center space-x-3 rounded-lg border border-[#444444] bg-white px-6 shadow-sm md:space-x-[30px]">
              <div className="flex-shrink-0">
                <Img4 />
              </div>
              <div className="min-w-0 flex-1">
                <a
                  href="https://github.com/rts-cn"
                  target="_blank"
                  className="focus:outline-none"
                  rel="noreferrer"
                >
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  <p className="text-lg font-medium text-gray-900">RTS{t('resource')}</p>
                  <p className="truncate text-sm text-gray-500">{t('rts resource subtitle')}</p>
                </a>
              </div>

              <div>
                <Img5 />
              </div>
            </div>
            <div className="hover:none relative flex h-[104px] items-center space-x-3 rounded-lg border border-[#444444] bg-white px-6 shadow-sm md:space-x-[30px]">
              <div className="flex-shrink-0">
                <Img6 />
              </div>
              <div className="min-w-0 flex-1">
                <a
                  href="https://github.com/rts-cn/rts/discussions"
                  target="_blank"
                  className="focus:outline-none"
                  rel="noreferrer"
                >
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  <p className="text-lg font-medium text-gray-900">Github{t('discussions')}</p>
                  <p className="truncate  text-sm text-gray-500">
                    {t('github discussions subtitle')}
                  </p>
                </a>
              </div>

              <div>
                <Img7 />
              </div>
            </div>

            <div className="hover:none relative flex h-[104px] items-center space-x-3 rounded-lg border border-[#444444] bg-white px-6 shadow-sm md:space-x-[30px]">
              <div className="flex-shrink-0">
                <Image
                  className="h-10 w-10"
                  width="40"
                  height="40"
                  src="/images/fscn.png"
                  srcSet="/images/fscn@2x.png"
                  alt=""
                />
              </div>
              <div className="min-w-0 flex-1">
                <a
                  href="http://www.freeswitch.org.cn/"
                  target="_blank"
                  className="focus:outline-none"
                  rel="noreferrer"
                >
                  <span className="absolute inset-0" aria-hidden="true"></span>
                  <p className="text-lg font-medium text-gray-900">
                    FreeSWITCH{t('chinese community')}
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    {t('freeswitch chinese community subtitle')}
                  </p>
                </a>
              </div>
              <div>
                <Img8 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
