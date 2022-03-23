import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { tradeUpSetPossible } from 'renderer/store/actions/tradeUpActions';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function PossibleOutcomes() {
    const tradeUpData = useSelector((state: any) => state.tradeUpReducer);
    const dispatch = useDispatch();
    
    if (tradeUpData.tradeUpProducts.length == 10 &&  tradeUpData.possibleOutcomes.length == 0) {
        window.electron.ipcRenderer.getPossibleOutcomes(tradeUpData.tradeUpProducts).then((messageValue) => {
            console.log(messageValue)
            dispatch(tradeUpSetPossible(messageValue));
          });
    }
  return (
    <div>
      <h2 className="text-gray-500  text-xs font-medium uppercase tracking-wide dark:text-gray-400">Possible outcomes</h2>
      <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 ">
        {tradeUpData.possibleOutcomes.map((project, index) => (
          <li key={index} className="col-span-1 flex shadow-sm rounded-md">
            <Link
                        to={{pathname:"https://steamcommunity.com/market/listings/730/" + project.product + " (" + project.skin_rarity + ')'}}
                        target="_blank"
                      >
           
            <div
                    className={classNames(
                      'flex-shrink-0 h-full  flex items-center justify-center w-16 dark:border-opacity-50 text-white border-t border-l border-b border-gray-200 rounded-l-md dark:bg-dark-level-two bg-gradient-to-t from-gray-100 to-gray-300 dark:from-gray-300 dark:to-gray-400'
                    )}
                  >
                    <img
                      className="max-w-none h-11 w-11  object-cover"
                      src={
                        project.image
                      }
                    />
                  </div>
                  </Link>
            <div className="flex-1 dark:bg-dark-level-two dark:border-opacity-50 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <a href={project.href} className="text-gray-900 font-medium hover:text-gray-600 dark:text-dark-white">
                  {project.product}
                </a>
                <p className="text-gray-500">{project.percentage} % | {project.skin_rarity}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}