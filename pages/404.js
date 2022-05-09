import Link from '@/components/Link'
import { useTranslation } from 'next-export-i18n'

export default function FourZeroFour() {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center md:flex-row md:items-center md:justify-center md:space-x-6">
      <div className="space-x-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-6xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 md:border-r-2 md:px-6 md:text-8xl md:leading-14">
          404
        </h1>
      </div>
      <div className="max-w-md">
        <p className="mb-4 text-xl font-bold leading-normal md:text-2xl">{t('not found title')}</p>
        <p className="mb-8">{t('not found subtitle')}</p>
        <Link href="/">
          <button className="focus:shadow-outline-blue inline rounded-lg border border-transparent bg-navBackground px-4 py-2 text-sm font-medium leading-5 text-white shadow transition-colors duration-150 focus:outline-none">
            {t('Back to homepage')}
          </button>
        </Link>
      </div>
    </div>
  )
}
