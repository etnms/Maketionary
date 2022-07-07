import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { IWordDb } from "../interfaces/interfaceWord";

// Define a type for the slice state
interface IArrayWordsState {
  value: Array<IWordDb>;
}

// Define the initial state using that type
const initialState: IArrayWordsState = {
  value: [],
};

export const arrayWordSlice = createSlice({
  name: "arrayWords",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    updateWordList: (state, action: PayloadAction<IWordDb[]>) => {
      state.value = action.payload;
    },
    addWord: (state, action: PayloadAction<IWordDb>) => {
      state.value.push(action.payload);
    },
  },
});

export const { addWord, updateWordList } = arrayWordSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAddWord = (state: RootState) => state.arrayWords.value;
export const selectUpdateWord = (state: RootState) => state.arrayWords.value;

export default arrayWordSlice.reducer;
