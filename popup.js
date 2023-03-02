let artigos = [];

function cadastrarArtigo(event) {
  event.preventDefault();
  const titulo = document.getElementById('input-titulo').value;
  const autor = document.getElementById('input-autor').value;
  const data = document.getElementById('input-data').value;
  const conteudo = document.getElementById('input-conteudo').value;
  const videoInput = document.getElementById('input-video');
  const novoArtigo = {
    titulo: titulo,
    autor: autor,
    data: data,
    conteudo: conteudo,
    video: videoInput.files[0]
  };
  artigos.push(novoArtigo);
  localStorage.setItem('artigos', JSON.stringify(artigos));
  document.getElementById('form-artigo').reset();
  listarArtigos();
}

function recuperarArtigos() {
  const artigosSalvos = localStorage.getItem('artigos');
  if (artigosSalvos) {
    artigos = JSON.parse(artigosSalvos);
    listarArtigos();
  }
}

function excluirArtigo(index) {
  artigos.splice(index, 1);
  localStorage.setItem('artigos', JSON.stringify(artigos));
  listarArtigos();
}

function listarArtigos() {
  const lista = document.getElementById('lista-artigos');
  lista.innerHTML = '';
  artigos.forEach((artigo, index) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const excluirBtn = document.createElement('button');
    excluirBtn.innerHTML = 'Excluir';
    excluirBtn.addEventListener('click', () => {
      excluirArtigo(index);
    });
    link.setAttribute('href', '#');
    link.innerHTML = artigo.titulo;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      exibirArtigo(index);
    });
    item.appendChild(link);
    item.appendChild(excluirBtn);
    lista.appendChild(item);
  });
}

recuperarArtigos();

document.getElementById('form-artigo').addEventListener('submit', cadastrarArtigo);

document.getElementById('btn-buscar').addEventListener('click', () => {
  const termo = document.getElementById('input-consulta').value;
  buscarArtigos(termo);
});

function exibirArtigo(index) {
  const artigo = artigos[index];
  let conteudo = `
    <h3>${artigo.titulo}</h3>
    <p>Autor: ${artigo.autor}</p>
    <p>Data: ${artigo.data}</p>
    <p>${artigo.conteudo}</p>
  `;
  if (artigo.video) {
    const videoUrl = URL.createObjectURL(artigo.video);
    conteudo += `
      <video id="videoArtigo" width="390" height="240" controls>
        <source src="${videoUrl}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <button id="playBtn">Play</button>
    `;
  }
  document.getElementById('conteudo-artigo').innerHTML = conteudo;

  if (artigo.video) {
    const playBtn = document.getElementById('playBtn');
    const video = document.getElementById('videoArtigo');
    playBtn.addEventListener('click', () => {
      video.play();
    });
  }

  const btnExcluir = document.getElementById('btn-excluir-artigo');
  btnExcluir.addEventListener('click', () => {
    excluirArtigo(index);
    document.getElementById('conteudo-artigo').innerHTML = '';
  });
}

function buscarArtigos(termo) {
    const lista = document.getElementById('lista-artigos');
    lista.innerHTML = '';
  
    const artigosEncontrados = artigos.filter((artigo) => {
      return artigo.titulo.toLowerCase().includes(termo.toLowerCase());
    });
  
    artigosEncontrados.forEach((artigo, index) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      const excluirBtn = document.createElement('button');
  
      excluirBtn.innerHTML = 'Excluir';
  
      excluirBtn.addEventListener('click', () => {
        excluirArtigo(index);
      });
  
      link.setAttribute('href', '#');
      link.innerHTML = artigo.titulo;
  
      link.addEventListener('click', () => {
        const conteudo = exibirArtigo(artigo);
  
        const artigoDiv = document.createElement('div');
        artigoDiv.innerHTML = conteudo;
        artigoDiv.setAttribute('id', 'artigo');
  
        lista.innerHTML = '';
        lista.appendChild(artigoDiv);
  
        if (artigo.video) {
          const playBtn = document.createElement('button');
          playBtn.innerHTML = 'Play';
          playBtn.setAttribute('id', 'playBtn');
  
          artigoDiv.appendChild(playBtn);
  
          playBtn.addEventListener('click', () => {
            const video = document.getElementById('videoArtigo');
            video.play();
          });
        }
  
        const btnExcluir = document.createElement('button');
        btnExcluir.innerHTML = 'Excluir';
        btnExcluir.setAttribute('id', 'btn-excluir-artigo');
  
        artigoDiv.appendChild(btnExcluir);
  
        btnExcluir.addEventListener('click', () => {
          excluirArtigo(artigos.indexOf(artigo));
        });
      });
  
      item.appendChild(link);
      item.appendChild(excluirBtn);
      lista.appendChild(item);
    });
  }
  
  function exibirArtigo(artigo) {
    let conteudo = `<h3>${artigo.titulo}</h3>
                    <p>Autor: ${artigo.autor}</p>
                    <p>Data: ${artigo.data}</p>
                    <p>${artigo.conteudo}</p>`;
  
    if (artigo.video) {
      const videoUrl = URL.createObjectURL(artigo.video);
      conteudo += `<video id="videoArtigo" width="390" height="240" controls>
                      <source src="${videoUrl}" type="video/mp4">
                      Your browser does not support the video tag.
                   </video>`;
    }
  
    return conteudo;
  }
  
  recuperarArtigos();
  
  document.getElementById('form-artigo').addEventListener('submit', cadastrarArtigo);
  
  document.getElementById('btn-buscar').addEventListener('click', () => {
    const termo = document.getElementById('input-consulta').value;
    buscarArtigos(termo);
  });
  