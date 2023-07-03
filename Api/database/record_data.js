async function registerNewUser (User,res,nickname,email,passwordHash) {
    const newUser = new User({
        nickname,
        email,
        password : passwordHash,
    });
    try {
        await newUser.save({ timestamps: { createdAt: true, updatedAt: true } });
        return res.status(200).json({ msg: "new user created successfully"});

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"a server error has occurred"});
    }
};

module.exports = {registerNewUser}