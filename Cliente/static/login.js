function login(req,res,next){
    //fazer com base no banco de dados
    const usuario = "Matheus";
    const senha = "123";
    if (req.body.usuario === usuario && req.body.senha === senha) {
        //update coluna "Hash" com novo uuid
        res.redirect('http://127.0.0.1:5500/Cliente/index.html');
    } else {
        res.redirect('http://127.0.0.1:5500/Cliente/login.html?erro=1');
    }
}

module.exports = {login}