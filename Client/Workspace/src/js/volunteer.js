

const _new = document.querySelector(".new_requests");
const _work = document.querySelector(".work_requests");
const _cancelled = document.querySelector(".cancelled_requests");
const _completed = document.querySelector(".completed_requests");

_new.onclock = () => {
    let serverURL = 'http://localhost:3001/api';
    let url_adduser = '/guestRequest/volunteerForNewApplication';

    axios.get(serverURL+url_adduser)
    .then(res=>getNewRequest(res.data))
    .catch(err=>console.log(err));
}

const getNewRequest = (data) => {

    const requests = document.querySelector(".requests");

    data.forEach(elem => {
        let tableRaw = document.createElement("tr");
        tableRaw.innerHTML = fillTableRaw(elem);
        requests.appendChild(tableRaw);
    });
}

const fillTableRaw = (elem) => {
    let tableRaw = 
    `
    <td>${elem.id}</td>
    <td>${elem.surname + " " + elem.name + " " + elem.patronymic}</td>
    <td>${elem.phone}</td>
    <td>${elem.createdAt.replace("T", " ").replace("Z", " ")}</td>
    <td>${elem.status}</td>
    <td>${elem.typeAssistance ? elem.typeAssistance : "-"}</td>
    `
    return tableRaw;
}

axios.get(serverURL+url_adduser)
.then(res=>getNewRequest(res.data))
.catch(err=>console.log(err));

