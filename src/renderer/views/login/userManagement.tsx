import { CheckIcon, TrashIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { classNames } from 'renderer/components/content/shared/inventoryFunctions';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function UserGrid({ clickOnProfile, deleteUser,  runDeleteUser }) {
  const [hasRun, setHasRun] = useState(false);
  const [getUsers, setUsers] = useState([] as any);

  // The brain
  async function updateFunction() {
    let finalList = [] as any;
    let seenValues = [] as any

    // Get the account details
    let doUpdate = await window.electron.ipcRenderer.getAccountDetails();
    if (doUpdate == undefined) {
      doUpdate = {};
    }

    // Get the order of the account details
    let valueToUse = [] as any;
    await window.electron.store.get('accountKeyList').then((returnValue) => {
      valueToUse = returnValue
    });

    // Conditional logic
    if (valueToUse != undefined) {
      valueToUse.forEach(element => {
        if (seenValues.includes(element) == false) {
          seenValues.push(element)
        }
      });
      for (const [key, value] of Object.entries(doUpdate)) {
        let userObject = value as any;
        userObject['username'] = key;
        if (!seenValues.includes(userObject['username'])) {
          finalList.push(userObject);
        }
      }
      seenValues.reverse()
      seenValues.forEach(element => {
        if (doUpdate[element] != undefined) {
          let userObject = doUpdate[element] as any;
          userObject['username'] = element;
          finalList.splice(0, 0, userObject)
        }

      });
    } else {
      for (const [key, value] of Object.entries(doUpdate)) {
        let userObject = value as any;
        userObject['username'] = key;
        finalList.push(userObject);
      }
    }
    // Apply the account details
    setUsers(finalList)

  }
  // Run brain only once
  if (hasRun == false) {
    updateFunction();
    setHasRun(true);
  }

  // Remove account
  async function removeUsername(username) {
    window.electron.ipcRenderer.deleteAccountDetails(username);
    updateFunction();
  }
  if (deleteUser) {
    updateFunction()
    runDeleteUser()
  }

  // Drag n drop features
  async function handleOnDragEnd(result) {
    // Check if actually moved
    if (!result.destination) return;
    const items = Array.from(getUsers);

    // Store change locally and in the settings
    window.electron.ipcRenderer.setAccountPosition(result.draggableId, result.destination.index)
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setUsers(items);

    // Store for next session
    const orderToStore = [] as any;
    items.forEach(element => {
      let e = element as any
      orderToStore.push(e.username)

    });
    await window.electron.store.set('accountKeyList', orderToStore)

  }

  return (
    <div className="overflow-x-auto h-screen-fixed bg-gray-50 dark:bg-dark-level-two">
      <div className="grid grid-cols-1 py-10 px-4 gap-4 overflow-y-auto">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="characters">
            {(provided) => (
              <ul className="characters" {...provided.droppableProps} ref={provided.innerRef}>
                {getUsers.length == 0 ? (
                  <li
                    className={classNames(
                      'relative rounded-lg border border-gray-300 border-dashed dark:bg-dark-level-four bg-white px-6 py-5 flex items-center space-x-3 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"'
                    )}
                  >
                    <div className="flex-shrink-0">
                      <svg
                        className="w-10 h-10 rounded-full flex-shrink-0 text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-dark-white">
                        Nothing here
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        Login to add user
                      </p>
                    </div>
                  </li>
                ) : (
                  getUsers.map((person, index) => (
                    <Draggable
                      key={person.username}
                      draggableId={person.username}
                      index={index}
                    >
                      {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={classNames(
                          index == 0 ? '' : 'mt-5',
                          'relative rounded-lg border dark:border-opacity-0 dark:border-none dark:bg-dark-level-four border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"'
                        )}
                      >
                        <div className="flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={person.imageURL}
                            alt=""
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-dark-white">
                            {person.displayName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {person.username}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => clickOnProfile([person.username, person.safeLoginKey])}
                          className="inline-flex items-center dark:text-dark-white p-1 border border-transparent rounded-full hover:shadow-sm text-black hover:bg-gray-50 transition duration-500 ease-in-out hover:text-white hover:bg-green-600 transform hover:-translate-y-1 hover:scale-110"
                        >
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeUsername(person.username)}
                          className={classNames(
                            'inline-flex items-center p-1 border border-transparent rounded-full dark:text-dark-white hover:shadow-sm text-black hover:bg-gray-50 transition duration-500 ease-in-out hover:text-white hover:bg-red-600 transform hover:-translate-y-1 hover:scale-110'
                          )}
                        >
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </li>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
