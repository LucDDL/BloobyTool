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
  
  if (videoInput.files.length === 0) {
    console.error('Nenhum vídeo selecionado');
    return;
  }
  
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
        <h6>${artigo.titulo}</h6>
        <p>${artigo.autor}, ${artigo.data} </p>
      <section>
            <div class="artigo-container">
              <p>${artigo.conteudo}</p>
              <button class="copiar-texto">
                <i class="fas fa-copy"></i>
                Copiar
              </button>
                    <div class="video-container">
                      <video id="video-${artigo.id}" src="${videoUrl}" style="width: 100%; height: auto; border: none;"></video>
                    </div>
                    <div class="video-controls">
                    <button id="play-${artigo.id}" class="video-control play">
                      <i class="fas fa-play"></i>
                    </button>
                    <button id="pause-${artigo.id}" class="video-control pause" style="display: none;">
                      <i class="fas fa-pause"></i>
                    </button>
                    <button id="stop-${artigo.id}" class="video-control stop">
                      <i class="fas fa-stop"></i>
                    </button>
                    <i class="fas fa-trash-alt excluir-artigo" data-id="${artigo.id}"></i>
            </div>
      </section>
      `;
      listaArtigos.appendChild(itemArtigo);

      // Adicionar ouvinte de evento de clique para copiar texto
        const btnCopiarTexto = itemArtigo.querySelector('.copiar-texto');
        btnCopiarTexto.addEventListener('click', function() {
          const textoArtigo = artigo.conteudo;
          navigator.clipboard.writeText(textoArtigo);
        });

    
      const playButton = document.getElementById(`play-${artigo.id}`);
      const pauseButton = document.getElementById(`pause-${artigo.id}`);
      const stopButton = document.getElementById(`stop-${artigo.id}`);
      const video = document.getElementById(`video-${artigo.id}`);
    
      playButton.addEventListener('click', function() {
        video.play();
        playButton.style.display = 'none';
        pauseButton.style.display = 'block';
      });
    
      pauseButton.addEventListener('click', function() {
        video.pause();
        playButton.style.display = 'block';
        pauseButton.style.display = 'none';
      });
    
      stopButton.addEventListener('click', function() {
        video.pause();
        video.currentTime = 0;
        playButton.style.display = 'block';
        pauseButton.style.display = 'none';
      });
    });
    
      // Adicionar ouvinte de evento de clique para os controles de vídeo
listaArtigos.addEventListener('click', function(event) {
  if (event.target.classList.contains('video-control')) {
    const id = event.target.id.split('-')[1];
    const video = document.getElementById(`video-${id}`);
    const playButton = document.getElementById(`play-${id}`);
    const pauseButton = document.getElementById(`pause-${id}`);
    if (event.target.classList.contains('play')) {
      video.play();
      playButton.style.display = 'none';
      pauseButton.style.display = 'block';
    } else if (event.target.classList.contains('pause')) {
      video.pause();
      playButton.style.display = 'block';
      pauseButton.style.display = 'none';
    } else if (event.target.classList.contains('stop')) {
      video.pause();
      video.currentTime = 0;
      playButton.style.display = 'block';
      pauseButton.style.display = 'none';
    }
  }
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

const btnUpload = document.querySelector('.btn-upload');
const inputVideo = document.getElementById('input-video');
btnUpload.addEventListener('click', function() {
inputVideo.click();
});

initDB();
});
