const bcrypt = require('bcrypt');
const prisma = require('../prisma/client');

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Registrar usuários
async function register(req, res) {
    let { nome, username, email, senha } = req.body;

    // Normalização
    nome = nome?.trim();
    username = username?.trim().toLowerCase();
    email = email?.trim().toLowerCase();

    if(!nome || !username || !email || !senha) {
        return res.status(400).render('auth/register', {
            error: 'Nome, username, email e senha são obrigatórios'
        });
    }

    if(nome.length < 3 || nome.length > 100) {
        return res.status(400).render('auth/register', {
            error: 'Nome deve ter entre 3 e 100 caracteres',
            nome,
            username,
            email
        });
    }

    if(!username) {
        return res.status(400).render('auth/register', {
            error: 'Username é obrigatório',
            nome,
            username,
            email
        });
    }

    const usernameRegex = /^[a-z0-9](?:[a-z0-9_]{1,18}[a-z0-9])?$/;

    if(!usernameRegex.test(username)) {
        return res.status(400).render('auth/register', {
            error: 'Username inválido, apenas letras minúsculas, números e "_"',
            nome,
            username,
            email
        });
    }

    if(!isValidEmail(email)) {
        return res.status(400).render('auth/register', {
            error: 'Email inválido'
        });
    }

    if(senha.length < 6) {
        return res.status(400).render('auth/register', {
            error: 'Senha deve ter no mínimo 6 caracteres'
        });
    }

    try {
        // Email já existente
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if(existingUser) {
            return res.status(409).render('auth/register', {
                error: 'Email já está em uso',
                nome,
                username
            });
        }

        // Username já existente
        const existingUserByUsername = await prisma.user.findUnique({
            where: { username }
        });

        if(existingUserByUsername) {
            return res.status(409).render('auth/register', {
                error: 'Username já está em uso',
                nome,
                username,
                email
            });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        await prisma.user.create({
            data: {
                nome,
                username,
                email,
                senha: hashedPassword
            }
        });

        return res.redirect('/login');

    } catch(error) {
        console.error(error);
        return res.status(500).render('auth/register', {
            error: 'Error interno do servidor'
        });
    }
}


// Login de usuários
async function login(req, res) {
    let { email, senha } = req.body;

    if(!email || !senha) {
        return res.render('auth/login', {
            error: 'Credenciais inválidas'
        });
    }

    email = email.trim().toLowerCase();

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.render('auth/login', {
            error: 'Credenciais inválidas'
        });
    }

    if(senha.length < 6) {
        return res.render('auth/login', {
            error: 'Credenciais inválidas'
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if(!user) {
            return res.render('auth/login', {
                error: 'Credenciais inválidas'
            });
        }

        const isPasswordValid = await bcrypt.compare(senha, user.senha);

        if(!isPasswordValid) {
            return res.render('auth/login', {
                error: 'Credenciais inválidas'
            });
        }

        req.session.user = {
            id: user.id,
            nome: user.nome,
            username: user.username,
            email: user.email
        };

        return res.redirect('/dashboard');

    } catch(error) {
        console.error(error);
        return res.status(500).render('auth/login', {
            error: 'Erro interno do servidor'
        });
    }

}

// Logout
async function logout(req, res) {
    try {
        req.session.destroy(err => {
            if(err) {
                console.error(err);
                return res.status(500).json({ error: 'Erro ao encerrar sessão' });
            }

            res.clearCookie('connect.sid')      // Nome padrão do express-session
            return res.status(200).json({ success: true });
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

module.exports = {
    register,
    login,
    logout
};