role = "ADMIN";
tokenStr = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibG9naW4iOiJtcnAiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE2ODg2Njg1MTksImV4cCI6MTY4ODc1NDkxOX0.CpfRXNXZd5T2IhKTzQqTlrv9EyFsKJDCr3Vyd_n6HpM"
H = { headers: {"Authorization" : `Bearer ${tokenStr}`} }

// управление кнопками
const adminButtons = {
    "USER": {
        elem: document.querySelector(".reg_users"),
        src: "/user/admin/req",
    },
}

for (let key in adminButtons) {
    adminButtons[key].elem.onclick = () => {
        if (key=="USER"){
            axios.get(serverURL + adminButtons[key].src, H)
            .then(res=>getUsers(res.data))
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
    `
    return tableRow;
}


//шаблон сортировок
const usersSortsObj = {
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
            getUsers(elem.options[elem.currOption].sort(data), key);
        }

        sorts.appendChild(sort);
    }

    return block;
}
