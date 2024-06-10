import { FC } from 'react';

import Link from 'next/link';

import { useLocale } from '@/lib/i18n';

const Pagination: FC<{ page: number; showNext: boolean }> = ({ page, showNext }) => {
  const locale = useLocale();

  const currentPage = +page;

  let additionalClassName = 'justify-between';

  if (currentPage === 1 && showNext) {
    additionalClassName = 'justify-end';
  }

  if (currentPage !== 1 && !showNext) {
    additionalClassName = 'justify-start';
  }

  return (
    <div className={`flex font-medium text-gray-500 dark:text-gray-100 ${additionalClassName}`}>
      {currentPage !== 1 && (
        <Link href={currentPage - 1 === 1 ? '/' : `/page/${currentPage - 1}`} passHref>
          <button rel="prev" className="block cursor-pointer">
            ← {locale?.PAGINATION.PREV}
          </button>
        </Link>
      )}
      {showNext && (
        <Link href={`/page/${currentPage + 1}`} passHref>
          <button rel="next" className="block cursor-pointer">
            {locale?.PAGINATION.NEXT} →
          </button>
        </Link>
      )}
    </div>
  );
};

export default Pagination;
