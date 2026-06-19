import { configureStore } from '@reduxjs/toolkit'
import logReducer from './logSlice.js'
import filterReducer from './filterSlice.js'
import alertReducer from './alertSlice.js'

export const store = configureStore({
  reducer: {
    logs: logReducer,
    filters: filterReducer,
    alerts: alertReducer,
  },
})
