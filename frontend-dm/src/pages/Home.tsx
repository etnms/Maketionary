import "./Home.css";
import TopNav from "../components/TopNav";
import ListWords from "../components/ListWords";
import CreateWordMenu from "../components/CreateWordMenu";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND}/api/dashboard`, { headers: { authorization: token! }})
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  });

  return (
    <div className="App">
      <TopNav />
      <div className="wrapper-main">
        <CreateWordMenu />
        <ListWords />
      </div>
    </div>
  );
};

export default Home;
