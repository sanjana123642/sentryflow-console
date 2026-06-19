import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  active: [],
  history: [],   // for undo
  future: [],    // for redo
}

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    toggleFilter(state, action) {
      state.history.push([...state.active])
      state.future = []
      const tag = action.payload
      if (state.active.includes(tag)) {
        state.active = state.active.filter(t => t !== tag)
      } else {
        state.active.push(tag)
      }
    },
    undoFilter(state) {
      if (state.history.length === 0) return
      state.future.push([...state.active])
      state.active = state.history.pop()
    },
    redoFilter(state) {
      if (state.future.length === 0) return
      state.history.push([...state.active])
      state.active = state.future.pop()
    },
    clearFilters(state) {
      state.history.push([...state.active])
      state.future = []
      state.active = []
    },
  },
})

export const { toggleFilter, undoFilter, redoFilter, clearFilters } = filterSlice.actions
export default filterSlice.reducer
