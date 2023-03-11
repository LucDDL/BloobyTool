// Define a função para autenticar o usuário
const authenticate = () => {
  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;

  // Abre o banco de dados do IndexedDB
  const request = indexedDB.open("miniblog", 1);

  // Define a função para criar o banco de dados e a tabela de usuários
  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    const usersStore = db.createObjectStore("users", { keyPath: "email" });
    usersStore.createIndex("name", "name", { unique: false });
  };

  // Define a função para tratar erros na abertura do banco de dados
  request.onerror = (event) => {
    console.error("Erro ao abrir o banco de dados:", event.target.errorCode);
  };

  // Define a função para buscar o usuário no banco de dados e autenticá-lo
  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction("users", "readonly");
    const usersStore = transaction.objectStore("users");
    const getUserRequest = usersStore.get(email);

    getUserRequest.onsuccess = () => {
      const user = getUserRequest.result;
      if (user && user.password === password) {
        localStorage.setItem("isLoggedIn", true);
        window.location.href = "popup.html";
      } else {
        alert("Usuário ou senha inválidos!");
      }
    };

    getUserRequest.onerror = (event) => {
      console.error("Erro ao buscar usuário:", event.target.errorCode);
    };
  };
};

// Define a função para o botão "Login"
const loginButton = document.getElementById("login-btn");
loginButton.addEventListener("click", (event) => {
  event.preventDefault();
  authenticate();
});

// Define a função para o botão "Cadastrar"
const registerButton = document.getElementById("register-btn");
registerButton.addEventListener("click", (event) => {
  event.preventDefault();
  // Redireciona o usuário para a página de cadastro
  window.location.href = "register.html";
});
