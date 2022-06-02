import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ProjectMenu.module.css";
import buttons from "../styles/Buttons.module.css";
import { useAppSelector } from "../app/hooks";
import { useEffect } from "react";

const NewProjectMenu = () => {
  const token = useAppSelector((state) => state.auth.token);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Maketionary - New project";
  });

  const createNewProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const language = (document.querySelector("input[name='newproject']") as HTMLInputElement).value;
    axios
      .post(
        `${process.env.REACT_APP_BACKEND}/api/language`,
        { language },
        { headers: { Authorization: token! } }
      )
      .then((res) => {
        localStorage.setItem("project", res.data._id);
        localStorage.setItem("projectName", res.data.name);
        navigate("/");
      })
      .catch((err) => console.log(err.message));
  };

  return (
    <div className={styles.menu}>
      <form className={styles["form-new-project"]} onSubmit={(e) => createNewProject(e)}>
        <label htmlFor="newproject" className={styles.label}>
          New project
        </label>
        <input name="newproject" className={styles.input} />
        <div className={buttons["wrapper-btns"]}>
          <button type="submit" className={buttons["btn-open"]}>
            Create
          </button>
          <button type="submit" className={buttons["btn-cancel"]} onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewProjectMenu;
