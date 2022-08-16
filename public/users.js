const users = [];


//Join user to chat
function userJoin(id, username, room){
    const user = {id, username, room};

    users.push(user);

    return user;
}

//get current user
function getCurrentUser(id){
    return users.find(user => user.id == id);
}

function deleteUser(id){
    delete users[id];
}

module.exports = {
    userJoin,
    getCurrentUser,
    deleteUser
}
