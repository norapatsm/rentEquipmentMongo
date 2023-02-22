const users = require('../models/users_model');

function getUsers(in_json){
    return new Promise((resolve, reject) => {
        users.find(in_json,(err,data)=>{
            resolve(data);
        });
    });
}

module.exports = getUsers;