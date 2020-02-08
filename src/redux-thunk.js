function createThunkMiddleware() {
  return ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action == 'function') {
      return action(dispatch, getState)
    }

    return next(action)
  }
}
