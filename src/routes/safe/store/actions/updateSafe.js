// @flow
import { createAction } from 'redux-actions'

export const UPDATE_SAFE = 'UPDATE_SAFE'

const updateSafe = createAction<string, *>(UPDATE_SAFE)

export default updateSafe
