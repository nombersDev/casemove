import { ModalMove } from "renderer/interfaces/store";

const initialState: ModalMove = {
    moveOpen: false,
    notifcationOpen: false,
    storageIdsToClearFrom: [],
    modalPayload: {
      number: 0,
      itemID: '',
      isLast: false
    },
    doCancel: [],
    query: [],
    totalFailed: 0
  };

  const modalMoveReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'MOVE_MODAL_QUERY_SET':
          let queryData = [...action.payload.query]
          queryData.shift()
          return {
              ...state,
              moveOpen: true,
              modalPayload: action.payload.query[0].payload,
              query: queryData
          }

      case 'MOVE_MODAL_UPDATE':
        if (state.query.length == 0) {
          return {
            ...state,
            modalPayload: initialState.modalPayload,
            moveOpen: false
          }
        }
          let initialStoragesToClear = state.storageIdsToClearFrom
           if (!initialStoragesToClear.includes(state.query[0].payload.storageID)) {
            initialStoragesToClear.push(state.query[0].payload.storageID)
           }
           if (state.doCancel.includes(state.query[0].payload.key)) {
             return {
               ...state
             }
           }
          let newQuery = [...state.query]
          newQuery.shift()
          return {
              ...state,
              moveOpen: true,
              modalPayload: state.query[0].payload,
              storageIdsToClearFrom: initialStoragesToClear,
              query: newQuery
          }
      case 'CLOSE_MOVE_MODAL':
        return {
            ...state,
            moveOpen: false,
            totalFailed: initialState.totalFailed
        }
      case 'MOVE_MODAL_RESET_PAYLOAD':
        return {
          ...state,
          query: initialState.query
        }
      case 'MOVE_MODAL_CANCEL':
        return {
            ...state,
            doCancel: [...state.doCancel, action.payload.doCancel],
            totalFailed: initialState.totalFailed
        }
      case 'MODAL_RESET_STORAGE_IDS_TO_CLEAR_FROM':
        return {
            ...state,
            storageIdsToClearFrom: initialState.storageIdsToClearFrom
        }
      case 'MODAL_ADD_TO_FAILED':
        return {
            ...state,
            totalFailed: state.totalFailed + 1
        }
      case 'SIGN_OUT':
        return {
          ...initialState
        }
      default:
        return {...state}

    }
  };


  export default modalMoveReducer;
