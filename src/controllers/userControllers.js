import userServices from "../services/userServices.js";


async function signup(req, res, next){

    const {name, email, password, type} = req.body;
    try {
        await userServices.signup({name, email, password, type});
        return res.status(201).send({message: "Successfully registered user"})
    } catch (err) {
        next(err);
    }
}

async function signin(req, res, next){

    const {email, password} = req.body;
    try {
        
    } catch (err) {
        next(err);
    }
}

export default {
    signup,
    signin
}