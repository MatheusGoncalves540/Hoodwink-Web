function registerNewUser (User,res,nickname,email,password) {
    try {
    const newUser = User.create({
        nickname : nickname,
        email : email,
        password : password
    });
        return res.status(201).json({"msg":"new user registered with success!"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg: "A server error has occurred, try again later"});
    }
};

module.exports = {registerNewUser}