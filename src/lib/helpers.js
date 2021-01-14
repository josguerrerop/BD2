const bcrypt = require('bcryptjs');
const passport = require('passport');


const helpers = {};

helpers.encrypt = async (password) => {
    try{
const salt =await bcrypt.genSalt(10);
const hash =await bcrypt.hash(password,salt);
    }catch(error){
        console.log(error);
    }
return hash;
};

helpers.compararpass = async (password, savePassw) => {
    try{
await bcrypt.compare(password,savePassw);
}catch(error){
    console.log(error);
}
};

module.exports=helpers;