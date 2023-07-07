// управление кнопками
const adminButtons = {
    "USER": {
        elem: document.querySelector(".reg_users"),
        src: "/user/admin/req",
        action: (data) => getUsers(data)
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

for (let key in adminButtons) {
    adminButtons[key].elem.onclick = () => {
            axios.get(serverURL + adminButtons[key].src, H)
            .then(res=>adminButtons[key].action(res.data))
            .catch(err=>console.log(err));
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
const userSorts = {
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
    for (let key in userSorts){

        let sort = document.createElement("div");
        let elem = userSorts[key];
        
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

