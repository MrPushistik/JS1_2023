const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const credentialRouterRouter = require('./credentialRouter')
const commentingApplicationRouter = require('./commentingApplicationRouter')
const guestRequestRouter = require('./guestRequestRouter')
const feedbackRouter = require('./feedbackRouter')

router.use('/user',userRouter)
router.use('/credential',credentialRouterRouter)
router.use('/commentingApplication',commentingApplicationRouter)
router.use('/guestRequest',guestRequestRouter)
router.use('/feedback',feedbackRouter)

module.exports = router