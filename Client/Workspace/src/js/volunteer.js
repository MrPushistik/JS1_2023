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
