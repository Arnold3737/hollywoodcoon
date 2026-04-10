if (!('scheduler' in globalThis)) { globalThis.scheduler = { yield: () => Promise.resolve() }; }
(function() {
  'use strict';

  /* === CLIENT-SIDE FORM VALIDATION — NO DEPENDENCIES === */
  document.querySelectorAll('form[novalidate]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await scheduler.yield();

      let valid = true;

      form.querySelectorAll('[required]').forEach(field => {
        const error = form.querySelector(`[data-error="${field.name}"]`);
        if (!field.value.trim()) {
          valid = false;
          field.setAttribute('aria-invalid', 'true');
          if (error) {
            error.textContent = '[Field required]';
            error.removeAttribute('hidden');
          }
        } else {
          field.removeAttribute('aria-invalid');
          if (error) {
            error.textContent = '';
            error.hidden = true;
          }
        }
      });

      if (valid) {
        /* submit logic placeholder */
      }
    });
  });
})();
