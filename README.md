# Mapa de Recorrência ENEM 2026 — RISING

Landing page estática com três seções, amostras reais do material e botões de WhatsApp. HTML, CSS e JavaScript sem dependências e sem etapa de compilação.

## Arquivos

- `dist/index.html`: página completa, incluindo estilos e interações.
- `dist/assets/`: logo, fotos, fontes locais e páginas do visor do MAPA.
- `vercel.json`: configuração de publicação na Vercel.
- `COPY-E-LAYOUT.md`: textos, estrutura e detalhes da página.
- `tests/`: verificações locais dos links, cards e halo do retrato.

## Importar na Vercel

1. Importe este repositório do GitHub na sua conta da Vercel.
2. Mantenha a raiz do projeto na raiz do repositório (`./`).
3. Selecione **Other** como Framework Preset.
4. Use **Build Command vazio**, **Install Command vazio** e **Output Directory `dist`**. O `vercel.json` já registra essas configurações.
5. Publique o projeto e teste o endereço gerado em desktop e celular.
6. Adicione o domínio próprio em **Settings → Domains** e configure no seu provedor os registros DNS fornecidos pela Vercel.

A página não exige variáveis de ambiente nem serviços de servidor. O importador da Vercel precisa ter acesso ao repositório escolhido. O envio dos arquivos ao GitHub, a importação e a configuração do domínio são etapas separadas; preparar este código não executa essas etapas automaticamente.

Documentação oficial: [integração com GitHub](https://vercel.com/docs/git/vercel-for-github), [configuração de publicação](https://vercel.com/docs/builds/configure-a-build) e [domínios](https://vercel.com/docs/domains).

## Editar a página

Edite `dist/index.html` e mantenha os assets referenciados dentro de `dist/assets/`. A página funciona sem depender do visualizador do ChatGPT.

Os CTAs apontam para `https://wa.me/5583999601029`, com a mensagem:

> Eai, galera da RISING, cade o meu MAPA de recorrência??

Para alterar o destino, atualize `RISING_CONFIG` no script e os dois atributos `href` no HTML, preservando também o acesso sem JavaScript.

## Verificações

Com Node.js instalado:

```sh
node tests/whatsapp-links.cjs
node tests/ecosystem-cards.cjs
node tests/portrait-glow.cjs
```

Essas verificações conferem estrutura e configuração do código. Não substituem a revisão visual nem a confirmação de que o WhatsApp abre no aparelho do visitante. A abertura do aplicativo pelo botão no celular ainda deve ser confirmada antes da campanha.

## Manutenção

Quando a integração GitHub → Vercel estiver configurada, os novos commits na branch de produção atualizarão a publicação da Vercel. Alterações realizadas somente na versão hospedada pelo ChatGPT não serão sincronizadas automaticamente com este repositório: elas precisam ser levadas ao GitHub para aparecer na Vercel.
