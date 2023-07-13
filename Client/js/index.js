const formGuestRequest = document.querySelector(".guest_request_form");
const formFeedback = document.querySelector(".feedback_form");
const feedbackComment = document.querySelector("#feedback-comments");
const serverURL = 'http://localhost:3001/api';
const month = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]

const feedbacks = axios.get(serverURL + "/feedback/")
.then(res=>feedbackList(res.data))
.catch(err=>(console.log(err),alert(err)));

const feedbackList = (data) => {
    data.forEach(feed => {
        console.log(feed)
        if (feed.status=="PUBLISHED"){
            let card = document.createElement("div");
            card.setAttribute("class","card-review swiper-slide ");
            card.innerHTML = `
                <div class="card-review-content">
                    <div class="date_comment">
                        ${new Date(feed.createdAt).getUTCDate()+" "+month[(new Date(feed.createdAt).getUTCMonth())]+" "+new Date(feed.createdAt).getUTCFullYear()}
                    </div>
                    <div class="card-review-text">
                        <h2 class="name_reviewer">${feed.commentatorSurname + " " + feed.commentatorName}</h2>
                        <p class="description">${feed.comment}</p>
                    </div>
                </div>
            `
            feedbackComment.appendChild(card);
        }
    });
}

formGuestRequest.onsubmit = (e) => {
    e.preventDefault();

    const name = formGuestRequest.querySelector("#name_guest_request").value;
    const surname = formGuestRequest.querySelector("#family_guest_request").value;
    const patronymic = "";
    const phone = formGuestRequest.querySelector("#phone_guest_request").value;
    const commentGuest = formGuestRequest.querySelector("#comment_body_guest_request").value;

    command = "/guestRequest/volunteer/req";
    axios.post(serverURL + command, {surname:surname,name:name,patronymic:patronymic,phone:phone,commentGuest:commentGuest})
    .then(res=>(e.target.reset(),createAlert("Заявка успешно создана", `Сохраните номер вашей заявки - №${res.data.id}`)))
    .catch(err=>{e.target.reset(),createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
}

formFeedback.onsubmit = (e) => {
    e.preventDefault();

    const name = formFeedback.querySelector("#name_feedback").value;
    const surname = formFeedback.querySelector("#family_feedback").value;
    const comment = formFeedback.querySelector("#comment_feedback").value;
    const status = "MODERATION";
    const guestRequestId = formFeedback.querySelector("#number_zayavki_feedback").value;
    
    command = "/feedback/";
    axios.post(serverURL + command, {commentatorName:name,commentatorSurname:surname,comment:comment,estimation:5,status:status,guestRequestId:guestRequestId})
    .then(res=>(e.target.reset(),createAlert("Отзыв создан успешно")))
    .catch(err=>{e.target.reset(),createAlert(err.response.statusText + ", " + err.response.status, err.response.data.message)});
}