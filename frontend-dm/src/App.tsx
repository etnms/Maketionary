import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NewProjectMenu from "./pages/NewProject";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OpenProject from "./pages/OpenProject";
import { Provider } from "react-redux";
import {store} from './app/store';
import PageNotFound from "./pages/PageNotFound";
import ExpiredSession from "./pages/ExpiredSession";

function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/new-project" element={<NewProjectMenu/>}/>
        <Route path="/open-project" element={<OpenProject/>}/>
        <Route path="/expired" element={<ExpiredSession/>}/>
        <Route path="/404" element={<PageNotFound/>}/>
        <Route path="*" element={<Navigate replace to="/404"/>}/>
      </Routes>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
