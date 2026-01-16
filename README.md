# Inicialização do Sistema

1. Baixar o npm:
```bash
npm install
npm start
```

2. Iniciar os containeres:
```bash
docker-compose up -d --build
```

3. Subir o banco:
```bash
cp .env.example .env
npx prisma migrate dev --name init
```