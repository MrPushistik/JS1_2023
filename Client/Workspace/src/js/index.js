const formGuestRequest = document.querySelector(".guest_request_form");
const formFeedback = document.querySelector(".feedback_form");
const serverURL = 'http://localhost:3001/api';

formGuestRequest.onsubmit = (e) => {
    e.preventDefault();

    const name = formGuestRequest.querySelector("#name_guest_request").value;
    const surname = formGuestRequest.querySelector("#family_guest_request").value;
    const patronymic = "";
    const phone = formGuestRequest.querySelector("#phone_guest_request").value;
    const commentGuest = formGuestRequest.querySelector("#comment_body_guest_request").value;

    command = "/guestRequest/volunteer/req";
    axios.post(serverURL + command, {surname:surname,name:name,patronymic:patronymic,phone:phone,commentGuest:commentGuest})
    .then(res=>console.log(res.data))
    .catch(err=>console.log(err));
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
    .then(res=>console.log(res.data))
    .catch(err=>console.log(err));
}