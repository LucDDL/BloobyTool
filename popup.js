let db;
const dbName = 'meu-banco-de-dados';
const storeName = 'artigos';

function initDB() {
  const request = window.indexedDB.open(dbName, 1);

  request.onerror = function(event) {
    console.error('Erro ao abrir o banco de dados:', event);
  };

  request.onsuccess = function(event) {
    db = event.target.result;
    listarArtigos();
  };

  request.onupgradeneeded = function(event) {
    const db = event.target.result;
    const store = db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
    store.createIndex('titulo', 'titulo', { unique: false });
    store.createIndex('autor', 'autor', { unique: false });
    store.createIndex('data', 'data', { unique: false });
  };
}

function cadastrarArtigo(event) {
  event.preventDefault();
  const titulo = document.getElementById('input-titulo').value;
  const autor = document.getElementById('input-autor').value;
  const data = document.getElementById('input-data').value;
  const conteudo = document.getElementById('input-conteudo').value;
  const videoInput = document.getElementById('input-video');
  
  const reader = new FileReader();
  reader.readAsArrayBuffer(videoInput.files[0]);
  reader.onload = function() {
    const videoArrayBuffer = reader.result;
    
    const novoArtigo = {
      titulo: titulo,
      autor: autor,
      data: data,
      conteudo: conteudo,
      videoArrayBuffer: videoArrayBuffer
    };

    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(novoArtigo);

    request.onsuccess = function(event) {
      listarArtigos();
    };

    request.onerror = function(event) {
      console.error('Erro ao adicionar o artigo:', event);
    };

    document.getElementById('form-artigo').reset();
  };
}


function listarArtigos() {
  const transaction = db.transaction([storeName], 'readonly');
  const store = transaction.objectStore(storeName);
  const request = store.getAll();

  request.onsuccess = function(event) {
    const artigos = event.target.result;
    const listaArtigos = document.getElementById('lista-artigos');
    listaArtigos.innerHTML = '';

    artigos.forEach(function(artigo) {
      const itemArtigo = document.createElement('li');
      const videoUrl = URL.createObjectURL(new Blob([artigo.videoArrayBuffer]));
      itemArtigo.innerHTML = `
        <h3>${artigo.titulo}</h3>
        <p>${artigo.autor}</p>
        <p>${artigo.data}</p>
        <p>${artigo.conteudo}</p>
        <video src="${videoUrl}" controls></video>
        <button class="excluir-artigo" data-id="${artigo.id}">Excluir</button>
      `;
      listaArtigos.appendChild(itemArtigo);
    });

    // Adicionar ouvinte de evento de clique para excluir artigo
    listaArtigos.addEventListener('click', function(event) {
      if (event.target.classList.contains('excluir-artigo')) {
        const id = Number(event.target.getAttribute('data-id'));
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = function(event) {
          listarArtigos();
        };

        request.onerror = function(event) {
          console.error('Erro ao excluir o artigo:', event);
        };
      }
    });
  };
}



document.addEventListener('DOMContentLoaded', function(event) {
  const formArtigo = document.getElementById('form-artigo');
  formArtigo.addEventListener('submit', cadastrarArtigo);

  initDB();
});
