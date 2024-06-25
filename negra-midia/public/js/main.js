document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('ul a[href^="#"]')
      .forEach(link => link.addEventListener('click', (e) => {
      e.preventDefault();

      document.querySelector(e.currentTarget.getAttribute('href'))
        .scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
    }));
});
