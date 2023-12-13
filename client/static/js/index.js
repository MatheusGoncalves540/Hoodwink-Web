document.getElementById('createRoomForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    axios.post('/creating-room', {
        nickname: event.target.nickname.value,
        roomName: event.target.roomName.value,
        maxPlayer: event.target.maxPlayer.value,
        roomPass: event.target.roomPass.value,
    })
    .then(function (response) {
        
        const roomId = response.data.roomId;
        const nickname = response.data.nickname;
        const roomPass = response.data.roomPass;
        
        // Fazer o redirecionamento usando POST
        const form = document.createElement('form');
        form.method = 'post';
        form.action = `/room/${roomId}`;
        
        const inputNickname = document.createElement('input');
        inputNickname.type = 'hidden';
        inputNickname.name = 'nickname';
        inputNickname.value = nickname;
        form.appendChild(inputNickname);
        
        const inputRoomPass = document.createElement('input');
        inputRoomPass.type = 'hidden';
        inputRoomPass.name = 'roomPass';
        inputRoomPass.value = roomPass;
        form.appendChild(inputRoomPass);

        document.body.appendChild(form);
        form.submit();
    })
    .catch(function (error) {
        console.log(error);
        if (error.response && error.response.status === 422) {
            // Erro 422 (Unprocessable Entity)
            window.alert("algum dado inserido é inválido, revise os dados e tente novamente.");
        };
    });
});

document.getElementById("EnterRoom").addEventListener("submit", function(event) {
    // Impede o envio padrão do formulário
    event.preventDefault();

    // Obter o valor do input "InputRoomId"
    const roomId = document.getElementById("InputRoomId").value;

    // Atualizar o atributo "action" do formulário com o valor obtido
    const form = document.getElementById("EnterRoom");
    form.action = `/room/${roomId}`;

    // Enviar o formulário com o novo URL no atributo "action"
    form.submit();
});