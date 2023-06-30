const {User} = require('../models/models');
const {Credential} = require("../models/models");
const ApiError = require('../error/ApiError');

class UserController{
    async registration(req,res,next){
        try{
            const {login,password,confirmPassword,role,surname,name,patronymic,post,placeWorkOrStudy,phone,email,dateCreation} = req.body
            if (password!=confirmPassword){
                next(ApiError.badRequest("Неверный пароль"));
            }
            const credential = await Credential.create({login,password,role})
            const user = await User.create({surname,name,patronymic,post,placeWorkOrStudy,phone,email,dateCreation,credentialId:credential.id})
            return res.json(user)
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

    async login(req,res,next){
        try{
            const {login,password,role} = req.body;
            const credential = await Credential.findOne({where: {login: login}});
            if (password!=credential.password){
                next(ApiError.badRequest("Неверный пароль"));
            }
            const user = await User.findOne({where: {credentialId: credential.id}});
            return res.json(user);
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

    async check(req,res,next){
        try{
            const {id} = req.query
            if (!id){
                return next(ApiError.badRequest('Не задан ID'))
            }
            return res.json(id)
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
        
    }
}

module.exports = new UserController()