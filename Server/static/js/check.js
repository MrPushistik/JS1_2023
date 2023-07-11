const serverURL = 'http://localhost:3001/api';
let role = JSON.parse(localStorage.getItem("user")).role;
let tokenStr = localStorage.getItem("token");
let H = { headers: {"Authorization" : `Bearer ${tokenStr}`} }

const matches = {
    keys: [null,"NEW", "AT WORK", "CANCELLED", "COMPLETED", "PSYCHO", "HUMANITARIAN", "ADDRESS", "OTHER","STATUSSTATISTICS","ASSISTANCESTATISTICS","COMPLEXSTATISTICS","MODERATION","PUBLISHED","REJECTED"],
    values: ["Не установлен","Новая", "В работе", "Отменена", "Выполнена", "Психологическая", "Гуманитарная", "Адресная", "Иная","По статусу","По типу помощи", "По статусу и типу помощи","Модерация", "Опубликован","Отклонен"],
}