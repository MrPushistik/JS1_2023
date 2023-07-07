// управление кнопками просмотра заявок
const requestButtons = {
    "NEW": {
        elem: document.querySelector(".new_requests"),
        src: "/guestRequest/volunteer/forNewApplication",
        showType: false,
        buttonName: "Обработать",
        haveForm: true
    },
    "AT WORK": {
        elem: document.querySelector(".work_requests"),
        src: "/guestRequest/volunteer/forWorkApplication",
        showType: true,
        buttonName: "Редактировать",
        haveForm: true
    },
    "CANCELLED": {
        elem: document.querySelector(".cancelled_requests"),
        src: "/guestRequest/volunteer/forCancelledApplication",
        showType: true,
        buttonName: "Просмотреть",
        haveForm: false
    },
    "COMPLETED": {
        elem: document.querySelector(".completed_requests"),
        src: "/guestRequest/volunteer/forCompletedApplication",
        showType: true,
        buttonName: "Просмотреть",
        haveForm: false
    },
}

const matches = {
    keys: [null,"NEW", "AT WORK", "CANCELLED", "COMPLETED", "PSYCHO", "HUMANITARIAN", "ADDRESS", "OTHER"],
    values: ["Не установлен","Новая", "В работе", "Отменена", "Выполнена", "Психологическая", "Гуманитарная", "Адресная", "Иная"],
    "NEW" : "Новая",
    "AT WORK": "В работе",
    "CANCELLED": "Отменена",
    "COMPLETED": "Выполнена",
    "PSYCHO": "Психологическая",
    "HUMANITARIAN": "Гуманитарная",
    "ADDRESS": "Адресная",
    "OTHER": "Иная",
}

for (let key in requestButtons) {
    requestButtons[key].elem.onclick = () => {
        requestSorts.date.currOption = 0;
        axios.get(serverURL + requestButtons[key].src, H)
        .then(res=>createRequestsTable(res.data))
        .catch(err=>console.log(err));
    }
}

//получить таблицу запросов
const createRequestsTable = (data) => {
 
    const holder = document.querySelector(".pg-data-holder");

    if (data.length == 0) {
        holder.innerHTML = "<p>Заявок по данному статусу не найдено</p>";
        return;
    }
    else holder.innerHTML = "";

    const key = data[0].status;
    const sorts = createRequestSorts(data);

    const table = document.createElement("div");
    table.className = "table"
    table.innerHTML = 
    `
    <div class="table-header">
        <div class="table-row">
            <p class="table-cell">№</p>
            <p class="table-cell">Дата Создания</p>
            <p class="table-cell">ФИО</p>
            <p class="table-cell">Телефон</p>
            <p class="table-cell">Комментарий</p>
            <p class="table-cell">Тип Помощи</p> 
            <p class="table-cell">Действие</p>
        </div>
    </div>
    <div class="table-body pg-requests">

    </div>
    `

    const requests = table.querySelector(".pg-requests");
    data.forEach(elem => {
        requests.appendChild(createTableRow(elem));
    });

    holder.appendChild(sorts);
    holder.appendChild(table);
}

//создать строку в таблице
const createTableRow = (elem) => {

    let tableRow = document.createElement("div");
    tableRow.className = "table-row"
    tableRow.innerHTML = 
    `
    <p class="table-cell table-col-1">${elem.id}</p>
    <p class="table-cell table-col-2">${new Date(elem.createdAt).toLocaleString()}</p>
    <p class="table-cell table-col-1">${elem.surname + " " + elem.name + " " + elem.patronymic}</p>
    <p class="table-cell table-col-2">${elem.phone}</p>
    <p class="table-cell table-col-1">${elem.commentGuest}</p>
    <p class="table-cell table-col-2">${matches.values[matches.keys.indexOf(elem.typeAssistance)]}</p>
    <div class="table-cell table-col-1">
        <button type="button" class="pg-reduct read-button td-button">${requestButtons[elem.status].buttonName}</button>
        ${role == "ADMIN" && elem.status != "AT WORK" ? `<button type="button" class="pg-delete delete-button td-button">Удалить</button>` : ""}
    </div>
    `

    tableRow.querySelector(".pg-reduct").onclick = () => {
        command = "/guestRequest/volunteer/fullRequest/";
    
        axios.get(serverURL + command + elem.id, H)
        .then(res=>showRequest(res.data))
        .catch(err=>console.log(err));
    }
    
    let del = tableRow.querySelector(".pg-delete");
    if (del){
        del.onclick = () => {
            command = "/guestRequest/admin/req/";
        
            axios.delete(serverURL + command + elem.id, H)
            .then(res=>console.log(res))
            .catch(err=>console.log(err));
        
            axios.get(serverURL + requestButtons[elem.status].src, H)
            .then(res=>createRequestsTable(res.data, elem.status))
            .catch(err=>console.log(err));
        }
    }

    return tableRow;
}

//показать подробные сведения о заявке
const showRequest = (data) => {
    const holder = document.querySelector(".pg-data-holder");
    holder.innerHTML = "";
    holder.appendChild(createRequestCard(data));
}

//создать карточку заявки
const createRequestCard = (elem) => {

    let card = document.createElement("div");
    card.className = "req-card"
    card.innerHTML = 
    `
    <div class="req-card-header">
        <div class="req-card-header-data">
            <p class="req-card-title">Заявка №${elem.id}</p>
            <p class="req-card-date">${new Date(elem.createdAt).toLocaleString()}</p>
        </div>
        <button class="pg-close req-card-close">x</button>
    </div>

    <div class="req-card-guest">
        <div class="req-guest-data">
            <p class="req-guest-name">${elem.surname + " " + elem.name + " " + elem.patronymic}</p>
            <p class="req-guest-phone">${elem.phone}</p>
        </div>
        <p class="req-guest-comment">${elem.commentGuest}</p>
    </div>
    `
    if (requestButtons[elem.status].haveForm) card.appendChild(createForm(elem.id, elem.status, elem.typeAssistance));
    else card.appendChild(createInfo(elem.status, elem.typeAssistance))

    card.querySelector(".pg-close").onclick = () => {
        requestButtons[elem.status].elem.click();
    }

    if (elem.comments.length > 0) {
        
        let comments = document.createElement("div");

        comments.className="req-comments";
        comments.innerHTML= 
        `
        <div class="req-comments-header">
            <p class="req-comments-title">Комментарии волонтеров</p>
        </div>
        `
        elem.comments.forEach(elem => {

            let comment = document.createElement("div");
            comment.className = "req-comment";
            comment.innerHTML = 
            `
            <div class="req-comment-data">
                <p class="req-comment-name">${elem.user.surname + " " + elem.user.name + " " + elem.user.patronymic}</p>
                <p class="req-comment-date">${new Date(elem.createdAt).toLocaleString()}</p>
            </div>

            <p class="req-comment-comment">${elem.content}</p>
            `
            comments.appendChild(comment);
        });

        card.appendChild(comments);
    }

    return card;
}

//создать форму редактирования заявки
const createForm = (id, status, assistance) => {

    let form = document.createElement("form");
    form.className = "req-card-form";
    form.innerHTML = 
    `
    <div class="req-form-selects">
        <div class="req-form-status">
            <label>Статус заявки</label>
            <select class="pg-select-status">
                ${status == "NEW" ? `<option value="NEW">Новая</option>` : ""}
                <option value="AT WORK">В работе</option>
                <option value="CANCELLED">Отклонена</option>
                <option value="COMPLETED">Выполнена</option>
            <select>
        </div>

        <div class="req-form-assistance">
            <label>Тип помощи</label>
            <select class="pg-select-assistance">
                ${status == "NEW" ? `<option value>Не установлен</option>` : ""}
                <option value="PSYCHO">Психологическая</option>
                <option value="HUMANITARIAN">Гуманитарная</option>
                <option value="ADDRESS">Адресная</option>
                <option value="OTHER">Иная</option>
            <select>
        </div>
    </div>

    <div class="req-form-comment">
        <label>Комментировать</label>
        <textarea class="pg-comment"></textarea>
    </div>

    <button type="submit" class="req-form-submit">Сохранить изменения</button>
    `

    if (status) form.querySelector(`.pg-select-status option[value="${status}"]`).selected = true;
    if (assistance) form.querySelector(`.pg-select-assistance option[value="${assistance}"]`).selected = true;

    form.onsubmit = (e) => {

        e.preventDefault();

        let statusS = form.querySelector(".pg-select-status").value;
        let assistanceS = form.querySelector(".pg-select-assistance").value;
        let comment = form.querySelector(".pg-comment").value;

        if (statusS != status){
            commandA = "/guestRequest/volunteer/req/updateStatus/";
            axios.put(serverURL + commandA + id, {status: statusS}, H)
            .then(res=>console.log(res))
            .catch(err=>console.log(err));
        }

        if (assistanceS != assistance){
            commandB = "/guestRequest/volunteer/req/updateAssistance/";
            axios.put(serverURL + commandB + id, {typeAssistance: assistanceS}, H)
            .then(res=>console.log(res))
            .catch(err=>console.log(err));
        }

        if (comment){
            commandC = "/commentingApplication";
            axios.post(serverURL + commandC, {content: comment, userId: 1, guestRequestId: id}, H)
            .then(res=>console.log(res))
            .catch(err=>console.log(err));
        }
 
        commandD = "/guestRequest/volunteer/fullRequest/";
        axios.get(serverURL + commandD + id, H)
        .then(res=>showRequest(res.data))
        .catch(err=>console.log(err));
    }

    return form;
}

//выдать блок информации
const createInfo = (status, assistance) => {
    let data = document.createElement("div");
    data.className = "req-info-selects";
    data.innerHTML = 
    `
    <div class="req-info">
        <p class="req-info-title">Статус</p>
        <p class="req-info-value">${status}</p>
    </div>

    <div class="req-info">
        <p class="req-info-title">Тип помощи</p>
        <p class="req-info-value">${assistance}</p>
    </div>
    `
    return data;
}


//шаблон сортировок
const requestSorts = {
    date: {
        name: "По дате создания",
        class: "pg-date-sort",
        options: [
            {name: "Сначала новые", sort: (data) => data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))},
            {name: "Сначала старые", sort: (data) => data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))},
        ],
        currOption: 0,
        maxOption: 2,
    }
}


//блок сортировки
const createRequestSorts = (data, key) => {

    const block = document.createElement("div");
    block.className = "request-sorts";
    block.innerHTML =
    `
    <p class="request-sorts-title">Сортировки</p>
    <div class="pg-sorts request-sorts-keeper">
        
    </div>
    `

    const sorts = block.querySelector(".pg-sorts");
    for (let key in requestSorts){

        let sort = document.createElement("div");
        let elem = requestSorts[key];
        
        //<p>${elem.name}</p>
        sort.innerHTML =
        `
            <button type="button" class="${elem.class} request-sorts-button"}">${elem.options[elem.currOption].name}</button>
        `

        let button = sort.querySelector(`.${elem.class}`);
        button.onclick = () => {
            elem.currOption = (elem.currOption + 1) % elem.maxOption;
            button.innerHTML = elem.options[elem.currOption].name;
            createRequestsTable(elem.options[elem.currOption].sort(data), key);
        }

        sorts.appendChild(sort);
    }

    return block;
}