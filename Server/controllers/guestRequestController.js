const {GuestRequest, CommentingApplication, User} = require("../models/models");
const ApiError = require("../error/ApiError");
const { Sequelize } = require("../db");

class GuestRequestController{
    async create(req,res,next){
        try{
            const {surname, name, patronymic, phone, commentGuest, status, typeAssistance} = req.body; //-dateCreation
            const guestRequest = await GuestRequest.create({surname, name, patronymic, phone, commentGuest, status, typeAssistance});
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
            const {surname, name, patronymic, phone, commentGuest, status, typeAssistance} = req.body; //-dateCreation
            const guestRequest = await GuestRequest.update({surname, name, patronymic, phone, commentGuest, status, typeAssistance}, {where: {id}});
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
            const {surname, name, patronymic, phone, commentGuest} = req.body; //-dateCreation
            let status = "NEW";
            let typeAssistance = null;
            const newRequest = await GuestRequest.create({surname, name, patronymic, phone, commentGuest, status, typeAssistance});
            return res.json(newRequest);
        }
        catch(e){
            next(ApiError.badRequest(e));
        }
    }

    async getAllForNewApplication(req,res,next){
        try{
            let status = "NEW";
            const requests = await GuestRequest.findAll({where: {status: status}, order: [["createdAt","DESC"]]});
            return res.json(requests);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async getAllForWorkApplication(req,res,next){
        try{
            let status = "AT WORK";
            const requests = await GuestRequest.findAll({where: {status: status}, order: [["createdAt","DESC"]]});
            return res.json(requests);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async getAllForCompletedApplication(req,res,next){
        try{
            let status = "COMPLETED";
            const requests = await GuestRequest.findAll({where: {status: status}, order: [["createdAt","DESC"]]});
            return res.json(requests);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async getAllForCanceledApplication(req,res,next){
        try{
            let status = "CANCELLED";
            const requests = await GuestRequest.findAll({where: {status: status}, order: [["createdAt","DESC"]]});
            return res.json(requests);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async getAllForNewApplicationFilter(req,res,next){
        try{
            const {dateCreation} = req.body;
            let status = "NEW";
            const requests = await GuestRequest.findAll({where: {status: status}});
            const filterRes = requests.filter(request => new Date(dateCreation).getTime()<=new Date(request.createdAt).getTime()) // + createdAt
            return res.json(filterRes);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }
    async getAllForWorkApplicationFilter(req,res,next){
        try{
            let status = "AT WORK";
            const requests = await GuestRequest.findAll({where: {status: status}});
            const filterRes = requests.filter(request => new Date(dateCreation).getTime()<=new Date(request.createdAt).getTime())
            return res.json(filterRes);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async getAllForCompletedApplicationFilter(req,res,next){
        try{
            let status = "COMPLETED";
            const requests = await GuestRequest.findAll({where: {status: status}});
            const filterRes = requests.filter(request => new Date(dateCreation).getTime()<=new Date(request.createdAt).getTime())
            return res.json(filterRes);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async getAllForCancelledApplicationFilter(req,res,next){
        try{
            let status = "CANCELLED";
            const requests = await GuestRequest.findAll({where: {status: status}});
            const filterRes = requests.filter(request => new Date(dateCreation).getTime()<=new Date(request.createdAt).getTime())
            return res.json(filterRes);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async updateRequest(req,res,next){
        try{
            const {id} = req.params;
            const {content,surname, name, patronymic, phone, commentGuest, status, typeAssistance} = req.body; // -dateCreation
            if (status=="AT WORK"){
                const guestRequest = await GuestRequest.update({surname, name, patronymic, phone, commentGuest, status, typeAssistance}, {where: {id}});
                const commentingApplication = await CommentingApplication.create({content:content, userId:1, guestRequestId: guestRequest.id}); //-updateTime
                return res.json(guestRequest);
            }
            else{
                const guestRequest = await GuestRequest.update({surname, name, patronymic, phone, commentGuest, status, typeAssistance}, {where: {id}});
                return res.json(guestRequest);
            }
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }
    
    async deleteGuestRequest(req, res, next){
        try{
            const {id} = req.params;
            const request = await GuestRequest.findOne({where: {id}});

            if (request.status != "AT WORK"){
                const destructionRes = await GuestRequest.destroy({where: {id}});
                return res.json(destructionRes);
            }  
            else next(ApiError.forbidden("Запрещено удалять заявки в работе")); 
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async requestStatusStatistics(req, res, next){
        try{
            const requests = {};
            const statuses = ["NEW", "AT WORK", "CANCELLED", "COMPLETED"];
            let all = 0;

            for (let i = 0; i < statuses.length; i++){
                let number = (await GuestRequest.count({where: {status: statuses[i]}})).valueOf();
                requests[statuses[i]] = number;
                all += number;
            }

            requests["ALL"] = all;
        
            return res.json(requests);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async requestAssistanceStatistics(req, res, next){
        try{
            const requests = {};
            const assistances = ["ADDRESS", "PSYCHO", "HUMANITARIAN", "OTHER"];
            let all = 0;

            for (let i = 0; i < assistances.length; i++){
                let number = (await GuestRequest.count({where: {typeAssistance: assistances[i]}})).valueOf();
                requests[assistances[i]] = number;
                all += number;
            }

            requests["ALL"] = all;
        
            return res.json(requests);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async requestComplexStatistics(req, res, next){
        try{
            const requests = {};

            const assistances = ["ADDRESS", "PSYCHO", "HUMANITARIAN", "OTHER"];
            const statuses = ["NEW", "AT WORK", "CANCELLED", "COMPLETED"];

            let all = 0;
            for (let i = 0; i < assistances.length; i++){
                
                let currAssistance = {};
                let allAssistance = 0;

                for (let j = 0; j < statuses.length; j++){

                    let number = (await GuestRequest.count({where: {typeAssistance: assistances[i], status: statuses[j]}})).valueOf();
                    currAssistance[statuses[j]] = number;
                    allAssistance += number;
                }

                currAssistance["ALL"] = allAssistance;

                requests[assistances[i]] = currAssistance;
            }

            return res.json(requests);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async getFullRequest(req,res,next){
        try{
            const {id} = req.params;
            const request = await GuestRequest.findOne({where: {id}})
            const comments = await CommentingApplication.findAll({include: [{model: User}], where: {guestRequestId: id}, order: [["createdAt","ASC"]]})

            request.setDataValue("comments", comments);
            
            return res.json(request);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async updateStatus(req,res,next){
        try{
            const {id} = req.params;
            const {status} = req.body;
            const guestRequest = await GuestRequest.update({status}, {where: {id}});
            return res.json(guestRequest);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async updateAssistance(req,res,next){
        try{
            const {id} = req.params;
            const {typeAssistance} = req.body;
            const guestRequest = await GuestRequest.update({typeAssistance}, {where: {id}});
            return res.json(guestRequest);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }
}



module.exports = new GuestRequestController();