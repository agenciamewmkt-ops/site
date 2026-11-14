# Ativação do formulário → Google Sheets

Planilha: https://docs.google.com/spreadsheets/d/17ZtluDq5HRBflMVvMnCx9Shb4q0nnPmEb56foCle3N4/edit

## Situação
O formulário, a rota Vercel e o Apps Script estão preparados nesta branch. O envio NÃO está ativo enquanto não existir uma implantação do Apps Script e as variáveis da Vercel. Não mesclar sem teste real.

## 1. Ativar o Apps Script
1. Abra a planilha com a conta proprietária, escolha Extensões > Apps Script.
2. Cole google-apps-script/Code.gs deste repositório no editor e salve.
3. Execute setupMew uma vez e autorize o acesso.
4. Em Configurações do projeto > Propriedades do script, crie MEW_SHEETS_SECRET com um valor aleatório forte de pelo menos 32 caracteres. Não compartilhe esse segredo no chat ou no GitHub.
5. Em Implantar > Nova implantação > Aplicativo da Web, configure executar como você e acesso qualquer pessoa. Autorize e copie a URL /exec.

## 2. Configurar a Vercel
No projeto site2 (equipe mew-marketing), configure GOOGLE_APPS_SCRIPT_URL com a URL terminada em /exec e MEW_SHEETS_SECRET com a mesma chave das propriedades do script. Use valor criptografado/sensível e configure o escopo Production; para testes de branch, também Preview. Depois faça novo deploy.

## 3. Testar antes de mesclar
1. Acesse o Preview da Vercel desta branch. Envie um lead identificado como TESTE.
2. Confirme mensagem de sucesso E nova linha na aba Leads.
3. Teste número inválido, ausência de ciência da política e falha de rede.
4. Apague o lead de teste. Só então mescle a branch e valide produção.

## Privacidade e segurança
Não tornar a planilha pública. Restringir permissões, definir retenção e revisar Política de Privacidade para indicar Google Sheets. O honeypot é básico; adotar também rate limiting e proteção contra automação antes do lançamento. Não enviar a chave de integração para o navegador.