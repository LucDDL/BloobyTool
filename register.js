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

// Define a função para cadastrar o usuário
const registerUser = () => {
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  // Cria um objeto com os dados do usuário
  const user = {
    name: name,
    email: email,
    password: password,
  };

  // Abre uma transação de escrita no banco de dados
  const transaction = request.result.transaction("users", "readwrite");

  // Adiciona o usuário à tabela de usuários
  const usersStore = transaction.objectStore("users");
  const addUserRequest = usersStore.add(user);

  addUserRequest.onsuccess = () => {
    console.log("Usuário cadastrado com sucesso:", user);
    // Redireciona o usuário para a página de login após o cadastro ser concluído
    window.location.href = "login.html";
  };

  addUserRequest.onerror = (event) => {
    console.error("Erro ao cadastrar usuário:", event.target.errorCode);
  };
};

// Define a função para o botão "Cadastrar"
const registerButton = document.querySelector("#register-btn");
registerButton.addEventListener("click", (event) => {
  event.preventDefault();
  registerUser();
});
