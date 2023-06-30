const {Feedback} = require("../models/models");
const ApiError = require("../error/ApiError");

class FeedbackController{
    async create(req,res,next){
        try{
            const {commentatorName,comment,estimation,dateCreation,status,guestRequestId} = req.body;
            const feedback = await Feedback.create({commentatorName,comment,estimation,dateCreation,status,guestRequestId});
            return res.json(feedback);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }

    }

    async getAll(req,res,next){
        try{
            const feedbacks = await Feedback.findAll();
            return res.json(feedbacks);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async get(req,res,next){
        try{
            const {id} = req.params;
            const feedbacks = await Feedback.findOne({where: {id}});
            return res.json(feedbacks);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async update(req,res,next){
        try{
            const {id} = req.params;
            const {commentatorName,comment,estimation,dateCreation,status,guestRequestId} = req.body;
            const feedback = await Feedback.update({commentatorName,comment,estimation,dateCreation,status,guestRequestId}, {where: {id}});
            return res.json(feedback);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }

    async delete(req,res,next){
        try{
            const {id} = req.params;
            const feedbacks = await Feedback.destroy({where: {id}});
            return res.json(feedbacks);
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }
    }
}

module.exports = new FeedbackController()