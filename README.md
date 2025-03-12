# Sistema de Chamados

Este projeto é um **Sistema de Chamados** desenvolvido com **React** e **Firebase**, permitindo que os usuários criem, editem e gerenciem chamados, além de adicionar clientes (empresas) ao sistema.

## 🚀 Funcionalidades

- **Cadastro e Login de Usuários** utilizando Firebase Authentication.
- **Criação e Edição de Chamados** para gerenciamento de solicitações.
- **Adicionação de Clientes (Empresas)** ao sistema.
- **Upload de Arquivos e Imagens** utilizando Firebase Storage.
- **Notificações** com react-toastify.

## 🛠️ Tecnologias Utilizadas

- **React**
- **React Router DOM**
- **Firebase Authentication**
- **Firestore Database**
- **Firebase Storage**
- **React Toastify**

## 📸 Demonstração

_A imagem ou gif demonstrativo do projeto será adicionada em breve._

## 📌 Como Rodar o Projeto

Para rodar este projeto localmente, siga os passos abaixo:

### 1. Clone o repositório

```bash
git clone https://github.com/Levickl/Sistema_de_chamados.git
```

### 2. Instale as dependências

Dentro da pasta do projeto, execute:

```bash
npm install
```

### 3. Configuração do Firebase

Crie um projeto no [Firebase Console](https://console.firebase.google.com/) e configure:

- **Firebase Authentication** (para login e registro de usuários).
- **Firestore** (para armazenar chamados e clientes).
- **Firebase Storage** (para armazenar imagens e arquivos).

Em seguida, adicione suas credenciais no arquivo `firebaseConfig.js`:

```js

const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID",
    measurementId: "SEU_MEASUREMENT_ID"
};

```

### 4. Rode a aplicação

Para rodar a aplicação localmente, utilize:

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

Este projeto foi desenvolvido como parte do aprendizado em desenvolvimento web com Firebase. ✨

