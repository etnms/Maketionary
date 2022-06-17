import axios from "axios"
import { IWordDb } from "../interfaces/interfaceWord";

export const downloadJSON = (token: string, projectID: string, projectName: string) => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND}/api/download/json`,
      headers: { Authorization: token! },
      params: { projectID },
    })
      .then((res) => {
        const fileName = projectName;
        // Sort data
        const sortedData = res.data.results.words.sort((a: IWordDb, b: IWordDb) =>
          a.word > b.word ? 1 : a.word === b.word ? 0 : -1
        );
        // Stringify
        const json = JSON.stringify(sortedData);
        const blob = new Blob([json], { type: "application/json" });
        // Create and click on anchor element to download the results
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = `${fileName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => console.log(err));
  };

export const downloadRTF = (token: string, projectID: string, projectName: string) => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND}/api/download/rtf`,
      headers: { Authorization: token! },
      params: { projectID },
      responseType: 'blob',
    })
      .then((res) => {
        const fileName = projectName;
        const blob = new Blob([res.data], { type: "text/plain" });
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = `${fileName}.rtf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => console.log(err));
  };

  export const downloadDocx = (token: string, projectID: string, projectName: string) => {
    axios({
      method: "get",
      url: `${process.env.REACT_APP_BACKEND}/api/download/docx`,
      headers: { Authorization: token! },
      params: { projectID },
      responseType: 'blob',
    })
      .then((res) => {
        const fileName = projectName;
        const blob = new Blob([res.data]);
        const href = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = href;
        link.download = `${fileName}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((err) => console.log(err));
  };