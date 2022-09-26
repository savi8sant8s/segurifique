## Verificador de vulnerabilidades
--------
- Baixar Programa Destktop do Owasp ZAP (https://www.zaproxy.org/download/)
- Pegar chave de API em ferramentas > opções > api

Obs.: Owasp ZAP roda na porta 8080

## Aplicação Web
------
- Adicionar variáveis de ambiente:
```env
ZAP_API_KEY=s1g0o2iudmp5hdpdjniq8vjba2
ZAP_PROXY=http://localhost:8080
```
- Executar: npx prisma migrate dev (para criar o banco de dados)
- Executar: npm i (para instalar as dependências)
- Executar: npm run dev (para iniciar a aplicação)
- Executar (opcional): npx prisma studio (para manipular o banco de dados pelo navegador)