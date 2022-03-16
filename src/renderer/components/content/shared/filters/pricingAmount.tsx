import { CashIcon } from '@heroicons/react/solid';

export default function PricingAmount({totalAmount, pricingAmount = 0}) {
  return (
    <span className="mr-3 flex items-center text-gray-500 text-xs font-medium uppercase tracking-wide">
      <CashIcon
        className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
        aria-hidden="true"
      />{' '}
      <span className="text-yellow-500">{totalAmount} </span>
      {pricingAmount == 0 ? 
      '' :
      <span className="text-gray-400 dark:text-gray-500">&nbsp; ( {pricingAmount} ) </span>
      }
      
    </span>
  );
}
