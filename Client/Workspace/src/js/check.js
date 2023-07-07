
role = JSON.parse(localStorage.getItem("user")).role;
tokenStr = localStorage.getItem("token");
H = { headers: {"Authorization" : `Bearer ${tokenStr}`} }

