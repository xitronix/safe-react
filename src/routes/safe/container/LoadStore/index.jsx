// @flow
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import loadAddressBookFromStorage from '~/logic/addressBook/store/actions/loadAddressBookFromStorage'
import addViewedSafe from '~/logic/currentSession/store/actions/addViewedSafe'
import fetchLatestMasterContractVersion from '~/routes/safe/store/actions/fetchLatestMasterContractVersion'
import fetchSafe from '~/routes/safe/store/actions/fetchSafe'
import fetchTransactions from '~/routes/safe/store/actions/fetchTransactions'
import { safeParamAddressFromStateSelector } from '~/routes/safe/store/selectors'

type Props = {
  setSafeLoaded: Function,
}

const LoadStore = (props: Props) => {
  const dispatch = useDispatch()
  const safeAddress = useSelector(safeParamAddressFromStateSelector)

  const { setSafeLoaded } = props
  useEffect(() => {
    const fetchData = () => {
      if (safeAddress) {
        dispatch(fetchLatestMasterContractVersion())
          .then(() => dispatch(fetchSafe(safeAddress)))
          .then(() => {
            setSafeLoaded(true)
            return dispatch(fetchTransactions(safeAddress))
          })
          .then(() => dispatch(addViewedSafe(safeAddress)))
      }

      dispatch(loadAddressBookFromStorage())
    }
    fetchData()
  }, [safeAddress])
  return null
}

export default LoadStore
