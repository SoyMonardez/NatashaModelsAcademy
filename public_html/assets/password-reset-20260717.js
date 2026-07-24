(() => {
  const form = document.querySelector('form');
  const message = document.querySelector('[data-message]');
  const submit = form?.querySelector('button[type="submit"]');
  const apiBase = location.hostname === 'localhost' ? 'http://localhost:3001/api' : location.origin + '/api';

  const showMessage = (text, type) => {
    message.textContent = text;
    message.dataset.type = type;
  };

  if (!form || !message || !submit) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submit.disabled = true;
    showMessage('', '');

    try {
      const mode = form.dataset.mode;
      const endpoint = mode === 'request' ? '/auth/password-reset/request' : '/auth/password-reset/confirm';
      const body = mode === 'request'
        ? { email: form.elements.email.value.trim() }
        : { token: new URLSearchParams(location.search).get('token') || '', password: form.elements.password.value };

      if (mode === 'confirm' && body.password !== form.elements.confirmPassword.value) {
        showMessage('Las contraseñas no coinciden.', 'error');
        return;
      }

      const response = await fetch(apiBase + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        showMessage(data.error || 'No pudimos completar la solicitud. Probá nuevamente.', 'error');
        return;
      }

      showMessage(data.message || 'Listo.', 'success');
      if (mode === 'confirm') form.reset();
    } catch {
      showMessage('No pudimos conectar con el servidor. Probá nuevamente más tarde.', 'error');
    } finally {
      submit.disabled = false;
    }
  });
})();