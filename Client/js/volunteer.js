// управление кнопками просмотра заявок
const requestButtons = {
    "NEW": {
        targClass: "new_requests",
        src: "/guestRequest/volunteer/forNewApplication",
        showType: false,
        buttonName: "Обработать",
        haveForm: true
    },
    "AT WORK": {
        targClass: "work_requests",
        src: "/guestRequest/volunteer/forWorkApplication",
        showType: true,
        buttonName: "Редактировать",
        haveForm: true
    },
    "CANCELLED": {
        targClass: "cancelled_requests",
        src: "/guestRequest/volunteer/forCancelledApplication",
        showType: true,
        buttonName: "Просмотреть",
        haveForm: false
    },
    "COMPLETED": {
        targClass: "completed_requests",
        src: "/guestRequest/volunteer/forCompletedApplication",
        showType: true,
        buttonName: "Просмотреть",
        haveForm: false
    },
}

for (let key in requestButtons) {
    document.querySelector(`.${requestButtons[key].targClass}`).onclick = () => {
        requestSorts.date.currOption = 0;
        axios.get(serverURL + requestButtons[key].src, H)
        .then(res=>createRequestsTable(res.data))
        .catch(err=>{createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
    }
}

document.querySelector(".new_requests").click();