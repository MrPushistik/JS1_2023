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

for (let key in requestButtons) {
    requestButtons[key].elem.onclick = () => {
        requestSorts.date.currOption = 0;
        axios.get(serverURL + requestButtons[key].src, H)
        .then(res=>createRequestsTable(res.data))
        .catch(err=>console.log(err));
    }
}

document.querySelector(".new_requests").click();