# Inicialização do Sistema

1. Baixar o npm:
```bash
npm install
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

4. Iniciar o aplicativo:
```bash
npm run dev
npm start
```