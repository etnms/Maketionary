import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";
import { IUserProject } from "../interfaces/interfaceProjectItem";

// Define a type for the slice state
interface IProjectItem {
  projectID: string;
  projectName: string;
  projectCreator: IUserProject;
  projectGuests: IUserProject[]
}

// Define the initial state using that type
const initialState: IProjectItem = {
  projectID: "",
  projectName: "",
  projectCreator: {username: "", _id: ""},
  projectGuests: []
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
    setProjectOwner: (state, action: PayloadAction<IUserProject>) => {
      state.projectCreator = action.payload;
    },
    setProjectGuests: (state, action: PayloadAction<IUserProject[]>) => {
      state.projectGuests = action.payload;
    }
  },
});

export const { setProjectOwner, setProjectGuests, setProjectID, setProjectName } = editModeSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectProjectItem = (state: RootState) => state.editMode.value;

export default editModeSlice.reducer;
