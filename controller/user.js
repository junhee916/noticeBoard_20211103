const userModel = require('../model/user')
const jwt = require('jsonwebtoken')

const userController = {}

userController.allget = async (req, res) => {

    try{

        if(res.locals.user){
            const users = await userModel.find()

            res.status(200).json({
                msg : "get users",
                count : users.length,
                userInfo : users.map(user => {
                    return {
                        id : user._id,
                        name : user.name,
                        email : user.email,
                        password : user.password
                    }
                })
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

userController.detailget = async (req, res) => {

    const id = req.params.userId

    try{

        if(res.locals.user){
            const user = await userModel.findById(id)

            if(!user){
                return res.status(402).json({
                    msg : "no userId"
                })
            }
            else{
                res.status(200).json({
                    msg : "get user",
                    userInfo : {
                        id : user._id,
                        name : user.name,
                        email : user.email,
                        password : user.password
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

userController.signup = async (req, res) => {

    const { name, email, password } = req.body

    try{
        const user = await userModel.findOne({email})

        if(user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            const user = new userModel({
                name, email, password
            })

            await user.save()

            res.status(200).json({
                msg : "success signup",
                userInfo : {
                    id : user._id,
                    name : user.name,
                    email : user.email,
                    password : user.password
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

userController.login = async (req, res) => {

    const { email, password } = req.body

    try{
        const user = await userModel.findOne({email})

        if(!user){
            return res.status(400).json({
                msg : "user email, please other email"
            })
        }
        else{
            await user.comparePassword(password, (err, isMatch) => {

                if(err || !isMatch){
                    return res.status(401).json({
                        msg : "not match password"
                    })
                }
                else{
                    const payload = {
                        id : user._id,
                        email : user.email
                    }

                    const token = jwt.sign(
                        payload,
                        process.env.SECRET_KEY,
                        {
                            expiresIn : '1h'
                        }
                    )

                    res.status(200).json({
                        msg : "success login",
                        tokenInfo : token,
                        userInfo : {
                            id : user._id,
                            name : user.name,
                            email : user.email,
                            password : user.password
                        }
                    })
                }
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};

userController.update = async (req, res) => {

    const id = req.params.userId

    const updateOps = {}

    for(const ops of req.body){

        updateOps[ops.propName] = ops.value
    }

    try{

        if(res.locals.user){
            const user = await userModel.findByIdAndUpdate(id, {$set : updateOps})

            if(!user){
                return res.status(402).json({
                    msg : "no userId"
                })
            }
            else{
                res.status(200).json({
                    msg : "update user by id: " + id
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

userController.alldelete = async (req, res) => {

    try{

        if(res.locals.user){
            await userModel.remove()

            res.status(200).json({
                msg : "delete users"
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

userController.detaildelete = async (req, res) => {

    const id = req.params.userId

    try{

        if(res.locals.user){
            const user = await userModel.findByIdAndRemove(id)

            if(!user){
                return res.status(402).json({
                    msg : "no userId"
                })
            }
            else{
                res.status(200).json({
                    msg : "delete user by id: " + id
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

module.exports = userController