const {CommentingApplication} = require("../models/models");
const ApiError = require("../error/ApiError");

class CommentingApplicationController{
    async create(req,res,next){
        try{
            const {content,userId,guestRequestId} = req.body;
            const commentingApplication = await CommentingApplication.create({content,userId,guestRequestId}); //removed dataChange
            return res.json(commentingApplication);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }

    }

    async getAll(req,res,next){
        try{
            const commentingApplications = await CommentingApplication.findAll();
            return res.json(commentingApplications);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async get(req,res,next){
        try{
            const {id} = req.params;
            const commentingApplication = await CommentingApplication.findOne({where: {id}});
            return res.json(commentingApplication);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async update(req,res,next){
        try{
            const {id} = req.params;
            const {content,userId,guestRequestId} = req.body;
            const commentingApplication = await CommentingApplication.update({content,userId,guestRequestId}, {where: {id}}); //- dataChange
            return res.json(commentingApplication);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async delete(req,res,next){
        try{
            const {id} = req.params;
            const commentingApplication = await CommentingApplication.destroy({where: {id}});
            return res.json(commentingApplication);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }
}

module.exports = new CommentingApplicationController()