import { createSlice } from '@reduxjs/toolkit'

const MAX_LOGS = 2000

const initialState = {
  live: [],
  history: [],
  paused: false,
}

const logSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    addLog(state, action) {
      if (!state.paused) {
        state.live.unshift(action.payload)
        if (state.live.length > 100) state.live = state.live.slice(0, 100)
      }
      state.history.unshift(action.payload)
      if (state.history.length > MAX_LOGS) state.history = state.history.slice(0, MAX_LOGS)
    },
    togglePause(state) {
      state.paused = !state.paused
    },
    clearLive(state) {
      state.live = []
    },
  },
})

export const { addLog, togglePause, clearLive } = logSlice.actions
export default logSlice.reducer
