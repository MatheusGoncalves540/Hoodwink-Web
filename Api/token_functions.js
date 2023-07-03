require('dotenv').config();
const jwt = require('jsonwebtoken');

async function GenerateTokenAndLogin(userDB,res){
    try {
        const secret = process.env.SECRET;
        const token = jwt.sign(
            { id: userDB._id },
            secret
        );
        return res.status(200).json({
            msg: "logged successfully",
            token: token
        }); 
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"a server error has occurred"});
    };
};

function checkTocken(req, res, proceed) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "access denied"});
    }

    try {
        const secret = process.env.SECRET;
        jwt.verify(token, secret);

        proceed();
        
    } catch (error) {
        res.status(400).json({msg : "invalid token"})
    }
}

module.exports = {GenerateTokenAndLogin,checkTocken}