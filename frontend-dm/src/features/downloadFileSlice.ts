import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISettings {

  isFileDownloading: boolean;
  errorDownload: boolean;
}

const initialState: ISettings = {

  isFileDownloading: false,
  errorDownload: false
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {

    setIsFileDownloading: (state, action: PayloadAction<boolean>) => {
      state.isFileDownloading = (action.payload)
    },
    setErrorDownload: (state, action: PayloadAction<boolean>) => {
      state.errorDownload = (action.payload)
    }
  },
});

export const { setIsFileDownloading, setErrorDownload } = settingsSlice.actions;

export default settingsSlice.reducer;
