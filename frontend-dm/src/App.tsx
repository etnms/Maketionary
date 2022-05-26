import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewProjectMenu from "./pages/NewProjectMenu";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OpenProject from "./pages/OpenProject";
import { Provider } from "react-redux";
import {store} from './app/store';

function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/new-project" element={<NewProjectMenu/>}/>
        <Route path="/open-project" element={<OpenProject/>}/>
      </Routes>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
