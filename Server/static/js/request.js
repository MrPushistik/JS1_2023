//получить таблицу запросов
const createRequestsTable = (data) => {
 
    const holder = document.querySelector(".pg-data-holder");

    if (data.length == 0) {
        holder.innerHTML = `<p class="no-requests">Заявок по данному статусу не найдено</p>`;
        return;
    }
    else holder.innerHTML = "";

    const sorts = createRequestSorts(data);

    const table = document.createElement("div");
    table.className = "table";
    table.innerHTML = 
    `
    <div class="table-header">
        <div class="table-row">
            <p class="table-cell request-cell">№</p>
            <p class="table-cell request-cell">Дата Создания</p>
            <p class="table-cell request-cell">ФИО</p>
            <p class="table-cell request-cell">Телефон</p>
            <p class="table-cell request-cell">Комментарий</p>
            <p class="table-cell request-cell">Тип Помощи</p> 
            <p class="table-cell request-cell">Действие</p>
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
    tableRow.className = "table-row";
    tableRow.innerHTML = 
    `
    <p class="table-cell request-cell">${elem.id}</p>
    <p class="table-cell request-cell">${new Date(elem.createdAt).toLocaleString()}</p>
    <p class="table-cell request-cell">${elem.surname + " " + elem.name + " " + elem.patronymic}</p>
    <p class="table-cell request-cell">${elem.phone}</p>
    <p class="table-cell request-cell">${elem.commentGuest}</p>
    <p class="table-cell request-cell">${matches.values[matches.keys.indexOf(elem.typeAssistance)]}</p>
    <div class="table-cell request-cell">
        <button type="button" class="pg-reduct read-button td-button">${requestButtons[elem.status].buttonName}</button>
        ${role == "ADMIN" && elem.status != "AT WORK" ? `<button type="button" class="pg-delete delete-button td-button">Удалить</button>` : ""}
    </div>
    `

    tableRow.querySelector(".pg-reduct").onclick = () => {
        command = "/guestRequest/volunteer/fullRequest/";
    
        axios.get(serverURL + command + elem.id, H)
        .then(res=>showRequest(res.data))
        .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
    }
    
    let del = tableRow.querySelector(".pg-delete");
    if (del){
        del.onclick = () => {
            command = "/guestRequest/admin/req/";
        
            axios.delete(serverURL + command + elem.id, H)
            .then(
                res=>{
                    createAlert("Успешно удалено");

                    axios.get(serverURL + requestButtons[elem.status].src, H)
                    .then(res=>createRequestsTable(res.data, elem.status))
                    .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
                }
            )
            .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
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
    card.className = "req-card";
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
        document.querySelector(`.${requestButtons[elem.status].targClass}`).click();
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

    form.querySelector(`.pg-select-status option[value="${status}"]`).selected = true;
    if (assistance) form.querySelector(`.pg-select-assistance option[value="${assistance}"]`).selected = true;

    form.onsubmit = (e) => {

        e.preventDefault();

        let statusS = form.querySelector(".pg-select-status").value;
        let assistanceS = form.querySelector(".pg-select-assistance").value;
        let comment = form.querySelector(".pg-comment").value;

        if (!assistanceS) assistanceS = null;

        if (statusS != status){
            commandA = "/guestRequest/volunteer/req/updateStatus/";
            axios.put(serverURL + commandA + id, {status: statusS}, H)
            .then(res=>(e.target.reset(),createAlert("Статус изменен успешно")))
            .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message); e.target.reset()});
        }

        if (assistanceS != assistance){
            commandB = "/guestRequest/volunteer/req/updateAssistance/";
            axios.put(serverURL + commandB + id, {typeAssistance: assistanceS}, H)
            .then(res=>(e.target.reset(),createAlert("Тип помощи изменен успешно")))
            .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message); e.target.reset()});
        }

        if (comment){
            commandC = "/commentingApplication";
            axios.post(serverURL + commandC, {content: comment, userId: JSON.parse(localStorage.getItem("user")).userId, guestRequestId: id}, H)
            .then(res=>(e.target.reset(),createAlert("Комментарий создан успешно")))
            .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message); e.target.reset()});
        }
 
        commandD = "/guestRequest/volunteer/fullRequest/";
        axios.get(serverURL + commandD + id, H)
        .then(res=>showRequest(res.data))
        .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
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
        <p class="req-info-value">${matches.values[matches.keys.indexOf(status)]}</p>
    </div>

    <div class="req-info">
        <p class="req-info-title">Тип помощи</p>
        <p class="req-info-value">${matches.values[matches.keys.indexOf(assistance)]}</p>
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
const createRequestSorts = (data) => {

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
            <button type="button" class="${elem.class} request-sorts-button">${elem.options[elem.currOption].name}</button>
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

addEventListener("click", (e) => {
    let targ = e.target;

    if (targ.classList.contains("request-nav-button-dis")){

        let active = document.querySelector(".request-nav-button-active");

        if (active){
            active.classList.remove("request-nav-button-active");
            active.classList.add("request-nav-button-dis");
        }

        targ.classList.remove("request-nav-button-dis");
        targ.classList.add("request-nav-button-active");
    }
})
