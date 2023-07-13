const {Feedback, GuestRequest} = require("../models/models");
const ApiError = require("../error/ApiError");

class FeedbackController{
    async create(req,res,next){
        try{
            const {commentatorName,commentatorSurname,comment,estimation,status,guestRequestId} = req.body;

            const request = await GuestRequest.findOne({where: {id: guestRequestId}});

            if (request){
                if(request.surname === commentatorSurname && request.name === commentatorName){
                    const feedback = await Feedback.create({commentatorName,commentatorSurname,comment,estimation,status,guestRequestId}); // - dataCreation
                    return res.json(feedback);
                }
                else {
                    next(ApiError.badRequest("У заявителя были иные Фамилия и/или Имя"));
                }
            }
            else {
                next(ApiError.badRequest("Заявка с указанным номером не существует"));
            }   
        }
        catch(e){
            next(ApiError.badRequest("Неверный формат данных"));
        }

    }

    async getAll(req,res,next){
        try{
            const feedbacks = await Feedback.findAll({order: [["createdAt","DESC"]]});
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
            const {commentatorName,commentatorSurname,comment,estimation,status,guestRequestId} = req.body; // - dateCreation + commentatorSurname
            const feedback = await Feedback.update({commentatorName,commentatorSurname,comment,estimation,status,guestRequestId}, {where: {id}});
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

    async createFeedback(req, res, next){
        try {
            const {commentatorName, commentatorSurname, comment, estimation} = req.body; // + commentatorSurname - dateCreation
            let status = "MODERATION";
            const newFeedback = await Feedback.create({commentatorName, commentatorSurname, comment, estimation, status});
            return res.json(newFeedback);
        }
        catch(e){
            next(ApiError.badRequest(e));
        }
    }
}

module.exports = new FeedbackController()