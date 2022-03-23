import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { classNames } from 'renderer/components/content/shared/inventoryFunctions';
import { tradeUpAddRemove } from 'renderer/store/actions/tradeUpActions';
import PossibleOutcomes from './possibleOutcomes';

export default function TradeUpSideBar() {
    const tradeUpData = useSelector((state: any) => state.tradeUpReducer);
    const [itemHover, setItemHover] = useState('')
    const dispatch = useDispatch();
    
    let totalFloat = 0
    tradeUpData.tradeUpProducts.forEach(element => {
        totalFloat += element.item_paint_wear
    });
    totalFloat = totalFloat / tradeUpData.tradeUpProducts.length

  return (
      <div >
          
    <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 dark:bg-dark-level-two dark:border-opacity-50">
      <div className="-ml-4 -mt-4 flex justify-center items-center">
        <div className="ml-4 mt-4">
          <div className="flex items-center flex-wrap">
              {tradeUpData.tradeUpProducts.map((projectRow) => (
                   <div className="flex flex-shrink-0 -space-x-1" key={projectRow.item_id}>
                       <button onClick={() => dispatch(tradeUpAddRemove(projectRow))}>
                   <img
                   onMouseEnter={() =>
                    setItemHover(projectRow.item_id)
                  }
                  onMouseLeave={() => setItemHover('')}
                  className={classNames(
                    itemHover == projectRow.item_id
                      ? 'transform-gpu hover:-translate-y-1 hover:scale-110'
                      : '', "max-w-none h-8 w-8 transition duration-500 ease-in-out  dark:from-gray-300 dark:to-gray-400 rounded-full ring-2 ring-transparent object-cover bg-gradient-to-t from-gray-100 to-gray-300")}
                     src={
                       'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CSGO/master/csgo/pak01_dir/resource/flash/' +
                       projectRow.item_url +
                       '.png'
                     }
                   /></button>
                 </div>
                  
              ))}
         
          </div>
        </div>

      </div>
      
    </div>
    <div className='px-4 py-5' >

    <PossibleOutcomes />
    </div>
      </div>
    
    
    
  )
}