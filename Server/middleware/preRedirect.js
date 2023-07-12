const jwt = require('jsonwebtoken')

module.exports = function (role) {
    return function (req, res, next){
        if (req.method === "OPTIONS"){
            next()
        }
        try {
            //const token = req.headers.authorization.split(' ')[1]//Bearer токен
            let cookies = {};

            const cookiesArray = req.headers.cookie.split(';');

            cookiesArray.forEach((cookie) => {
                const [key, value] = cookie.trim().split('=');
                cookies[key] = value;
            });

            const token = cookies["token"];
            if (!token){
                return res.status(401).json({message:"Не авторизован"})
            }
            const decoded = jwt.verify(token, process.env.SECRET_KEY)
            if (decoded.role !== role){
                return res.status(403).json({message:"Нет доступа"})
            }
            
            next()
        } catch(e){
            return res.status(401).json({message:"Не авторизован"})
        }
    }
}