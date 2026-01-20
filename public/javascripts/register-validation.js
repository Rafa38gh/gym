// register-validation.js
// Validação do formulário de registro

//DEBUG
console.log('register-validation.js carregado.');

const form = document.getElementById('registerForm');
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const senhaInput = document.getElementById('senha');
const confirmarSenhaInput = document.getElementById('confirmarSenha');
const submitBtn = document.getElementById('submitBtn');

const nomeError = document.getElementById('nomeError');
const emailError = document.getElementById('emailError');
const senhaError = document.getElementById('senhaError');
const confirmarSenhaError = document.getElementById('confirmarSenhaError');
const passwordStrength = document.getElementById('passwordStrength');

// Validação de email
function validateEmail(email) {
    // Verificar se tem @
    if (!email.includes('@')) {
        return { valid: false, message: 'Email deve conter @' };
    }

    // Verificar se tem pelo menos um ponto após o @
    const partes = email.split('@');
    if (partes.length !== 2) {
        return { valid: false, message: 'Email inválido' };
    }

    const [usuario, dominio] = partes;

    // Verificar se o usuário não está vazio
    if (usuario.length === 0) {
        return { valid: false, message: 'Email deve ter um usuário antes do @' };
    }

    // Verificar se o domínio tem pelo menos um ponto
    if (!dominio.includes('.')) {
        return { valid: false, message: 'Email deve conter um domínio válido (ex: .com)' };
    }

    // Verificar se termina com uma extensão válida
    const extensoesValidas = ['.com', '.br', '.org', '.net', '.edu', '.gov', '.com.br', '.org.br', '.net.br'];
    const terminaComExtensaoValida = extensoesValidas.some(ext => dominio.toLowerCase().endsWith(ext));

    if (!terminaComExtensaoValida) {
        return { valid: false, message: 'Email deve terminar com uma extensão válida (ex: .com, .br, .com.br)' };
    }

    // Regex completo para validação final
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
        return { valid: false, message: 'Email inválido' };
    }

    return { valid: true };
}

// Calcular força da senha
function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    return strength;
}

// Mostrar erro
function showError(input, errorElement, message) {
    input.classList.add('error');
    input.classList.remove('success');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

// Mostrar sucesso
function showSuccess(input, errorElement) {
    input.classList.remove('error');
    input.classList.add('success');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

// Validar nome
function checkNome() {
    const nomeValue = nomeInput.value.trim();

    if (nomeValue === '') {
        showError(nomeInput, nomeError, 'Nome é obrigatório');
        return false;
    } else if (nomeValue.length < 3) {
        showError(nomeInput, nomeError, 'Nome deve ter no mínimo 3 caracteres');
        return false;
    } else if (nomeValue.length > 100) {
        showError(nomeInput, nomeError, 'Nome muito longo');
        return false;
    } else {
        showSuccess(nomeInput, nomeError);
        return true;
    }
}

// Validar email
function checkEmail() {
    const emailValue = emailInput.value.trim();

    if (emailValue === '') {
        showError(emailInput, emailError, 'Email é obrigatório');
        return false;
    }

    const validacao = validateEmail(emailValue);
    
    if (!validacao.valid) {
        showError(emailInput, emailError, validacao.message);
        return false;
    } else {
        showSuccess(emailInput, emailError);
        return true;
    }
}

// Validar senha
function checkSenha() {
    const senhaValue = senhaInput.value;

    if (senhaValue === '') {
        showError(senhaInput, senhaError, 'Senha é obrigatória');
        passwordStrength.classList.remove('show');
        return false;
    } else if (senhaValue.length < 6) {
        showError(senhaInput, senhaError, 'Senha deve ter no mínimo 6 caracteres');
        passwordStrength.classList.remove('show');
        return false;
    } else {
        showSuccess(senhaInput, senhaError);
        
        // Mostrar força da senha
        const strength = calculatePasswordStrength(senhaValue);
        passwordStrength.classList.add('show');
        
        if (strength <= 2) {
            passwordStrength.textContent = 'Força: Fraca';
            passwordStrength.className = 'password-strength show strength-weak';
        } else if (strength <= 3) {
            passwordStrength.textContent = 'Força: Média';
            passwordStrength.className = 'password-strength show strength-medium';
        } else {
            passwordStrength.textContent = 'Força: Forte';
            passwordStrength.className = 'password-strength show strength-strong';
        }
        
        return true;
    }
}

// Validar confirmação de senha
function checkConfirmarSenha() {
    const senhaValue = senhaInput.value;
    const confirmarValue = confirmarSenhaInput.value;

    if (confirmarValue === '') {
        showError(confirmarSenhaInput, confirmarSenhaError, 'Confirmação de senha é obrigatória');
        return false;
    } else if (confirmarValue !== senhaValue) {
        showError(confirmarSenhaInput, confirmarSenhaError, 'As senhas não coincidem');
        return false;
    } else {
        showSuccess(confirmarSenhaInput, confirmarSenhaError);
        return true;
    }
}

// Event listeners
nomeInput.addEventListener('blur', checkNome);
emailInput.addEventListener('blur', checkEmail);
senhaInput.addEventListener('blur', checkSenha);
senhaInput.addEventListener('input', checkSenha);
confirmarSenhaInput.addEventListener('blur', checkConfirmarSenha);

nomeInput.addEventListener('input', () => {
    if (nomeInput.classList.contains('error')) {
        checkNome();
    }
});

emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('error')) {
        checkEmail();
    }
});

confirmarSenhaInput.addEventListener('input', () => {
    if (confirmarSenhaInput.classList.contains('error')) {
        checkConfirmarSenha();
    }
});

// Validação no submit
form.addEventListener('submit', (e) => {

    const isNomeValid = checkNome();
    const isEmailValid = checkEmail();
    const isSenhaValid = checkSenha();
    const isConfirmarValid = checkConfirmarSenha();

    if(!isNomeValid || !isEmailValid || !isSenhaValid || !isConfirmarValid) {
        e.preventDefault();
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Cadastrando...';
});