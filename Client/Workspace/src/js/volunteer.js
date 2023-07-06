const serverURL = 'http://localhost:3001/api';


// управление кнопками
const buttons = {
    "NEW": {
        elem: document.querySelector(".new_requests"),
        src: "/guestRequest/volunteer/forNewApplication",
        showType: false,
        buttonName: "Обработать",
        haveForm: true,
    },
    "AT WORK": {
        elem: document.querySelector(".work_requests"),
        src: "/guestRequest/volunteer/forWorkApplication",
        showType: true,
        buttonName: "Редактировать",
        haveForm: true,
    },
    "CANCELLED": {
        elem: document.querySelector(".cancelled_requests"),
        src: "/guestRequest/volunteer/forCancelledApplication",
        showType: true,
        buttonName: "Просмотр",
        haveForm: false,
    },
    "COMPLETED": {
        elem: document.querySelector(".completed_requests"),
        src: "/guestRequest/volunteer/forCompletedApplication",
        showType: true,
        buttonName: "Просмотр",
        haveForm: false,
    },
}

let tokenStr = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibG9naW4iOiJtcnAyIiwicm9sZSI6IlZPTFVOVEVFUiIsImlhdCI6MTY4ODYzNzUzMSwiZXhwIjoxNjg4NzIzOTMxfQ.s-b5cpTJUqORHFb_x4_Rn2E9CvFBAFnMtBRUY_J7oSA"
let H = { headers: {"Authorization" : `Bearer ${tokenStr}`} }

for (let key in buttons) {
    buttons[key].elem.onclick = () => {
        axios.get(serverURL + buttons[key].src, H)
        .then(res=>getRequests(res.data, key))
        .catch(err=>console.log(err));
    }
}

//получить таблицу запросов
const getRequests = (data, key) => {

    const table = document.createElement("table");
    table.innerHTML = 
    `
    <thead>
        <tr>
            <td>Номер</td>
            <td>Дата Создания</td>
            <td>ФИО</td>
            <td>Телефон</td>
            <td>Комментарий</td>
            ${
                key != "NEW" 
                ? `<td>Тип Помощи</td>`
                : ""
            }
            <td>Действие</td>
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
    console.log(elem)
    tableRow.innerHTML = 
    `
    <td>${elem.id}</td>
    <td>${elem.createdAt.replace("T", " ").replace("Z", " ")}</td>
    <td>${elem.surname + " " + elem.name + " " + elem.patronymic}</td>
    <td>${elem.phone}</td>
    <td>${elem.commentGuest}</td>
    ${
        buttons[elem.status].showType
        ? `<td>${elem.typeAssistance}</td>`
        : ""
    }
    <td><button class="pg-reduct">${buttons[elem.status].buttonName}</button><td>
    `

    tableRow.querySelector(".pg-reduct").onclick = () => {
        command = "/guestRequest/volunteer/fullRequest/";

        axios.get(serverURL + command + elem.id, H)
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
    console.log(elem)
    card.innerHTML = 
    `
    <div>
        <p>${elem.id}</p>
        <p>${elem.createdAt}</p>
    </div>

    <div>
        <p>${elem.surname + " " + elem.name + " " + elem.patronymic}</p>
        <p>${elem.phone}</p>
        <p>${elem.commentGuest}</p>
    </div>

    <div class="pg-comments"></div>
    `
    if (buttons[elem.status].haveForm) card.appendChild(createForm(elem.id, elem.status, elem.typeAssistance));
    else card.appendChild(createInfo(elem.status, elem.typeAssistance))

    let comments = document.createElement("div");
    elem.comments.forEach(elem => {

        let comment = document.createElement("div");
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

    card.appendChild(comments);

    return card;
}

const matches = {
    "NEW" : "Новая",
    "AT WORK": "В работе",
    "CANCELLED": "Отменена",
    "COMPLETED": "Выполнена",
    "PSYCHO": "Психологическая",
    "HUMANITARIAN": "Гуманитарная",
    "ADDRESS": "Адресная",
    "OTHER": "Иная",
}

const createForm = (id, status, assistance) => {

    let form = document.createElement("form");
    form.innerHTML = 
    `
    <select class="pg-select-status">
        ${status == "NEW" ? `<option value="NEW">Новая</option>` : ""}
        <option value="AT WORK">В работе</option>
        <option value="CANCELLED">Отклонена</option>
        <option value="COMPLETED">Выполнена</option>
    <select>

    <select class="pg-select-assistance">
        ${status == "NEW" ? `<option value>Не выбрано</option>` : ""}
        <option value="PSYCHO">Психологическая</option>
        <option value="HUMANITARIAN">Гуманитарная</option>
        <option value="ADDRESS">Адресная</option>
        <option value="OTHER">Иная</option>
    <select>

    <textarea class="pg-comment">
    </textarea>

    <button type="submit">Сохранить изменения</button>
    `

    if (status) form.querySelector(`.pg-select-status option[value="${status}"]`).selected = true;
    if (assistance) form.querySelector(`.pg-select-assistance option[value="${assistance}"]`).selected = true;

    form.onsubmit = (e) => {

        e.preventDefault();

        let statusS = form.querySelector(".pg-select-status").value;
        let assistanceS = form.querySelector(".pg-select-assistance").value;
        let comment = form.querySelector(".pg-comment").value;
        
        commandA = "/guestRequest/volunteer/req/updateRequest/"
        axios.put(serverURL + commandA + id, {status: statusS, typeAssistance: assistanceS}, H)
        .then(res=>console.log(res))
        .catch(err=>console.log(err));

        if (comment)
            commandB = "/commentingApplication"
            axios.post(serverURL + commandB, {content: comment, userId: 1, guestRequestId: id}, H)
            .then(res=>console.log(res))
            .catch(err=>console.log(err));

        commandC = "/guestRequest/volunteer/fullRequest/";
        axios.get(serverURL + commandC + id, H)
        .then(res=>showRequest(res.data))
        .catch(err=>console.log(err));
    }

    return form;
}

const createInfo = (status, assistance) => {
    let data = document.createElement("div");
    data.innerHTML = 
    `
    <p>${status}</p>
    <p>${assistance}</p>
    `
    return data;
}