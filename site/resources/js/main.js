const BASEAPI_URL = `${window.location.origin}/api`;
const MESSAGE_STOREKEY = 'SAVEDMESSAGE';

document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    document.getElementById('footerCurrentYear').textContent = currentYear;

    MaskPhoneNumbers();
    LoadExistingMessage();

    const form = document.getElementById('formContato');
    form.addEventListener('submit', SendMessageForm);

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

    document.querySelectorAll('#formContato input')
      .forEach(link => link.addEventListener('keyup', debounce((e) => {        
        let formData = new FormData(form);
        let formProps = Object.fromEntries(formData);

        localStorage.setItem(MESSAGE_STOREKEY, JSON.stringify(formProps));
    }, 1000)));    

    document.querySelectorAll('#formContato textarea')
      .forEach(link => link.addEventListener('keyup', debounce((e) => {        
        let formData = new FormData(form);
        let formProps = Object.fromEntries(formData);

        localStorage.setItem(MESSAGE_STOREKEY, JSON.stringify(formProps));
    }, 1000))); 
});

function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

function SendMessageForm(event){
    event.preventDefault(); 
    let loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.classList.remove('uk-invisible');
    
    const formData = new FormData(event.target);
    const formProps = Object.fromEntries(formData);

    fetch(`${BASEAPI_URL}/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formProps)
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
      localStorage.removeItem(MESSAGE_STOREKEY);
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

function LoadExistingMessage(){
  let messageStored = localStorage.getItem(MESSAGE_STOREKEY);
  if(messageStored == undefined || messageStored == null)
    return;
  
  let message = JSON.parse(messageStored);
  let form = document.getElementById('formContato');
  let inputs = form.querySelectorAll('input, textarea');

  inputs.forEach(el =>{
    el.value = message[el.name] || '';
  });
}