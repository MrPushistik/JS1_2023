const serverURL = 'http://localhost:3001/api';
let role = JSON.parse(localStorage.getItem("user")).role;
let tokenStr = localStorage.getItem("token");
let H = { headers: {"Authorization" : `Bearer ${tokenStr}`} }

