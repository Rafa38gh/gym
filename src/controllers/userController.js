const bcrypt = require('bcrypt');
const prisma = require('../prisma/client');


// Registrar usuários
async function register(req, res) {
    const { nome, email, senha } = req.body;

    // Validação
    if(!nome || !email || !senha) {
        return res.status(400).json({
            error: 'Nome, email e senha são obrigatórios.'
        });
    }

    try {
        // Verificar se o email já está em uso
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if(existingUser) {
            return res.status(409).json({
                error: 'Email já está em uso.'
            });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Criar usuário
        const user = await prisma.user.create({
            data: {
                nome,
                email,
                senha: hashedPassword
            }
        });

        return res.redirect('/login');

        // Retornar resposta
        /*return res.status(201).json({
            id: user.id,
            nome: user.nome,
            email: user.email,
            createdAt: user.createdAt
        }); */

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            error: 'Erro interno do servidor.'
        });
    }
}


// Login de usuários
async function login(req, res) {
    console.log('Login attempt received');
    const { email, senha } = req.body;

    // Validação
    if(!email || !senha) {
        return res.status(400).json({
            error: 'Email e senha são obrigatórios.'
        });
    }

    try {
        // Buscar usuário
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if(!user) {
            return res.render('auth/login', {
                error: 'Credenciais inválidas.'
            });
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(senha, user.senha);

        if(!isPasswordValid) {
            return res.render('auth/login', {
                error: 'Credenciais inválidas.'
            });
        }

        // Login com sucesso
        console.log('Login bem sucedido para o usuário:', user.email);
        req.session.user = {
            id: user.id,
            nome: user.nome,
            email: user.email
        }

        return res.redirect('/dashboard');

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            error: 'Erro interno do servidor.'
        });
    }

}

module.exports = {
    register,
    login
};