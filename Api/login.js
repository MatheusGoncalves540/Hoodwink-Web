function login(request,response,next){
    //fazer com base no bandco de dados
    const usuario = "Matheus";
    const senha = "123";
    if (request.body.usuario === usuario && request.body.senha === senha) {
        //update coluna "Hash" com novo uuid
        response.redirect('http://127.0.0.1:5500/Cliente/index.html');
    } else {
        response.redirect('http://127.0.0.1:5500/Cliente/login.html?erro=1');
    }
}

module.exports = {login}