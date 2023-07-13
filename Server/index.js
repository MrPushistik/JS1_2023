require('dotenv').config();
const express = require("express");
const sequelize = require("./db");
const {User, Credential} = require('./models/models');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const preRedirect = require("./middleware/preRedirect");
const path = require("path");
const bcrypt = require('bcrypt');


const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/admin.html", preRedirect("ADMIN"));
app.use("/volunteer.html", preRedirect("VOLUNTEER"));

app.use(express.static(path.resolve(__dirname, "static")));
app.use('/api',router);
app.use(errorHandler);

const start = async () => {
    try{
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server was started. Port: ${PORT}`));

        const number = (await Credential.count({})).valueOf();
        if (number === 0){
            const hashPassword = await bcrypt.hash("admin",5);
            const credential = await Credential.create({login: "admin",password:hashPassword,role:"ADMIN"});
            await User.create({surname: "Админов",name: "Админ",patronymic: "Админович",post: "Админ",placeWorkOrStudy: "СГТУ",phone: "+78007006050",email: "admin@mail.ru",credentialId:credential.id});
        }
        
    } catch (e){
        console.log(e);
    }
}

start();