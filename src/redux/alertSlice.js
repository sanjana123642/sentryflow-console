import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  rules: [],
  triggered: [],
}

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addRule(state, action) {
      state.rules.push({ ...action.payload, id: Date.now() })
    },
    removeRule(state, action) {
      state.rules = state.rules.filter(r => r.id !== action.payload)
    },
    triggerAlert(state, action) {
      state.triggered.unshift({ ...action.payload, time: Date.now() })
      if (state.triggered.length > 50) state.triggered.pop()
    },
  },
})

export const { addRule, removeRule, triggerAlert } = alertSlice.actions
export default alertSlice.reducer
