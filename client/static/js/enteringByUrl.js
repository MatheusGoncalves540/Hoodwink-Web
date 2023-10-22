document.getElementById('titlePage').innerHTML += ((window.location.href).split('/room/')[1]) ;

document.getElementById("EnterRoom").addEventListener("submit", function(event) {
    // Impede o envio padrão do formulário
    event.preventDefault();

    //pega o roomId definido na url
    document.getElementById("InputRoomId").value = ((window.location.href).split('/room/')[1]);

    // Obter o valor do input "InputRoomId"
    const roomId = document.getElementById("InputRoomId").value;

    // Atualizar o atributo "action" do formulário com o valor obtido
    const form = document.getElementById("EnterRoom");
    form.action = `/room/${roomId}`;

    // Enviar o formulário com o novo URL no atributo "action"
    form.submit();
});