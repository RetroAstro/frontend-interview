function createStore(reducer, initState, enhancer) {
  if (typeof initState == 'function' && enhancer == undefined) {
    enhancer = initState
    initState = null
  }

  if (enhancer) {
    return enhancer(createStore)(reducer, initState)
  }

  let state = initState
  let listeners = []

  function subscribe(listener) {
    listeners.push(listener)

    return function unsubscribe() {
      let index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  function dispatch(action) {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
  }

  function getState() {
    return state
  }

  dispatch({ type: Symbol() })

  return {
    subscribe,
    dispatch,
    getState
  }
}

function combineReducers(reducers) {
  let reducerKeys = Object.keys(reducers)

  return function combination(state = {}, action) {
    let nextState = {}

    reducerKeys.forEach(key => {
      let reducer = reducers[key]
      let previousStateForKey = state[key]
      let nextStateForKey = reducer(previousStateForKey, action)

      nextState[key] = nextStateForKey
    })

    return nextState
  }
}

function compose(...funcs) {
  if (funcs.length == 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

function applyMiddleware(...middlewares) {
  return function (oldCreateStore) {
    return function newCreateStore(reducer, initState) {
      let store = oldCreateStore(reducer, initState)
      let dispatch = () => {}

      let middlewareAPI = {
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args)
      }

      let chain = middlewares.map(middleware => middleware(middlewareAPI))
      dispatch = compose(...chain)(store.dispatch)

      return {
        ...store,
        dispatch
      }
    }
  }
}

function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators != 'object' || actionCreators == null) {
    throw new Error()
  }

  let keys = Object.keys(actionCreators)
  let boundActionCreators = {}

  keys.forEach(key => {
    let actionCreator = actionCreators[key]
    boundActionCreators[key] = bindActionCreator(actionCreator, dispatch)
  })

  return boundActionCreators

  function bindActionCreator(actionCreator, dispatch) {
    return function () {
      return dispatch(actionCreator.apply(this, arguments))
    }
  }
}
