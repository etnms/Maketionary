import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

// Define a type for the slice state
interface IEditMode {
  value: boolean;
  wordToEdit: string;
}

// Define the initial state using that type
const initialState: IEditMode = {
  value: false,
  wordToEdit: "",
};

export const editModeSlice = createSlice({
  name: "editMode",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
    selectWordEdit: (state, action: PayloadAction<string>) => {
      state.wordToEdit = action.payload;
    },
  },
});

export const { setEditMode, selectWordEdit } = editModeSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectEditMode = (state: RootState) => state.editMode.value;

export default editModeSlice.reducer;
