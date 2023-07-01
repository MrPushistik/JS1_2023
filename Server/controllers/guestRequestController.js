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

    async createRequest(req, res, next){
        try {
            const {surname, name, patronymic, phone, commentGuest} = req.body;
            let dateCreation = new Date().toJSON().replace("T"," ").replace("Z"," -4:00");
            let status = "NEW";
            let typeAssistance = null;
            const newRequest = await GuestRequest.create({surname, name, patronymic, phone, commentGuest, dateCreation, status, typeAssistance});
            return res.json(newRequest);
        }
        catch(e){
            next(ApiError.badRequest(e));
        }
    }

    async getAllForNewApplication(req,res,next){
        try{
            let status = "NEW";
            const requests = await GuestRequest.findAll({where: {status: status}});
            return res.json(requests);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async getAllForWorkApplication(req,res,next){
        try{
            let status = "AT WORK";
            const requests = await GuestRequest.findAll({where: {status: status}});
            return res.json(requests);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async getAllForCompletedApplication(req,res,next){
        try{
            let status = "COMPLETED";
            const requests = await GuestRequest.findAll({where: {status: status}});
            return res.json(requests);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async getAllForCanceledApplication(req,res,next){
        try{
            let status = "CANCELLED";
            const requests = await GuestRequest.findAll({where: {status: status}});
            return res.json(requests);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }
}



module.exports = new GuestRequestController();