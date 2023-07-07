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

document.querySelector(".new_requests").click();