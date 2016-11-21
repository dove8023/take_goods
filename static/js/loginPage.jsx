let React = require("react");
let ReactDOM= require("react-dom");
import LoginFrom from "./components/loginForm";

ReactDOM.render(
    <LoginFrom api="/api/login" />,
    document.getElementById('example')
);