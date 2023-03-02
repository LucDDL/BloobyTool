let artigos = [];

function cadastrarArtigo(event) {
  event.preventDefault();
  const titulo = document.getElementById('input-titulo').value;
  const autor = document.getElementById('input-autor').value;
  const data = document.getElementById('input-data').value;
  const conteudo = document.getElementById('input-conteudo').value;
  const videoInput = document.getElementById('input-video');
  const videoUrl = URL.createObjectURL(videoInput.files[0]); // obter a URL do arquivo selecionado
  const novoArtigo = {
    titulo: titulo,
    autor: autor,
    data: data,
    conteudo: conteudo,
    videoUrl: videoUrl
  };
  artigos.push(novoArtigo);
  localStorage.setItem('artigos', JSON.stringify(artigos)); // salvar os artigos no localStorage
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
  localStorage.setItem('artigos', JSON.stringify(artigos)); // atualizar os artigos no localStorage
  listarArtigos();
}

function listarArtigos() {
  const lista = document.getElementById('lista-artigos');
  lista.innerHTML = '';
  artigos.forEach((artigo, index) => { // adicionar o índice como parâmetro da função forEach
    const item = document.createElement('li');
    const link = document.createElement('a');
    const excluirBtn = document.createElement('button'); // criar o botão de excluir artigo
    excluirBtn.innerHTML = 'Excluir';
    excluirBtn.addEventListener('click', () => {
      excluirArtigo(index);
    });
    link.setAttribute('href', '#');
    link.innerHTML = artigo.titulo;
    link.addEventListener('click', () => {
      exibirArtigo(artigo);
    });
    item.appendChild(link);
    item.appendChild(excluirBtn); // adicionar o botão de excluir artigo no item da lista
    lista.appendChild(item);
  });
}

recuperarArtigos();

document.getElementById('form-artigo').addEventListener('submit', cadastrarArtigo);
document.getElementById('btn-buscar').addEventListener('click', () => {
  const termo = document.getElementById('input-consulta').value;
  buscarArtigos(termo);
});

function exibirArtigo(artigo) {
  let conteudo = `
    <h3>${artigo.titulo}</h3>
    <p>Autor: ${artigo.autor}</p>
    <p>Data: ${artigo.data}</p>
    <p>${artigo.conteudo}</p>
  `;
  if (artigo.videoUrl) {
    conteudo += `
      <video id="videoArtigo" width="390" height="240" controls>
        <source src="${artigo.videoUrl}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      `;
  }
  conteudo += `
    
  `;
  document.getElementById('lista-artigos').innerHTML = conteudo;

  if (artigo.videoUrl) {
    const playBtn = document.getElementById('playBtn');
    playBtn.addEventListener('click', () => {
      const video = document.getElementById('videoArtigo');
      video.play();
    });
  }

  const btnExcluir = document.getElementById('btn-excluir-artigo');
btnExcluir.addEventListener('click', () => {
excluirArtigo(artigo);
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
      exibirArtigo(artigo);
    });
    item.appendChild(link);
    item.appendChild(excluirBtn);
    lista.appendChild(item);
  });
}

