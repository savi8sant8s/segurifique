## Verificador de vulnerabilidades
--------
- Baixar Programa Destktop do Owasp ZAP (https://www.zaproxy.org/download/)
- Pegar chave de API em ferramentas > opções > api

Obs.: Owasp ZAP roda na porta 8080

## Aplicação Web
------
- Adicionar variáveis de ambiente:
```env
ZAP_API_KEY=
ZAP_PROXY=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
```
- Executar: npm i (para instalar as dependências)
- Executar: npm run dev (para iniciar a aplicação em desenvolvimento)
- Executar: npm run build && npm run start (para iniciar a aplicação em produção)