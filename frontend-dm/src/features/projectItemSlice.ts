import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

// Define a type for the slice state
interface IProjectItem {
  projectID: string;
  projectName: string;
}

// Define the initial state using that type
const initialState: IProjectItem = {
  projectID: "",
  projectName: "",
};

export const editModeSlice = createSlice({
  name: "projectItem",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setProjectID: (state, action: PayloadAction<string>) => {
      state.projectID = action.payload;
    },
    setProjectName: (state, action: PayloadAction<string>) => {
      state.projectName = action.payload;
    },
  },
});

export const { setProjectID, setProjectName } = editModeSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectProjectItem = (state: RootState) => state.editMode.value;

export default editModeSlice.reducer;
