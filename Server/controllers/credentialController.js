const {Credential} = require("../models/models");
const ApiError = require("../error/ApiError");

class CredentialController{
    async create(req,res,next){
        try{
            const {login, password, role} = req.body;
            const credential = await Credential.create({login, password, role});
            return res.json(credential);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }

    }

    async getAll(req,res,next){
        try{
            const credentials = await Credential.findAll();
            return res.json(credentials);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async get(req,res,next){
        try{
            const {id} = req.params;
            const credential = await Credential.findOne({where: {id}});
            return res.json(credential);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async update(req,res,next){
        try{
            const {id} = req.params;
            const {login, password, role} = req.body;
            const credential = await Credential.update({login, password, role}, {where: {id}});
            return res.json(credential);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async delete(req,res,next){
        try{
            const {id} = req.params;
            const credential = await Credential.destroy({where: {id}});
            return res.json(credential);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }
}

module.exports = new CredentialController()