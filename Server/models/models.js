const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    surname: {type: DataTypes.STRING, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    patronymic: {type: DataTypes.STRING, allowNull: false},
    post: {type: DataTypes.STRING, allowNull: false},
    placeWorkOrStudy: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, unique: true, allowNull: false},
    email:{type: DataTypes.STRING, unique: true, allowNull: false},
})

const Credential = sequelize.define('credential',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    login: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, allowNull: false}
})

const CommentingApplication = sequelize.define('commenting_application',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    content: {type: DataTypes.STRING, allowNull: false}
})

const GuestRequest = sequelize.define('guest_request',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    surname: {type: DataTypes.STRING, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    patronymic: {type: DataTypes.STRING, allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false},
    commentGuest: {type: DataTypes.STRING, allowNull: false},
    status: {type: DataTypes.STRING, allowNull: false},
    typeAssistance: {type: DataTypes.STRING, defaultValue: null}
})

const Feedback = sequelize.define('feedback',{
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    commentatorName: {type: DataTypes.STRING, allowNull: false},
    commentatorSurname: {type: DataTypes.STRING, allowNull: false},
    comment: {type: DataTypes.STRING, allowNull: false},
    estimation: {type:DataTypes.INTEGER, allowNull: false, defaultValue: 5},
    status: {type: DataTypes.STRING, allowNull: false}
})

// Credential.hasOne(User);
// User.belongsTo(Credential);
// // User.hasOne(Credential)
// // Credential.belongsTo(User)

// User.hasMany(CommentingApplication)
// CommentingApplication.belongsTo(User)

// GuestRequest.hasMany(CommentingApplication)
// CommentingApplication.belongsTo(GuestRequest)

// GuestRequest.hasMany(Feedback)
// Feedback.belongsTo(GuestRequest)

Credential.hasOne(User,{onDelete: 'cascade'});
User.belongsTo(Credential);
// User.hasOne(Credential)
// Credential.belongsTo(User)

User.hasMany(CommentingApplication,{onDelete: 'set null'})
CommentingApplication.belongsTo(User)

GuestRequest.hasMany(CommentingApplication,{onDelete: 'cascade'})
CommentingApplication.belongsTo(GuestRequest)

GuestRequest.hasMany(Feedback,{onDelete: 'cascade'})
Feedback.belongsTo(GuestRequest)

module.exports = {
    User,
    Credential,
    CommentingApplication,
    GuestRequest,
    Feedback
}