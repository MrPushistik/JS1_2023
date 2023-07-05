const serverURL = 'http://localhost:3001/api';

const buttons = {
    _new: {
        elem: document.querySelector(".new_requests"),
        src: "/guestRequest/volunteerForNewApplication",
    },
    _work: {
        elem: document.querySelector(".work_requests"),
        src: "/guestRequest/volunteerForWorkApplication",
    },
    _cancelled: {
        elem: document.querySelector(".cancelled_requests"),
        src: "/guestRequest/volunteerForCancelledApplication",
    },
    _completed: {
        elem: document.querySelector(".completed_requests"),
        src: "/guestRequest/volunteerForCompletedApplication",
    },
}

const getNewRequest = (data) => {

    const requests = document.querySelector(".requests");
    requests.innerHTML = "";

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

for (let key in buttons) {
    buttons[key].elem.onclick = () => {
        axios.get(serverURL + buttons[key].src)
        .then(res=>getNewRequest(res.data))
        .catch(err=>console.log(err));
    }
}


