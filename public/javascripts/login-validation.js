// Validação do formulário de login

const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const emailError = document.getElementById('emailError');
const senhaError = document.getElementById('senhaError');
const submitBtn = document.getElementById('submitBtn');

// Validação de email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(input, errorElement, message) {
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function showSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

function checkEmail() {
    const emailValue = emailInput.value.trim();

    if(emailValue === '') {
        showError(emailInput, emailError, 'Email é obrigatório');
        return false;

    } else if(!validateEmail(emailValue)) {
        showError(emailInput, emailError, 'Email inválido');
        return false;

    } else {
        showSuccess(emailInput, emailError);
        return true;
    }
}

// Validação de senha
function checkSenha() {
    const senhaValue = senhaInput.value;

    if(senhaValue === '') {
        showError(senhaInput, senhaError, 'Senha é obrigatória');
        return false;

    } else if(senhaValue.length < 6) {
        showError(senhaInput, senhaError, 'Senha deve ter ao menos 6 caracteres');
        return false;

    } else {
        showSuccess(senhaInput, senhaError);
        return true;
    }
}

// Event listeners
emailInput.addEventListener('blur', checkEmail);
senhaInput.addEventListener('blur', checkSenha);

emailInput.addEventListener('input', () => {
    if(emailInput.classList.contains('error')) {
        checkEmail();
    }
});

senhaInput.addEventListener('input', () => {
    if(senhaInput.classList.contains('error')) {
        checkSenha();
    }
});

// Submit
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const isEmailValid = checkEmail();
    const isSenhaValid = checkSenha();

    if(isEmailValid && isSenhaValid) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Entrando...';
        form.submit();
    }
});