const commendModel = require('../model/commend')

const commendController = {}

commendController.get = async (req, res) => {

    const id = req.params.commendId
    
    try{

        if(res.locals.user){
            const commend = await commendModel.findById(id)
                                    populate('user', ['email'])
                                    populate('board', ['board'])

            if(!commend){
                return res.status(402).json({
                    msg : "no commendId"
                })
            }
            else{
                res.status(200).json({
                    msg : "get commend",
                    commendInfo : {
                        id : commend._id,
                        user : commend.user,
                        board : commend.board,
                        commend : commend.commend
                    }
                })
            }
        }
        else{
            res.status(403).json({
                msg : "not token"
            })
        }

    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

commendController.save = async (req, res) => {

    const { user, board, commend } = req.body

    const newCommend = new commendModel({
        user, board, commend 
    })

    try{

        if(res.locals.user){
            const commend = await newCommend.save()

            res.status(200).json({
                msg : "register commend",
                commendInfo : {
                    id : commend._id,
                    user : commend.user,
                    board : commend.board,
                    commend : commend.commend
                }
            })
        }
        else{
            res.status(403).json({
                msg : "not token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

commendController.update = async (req, res) => {

    const id = req.params.commendId

    const updateOps = {}

    for(const ops of req.body){
        updateOps[ops.propName] = ops.value
    }

    try{

        if(res.locals.user){
            const commend = await commendModel.findByIdAndUpdate(id, {$set : updateOps})

            if(!commend){
                return res.status(402).json({
                    msg : "no commendId"
                })
            }
        }
        else{
            res.status(403).json({
                msg : "not token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

commendController.delete = async (req, res) => {

    const id = req.params.commendId

    try{

        if(res.locals.user){
            const commend = await commendModel.findByIdAndRemove(id)

            if(!commend){
                return res.status(402).json({
                    msg : "no commendId"
                })
            }
            else{
                res.status(200).json({
                    msg : "delete commend by id: " + id
                })
            }
        }
        else{
            res.status(403).json({
                msg : "not token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

module.exports = commendController