const maoJ1 = document.getElementById("mao-j1");
const maoJ2 = document.getElementById("mao-j2");
const tabuleiro = document.getElementById("tabuleiro");
const mensagem = document.getElementById("mensagem");

let pecas = [];
let jogador1 = [];
let jogador2 = [];
let mesa = [];
let turno = 1; // 1 ou 2

function criarTodasPecas() {
  const todas = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      todas.push([i, j]);
    }
  }
  return embaralhar(todas);
}

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

function distribuirPecas() {
  pecas = criarTodasPecas();
  jogador1 = pecas.splice(0, 7);
  jogador2 = pecas.splice(0, 7);
  mesa = [];
  turno = 1;
  atualizarInterface();
  mensagem.textContent = "🎯 Vez do Jogador 1";
}

function atualizarInterface() {
  tabuleiro.innerHTML = "";
  maoJ1.innerHTML = "";
  maoJ2.innerHTML = "";

  mesa.forEach(p => {
    const el = criarElementoPeca(p);
    tabuleiro.appendChild(el);
  });

  jogador1.forEach((p, i) => {
    const el = criarElementoPeca(p);
    if (turno === 1) {
      el.onclick = () => tentarJogar(i, 1);
    } else {
      el.classList.add("inativa");
    }
    maoJ1.appendChild(el);
  });

  jogador2.forEach((p, i) => {
    const el = criarElementoPeca(p);
    if (turno === 2) {
      el.onclick = () => tentarJogar(i, 2);
    } else {
      el.classList.add("inativa");
    }
    maoJ2.appendChild(el);
  });
}

function criarElementoPeca([a, b]) {
  const div = document.createElement("div");
  div.classList.add("peca");
  div.textContent = `[${a}|${b}]`;
  return div;
}

function inverter([a, b]) {
  return [b, a];
}

function tentarJogar(index, jogadorAtual) {
  const mao = jogadorAtual === 1 ? jogador1 : jogador2;
  const peca = mao[index];

  if (mesa.length === 0) {
    mesa.push(peca);
    mao.splice(index, 1);
    proximoTurno();
    return;
  }

  const esquerda = mesa[0][0];
  const direita = mesa[mesa.length - 1][1];

  let jogou = false;

  if (peca[1] === esquerda) {
    mesa.unshift(peca);
    jogou = true;
  } else if (peca[0] === esquerda) {
    mesa.unshift(inverter(peca));
    jogou = true;
  } else if (peca[0] === direita) {
    mesa.push(peca);
    jogou = true;
  } else if (peca[1] === direita) {
    mesa.push(inverter(peca));
    jogou = true;
  }

  if (!jogou) {
    mensagem.textContent = "⛔ Peça inválida. Tente outra.";
    return;
  }

  mao.splice(index, 1);
  if (mao.length === 0) {
    mensagem.textContent = `🏆 Jogador ${jogadorAtual} venceu!`;
    bloquearJogo();
    return;
  }

  proximoTurno();
}

function proximoTurno() {
  turno = turno === 1 ? 2 : 1;
  atualizarInterface();
  mensagem.textContent = `🎯 Vez do Jogador ${turno}`;
}

function bloquearJogo() {
  maoJ1.querySelectorAll('.peca').forEach(p => p.onclick = null);
  maoJ2.querySelectorAll('.peca').forEach(p => p.onclick = null);
}

distribuirPecas();
