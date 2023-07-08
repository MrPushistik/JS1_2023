// управление кнопками
const adminButtons = {
    "USER": {
        elem: document.querySelector(".reg_users"),
        src: "/user/admin/req",
        action: (data) => getUsers(data)
    },
    "FEEDBACK": {
        elem: document.querySelector(".reg_feedbacks"),
        src: "/feedback/",
        action: (data) => getFeedbacks(data)
    },
    "STATUSSTATISTICS": {
        elem: document.querySelector(".status_statistics"),
        src: "/guestRequest/admin/statusStatistics",
        action: (data) => getStatusStatistics(data)
    },
    "ASSISTANCESTATISTICS": {
        elem: document.querySelector(".assistance_statistics"),
        src: "/guestRequest/admin/assistanceStatistics",
        action: (data) =>  getAssistanceStatistics(data)
    },
    "COMPLEXSTATISTICS": {
        elem: document.querySelector(".complex_statistics"),
        src: "/guestRequest/admin/complexStatistics",
        action: (data) => getComplexStatistics(data)
    },
}

//получить таблицу пользователей
const getUsers = (data) => {

    const holder = document.querySelector(".pg-data-holder");

    if (data.length == 0) {
        holder.innerHTML = "<p>Пользователей не найдено</p>";
        return;
    }
    else holder.innerHTML = "";

    const sorts = createUserSorts(data);

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
            <td>Действие</td>
        </tr>
    </thead>
    <tbody class="pg-admins">

    </tbody>
    `

    const admins = table.querySelector(".pg-admins");
    data.forEach(elem => {
        admins.appendChild(createTableRowUser(elem));
    });

    holder.appendChild(sorts);
    holder.appendChild(table);
}

//создать строку в таблице
const createTableRowUser = (elem) => {
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
    <td>
        <button type="button" class="pg-reduct">Посмотреть</button>
        <button type="button" class="pg-delete">Удалить</button>
    <td>
    `

    tableRow.querySelector(".pg-reduct").onclick = () => {
        command = "/user/admin/req/";
    
        axios.get(serverURL + command + elem.id, H)
        .then(res=>showUser(res.data))
        .catch(err=>console.log(err));
    }
    
    let del = tableRow.querySelector(".pg-delete");
    if (del){
        del.onclick = () => {
            command = "/user/";
        
            axios.delete(serverURL + command + elem.id, H)
            .then(res=>console.log(res))
            .catch(err=>console.log(err));
        
            axios.get(serverURL + "/user/admin/req", H)
            .then(res=>getUsers(res.data))
            .catch(err=>console.log(err));
        }
    }

    return tableRow;
}

const createFormUser = () => {
    let form = document.createElement("form");
    form.innerHTML = 
    `
    <input type="text" placeholder="логин" id="login-user" required>
    <input type="password" placeholder="пароль" id="password-user" required>
    <input type="password" placeholder="повторите пароль" id="confirm-password-user" required>
    <select id="role-user" required>
        <option selected value="VOLUNTEER">Волонтёр</option>
        <option value="ADMIN">Админ</option>
    <select>
    <input type="text" placeholder="фамилия" id="surname-user" required>
    <input type="text" placeholder="имя" id="name-user" required>
    <input type="text" placeholder="отчество" id="patronymic-user" required>
    <input type="text" placeholder="должность" id="post-user" required>
    <input type="text" placeholder="место работы/место учёбы" id="place-work-or-study-user" required>
    <input type="text" placeholder="телефон" id="phone-user" required>
    <input type="text" placeholder="почта" id="email-user" required>

    <button type="submit">Сохранить изменения</button>
    `
    form.onsubmit = (e) => {

        e.preventDefault();

        const login = form.querySelector("#login-user").value;
        const password = form.querySelector("#password-user").value;
        const confirmPassword = form.querySelector("#confirm-password-user").value;
        const role = form.querySelector("#role-user").value;
        const surname = form.querySelector("#surname-user").value;
        const name = form.querySelector("#name-user").value;
        const patronymic = form.querySelector("#patronymic-user").value;
        const post = form.querySelector("#post-user").value;
        const placeWorkOrStudy = form.querySelector("#place-work-or-study-user").value;
        const phone = form.querySelector("#phone-user").value;
        const email = form.querySelector("#email-user").value;
        command = "/user/registration";
        console.log(serverURL+ command)
        axios.post(serverURL + command, {login:login,password:password,confirmPassword:confirmPassword,role:role,surname:surname,name:name,patronymic:patronymic,post:post,placeWorkOrStudy:placeWorkOrStudy,phone:phone,email:email}, H)
        .then(res=>console.log(res.data))
        .catch(err=>console.log(err));
    }

    return form;
}

//показать подробные сведения о пользователе
const showUser = (data) => {
    const holder = document.querySelector(".pg-data-holder");
    holder.innerHTML = "";
    holder.appendChild(createUserCard(data));
}

//создать карточку пользователя
const createUserCard = (elem) => {

    let card = document.createElement("div");
    card.innerHTML = 
    `
    <div>
        <p>Номер: ${elem.id}</p>
        <p>Дата Создания: ${elem.createdAt}</p>
    </div>

    <div>
        <p>ФИО: ${elem.surname + " " + elem.name + " " + elem.patronymic}</p>
        <p>Должность: ${elem.post}</p>
        <p>Место работы/Место учёбы: ${elem.placeWorkOrStudy}</p>
        <p>Телефон: ${elem.phone}</p>
        <p>Почта: ${elem.email}</p>
    </div>
    `

    return card;
}

//получить таблицу пользователей
const getFeedbacks = (data) => {

    const holder = document.querySelector(".pg-data-holder");

    if (data.length == 0) {
        holder.innerHTML = "<p>Отзывов не найдено</p>";
        return;
    }
    else holder.innerHTML = "";

    const sorts = createFeedbackSorts(data);

    const table = document.createElement("table");
    table.innerHTML = 
    `
    <thead>
        <tr>
            <td>Номер</td>
            <td>Дата Создания</td>
            <td>ФИ</td>
            <td>Комментарий</td>
            <td>Оценка</td>
            <td>Статус</td>
            <td>Действие</td>
        </tr>
    </thead>
    <tbody class="pg-admins">

    </tbody>
    `

    const admins = table.querySelector(".pg-admins");
    data.forEach(elem => {
        admins.appendChild(createTableRowFeedback(elem));
    });

    holder.appendChild(sorts);
    holder.appendChild(table);
}

//создать строку в таблице
const createTableRowFeedback = (elem) => {
    let tableRow = document.createElement("tr");
    tableRow.innerHTML = 
    `
    <td>${elem.id}</td>
    <td>${new Date(elem.createdAt).toLocaleString()}</td>
    <td>${elem.commentatorSurname + " " + elem.commentatorName}</td>
    <td>${elem.comment}</td>
    <td>${elem.estimation}</td>
    <td>${elem.status}</td>
    <td>
        <button type="button" class="pg-reduct">Обработать</button>
        <button type="button" class="pg-delete">Удалить</button>
    <td>
    `

    tableRow.querySelector(".pg-reduct").onclick = () => {
        command = "/feedback/";
    
        axios.get(serverURL + command + elem.id, H)
        .then(res=>showFeedback(res.data))
        .catch(err=>console.log(err));
    }
    
    let del = tableRow.querySelector(".pg-delete");
    if (del){
        del.onclick = () => {
            command = "/feedback/";
        
            axios.delete(serverURL + command + elem.id, H)
            .then(res=>console.log(res))
            .catch(err=>console.log(err));
        
            axios.get(serverURL + "/feedback/", H)
            .then(res=>getFeedbacks(res.data))
            .catch(err=>console.log(err));
        }
    }

    return tableRow;
}

//показать подробные сведения об отзыве
const showFeedback = (data) => {
    const holder = document.querySelector(".pg-data-holder");
    holder.innerHTML = "";
    holder.appendChild(createFormFeedback(data));
}

//создать карточку отзыва
const createFormFeedback = (elem) => {

    let form = document.createElement("form");
    form.innerHTML = 
    `
    <div>
        <p>Номер: ${elem.id}</p>
        <p>Дата Создания: ${elem.createdAt}</p>
    </div>

    <div>
        <p>ФИ: ${elem.commentatorSurname + " " + elem.commentatorName}</p>
        <p>Комментарий: ${elem.comment}</p>
        <p>Оценка: ${elem.estimation}</p>
        <p>Статус: ${elem.status}</p>
    </div>
    <select class="pg-select-status">
        <option selected value="MODERATION">Не опубликована</option>
        <option value="PUBLISHED">Опубликована</option>
    <select>
    <button type="submit">Сохранить изменения</button>
    `

    form.onsubmit = (e) => {

        e.preventDefault();

        let status = form.querySelector(".pg-select-status").value;

        command = "/feedback/req/";
        console.log(serverURL+ command)
        axios.put(serverURL + command + elem.id, {commentatorName:elem.commentatorName,commentatorSurname:elem.commentatorSurname,comment:elem.comment,estimation:elem.estimation,status:status,guestRequestId:elem.guestRequestId}, H)
        .then(res=>console.log(res.data))
        .catch(err=>console.log(err));
    }

    return form;
}

//шаблон сортировок
const adminSorts = {
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
const createUserSorts = (data) => {
    const block = document.createElement("div");
    block.innerHTML =
    `
    <button type="button" class="pg-form-registration">Создать</button>
    <p>Сортировки</p>
    <div class="pg-sorts">
        
    </div>
    `
    const sorts = block.querySelector(".pg-sorts");
    for (let key in adminSorts){

        let sort = document.createElement("div");
        let elem = adminSorts[key];
        
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
            getUsers(elem.options[elem.currOption].sort(data), key);
        }

        sorts.appendChild(sort);
    }
    block.querySelector(".pg-form-registration").onclick = () => {
        const holder = document.querySelector(".pg-data-holder");
        holder.innerHTML = "";
        holder.appendChild(createFormUser())
    }
    return block;
}

//блок сортировки
const createFeedbackSorts = (data) => {
    const block = document.createElement("div");
    block.innerHTML =
    `
    <p>Сортировки</p>
    <div class="pg-sorts">
        
    </div>
    `
    const sorts = block.querySelector(".pg-sorts");
    for (let key in adminSorts){

        let sort = document.createElement("div");
        let elem = adminSorts[key];
        
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
            getFeedbacks(elem.options[elem.currOption].sort(data), key);
        }

        sorts.appendChild(sort);
    }
    return block;
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

for (let key in adminButtons) {
    adminButtons[key].elem.onclick = () => {
            axios.get(serverURL + adminButtons[key].src, H)
            .then(res=>adminButtons[key].action(res.data))
            .catch(err=>console.log(err));
    }
}