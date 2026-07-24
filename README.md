# 🍽️ Cardápio Digital

Cardápio digital completo com autenticação, carrinho de compras, busca de endereço via CEP e finalização de pedido direto pelo WhatsApp. Construído para ser fácil de manter e gratuito para hospedar.

**Demo:** https://cardapio-digital-ten-hazel.vercel.app

---

## ✨ Funcionalidades

- **Autenticação de usuários** — cadastro e login com e-mail/senha, recuperação de senha por e-mail (Firebase Authentication)
- **Catálogo de produtos** — exibição por categorias, com foto, nome, descrição e preço (Firestore)
- **Busca e filtro** — busca por nome do produto e filtro por categoria
- **Carrinho de compras** — adicionar/remover itens, alterar quantidades, cálculo automático de subtotal e total
- **Endereço de entrega** — preenchimento automático via CEP usando a API pública do [ViaCEP](https://viacep.com.br/)
- **Forma de pagamento** — seleção entre Pix, Cartão de Crédito, Cartão de Débito ou Dinheiro (com campo de troco) — apenas informativo, sem processamento de pagamento
- **Checkout via WhatsApp** — gera um número de pedido aleatório e monta uma mensagem formatada, redirecionando o cliente para o WhatsApp do estabelecimento (`wa.me`)
- **Identidade visual própria** — paleta de cores, tipografia e componentes customizados via Tailwind CSS, com animações de rolagem e hover

---

## 🛠️ Stack utilizada

| Camada | Tecnologia |
|---|---|
| Frontend | [Next.js 15](https://nextjs.org/) (App Router) |
| Estilo | [Tailwind CSS v4](https://tailwindcss.com/) |
| Autenticação e Banco de Dados | [Firebase](https://firebase.google.com/) (Authentication + Firestore) |
| Endereço | API pública [ViaCEP](https://viacep.com.br/) |
| Hospedagem | [Vercel](https://vercel.com/) |

---

## 📁 Estrutura de pastas

```
cardapio-digital/
├── src/
│   ├── app/
│   │   ├── layout.js              # Layout raiz (fontes, providers)
│   │   ├── page.js                 # Página inicial (cardápio)
│   │   ├── login/page.js
│   │   ├── cadastro/page.js
│   │   ├── carrinho/page.js
│   │   ├── checkout/page.js
│   │   └── globals.css             # Tema (cores, fontes, animações)
│   ├── components/
│   │   ├── ProdutoCard.jsx
│   │   ├── CarrinhoItem.jsx
│   │   ├── Reveal.jsx               # Animação de entrada ao rolar a página
│   │   └── Logo.jsx                 # Logo genérico (fácil de trocar por cliente)
│   ├── context/
│   │   ├── AuthContext.jsx          # Cadastro, login, logout, reset de senha
│   │   └── CarrinhoContext.jsx      # Estado global do carrinho
│   └── lib/
│       ├── firebase.js              # Inicialização do Firebase
│       ├── viacep.js                # Busca de endereço por CEP
│       └── whatsapp.js              # Geração de mensagem e link do WhatsApp
├── .env.local                       # Variáveis de ambiente (não versionado)
└── package.json
```

---

## 🚀 Como rodar localmente

### 1. Clonar o repositório e instalar dependências

```bash
git clone https://github.com/seu-usuario/cardapio-digital.git
cd cardapio-digital
npm install
```

### 2. Configurar o Firebase

1. Crie um projeto em [console.firebase.google.com](https://console.firebase.google.com)
2. Ative **Authentication → Sign-in method → E-mail/senha**
3. Crie um banco **Firestore Database** (modo produção)
4. Registre um app Web e copie as credenciais (`firebaseConfig`)
5. Crie a coleção `produtos` no Firestore com os campos:
   - `nome` (string)
   - `descricao` (string)
   - `preco` (number/double)
   - `imagemUrl` (string)
   - `categoria` (string)

### 3. Configurar as regras de segurança do Firestore

Em **Firestore Database → Regras**, cole:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /produtos/{produtoId} {
      allow read: if true;
      allow write: if false;
    }

    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /pedidos/{pedidoId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.uid == resource.data.usuarioId;
    }
  }
}
```

### 4. Criar o arquivo `.env.local`

Na raiz do projeto:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_WHATSAPP_NUMBER=5511999999999
```

> `NEXT_PUBLIC_WHATSAPP_NUMBER` deve conter código do país + DDD + número, apenas dígitos.

### 5. Rodar o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## ☁️ Deploy (Vercel)

```bash
npm install -g vercel
vercel login
vercel
```

Depois, cadastre as mesmas variáveis do `.env.local` no ambiente de produção:

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
vercel env add NEXT_PUBLIC_WHATSAPP_NUMBER
```

E finalize com:

```bash
vercel --prod
```

> ⚠️ Importante: em **Firebase Console → Authentication → Settings → Domínios autorizados**, adicione o domínio gerado pela Vercel (ex: `seu-projeto.vercel.app`) para que o login funcione em produção.

---

## 🎨 Personalizando para outro cliente/restaurante

O tema visual é centralizado em poucos arquivos, facilitando a reutilização do projeto para outros estabelecimentos:

- **Cores**: `src/app/globals.css`, bloco `@theme`
- **Fontes**: `src/app/layout.js`
- **Logo**: `src/components/Logo.jsx`
- **Nome do site e número do WhatsApp**: `.env.local` e `src/app/layout.js` (metadata)
- **Produtos**: diretamente pelo painel do Firestore, sem precisar editar código

---

## 📄 Licença

Projeto de uso livre — adapte como quiser para seus próprios cardápios digitais.