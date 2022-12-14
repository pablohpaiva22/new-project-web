import React from "react";
import styles from "./SignUp.module.scss";
import useFetch from "../../hooks/useFetch";
import Input from "../../components/general/Input";
import { Link, useNavigate } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalContext";

function SignUp() {
  const [user, setUser] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passCheck, setPassCheck] = React.useState("");
  const { request, loading, error, data } = useFetch();
  const { setLogin } = React.useContext(GlobalContext);
  const navigate = useNavigate();
  const {
    data: loginData,
    loading: loginLoading,
    error: loginError,
    request: loginRequest,
  } = useFetch();
  const {
    data: userData,
    loading: userLoading,
    error: userError,
    request: userRequest,
  } = useFetch();

  function handleSubmit(event) {
    event.preventDefault();

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user,
        email,
        password,
        passCheck,
      }),
    };

    const url = "https://new-project-server.vercel.app/newuser";

    request(url, options);
  }

  React.useEffect(() => {
    if (data) {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      };

      loginRequest("https://new-project-server.vercel.app/login", options);
    }
  }, [data]);

  React.useEffect(() => {
    if (loginData && loginData.token) {
      localStorage.setItem("token", loginData.token);

      setLogin(true);

      const url = "https://new-project-server.vercel.app/getuser";

      const options = {
        method: "GET",
        headers: { authorization: "Bearer " + loginData.token },
      };

      userRequest(url, options);
    }
  }, [loginData, loginError]);

  React.useEffect(() => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      navigate(`/minhaconta/${userData.id}`);
    }
    if (error) {
      navigate("/");
      localStorage.clear();
      setLogin(false);
    }
  }, [userData, userError]);

  return (
    <section className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Criar Novo Usu??rio</h2>

        <Input
          id="newUser"
          type="text"
          value={user}
          setValue={setUser}
          label="Usu??rio"
        />
        <Input
          id="email"
          type="email"
          value={email}
          setValue={setEmail}
          label="E-mail"
          placehoder="email@example.com"
        />
        <Input
          id="password"
          type="password"
          value={password}
          setValue={setPassword}
          label="Senha"
        />
        <Input
          id="passCheck"
          type="password"
          value={passCheck}
          setValue={setPassCheck}
          label="Confirme a senha"
        />

        {loading || loginLoading || userLoading ? (
          <button className={styles.loading} disabled>
            Carregando...
          </button>
        ) : (
          <button>Criar</button>
        )}

        {error && <p className={styles.error}>{error}</p>}

        <p className={styles.footer}>
          J?? ?? cadastrado? Fa??a{" "}
          <Link className={styles.footerLink} to={"/"}>
            Login
          </Link>{" "}
        </p>
      </form>
    </section>
  );
}

export default SignUp;
