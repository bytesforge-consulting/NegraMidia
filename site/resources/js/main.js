
document.addEventListener('DOMContentLoaded', function() {
    var currentYear = new Date().getFullYear();
    document.getElementById('footerCurrentYear').textContent = currentYear;

    
    var form = document.getElementById('formContato');
    form.addEventListener('submit', SendMessageForm);

    MaskPhoneNumbers();

    var teamSliderEl = document.getElementById('teamSlider');
    teamSliderEl.addEventListener('itemshow', e =>{
    })
    
    document.querySelectorAll('a[href^="#"]')
      .forEach(link => link.addEventListener('click', (e) => {
      e.preventDefault();

      document.querySelector(e.currentTarget.getAttribute('href'))
        .scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
    }))

    
});


function SendMessageForm(event){
    event.preventDefault(); 
    let loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.classList.remove('uk-invisible');
    
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
    .catch(error => UIkit.notification({message: '<span uk-icon=\'icon: warning\'></span> Houve um erro ao enviar sua mensagem', status: 'danger', pos: 'bottom-right'}))
    .finally(() => loadingSpinner.classList.add('uk-invisible'));
}

function MaskPhoneNumbers(){
  const phoneInput = Array.from(document.querySelectorAll('input[type="tel"]'));

  phoneInput.forEach((input, index) => {
    IMask(input, {
      mask: [
        {
          mask: '(00)0000-0000',
        },
        {
          mask: '(00)00000-0000',
        }
      ]
    })
  });
}