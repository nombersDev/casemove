import { createContext, useContext } from 'react';
export type toMoveContext = {
  getToMoveContext: any;
  setToMoveContext: (c: any) => void;
};

export const toMoveContext = createContext<toMoveContext>({
  getToMoveContext: {},
  setToMoveContext: () => {},
});
export const useToMoveContext = () => useContext(toMoveContext);

export async function updateToMove(getToMoveContext, options) {
  let fromStorage = options.hasOwnProperty('fromStorage')
    ? options.fromStorage
    : getToMoveContext['fromStorage'];
  console.log(fromStorage);
  return {
    fromStorage: fromStorage,
  };
}
