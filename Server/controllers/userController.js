const {User} = require('../models/models');
const {Credential} = require("../models/models");
const ApiError = require('../error/ApiError');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const generateJwt = (userId, role) => {
    return jwt.sign(
        {userId,role},
        process.env.SECRET_KEY,
        {expiresIn:'24h'}
    )
}

class UserController{
    async registration(req,res,next){
        try{
            const {login,password,confirmPassword,role,surname,name,patronymic,post,placeWorkOrStudy,phone,email} = req.body //-dateCreation
            if (!login || !surname || !placeWorkOrStudy || !email){
                return next(ApiError.badRequest("Неверный формат данных"));
            }
            if (password!=confirmPassword){
                return next(ApiError.badRequest("Неверный пароль"));
            }
            const candidate1 = await Credential.findOne({where:{login}})
            if (candidate1){
                return next(ApiError.badRequest("Пользователь с таким login уже существует"));
            }
            const candidate2 = await User.findOne({where:{email}})
            if (candidate2){
                return next(ApiError.badRequest("Пользователь с таким email уже существует"));
            }
            const candidate3 = await User.findOne({where:{phone}})
            if (candidate3){
                return next(ApiError.badRequest("Пользователь с таким phone уже существует"));
            }
            const hashPassword = await bcrypt.hash(password,5)
            const credential = await Credential.create({login,password:hashPassword,role})
            const user = await User.create({surname,name,patronymic,post,placeWorkOrStudy,phone,email,credentialId:credential.id})
            const token = generateJwt(user.id,credential.role)
            return res.json({token})
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

    async login(req,res,next){
        try{
            const {login,password} = req.body;
            const credential = await Credential.findOne({where: {login}});
            if (!credential){
                return next(ApiError.badRequest("Пользователь не найден"));
            }
            let comparePassword = bcrypt.compareSync(password,credential.password)
            if (!comparePassword){
                return next(ApiError.badRequest("Неверный пароль"));
            }

            const user = await User.findOne({where: {credentialId: credential.id}});
            const token = generateJwt(user.id,credential.role)
            return res.json({token})
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

    async check(req,res,next){
        const token = generateJwt(req.user.id, req.user.role)
        return res.json({token})
    }

    async delete(req,res,next){
        try{
            const {id} = req.params;
            const user = await User.destroy({where: {id}});
            return res.json(user);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async getAll(req,res,next){
        try{
            const users = await User.findAll({order: [["createdAt","DESC"]]});
            return res.json(users);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async get(req,res,next){
        try{
            const {id} = req.params;
            const users = await User.findOne({where: {id}});
            return res.json(users);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async getFullUserInfo(req,res,next){
        try{
            const {id} = req.params;
            const user = await User.findOne({where: {id}});
            const data = await Credential.findOne({where: {id: user.credentialId}})

            user.setDataValue("credential", data);
            
            return res.json(user);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async update(req,res,next){
        try{
            const {id} = req.params;
            const {surname, name, patronymic, post, placeWorkOrStudy, phone, email} = req.body; //-dateCreation

            const user = await User.update({surname,name,patronymic,post,placeWorkOrStudy,phone,email}, {where: {id}})
            return res.json(user);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }
}

module.exports = new UserController()