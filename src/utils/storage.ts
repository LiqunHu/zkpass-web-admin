const clearStoreData = function () {
  window.localStorage.clear()
}

const setStoreData = function (key: string, value: object) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

const getStoreData = function (key: string) {
  let storeStr = window.localStorage.getItem(key)
  if (storeStr) {
    return JSON.parse(storeStr)
  } else {
    return null
  }
}

const removeStoreData = function (key: string) {
  window.localStorage.removeItem(key)
}
const clearSessionStoreData = function () {
  window.sessionStorage.clear()
}

const setSessionStoreData = function (key: string, value: object) {
  window.sessionStorage.setItem(key, JSON.stringify(value))
}

const getSessionStoreData = function (key: string) {
  let storeStr = window.sessionStorage.getItem(key)
  if (storeStr) {
    return JSON.parse(storeStr)
  } else {
    return null
  }
}

const removeSessionStoreData = function (key: string) {
  window.sessionStorage.removeItem(key)
}

export {
  clearStoreData,
  setStoreData,
  getStoreData,
  removeStoreData,
  clearSessionStoreData,
  setSessionStoreData,
  getSessionStoreData,
  removeSessionStoreData
}
