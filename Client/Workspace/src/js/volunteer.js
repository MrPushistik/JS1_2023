const serverURL = 'http://localhost:3001/api';


// управление кнопками
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

let tokenStr = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibG9naW4iOiJtcnAyIiwicm9sZSI6IlZPTFVOVEVFUiIsImlhdCI6MTY4ODU1MDUxNywiZXhwIjoxNjg4NjM2OTE3fQ.2MLWybnzW6pwVRMVx1O944XjXWZeUlJI3JxG35YqraQ"

for (let key in buttons) {
    buttons[key].elem.onclick = () => {
        axios.get(serverURL + buttons[key].src, { headers: {"Authorization" : `Bearer ${tokenStr}`} })
        .then(res=>getRequests(res.data))
        .catch(err=>console.log(err));
    }
}

//получить таблицу запросов
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

//создать строку в таблице
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
        command = "/guestRequest/fullRequest/";

        axios.get(serverURL + command + id)
        .then(res=>showRequest(res.data))
        .catch(err=>console.log(err));
    }

    return tableRow;
}

//показать подробные сведения о заявке
const showRequest = (data) => {
    const holder = document.querySelector(".pg-data-holder");
    holder.innerHTML = "";
    holder.appendChild(createCard(data));
}

//создать карточку заявки
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

    let comments = card.querySelector(".pg-comments");
    elem.comments.forEach(elem => {

        let comment = createElement("div");
        comment.innerHTML = 
        `
        <div>
            <p>${elem.user.surname + " " + elem.user.name + " " + elem.user.patronymic}</p>
            <p>${elem.createdAt}</p>
        </div>

        <div>
            <p>${elem.content}
        </div>
        `
        comments.appendChild(comment);
    });

    return card;
}


