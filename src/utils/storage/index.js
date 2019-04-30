import {
  setValueToSessionStorage,
  getValueFromSessionStorage,
} from './sessionStorage'
import {
  setValueToLocalStorage,
  getValueFromLocalStorage,
} from './localStorage'
import { THEME } from '../../constants'

const SESSION_STORAGE_KEY = '__rinae_dev_session_storage_key__'
const LOCAL_STORAGE_KEY = '__rinae_dev_local_storage_key__'

export function getCount(defaultValue) {
  return (
    getValueFromSessionStorage(`${SESSION_STORAGE_KEY}/count`) || defaultValue
  )
}

export function setCount(val) {
  return setValueToSessionStorage(`${SESSION_STORAGE_KEY}/count`, val)
}

export function getTag(defaultValue) {
  return (
    getValueFromSessionStorage(`${SESSION_STORAGE_KEY}/tag`) || defaultValue
  )
}

export function setTag(val) {
  return setValueToSessionStorage(`${SESSION_STORAGE_KEY}/tag`, val)
}

export function getData() {
  return getValueFromLocalStorage(LOCAL_STORAGE_KEY)
}

export function setData(val) {
  return setValueToLocalStorage(LOCAL_STORAGE_KEY, val)
}

export function getTheme() {
  return (
    getValueFromSessionStorage(`${SESSION_STORAGE_KEY}/theme`) || THEME.LIGHT
  )
}

export function setTheme(theme) {
  return setValueToSessionStorage(`${SESSION_STORAGE_KEY}/theme`, theme)
}
