// Carimbo do mês = o dump do mês. Mostra só emoji + nome do sentimento que venceu (nunca dias nem palavras).
// Regra: só meses FECHADOS com pelo menos MIN_DIAS_CARIMBO dias registrados ganham carimbo.
// Serve para o seu livro (Folhear) e, depois, para o livro aberto de outra pessoa.
import { calcMes, MIN_DIAS_CARIMBO, nomeMes } from './dump.js';

// entradas: [{data, categoria}] do mês. Devolve null se o mês não ganha carimbo.
export function dadosCarimbo(entradas, cat, mes, hoje) {
  const r = calcMes(entradas, cat, mes, hoje);
  if (!r.fechado || r.vazio || r.registrados < MIN_DIAS_CARIMBO) return null;
  const v = r.vencedor;
  return { mes, emoji: v.emoji, nome: v.nome, cor: v.cor };
}

// opcoes.mini: versão pequena, para as casinhas do livro aberto de outra pessoa.
export function criaCarimbo(d, opcoes = {}) {
  const m = Number(d.mes.slice(5, 7));
  const grau = ((m * 37) % 9) - 4; // inclinação leve, diferente em cada mês (-4 a +4 graus)
  const e = document.createElement('div');
  e.className = 'stamp' + (opcoes.mini ? ' mini' : '');
  e.style.setProperty('--cor', d.cor);
  e.style.setProperty('--grau', grau + 'deg');
  e.setAttribute('role', 'img');
  e.setAttribute('aria-label', `Carimbo de ${nomeMes(d.mes)}: ${d.nome}`);
  e.innerHTML = '<span class="s-emoji"></span><b class="s-nome"></b><small class="s-mes"></small>';
  e.querySelector('.s-emoji').textContent = d.emoji;
  e.querySelector('.s-nome').textContent = d.nome;
  e.querySelector('.s-mes').textContent = nomeMes(d.mes);
  return e;
}
