import { DatabaseIcon } from '@heroicons/react/solid';

export default function AccountAmount({totalAmount, textToWrite = "Left"}) {
  return (
    <span className="mr-3 flex items-center text-gray-500 text-xs font-medium uppercase tracking-wide">
                  <DatabaseIcon
                    className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />{' '}
                  <span className="text-blue-500">
                    {totalAmount}{' '}
                    {textToWrite}
                  </span>
                </span>
  );
}
