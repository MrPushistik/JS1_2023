const form = document.querySelector(".auth");

form.onsubmit = (e) => {
    e.preventDefault();

    const login = form.querySelector("#login").value;
    const password = form.querySelector("#password").value;

    command = "/user/login";
    axios.post(serverURL + command, {login: login, password: password})
    .then(res=>{
        setToken(res.data);
        e.target.reset();
        createAlert("Вход выполнен успешно");
        switch((JSON.parse(localStorage.getItem("user"))).role){
            case "ADMIN": window.location.href="/admin.html"; break;
            case "VOLUNTEER": window.location.href="/volunteer.html"; break;
        }
    })
    .catch(err=>{console.log(err); createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message), e.target.reset()});
}

const setToken = (data) => {
    document.cookie = "token="+data.token;
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(parseJwt(data.token)));
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
   
    return JSON.parse(jsonPayload);
}