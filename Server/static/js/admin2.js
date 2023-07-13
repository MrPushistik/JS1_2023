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
    const reg = createUserReg();

    const table = document.createElement("div");
    table.className = "table";
    table.innerHTML = 
    `
    <div class="table-header">
        <div class="table-row">
            <p class="table-cell user-cell">№</p>
            <p class="table-cell user-cell">Дата Создания</p>
            <p class="table-cell user-cell">ФИО</p>
            <p class="table-cell user-cell">Должность</p>
            <p class="table-cell user-cell">Место работы/учёбы</p>
            <p class="table-cell user-cell">Телефон</p>
            <p class="table-cell user-cell">Почта</p>
            <p class="table-cell user-cell">Действие</p>
        </div>
    </div>
    <div class="table-body pg-admins">

    </div>
    `

    const admins = table.querySelector(".pg-admins");
    data.forEach(elem => {
        admins.appendChild(createTableRowUser(elem));
    });

    holder.appendChild(reg);
    holder.appendChild(sorts);
    holder.appendChild(table);
}

//создать строку в таблице
const createTableRowUser = (elem) => {
    let tableRow = document.createElement("div");
    tableRow.className = "table-row";
    tableRow.innerHTML = 
    `
    <p class="table-cell user-cell">${elem.id}</p>
    <p class="table-cell user-cell">${new Date(elem.createdAt).toLocaleString()}</p>
    <p class="table-cell user-cell">${elem.surname + " " + elem.name + " " + elem.patronymic}</p>
    <p class="table-cell user-cell">${elem.post}</p>
    <p class="table-cell user-cell">${elem.placeWorkOrStudy}</p>
    <p class="table-cell user-cell">${elem.phone}</p>
    <p class="table-cell user-cell">${elem.email}</p>
    <p class="table-cell user-cell">
        <button type="button" class="pg-reduct read-button td-button">Посмотреть</button>
        ${elem.id != JSON.parse(localStorage.getItem("user")).userId ? `<button type="button" class="pg-delete delete-button td-button">Удалить</button>` : ""}
    </p>
    `

    tableRow.querySelector(".pg-reduct").onclick = () => {
        let command = "/user/admin/req/";
    
        axios.get(serverURL + command + elem.id, H)
        .then(res=>showUser(res.data))
        .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
    }
    
    let del = tableRow.querySelector(".pg-delete");
    if (del){
        del.onclick = () => {
            let command = "/user/";
        
            axios.delete(serverURL + command + elem.id, H)
            .then(res=>console.log(res))
            .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
        
            axios.get(serverURL + "/user/admin/req", H)
            .then(res=>getUsers(res.data))
            .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
        }
    }

    return tableRow;
}

const createFormUser = () => {
    let form = document.createElement("form");
    form.innerHTML = 
    `
    <div class="req-comments-header margintop10 admin-reg-header">
        <p class="req-comments-title">Регистрация</p>
        <button class="pg-close req-card-close">x</button>
    </div>

    <div class="admin-user-info margintop10">
        <div class="req-info user-info">
            <label class="req-info-title">Логин:</label>
            <input class="req-info-value user-info-value" type="text" placeholder="логин" id="login-user" required>
        </div>

        <div class="req-info user-info">
            <label class="req-info-title">Пароль:</label>
            <input class="req-info-value user-info-value" type="password" placeholder="пароль" id="password-user" required>
            <input class="req-info-value user-info-value" type="password" placeholder="повторите пароль" id="confirm-password-user" required>
        </div>
        
        <div class="req-info user-info">
            <label class="req-info-title">Роль:</label>
            <select id="role-user" required>
                <option selected value="VOLUNTEER">Волонтёр</option>
                <option value="ADMIN">Админ</option>
            <select>
        </div>

        <div class="req-info user-info">
            <p class="req-info-title">ФИО:</p>
            <input class="req-info-value user-info-value" type="text" placeholder="фамилия" id="surname-user" required>
            <input class="req-info-value user-info-value" type="text" placeholder="имя" id="name-user" required>
            <input class="req-info-value user-info-value" type="text" placeholder="отчество" id="patronymic-user" required>
        </div>

        <div class="req-info user-info">
            <label class="req-info-title">Должность:</label>
            <input class="req-info-value user-info-value" type="text" placeholder="должность" id="post-user" required>
        </div>

        <div class="req-info user-info">
            <label class="req-info-title">Место работы/учёбы:</label>
            <input class="req-info-value user-info-value" type="text" placeholder="место работы/учёбы" id="place-work-or-study-user" required>
        </div>

        <div class="req-info user-info">
            <label class="req-info-title">Телефон:</label>
            <input class="req-info-value user-info-value" type="text" placeholder="телефон" id="phone-user" required>
        </div>

        <div class="req-info user-info">
            <label class="req-info-title">Почта:</label>
            <input class="req-info-value user-info-value" type="text" placeholder="почта" id="email-user" required>
        </div>

        <button class="req-form-submit" type="submit">Зарегистрировать</button>
    </div>
    `
    form.querySelector(".pg-close").onclick = () => {
        adminButtons["USER"].elem.click();
    }

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
        
        axios.post(serverURL + command, {login:login,password:password,confirmPassword:confirmPassword,role:role,surname:surname,name:name,patronymic:patronymic,post:post,placeWorkOrStudy:placeWorkOrStudy,phone:phone,email:email}, H)
        .then(res=>(console.log(res.data),e.target.reset(),createAlert("Пользователь создан успешно")))
        .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message); e.target.reset()});
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
    card.className = "req-card";
    card.innerHTML = 
    `
    <div class="req-card-header">
        <div class="req-card-header-data">
            <p class="req-card-title">Пользователь №${elem.id}</p>
            <p class="req-card-date">${new Date(elem.createdAt).toLocaleString()}</p>
        </div>
        <button class="pg-close req-card-close">x</button>
    </div>

    <div class="req-comments-header margintop10">
        <p class="req-comments-title">Сведения о пользователе</p>
    </div>

    <form class="admin-user-info margintop10 pg-user">
        <div class="req-info user-info">
            <label class="req-info-title">ФИО:</label>
            <input type="text" class="pg-surname req-info-value user-info-value" value="${elem.surname}">
            <input type="text" class="pg-name req-info-value user-info-value" value="${elem.name}">
            <input type="text" class="pg-patronymic req-info-value user-info-value" value="${elem.patronymic}">
        </div>
        <div class="req-info user-info">
            <lable class="req-info-title">Должность:</label>
            <input type="text" class="pg-post req-info-value user-info-value" value="${elem.post}">
        </div>
        <div class="req-info user-info">
            <label class="req-info-title">Место работы/учёбы:</label>
            <input type="text" class="pg-place req-info-value user-info-value" value="${elem.placeWorkOrStudy}">
        </div>
        <div class="req-info user-info">
            <label class="req-info-title">Телефон:</label>
            <input type="text" class="pg-phone req-info-value user-info-value" value="${elem.phone}">
        </div>
        <div class="req-info user-info">
            <label class="req-info-title">Почта:</label>
            <input type="text" class="pg-email req-info-value user-info-value" value="${elem.email}">
        </div>

        <button type="submit" class="req-form-submit">Сохранить изменения</button>
    </form>

    <div class="req-comments-header margintop10">
        <p class="req-comments-title">Учетные данные пользователя</p>
    </div>

    <div class="admin-user-info margintop10 pg-cred">
        <div class="req-info user-info">
            <p class="req-info-title">Логин:</p>
            <p class="req-info-value user-info-value">${elem.credential.login}</p>
        </div>
        <form class="req-info user-info pg-change-password">
            <label class="req-info-title">Изменить пароль:</label>
            <input type="password" class="req-info-value user-info-value pg-new-password">
            <button type="submit" class="req-form-submit user-form-submit">Изменить</button>
        </form>
        <div class="req-info user-info">
            <p class="req-info-title">Роль:</p>
            <p class="req-info-value user-info-value">${elem.credential.role}</p>
        </div>
    </div>
    `

    card.querySelector(".pg-close").onclick = () => {
        adminButtons["USER"].elem.click();
    }

    let form1 = card.querySelector(".pg-user");
    form1.onsubmit = (e) => {
        e.preventDefault();
        const surname = form1.querySelector(".pg-surname").value;
        const name = form1.querySelector(".pg-name").value;
        const patronymic  = form1.querySelector(".pg-patronymic").value;
        const post  = form1.querySelector(".pg-post").value;
        const place  = form1.querySelector(".pg-place").value;
        const phone  = form1.querySelector(".pg-phone").value;
        const email  = form1.querySelector(".pg-email").value;

        let commandA = "/user/";
        axios.put(serverURL + commandA + elem.id, {surname: surname,name: name,patronymic: patronymic,post:post,placeWorkOrStudy:place,phone: phone,email: email}, H)
        .then(res=>(createAlert("Сведения о пользователе успешно изменены")))
        .catch(err=>{
            createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message);

            let commandB = "/user/admin/req/";
    
            axios.get(serverURL + commandB + elem.id, H)
            .then(res=>showUser(res.data))
            .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
        });
    }

    let form2 = card.querySelector(".pg-change-password");
    form2.onsubmit = (e) => {
        e.preventDefault();

        const password = form2.querySelector(".pg-new-password").value;

        let commandC = "/credential/password/";
        axios.put(serverURL + commandC + elem.credentialId, {password: password}, H)
        .then(res=>{
            createAlert("Пароль успешно изменен"); 
            e.target.reset();
        })
        .catch(err=>{
            createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message);
            e.target.reset(); 
        });
    }


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

    const table = document.createElement("div");
    table.className = "table";
    table.innerHTML = 
    `
    <div class="table-header">
        <div class="table-row">
            <p class="table-cell feedback-cell">№</p>
            <p class="table-cell feedback-cell">Дата Создания</p>
            <p class="table-cell feedback-cell">ФИ</p>
            <p class="table-cell feedback-cell">Комментарий</p>
            <p class="table-cell feedback-cell">Оценка</p>
            <p class="table-cell feedback-cell">Статус</p>
            <p class="table-cell feedback-cell">Действие</p>
        </div>
    </div>
    <div class="table-body pg-admins">

    </div>
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
    let tableRow = document.createElement("div");
    tableRow.className = "table-row";
    tableRow.innerHTML = 
    `
    <p class="table-cell feedback-cell">${elem.id}</p>
    <p class="table-cell feedback-cell">${new Date(elem.createdAt).toLocaleString()}</p>
    <p class="table-cell feedback-cell">${elem.commentatorSurname + " " + elem.commentatorName}</p>
    <p class="table-cell feedback-cell">${elem.comment}</p>
    <p class="table-cell feedback-cell">${elem.estimation}</p>
    <p class="table-cell feedback-cell">${matches.values[matches.keys.indexOf(elem.status)]}</p>
    <p class="table-cell feedback-cell">
        <button type="button" class="pg-reduct read-button td-button">Обработать</button>
        <button type="button" class="pg-delete delete-button td-button">Удалить</button>
    </p>
    `

    tableRow.querySelector(".pg-reduct").onclick = () => {
        command = "/feedback/";
    
        axios.get(serverURL + command + elem.id, H)
        .then(res=>showFeedback(res.data))
        .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
    }
    
    let del = tableRow.querySelector(".pg-delete");
    if (del){
        del.onclick = () => {
            command = "/feedback/";
        
            axios.delete(serverURL + command + elem.id, H)
            .then(res=>console.log(res))
            .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
        
            axios.get(serverURL + "/feedback/", H)
            .then(res=>getFeedbacks(res.data))
            .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
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
    <div class="req-card-header feedback-card-header">
        <div class="req-card-header-data">
            <p class="req-card-title">Заявка №${elem.id}</p>
            <p class="req-card-date">${new Date(elem.createdAt).toLocaleString()}</p>
        </div>
        <button type="button" class="pg-close req-card-close">x</button>
    </div>

    <div class="req-card-guest feedback-card-comment">
        <div class="req-guest-data">
            <p class="req-guest-name">${elem.commentatorSurname + " " + elem.commentatorName}</p>

            <label class="req-guest-phone">Оценка</label>
            <select class="pg-select-mark">
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
            <select>

            <label class="req-guest-phone">Статус</label>
            <select class="pg-select-status">
                <option value="MODERATION">Не опубликован</option>
                <option value="PUBLISHED">Опубликован</option>
                <option value="REJECTED">Отклонен</option>
            <select>
        </div>
        <p class="req-guest-comment feedback-guset-comment">${elem.comment}</p>

        <button type="submit" class="req-form-submit">Сохранить изменения</button>
    </div>
    
    `;

    form.querySelector(`.pg-select-mark option[value="${elem.estimation}"]`).selected = true;
    form.querySelector(`.pg-select-status option[value="${elem.status}"]`).selected = true;

    form.querySelector(".pg-close").onclick = () => {
        document.querySelector(".reg_feedbacks").click();
    }

    form.onsubmit = (e) => {

        e.preventDefault();

        let status = form.querySelector(".pg-select-status").value;
        let mark = form.querySelector(".pg-select-mark").value;

        command = "/feedback/req/";
        axios.put(serverURL + command + elem.id, {commentatorName:elem.commentatorName,commentatorSurname:elem.commentatorSurname,comment:elem.comment,estimation:mark,status:status,guestRequestId:elem.guestRequestId}, H)
        .then(res=>{
            createAlert("Отзыв успешно изменен")

            commandB = "/feedback/";
            axios.get(serverURL + commandB + elem.id, H)
            .then(res=>(showFeedback(res.data)))
            .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
        }
        )
        .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
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
    block.className = "request-sorts";
    block.innerHTML =
    `
    <p class="request-sorts-title">Сортировки</p>
    <div class="pg-sorts request-sorts-keeper">
        
    </div>
    `
    const sorts = block.querySelector(".pg-sorts");
    for (let key in adminSorts){

        let sort = document.createElement("div");
        let elem = adminSorts[key];
        
        sort.innerHTML =
        `
            <button type="button" class="${elem.class} request-sorts-button" value="${elem.options[elem.currOption].value}">${elem.options[elem.currOption].name}</button>
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
    return block;
}

// регистрация
const createUserReg = () => {
    const block = document.createElement("div");
    block.className = "request-sorts";
    block.innerHTML =
    `
    <p class="request-sorts-title">Регистрация</p>
    <div class="pg-sorts request-sorts-keeper">
        <button type="button" class="user-reg pg-form-registration request-sorts-button">Создать пользователя</button>
    </div>
    `
    
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
    block.className = "request-sorts";
    block.innerHTML =
    `
    <p class="request-sorts-title">Сортировки</p>
    <div class="pg-sorts request-sorts-keeper">
        
    </div>
    `
    const sorts = block.querySelector(".pg-sorts");
    for (let key in adminSorts){

        let sort = document.createElement("div");
        let elem = adminSorts[key];
        
        sort.innerHTML =
        `
            <button type="button" class="${elem.class}  request-sorts-button" value="${elem.options[elem.currOption].value}">${elem.options[elem.currOption].name}</button>
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
    holder.innerHTML = "<canvas id='statusStatistics' width='300' height='100'></canvas>";
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
    holder.innerHTML = "<canvas id='assistanceStatistics' width='300' height='100'></canvas>";
    var ctx = document.getElementById('assistanceStatistics').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["ADDRESS","PSYCHO","HUMANITARIAN","OTHER","ALL"],
            datasets: [{
                label: 'Count',
                data: [dataSt["ADDRESS"],dataSt["PSYCHO"],dataSt["HUMANITARIAN"],dataSt["OTHER"],dataSt["ALL"]],
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
    holder.innerHTML = "<canvas id='ComplexStatistics' width='300' height='100'></canvas>";
    var ctx = document.getElementById('ComplexStatistics').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["ADDRESS","PSYCHO","HUMANITARIAN","OTHER"],
            datasets: [{
                label: 'NEW',
                data: [dataSt["ADDRESS"]["NEW"],dataSt["PSYCHO"]["NEW"],dataSt["HUMANITARIAN"]["NEW"],dataSt["OTHER"]["NEW"],],
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
                data: [dataSt["ADDRESS"]["AT WORK"],dataSt["PSYCHO"]["AT WORK"],dataSt["HUMANITARIAN"]["AT WORK"],dataSt["OTHER"]["AT WORK"],],
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
                data: [dataSt["ADDRESS"]["CANCELLED"],dataSt["PSYCHO"]["CANCELLED"],dataSt["HUMANITARIAN"]["CANCELLED"],dataSt["OTHER"]["CANCELLED"],],
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
                data: [dataSt["ADDRESS"]["COMPLETED"],dataSt["PSYCHO"]["COMPLETED"],dataSt["HUMANITARIAN"]["COMPLETED"],dataSt["OTHER"]["COMPLETED"],],
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
                data: [dataSt["ADDRESS"]["ALL"],dataSt["PSYCHO"]["ALL"],dataSt["HUMANITARIAN"]["ALL"],dataSt["OTHER"]["ALL"],],
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

            const buttonHolder = document.querySelector(".pg-extra-nav");
            if (buttonHolder) buttonHolder.remove();

            axios.get(serverURL + adminButtons[key].src, H)
            .then(res=>adminButtons[key].action(res.data))
            .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
    }
}

const createButtonHolder = (className) => {
    let buttonHolder = document.createElement("div");
    buttonHolder.className = className;
    return buttonHolder;
}

const requestButtons = {
    "NEW": {
        classes: "request-nav-button request-nav-button-dis",
        targClass: "new_requests",
        src: "/guestRequest/volunteer/forNewApplication",
        showType: false,
        buttonName: "Обработать",
        haveForm: true
    },
    "AT WORK": {
        classes: "request-nav-button request-nav-button-dis",
        targClass: "work_requests",
        src: "/guestRequest/volunteer/forWorkApplication",
        showType: true,
        buttonName: "Редактировать",
        haveForm: true
    },
    "CANCELLED": {
        classes: "request-nav-button request-nav-button-dis",
        targClass: "cancelled_requests",
        src: "/guestRequest/volunteer/forCancelledApplication",
        showType: true,
        buttonName: "Просмотреть",
        haveForm: false
    },
    "COMPLETED": {
        classes: "request-nav-button request-nav-button-dis",
        targClass: "completed_requests",
        src: "/guestRequest/volunteer/forCompletedApplication",
        showType: true,
        buttonName: "Просмотреть",
        haveForm: false
    },
}

document.querySelector(".requests").onclick = () => {

    const pgData = document.querySelector(".pg-data-holder");

    let buttonHolder = document.querySelector(".pg-extra-nav");
    if (buttonHolder) buttonHolder.remove();
    buttonHolder = createButtonHolder("extra-nav pg-extra-nav");

    for (let key in requestButtons){

        let button = document.createElement("button");
        button.type = "button";
        button.className = requestButtons[key].targClass + " " + requestButtons[key].classes
        button.innerHTML = matches.values[matches.keys.indexOf(key)];

        button.onclick = () => {
            requestSorts.date.currOption = 0;
            axios.get(serverURL + requestButtons[key].src, H)
            .then(res=>createRequestsTable(res.data))
            .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
        }

        buttonHolder.appendChild(button);
    }

    pgData.innerHTML = "";
    pgData.before(buttonHolder);
    buttonHolder.childNodes[0].click();
}

const statisticsButtons = {
    "STATUSSTATISTICS": {
        class: "status_statistics statistics-nav-button statistics-nav-button-dis",
        //elem: document.querySelector(".status_statistics"),
        src: "/guestRequest/admin/statusStatistics",
        action: (data) => getStatusStatistics(data)
    },
    "ASSISTANCESTATISTICS": {
        class: "assistance_statistics statistics-nav-button statistics-nav-button-dis",
        //elem: document.querySelector(".assistance_statistics"),
        src: "/guestRequest/admin/assistanceStatistics",
        action: (data) =>  getAssistanceStatistics(data)
    },
    "COMPLEXSTATISTICS": {
        class: "complex_statistics statistics-nav-button statistics-nav-button-dis",
        //elem: document.querySelector(".complex_statistics"),
        src: "/guestRequest/admin/complexStatistics",
        action: (data) => getComplexStatistics(data)
    },
}

document.querySelector(".statistics").onclick = () => {

    const pgData = document.querySelector(".pg-data-holder");

    let buttonHolder = document.querySelector(".pg-extra-nav");
    if (buttonHolder) buttonHolder.remove();
    buttonHolder = createButtonHolder("extra-nav pg-extra-nav");

    for (let key in statisticsButtons){

        let button = document.createElement("button");
        button.type = "button";
        button.className = statisticsButtons[key].class
        button.innerHTML = matches.values[matches.keys.indexOf(key)];

        button.onclick = () => {
            axios.get(serverURL + statisticsButtons[key].src, H)
            .then(res=>statisticsButtons[key].action(res.data))
            .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
        }

        buttonHolder.appendChild(button);
    }

    pgData.innerHTML = "";
    pgData.before(buttonHolder);
    buttonHolder.childNodes[0].click();
}


addEventListener("click", (e) => {
    let targ = e.target;

    if (targ.classList.contains("statistics-nav-button-dis")){

        let active = document.querySelector(".statistics-nav-button-active");

        if (active){
            active.classList.remove("statistics-nav-button-active");
            active.classList.add("statistics-nav-button-dis");
        }

        targ.classList.remove("statistics-nav-button-dis");
        targ.classList.add("statistics-nav-button-active");
    }
})

addEventListener("click", (e) => {
    let targ = e.target;

    if (targ.classList.contains("main-nav-button-dis")){

        let active = document.querySelector(".main-nav-button-active");

        if (active){
            active.classList.remove("main-nav-button-active");
            active.classList.add("main-nav-button-dis");
        }

        targ.classList.remove("main-nav-button-dis");
        targ.classList.add("main-nav-button-active");
    }
})

document.querySelector(".requests").click();