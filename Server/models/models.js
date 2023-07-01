const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    surname:{type:DataTypes.STRING,allowNull:false, validate: {is: ["^[А-ЯЁ]{1,1}[а-яё]{1,29}$","g"]}},
    name:{type:DataTypes.STRING,allowNull:false, validate: {is: ["^[А-ЯЁ]{1,1}[а-яё]{1,29}$","g"]}},
    patronymic:{type:DataTypes.STRING,allowNull:false, validate: {is: ["^[А-ЯЁ]{1,1}[а-яё]{1,29}$","g"]}},
    post:{type:DataTypes.STRING,allowNull:false, validate: {is: ["^[а-яА-ЯЁё]{2,30}$","g"]}},
    placeWorkOrStudy:{type:DataTypes.STRING,allowNull:false, validate: {is: ["^[а-яА-ЯЁё]{2,30}$","g"]}},
    phone:{type:DataTypes.STRING,unique:true,allowNull:false, validate: {is: ["^\+7[0-9]{10,10}$","g"]}},
    email:{type:DataTypes.STRING,unique:true,allowNull:false, validate: {isEmail: true}},
    dateCreation:{type:DataTypes.DATE,allowNull:false, validate: {isDate: true}}
})

const Credential = sequelize.define('credential',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    login:{type:DataTypes.STRING,unique:true,allowNull:false,validate: {is: ["^[a-zA-Z0-9]{3,24}$","g"]}},
    password:{type:DataTypes.STRING,allowNull:false,validate: {is: ["^[a-zA-Z0-9\!\@\<\>\.\,\$]{8,32}$","g"]}},
    role:{type:DataTypes.STRING,allowNull:false, validate: {isIn: [["ADMIN", "VOLUNTEER"]]}}
})

const CommentingApplication = sequelize.define('commenting_application',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    dateChange:{type:DataTypes.DATE,allowNull:false, validate: {isDate: true}},
    content:{type:DataTypes.STRING,allowNull:false, validate: {is: ["[а-яА-Я\ Ёё\.\,\!\?\n\r\+\-0-9]{1,100}","g"]}}
})

const GuestRequest = sequelize.define('guest_request',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    surname:{type:DataTypes.STRING,allowNull:false},
    name:{type:DataTypes.STRING,allowNull:false},
    patronymic:{type:DataTypes.STRING,allowNull:false},
    phone:{type:DataTypes.STRING,unique:true,allowNull:false},
    commentGuest:{type:DataTypes.STRING,allowNull:false},
    dateCreation:{type:DataTypes.DATE,allowNull:false},
    status:{type:DataTypes.STRING,allowNull:false, validate: {isIn: [["NEW", "AT WORK", "CANCELLED", "COMPLETED"]]}},
    typeAssistance:{type:DataTypes.STRING, validate: {isIn: [["ADDRESS", "PSCYCO", "HUMANITARIAN","OTHER"]]}}
})

const Feedback = sequelize.define('feedback',{
    id:{type:DataTypes.INTEGER,primaryKey:true,autoIncrement:true},
    commentatorName:{type:DataTypes.STRING,allowNull:false},
    comment:{type:DataTypes.STRING,allowNull:false},
    estimation:{type:DataTypes.INTEGER,allowNull:false,defaultValue:5},
    dateCreation:{type:DataTypes.DATE,allowNull:false},
    status:{type:DataTypes.STRING,allowNull:false, validate: {isIn: [["MODERATED", "PUBLISHED", "REJECTED"]]}}
})

Credential.hasOne(User);
User.belongsTo(Credential);
// User.hasOne(Credential)
// Credential.belongsTo(User)

User.hasMany(CommentingApplication)
CommentingApplication.belongsTo(User)

GuestRequest.hasMany(CommentingApplication)
CommentingApplication.belongsTo(GuestRequest)

GuestRequest.hasMany(Feedback)
Feedback.belongsTo(GuestRequest)

module.exports = {
    User,
    Credential,
    CommentingApplication,
    GuestRequest,
    Feedback
}