const form = document.querySelector(".auth");
const serverURL = 'http://localhost:3001/api';

form.onsubmit = (e) => {
    e.preventDefault();

    const login = form.querySelector("#login").value;
    const password = form.querySelector("#password").value;

    command = "/user/login";
    axios.post(serverURL + command, {login: login, password: password})
    .then(res=>setToken(res.data))
    .catch(err=>console.log(err));
}

const setToken = (data) => {
    localStorage.setItem("token", data.token);
}