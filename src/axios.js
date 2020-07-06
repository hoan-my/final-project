//creating copy of axios

import axios from "axios";

var copy = axios.create({
    xsrfCookieName: "mytoken",
    xsrfHeaderName: "csrf-token",
});

export default copy;
