import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../app/store'

// Define a type for the slice state
interface ISearch {
  searchInput: string;
}

// Define the initial state using that type
const initialState:  ISearch = {
    searchInput: ""
}

export const editModeSlice = createSlice({
  name: 'search',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSearchInput: (state, action: PayloadAction<string>) => {
      state.searchInput = (action.payload);
    },

  }
})

export const { setSearchInput } = editModeSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectSearch = (state: RootState) => state.search.searchInput;


export default editModeSlice.reducer