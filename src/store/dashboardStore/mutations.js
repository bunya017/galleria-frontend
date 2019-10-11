export function setLoggedInStatus (state, payload) {
  state.isLoggedIn = payload.isLoggedIn
  state.authToken = payload.authToken
}
