import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import NewProjectMenu from "./pages/NewProject";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OpenProject from "./pages/OpenProject";
import { Provider } from "react-redux";
import { store } from "./app/store";
import PageNotFound from "./pages/PageNotFound";
import ExpiredSession from "./pages/ExpiredSession";
import Home from "./pages/Home";
import { Suspense } from "react";
import HomeLoader from "./components/Loaders/HomeLoader";
import Settings from "./components/Settings";
import DownloadWindow from "./components/DownloadWindow";

function App() {
  return (
    // Suspense for the sole purpose of having a fallback while waiting on translations
    <Suspense fallback={<HomeLoader/>}>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="settings" element={<Settings/>}/>
            <Route path="download" element={<DownloadWindow/>}/>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/new-project" element={<NewProjectMenu />} />
          <Route path="/open-project" element={<OpenProject />} />
          <Route path="/expired" element={<ExpiredSession />} />
          <Route path="/404" element={<PageNotFound />} />
          <Route path="*" element={<Navigate replace to="/404" />} />
        </Routes>
      </BrowserRouter>
    </Provider>
    </Suspense>
  );
}

export default App;
