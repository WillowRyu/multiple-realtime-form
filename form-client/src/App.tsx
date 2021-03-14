import React, { useEffect } from "react";
import { socket } from "./core";
import { FormContainer } from "./form";

function App() {
  useEffect(() => {
    socket.connect();
  }, []);
  return <FormContainer />;
}

export default App;
