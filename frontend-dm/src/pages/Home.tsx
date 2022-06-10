import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    document.title = "Maketionary";
    if (localStorage.getItem("darktheme") === "darktheme")
      document.documentElement.setAttribute("data-color-scheme", "dark");
    else document.documentElement.setAttribute("data-color-scheme", "light");
  });
  return <div></div>;
};

export default Home;
