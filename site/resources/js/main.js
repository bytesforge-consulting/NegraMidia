document.addEventListener('DOMContentLoaded', function() {
    var currentYear = new Date().getFullYear();
    document.getElementById('footerCurrentYear').textContent = currentYear;

    
    var form = document.getElementById('formContato');
    form.addEventListener('submit', SendMessageForm);

});


function SendMessageForm(event){
    event.preventDefault(); 

    // Cria um objeto FormData com os dados do formulário
    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);
    
    fetch('http://localhost:7150/api/ReceivedEmailFunction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formProps),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na resposta da rede');
      }
      return response;
    })
    .then(data => {
      UIkit.notification({message: '<span uk-icon=\'icon: check\'></span> Mensagem enviada com sucesso.', status: 'primary', pos: 'bottom-right'});
      document.getElementById('formContato').reset();
    })
    .catch(error => UIkit.notification({message: '<span uk-icon=\'icon: warning\'></span> Houve um erro ao enviar sua mensagem', status: 'danger', pos: 'bottom-right'}));
}