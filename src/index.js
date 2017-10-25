import React from "react";
import { render } from "react-dom";
import GraphiQLApp from "./components/GraphiQLApp";
import "./index.css";

render(<GraphiQLApp />, document.getElementById("graphiql"));
