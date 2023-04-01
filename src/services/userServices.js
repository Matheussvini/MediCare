import bcrypt from 'bcrypt'
import userRepositories from '../repositories/userRepositories.js';
import errors from '../errors/index.js';


async function signup({name, email, password, type}){
    const { rowCount } = await userRepositories.findByEmail(email);
    if ( rowCount ) throw errors.duplicatedEmailError(email);

    const hashPassword = await bcrypt.hash(password, 10);
    await userRepositories.signup({name, email, password: hashPassword, type});
}

export default {
    signup,
}