import pageStyle from "../../styles/PageOverlay.module.css";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const ReceivedRequestMenu = () => {
  const navigate = useNavigate();
  return (
    <div className={pageStyle.page}>
      <div className={pageStyle.box}>
        <button onClick={() => navigate("/dashboard")} className={pageStyle["btn-close"]}>
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default ReceivedRequestMenu;
