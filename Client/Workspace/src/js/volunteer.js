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

const getRequests = (data) => {

    const table = document.createElement("table");
    table.innerHTML = 
    `
    <thead>
        <tr>
            <td>Номер</td>
            <td>ФИО</td>
            <td>Телефон</td>
            <td>Дата Создания</td>
            <td>Статус</td>
            <td>Вид Помощи</td>
            <td>Редактировать</td>
        </tr>
    </thead>
    <tbody class="pg-requests">

    </tbody>
    `

    const requests = table.querySelector(".pg-requests");

    data.forEach(elem => {
        requests.appendChild(createTableRaw(elem));
    });

    const holder = document.querySelector(".pg-data-holder");
    holder.innerHTML = "";
    holder.appendChild(table);
}

const createTableRaw = (elem) => {
    let tableRow = document.createElement("tr");
    tableRow.innerHTML = 
    `
    <td>${elem.id}</td>
    <td>${elem.surname + " " + elem.name + " " + elem.patronymic}</td>
    <td>${elem.phone}</td>
    <td>${elem.createdAt.replace("T", " ").replace("Z", " ")}</td>
    <td>${elem.status}</td>
    <td>${elem.typeAssistance ? elem.typeAssistance : "-"}</td>
    <td><button class="pg-reduct">Редактировать</button><td>
    `

    tableRow.querySelector(".pg-reduct").onclick = () => {
        showRequest(elem.id);
    }

    return tableRow;
}

for (let key in buttons) {
    buttons[key].elem.onclick = () => {
        axios.get(serverURL + buttons[key].src)
        .then(res=>getRequests(res.data))
        .catch(err=>console.log(err));
    }
}

const showRequest = (id) => {
    command = "/guestRequest/fullRequest/";

    axios.get(serverURL + command + id)
    .then(res=>console.log(res))
    .catch(err=>console.log(err));
}

const createCard = (elem) => {
    let card = document.createElement("div");
    card.innerHTML = 
    `
    <div>
        <p>${elem.surname + " " + elem.name + " " + elem.patronymic}</p>
        <p>${elem.phone}</p>
    </div>

    <div>
        <p>${elem.createdAt}</p>
        <p>${elem.statuse}</p>
        <p>${elem.typeAssistance}</p>
    </div>

    <div>
        <div class="pg-comments">

        </div>

        <button class="pg-add-comment">Добавить комментарий</button>
    </div>
    `
}


