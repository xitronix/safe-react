// @flow
import { fetchProvider, removeProvider } from '~/logic/wallets/store/actions'

export type Actions = {
  fetchProvider: typeof fetchProvider,
  removeProvider: typeof removeProvider,
}

export default {
  fetchProvider,
  removeProvider,
}
