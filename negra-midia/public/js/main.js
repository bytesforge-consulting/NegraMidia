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

window.addEventListener('appinstalled', () => {
  // If visible, hide the install promotion
  hideInAppInstallPromotion();
  // Log install to analytics
  console.log('INSTALL: Success');
});
