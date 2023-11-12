import React, { useState } from "react";
import { CreateCont } from "./CreateCont";

function LoginAnime(props) {
  const value = {
    blurHome: "blur-home",
    disAdmin: "disable-admin-login-page",
  };

  const [state, setState] = useState("Vilas");

  return (
    <CreateCont.Provider value={{ state, ...value }}>
      {props.children}
    </CreateCont.Provider>
  );
}

export { LoginAnime };
