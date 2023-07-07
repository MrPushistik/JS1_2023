const serverURL = 'http://localhost:3001/api';

// управление кнопками
const buttons = {
    "USER": {
        elem: document.querySelector(".reg_users"),
        src: "/user/admin/req",
    },
    "NEW": {
        elem: document.querySelector(".new_requests"),
        src: "/guestRequest/volunteer/forNewApplication",
        showType: false,
        buttonName: "Обработать",
        haveForm: true,
        adminCanDelete: true,
    },
    "AT WORK": {
        elem: document.querySelector(".work_requests"),
        src: "/guestRequest/volunteer/forWorkApplication",
        showType: true,
        buttonName: "Редактировать",
        haveForm: true,
        adminCanDelete: false,
    },
    "CANCELLED": {
        elem: document.querySelector(".cancelled_requests"),
        src: "/guestRequest/volunteer/forCancelledApplication",
        showType: true,
        buttonName: "Просмотр",
        haveForm: false,
        adminCanDelete: true,
    },
    "COMPLETED": {
        elem: document.querySelector(".completed_requests"),
        src: "/guestRequest/volunteer/forCompletedApplication",
        showType: true,
        buttonName: "Просмотр",
        haveForm: false,
        adminCanDelete: true,
    },
    "STATUSSTATISTICS": {
        elem: document.querySelector(".status_statistics"),
        src: "/guestRequest/admin/statusStatistics"
    },
    "ASSISTANCESTATISTICS": {
        elem: document.querySelector(".assistance_statistics"),
        src: "/guestRequest/admin/assistanceStatistics"
    },
    "COMPLEXSTATISTICS": {
        elem: document.querySelector(".complex_statistics"),
        src: "/guestRequest/admin/complexStatistics"
    },
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

let tokenStr = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsImxvZ2luIjoiZmdnaGRmaGgiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2ODg2Njg3NTksImV4cCI6MTY4ODc1NTE1OX0.RB8ryh-yKIR3r8j1ePQySIF7Ce-YurmwTM3KpPl5u5E"
let H = { headers: {"Authorization" : `Bearer ${tokenStr}`} }

for (let key in buttons) {
    buttons[key].elem.onclick = () => {
        if (key=="USER"){
            axios.get(serverURL + buttons[key].src, H)
            .then(res=>getUsers(res.data))
            .catch(err=>console.log(err));
        }
        else if(key=="STATUSSTATISTICS"){
            axios.get(serverURL + buttons[key].src, H)
            .then(res=>getStatusStatistics(res.data))
            .catch(err=>console.log(err));
        }
        else if(key=="ASSISTANCESTATISTICS"){
            axios.get(serverURL + buttons[key].src, H)
            .then(res=>getAssistanceStatistics(res.data))
            .catch(err=>console.log(err));
        }
        else if(key=="COMPLEXSTATISTICS"){
            axios.get(serverURL + buttons[key].src, H)
            .then(res=>getComplexStatistics(res.data))
            .catch(err=>console.log(err));
        }
        else{
            axios.get(serverURL + buttons[key].src, H)
            .then(res=>getRequests(res.data, key))
            .catch(err=>console.log(err));
        }
    }
}

//получить таблицу пользователей
const getUsers = (data) => {

    const holder = document.querySelector(".pg-data-holder");

    if (data.length == 0) {
        holder.innerHTML = "<p>Пользователей не найдено</p>";
        return;
    }
    else holder.innerHTML = "";

    const sorts = createSorts(data);

    const table = document.createElement("table");
    table.innerHTML = 
    `
    <thead>
        <tr>
            <td>Номер</td>
            <td>Дата Создания</td>
            <td>ФИО</td>
            <td>Должность</td>
            <td>Место работы/Место учёбы</td>
            <td>Телефон</td>
            <td>Почта</td>
        </tr>
    </thead>
    <tbody class="pg-admins">

    </tbody>
    `

    const admins = table.querySelector(".pg-admins");
    data.forEach(elem => {
        admins.appendChild(createTableRawUser(elem));
    });

    holder.appendChild(sorts);
    holder.appendChild(table);
}

//создать строку в таблице
const createTableRawUser = (elem) => {
    let tableRow = document.createElement("tr");
    tableRow.innerHTML = 
    `
    <td>${elem.id}</td>
    <td>${new Date(elem.createdAt).toLocaleString()}</td>
    <td>${elem.surname + " " + elem.name + " " + elem.patronymic}</td>
    <td>${elem.post}</td>
    <td>${elem.placeWorkOrStudy}</td>
    <td>${elem.phone}</td>
    <td>${elem.email}</td>
    `
    return tableRow;
}


//шаблон сортировок
const sortsObj = {
    date: {
        name: "По дате создания",
        class: "pg-date-sort",
        options: [
            {value: "new", name: "Сначала новые", sort: (data) => data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))},
            {value: "old", name: "Сначала старые", sort: (data) => data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))},
        ],
        currOption: 0,
        maxOption: 2,
    }
}

//блок сортировки
const createSorts = (data) => {
    const block = document.createElement("div");
    block.innerHTML =
    `
    <p>Сортировки</p>
    <div class="pg-sorts">
        
    </div>
    `

    const sorts = block.querySelector(".pg-sorts");
    for (let key in sortsObj){

        let sort = document.createElement("div");
        let elem = sortsObj[key];
        
        sort.innerHTML =
        `
            <p>${elem.name}</p>
            <button type="button" class="${elem.class}" value="${elem.options[elem.currOption].value}">${elem.options[elem.currOption].name}</button>
        `

        let button = sort.querySelector(`.${elem.class}`);
        button.onclick = () => {
            elem.currOption = (elem.currOption + 1) % elem.maxOption;
            button.value = elem.options[elem.currOption].value;
            button.innerHTML = elem.options[elem.currOption].name;
            getRequests(elem.options[elem.currOption].sort(data), key);
        }

        sorts.appendChild(sort);
    }

    return block;
}

//получить таблицу запросов
const getRequests = (data, key) => {

    const holder = document.querySelector(".pg-data-holder");

    if (data.length == 0) {
        holder.innerHTML = "<p>Заявок по данному статусу не найдено</p>";
        return;
    }
    else holder.innerHTML = "";

    const sorts = createSorts(data, key);

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
            ${key != "NEW" ? `<td>Тип Помощи</td>` : ""}
            <td>Действие</td>
        </tr>
    </thead>
    <tbody class="pg-requests">

    </tbody>
    `

    const requests = table.querySelector(".pg-requests");
    data.forEach(elem => {
        requests.appendChild(createTableRawRequest(elem));
    });

    holder.appendChild(sorts);
    holder.appendChild(table);
}

//создать строку в таблице
const createTableRawRequest = (elem) => {

    let tableRow = document.createElement("tr");
    tableRow.innerHTML = 
    `
    <td>${elem.id}</td>
    <td>${new Date(elem.createdAt).toLocaleString()}</td>
    <td>${elem.surname + " " + elem.name + " " + elem.patronymic}</td>
    <td>${elem.phone}</td>
    <td>${elem.commentGuest}</td>
    ${
        buttons[elem.status].showType
        ? `<td>${elem.typeAssistance}</td>`
        : ""
    }
    <td>
        <button type="button" class="pg-reduct">${buttons[elem.status].buttonName}</button>
        ${role == "ADMIN" && buttons[elem.status].adminCanDelete ? `<button type="button" class="pg-delete">Удалить</button>` : ""}
    <td>
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

            axios.get(serverURL + buttons[elem.status].src, H)
            .then(res=>getRequests(res.data, elem.status))
            .catch(err=>console.log(err));
        }
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

//создать форму редактирования заявки
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

    <textarea class="pg-comment"></textarea>

    <button type="submit">Сохранить изменения</button>
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
    data.innerHTML = 
    `
    <p>${status}</p>
    <p>${assistance}</p>
    `
    return data;
}

const getStatusStatistics = (dataSt) => {
    const holder = document.querySelector(".pg-data-holder");
    holder.innerHTML = "<canvas id='statusStatistics' width='200' height='100'></canvas>";
    var ctx = document.getElementById('statusStatistics').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["NEW","AT WORK","CANCELLED","COMPLETED","ALL"],
            datasets: [{
                label: 'Count',
                data: [dataSt["NEW"],dataSt["AT WORK"],dataSt["CANCELLED"],dataSt["COMPLETED"],dataSt["ALL"]],
                backgroundColor: [
                    'rgba(216, 27, 96, 0.6)',
                    'rgba(3, 169, 244, 0.6)',
                    'rgba(255, 152, 0, 0.6)',
                    'rgba(29, 233, 182, 0.6)',
                    'rgba(156, 39, 176, 0.6)'
                ],
                borderColor: [
                    'rgba(216, 27, 96, 1)',
                    'rgba(3, 169, 244, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(29, 233, 182, 1)',
                    'rgba(156, 39, 176, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                display: false
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Stacked Bar chart for pollution status'
                },
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    });
}

const getAssistanceStatistics = (dataSt) => {
    const holder = document.querySelector(".pg-data-holder");
    holder.innerHTML = "<canvas id='assistanceStatistics' width='200' height='100'></canvas>";
    var ctx = document.getElementById('assistanceStatistics').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["ADSRESS","PSYCHO","HUMANITARIAN","OTHER","ALL"],
            datasets: [{
                label: 'Count',
                data: [dataSt["ADSRESS"],dataSt["PSYCHO"],dataSt["HUMANITARIAN"],dataSt["OTHER"],dataSt["ALL"]],
                backgroundColor: [
                    'rgba(216, 27, 96, 0.6)',
                    'rgba(3, 169, 244, 0.6)',
                    'rgba(255, 152, 0, 0.6)',
                    'rgba(29, 233, 182, 0.6)',
                    'rgba(156, 39, 176, 0.6)'
                ],
                borderColor: [
                    'rgba(216, 27, 96, 1)',
                    'rgba(3, 169, 244, 1)',
                    'rgba(255, 152, 0, 1)',
                    'rgba(29, 233, 182, 1)',
                    'rgba(156, 39, 176, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                display: false
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Stacked Bar chart for pollution status'
                },
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    });
}

const getComplexStatistics = (dataSt) => {
    const holder = document.querySelector(".pg-data-holder");
    holder.innerHTML = "<canvas id='ComplexStatistics' width='200' height='100'></canvas>";
    var ctx = document.getElementById('ComplexStatistics').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["ADSRESS","PSYCHO","HUMANITARIAN","OTHER"],
            datasets: [{
                label: 'NEW',
                data: [dataSt["ADSRESS"]["NEW"],dataSt["PSYCHO"]["NEW"],dataSt["HUMANITARIAN"]["NEW"],dataSt["OTHER"]["NEW"],],
                backgroundColor: 
                    'rgba(216, 27, 96, 0.6)'
                ,
                borderColor: 
                    'rgba(216, 27, 96, 1)'
                ,
                borderWidth: 1
            },
            {
                label: 'AT WORK',
                data: [dataSt["ADSRESS"]["AT WORK"],dataSt["PSYCHO"]["AT WORK"],dataSt["HUMANITARIAN"]["AT WORK"],dataSt["OTHER"]["AT WORK"],],
                backgroundColor: 
                    'rgba(3, 169, 244, 0.6)'
                ,
                borderColor: 
                    'rgba(3, 169, 244, 1)'
                ,
                borderWidth: 1
            },
            {
                label: 'CANCELLED',
                data: [dataSt["ADSRESS"]["CANCELLED"],dataSt["PSYCHO"]["CANCELLED"],dataSt["HUMANITARIAN"]["CANCELLED"],dataSt["OTHER"]["CANCELLED"],],
                backgroundColor: 
                    'rgba(255, 152, 0, 0.6)'
                ,
                borderColor: 
                    'rgba(255, 152, 0, 1)'
                ,
                borderWidth: 1
            },
            {
                label: 'COMPLETED',
                data: [dataSt["ADSRESS"]["COMPLETED"],dataSt["PSYCHO"]["COMPLETED"],dataSt["HUMANITARIAN"]["COMPLETED"],dataSt["OTHER"]["COMPLETED"],],
                backgroundColor: 
                    'rgba(29, 233, 182, 0.6)'
                ,
                borderColor: 
                    'rgba(29, 233, 182, 1)'
                ,
                borderWidth: 1
            },
            {
                label: 'ALL',
                data: [dataSt["ADSRESS"]["ALL"],dataSt["PSYCHO"]["ALL"],dataSt["HUMANITARIAN"]["ALL"],dataSt["OTHER"]["ALL"],],
                backgroundColor: 
                    'rgba(156, 39, 176, 0.6)'
                ,
                borderColor: 
                    'rgba(156, 39, 176, 1)'
                ,
                borderWidth: 1
            },]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Stacked Bar chart for pollution status'
                },
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true
                }
            }
        }
    });
}

