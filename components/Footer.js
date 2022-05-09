import { useTranslation } from 'next-export-i18n'
import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'

export default function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-[#F7F7F7]">
      <div className="mx-auto bg-white lg:max-w-[1680px]">
        <div className="border-t border-gray-200 px-4 py-8 text-center  text-sm text-gray-500 sm:px-6 sm:text-left lg:px-32">
          <span className="block sm:inline">
            {' '}
            鲁ICP备17017005号-2 {t('reserved')} © 2019-{new Date().getFullYear()}{' '}
          </span>{' '}
          <a
            href="https://x-y-t.cn"
            target="_blank"
            className="block pr-1 text-[#FF745C] sm:inline"
            rel="noreferrer"
          >
            {t('company')}
          </a>
          <span className="block sm:inline">{t('email')}info@x-y-t.cn</span>
        </div>
      </div>
    </footer>
  )
}
