// Roteador por hash (#/hoje, #/capa...), porque o GitHub Pages não tem fallback de rotas.
// Cada tela exporta mount(root, ctx) e pode devolver uma função de limpeza.
const ROTAS = { '': 'livro', hoje: 'hoje', capa: 'capa', folhear: 'folhear', estante: 'estante', dump: 'dump', amigo: 'amigo' };
const COM_3D = new Set(['livro', 'capa']);
const view = document.getElementById('view');
const ctx = { state: {} };
let limpar = null, atual = null, token = 0;

async function ir() {
  const [seg, param] = location.hash.replace(/^#\/?/, '').split('/'); // ex.: #/amigo/f1
  const nome = ROTAS[seg] || 'livro';
  ctx.param = param ? decodeURIComponent(param) : '';
  const meu = ++token;
  if (limpar) { try { limpar(); } catch (e) { console.error(e); } limpar = null; }
  if (atual) atual.remove();
  atual = document.createElement('div');
  atual.className = 'screen';
  view.append(atual);
  document.body.dataset.screen = nome;
  document.querySelectorAll('#nav a').forEach((a) => a.classList.toggle('on', a.dataset.n === (nome === 'amigo' ? 'estante' : nome)));

  if (COM_3D.has(nome) && !window.THREE) {
    atual.innerHTML = '<p class="erro">Não consegui carregar o Three.js. Coloque o arquivo em <b>js/vendor/three.min.js</b> (r128) ou conecte-se à internet.</p>';
    return;
  }
  try {
    const mod = await import(`./screens/${nome}.js`);
    if (meu !== token) return;
    const fim = await mod.mount(atual, ctx);
    if (meu !== token) { if (fim) fim(); return; }
    limpar = fim || null;
  } catch (e) {
    console.error(e);
    if (meu === token) atual.innerHTML = '<p class="erro">Algo deu errado ao abrir esta tela.</p>';
  }
}

addEventListener('hashchange', ir);
ir();
