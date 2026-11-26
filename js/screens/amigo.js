// Livro aberto de outra pessoa: duas páginas (jan-jun e jul-dez), um quadrado por mês.
// Só aparece o carimbo (emoji + sentimento) dos meses fechados com 5+ dias. Nunca dias nem palavras.
import * as api from '../api.js';
import { today } from '../clock.js';
import { MESES } from '../dump.js';
import { criaCarimbo } from '../carimbo.js';

const h = (tag, props = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') e.className = v;
    else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v);
  }
  e.append(...kids.flat().filter((x) => x != null && x !== false));
  return e;
};
const voltar = () => h('a', { class: 'voltar', href: '#/estante', 'aria-label': 'Voltar para a estante' }, '‹');

export async function mount(root, ctx) {
  const body = h('div', { class: 'abody' });
  let livro;
  try {
    livro = await api.getFriendBook(ctx.param, Number(today().slice(0, 4)));
  } catch (e) {
    const msg = e.code === 'denied' ? 'Você ainda não tem permissão para ver este livro.' : 'Não encontrei este livro.';
    root.append(h('header', { class: 'top' }, voltar(), h('div', {}, h('h1', {}, 'Livro aberto'))), body);
    body.append(h('p', { class: 'erro' }, msg));
    return;
  }
  root.append(
    h('header', { class: 'top' }, voltar(), h('div', {}, h('h1', {}, `Livro de ${livro.nome}`), h('small', {}, `${livro.ano} · só os meses carimbados aparecem`))),
    body);

  const casa = (d, i) => h('div', { class: 'mes', 'aria-label': `${MESES[i]}: ${d ? 'carimbo ' + d.nome : 'em branco'}` },
    h('small', {}, MESES[i].slice(0, 3).toUpperCase()), d ? criaCarimbo(d, { mini: true }) : null);
  const pagina = (lado, ini) => h('section', { class: 'apag ' + lado }, livro.meses.slice(ini, ini + 6).map((d, j) => casa(d, ini + j)));

  body.append(
    h('div', { class: 'aberto' }, pagina('esq', 0), h('div', { class: 'lombada' }), pagina('dir', 6)),
    h('p', { class: 'enota' }, 'Cada carimbo é o sentimento que mais marcou o mês. Meses em andamento ou com poucos registros ficam em branco.'));
}
