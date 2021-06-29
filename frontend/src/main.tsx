import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Dapp } from "./components/Dapp";

// We import bootstrap here, but you can remove if you want
import "bootstrap/dist/css/bootstrap.css";

ReactDOM.render(
    <React.StrictMode>
        <Dapp />
    </React.StrictMode>,
    document.getElementById("root")
);
