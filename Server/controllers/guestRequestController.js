const {GuestRequest} = require("../models/models");
const ApiError = require("../error/ApiError");

class GuestRequestController{
    async create(req,res,next){
        try{
            const {surname, name, patronymic, phone, commentGuest, dateCreation, status, typeAssistance} = req.body;
            const guestRequest = await GuestRequest.create({surname, name, patronymic, phone, commentGuest, dateCreation, status, typeAssistance});
            return res.json(guestRequest);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }

    }

    async getAll(req,res,next){
        try{
            const requests = await GuestRequest.findAll();
            return res.json(requests);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async get(req,res,next){
        try{
            const {id} = req.params;
            const requests = await GuestRequest.findOne({where: {id}});
            return res.json(requests);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async update(req,res,next){
        try{
            const {id} = req.params;
            const {surname, name, patronymic, phone, commentGuest, dateCreation, status, typeAssistance} = req.body;
            const guestRequest = await GuestRequest.update({surname, name, patronymic, phone, commentGuest, dateCreation, status, typeAssistance}, {where: {id}});
            return res.json(guestRequest);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async delete(req,res,next){
        try{
            const {id} = req.params;
            const requests = await GuestRequest.destroy({where: {id}});
            return res.json(requests);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }
}

module.exports = new GuestRequestController();