const createAlert = (title, msg) => {

    const alert = document.createElement("section");
    alert.className = "alert-wrap";
    alert.innerHTML = 
    `
    <div class="my-alert">
        <div class="alert-title-holder">
            <p class="alert-title"></p>
        </div>
        <div class="alert-message-holder">
        </div>
        <button type="button" class="ok-button request-sorts-button">OK</button>
    </div>
    `
    alert.querySelector(".alert-title").innerHTML = title;

    const holder = alert.querySelector(".alert-message-holder");
    if (msg){    
        let p = document.createElement("p");
        p.className = "alert-message";
        p.innerHTML = msg;
        holder.appendChild(p);
    }
    else holder.remove();

    alert.querySelector(".ok-button").onclick = () => alert.remove();

    document.body.appendChild(alert);
}