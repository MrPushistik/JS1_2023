const {User} = require('../models/models')
const ApiError = require('../error/ApiError')
class UserController{
    async registration(req,res,next){
        try{
            const {surname,name,patronymic,post,placeWorkOrStudy,phone,email,dateCreation} = req.body
            const user = await User.create({surname,name,patronymic,post,placeWorkOrStudy,phone,email,dateCreation})
            return res.json(user)
        }
        catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

    async login(req,res){
        
    }

    async check(req,res,next){
        const {id} = req.query
        if (!id){
            return next(ApiError.badRequest('Не задан ID'))
        }
        res.json(id)
    }
}

module.exports = new UserController()