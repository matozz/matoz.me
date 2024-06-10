import classNames from 'classnames';

import BLOG from '@/blog.config';

type Props = { fullWidth?: boolean };

export const Footer: React.FC<Props> = ({ fullWidth }) => {
  return (
    <div
      className={classNames(
        'm-auto mt-6 w-full flex-shrink-0 text-gray-500 transition-all dark:text-gray-400',
        {
          'px-4 md:px-24': fullWidth,
          'max-w-2xl px-4': !fullWidth,
        },
      )}
    >
      <hr className="border-gray-200 dark:border-gray-600" />
      <div className="my-4 text-sm leading-6">
        <div className="flex flex-wrap justify-between align-baseline">
          <p>{`${BLOG.since ? `${BLOG.since} ` : ''}© ${BLOG.author}`}</p>
          {/* <a
            href={BLOG.repository}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-black dark:hover:text-gray-100"
          >
            Source
          </a> */}
        </div>
      </div>
    </div>
  );
};
