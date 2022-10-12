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
NEXT_PUBLIC_GOOGLE_CLIENT_ID=856133900449-md74sdgjch51o0ap64qdu9tpemju6def.apps.googleusercontent.com
```
- Executar: npm i (para instalar as dependências)
- Executar: npm run dev (para iniciar a aplicação em desenvolvimento)
- Executar: npm run build && npm run start (para iniciar a aplicação em produção)