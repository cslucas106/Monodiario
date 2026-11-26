// Cenários ("casas") compartilhados pela estante e pela página inicial: parede, madeira e luz.
// Para criar outro cenário, copie um bloco de CENARIOS. Os campos de 'casa' valem só para a página inicial.
const T = window.THREE;

// Para criar outro cenário, basta copiar um bloco abaixo (e, se quiser, um desenho novo de parede em parede()).
export const CENARIOS = [
  { id: 'classico', nome: 'Biblioteca', fundo: '#1c120b', madeira: '#5a3a22', rotulo: '#f1e7d6', tint: 0xffffff,
    hemi: [0xffe9c8, 0x2a1a0e, 0.55], dir: [0xffd9a0, 1.0], lampada: null,
    casa: { lamp: [0xffb868, 1.3, [-2.6, 0.9, -1.4]] } },
  { id: 'sala', nome: 'Sala clara', fundo: '#e9dcc6', madeira: '#b08457', rotulo: '#3a2a1a', tint: 0xffffff,
    hemi: [0xffffff, 0xd8c8b0, 0.62], dir: [0xfff4e0, 0.6], lampada: null,
    casa: { hemi: [0xffffff, 0.7], key: [0xfff4e0, 0.8] } },
  { id: 'noite', nome: 'Noite', fundo: '#0c1128', madeira: '#4a3426', rotulo: '#f1e7d6', tint: 0xd5dcff,
    hemi: [0x9fb0ff, 0x10142a, 0.5], dir: [0x8aa0ff, 0.45], lampada: [0xffb868, 2.4],
    casa: { sombra: 0.6, grama: ['#2b6b35', '#41914d', '#194a24'], hemi: [0x9fb0ff, 0.7], key: [0x8aa0ff, 0.8], lamp: [0xffb868, 2.2, [2.4, 1.0, -1.2]] } },
  { id: 'dia', nome: 'Dia', fundo: '#bfe3f7', madeira: '#b08457', rotulo: '#3a2a1a', tint: 0xffffff,
    hemi: [0xffffff, 0xcfe3b0, 0.65], dir: [0xfff6dc, 0.8], lampada: null,
    casa: { ceu: true, sombra: 0.4, grama: ['#5aa03a', '#86cc57', '#3d7a29'], hemi: [0xffffff, 0.9], key: [0xfff4d6, 1.0] } },
];

function nuvem(x, cx, cy, r, a = 1) { // nuvem fofa: vários círculos brancos macios
  const bolhas = [[0, 0, 1], [-.9, .25, .7], [.9, .2, .75], [-.4, -.35, .75], [.45, -.3, .65], [1.5, .35, .5], [-1.5, .35, .5]];
  bolhas.forEach(([dx, dy, k]) => {
    const px = cx + dx * r, py = cy + dy * r, rr = r * k * 1.1, g = x.createRadialGradient(px, py, 0, px, py, rr);
    g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(0.55, `rgba(255,255,255,${a * 0.85})`); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.beginPath(); x.arc(px, py, rr, 0, 6.3); x.fill();
  });
}

export function parede(id) { // textura que se repete na parede atrás da estante
  const S = 256, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const x = cv.getContext('2d');
  if (id === 'sala') {
    x.fillStyle = '#efe4d0'; x.fillRect(0, 0, S, S);
    x.fillStyle = 'rgba(190,160,120,.18)';
    for (let i = 0; i < S; i += 32) x.fillRect(i, 0, 14, S);
  } else if (id === 'noite') {
    const g = x.createLinearGradient(0, 0, 0, S); g.addColorStop(0, '#0e1530'); g.addColorStop(1, '#1b2552');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 26; i++) {
      x.fillStyle = `rgba(255,248,220,${0.25 + Math.random() * 0.6})`;
      x.beginPath(); x.arc(Math.random() * S, Math.random() * S, Math.random() * 1.3 + 0.4, 0, 6.3); x.fill();
    }
  } else if (id === 'dia') {
    const g = x.createLinearGradient(0, 0, 0, S); g.addColorStop(0, '#79c0ee'); g.addColorStop(1, '#d8f0ff');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    nuvem(x, 70, 70, 34, 0.9); nuvem(x, 190, 170, 44, 0.9); nuvem(x, 80, 215, 26, 0.8);
  } else {
    x.fillStyle = '#2b1a0f'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 90; i++) {
      x.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,.22)' : 'rgba(255,200,140,.06)';
      x.fillRect(Math.random() * S, 0, Math.random() * 2 + 0.5, S);
    }
    x.fillStyle = 'rgba(0,0,0,.45)';
    for (let i = 0; i < S; i += 64) x.fillRect(i, 0, 2, S);
  }
  const t = new T.CanvasTexture(cv); t.wrapS = t.wrapT = T.MirroredRepeatWrapping; return t;
}


export function madeira(hex, vert) { // veios de madeira
  const W = 512, H = 128, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const x = cv.getContext('2d');
  x.fillStyle = hex; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 70; i++) {
    const a = Math.random() * 0.16;
    x.fillStyle = Math.random() < 0.5 ? `rgba(0,0,0,${a})` : `rgba(255,235,200,${a * 0.7})`;
    x.fillRect(0, Math.random() * H, W, Math.random() * 2.2 + 0.4);
  }
  x.strokeStyle = 'rgba(0,0,0,.10)'; x.lineWidth = 1;
  for (let i = 0; i < 10; i++) {
    const y0 = Math.random() * H; x.beginPath(); x.moveTo(0, y0);
    for (let u = 0; u <= W; u += 32) x.lineTo(u, y0 + Math.sin(u / 60 + i) * 2.5);
    x.stroke();
  }
  const t = new T.CanvasTexture(cv);
  if (vert) { t.center.set(0.5, 0.5); t.rotation = Math.PI / 2; }
  return t;
}


// Cena da página inicial: parede ao fundo e chão/mesa abaixo do livro.
export const MESA_Y = -1.95; // altura do chão/mesa (o livro termina em -1.2; quanto menor, mais longe ele fica do chão)
export function montaCasa(sc, aniso = 1) {
  const c = sc.casa || {}, g = new T.Group();
  let wall;
  if (c.ceu) { // céu inteiro, sem luz própria (sempre claro)
    wall = new T.Mesh(new T.PlaneGeometry(20, 16), new T.MeshBasicMaterial({ map: ceu() }));
    wall.position.set(0, MESA_Y + 8, -3.2);
  } else {
    const tw = parede(sc.id); tw.encoding = T.sRGBEncoding; tw.repeat.set(10, 8); tw.anisotropy = aniso;
    wall = new T.Mesh(new T.PlaneGeometry(40, 32), new T.MeshLambertMaterial({ map: tw }));
    wall.position.set(0, MESA_Y + 16, -3.2);
  }
  wall.receiveShadow = true; g.add(wall);
  const tm = c.grama ? grama(c.grama) : madeira(sc.madeira, false); tm.encoding = T.sRGBEncoding;
  if (c.grama) tm.repeat.set(10, 7); else { tm.wrapS = tm.wrapT = T.RepeatWrapping; tm.repeat.set(4, 6); }
  tm.anisotropy = aniso;
  const mat = new T.MeshStandardMaterial({ map: tm, roughness: c.grama ? 0.95 : 0.62, envMapIntensity: c.grama ? 0.1 : 0.25, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const mesa = new T.Mesh(new T.PlaneGeometry(40, 26), mat);
  mesa.rotation.x = -Math.PI / 2; mesa.position.set(0, MESA_Y, -3.2 + 13); g.add(mesa);
  // camada que só mostra a sombra do livro (assim dá para controlar o quão escura ela fica, em qualquer cenário)
  const sp = new T.Mesh(new T.PlaneGeometry(40, 26), new T.ShadowMaterial({ opacity: c.sombra || 0.5 }));
  sp.rotation.x = -Math.PI / 2; sp.position.set(0, MESA_Y + 0.004, -3.2 + 13); sp.receiveShadow = true; g.add(sp);
  if (c.lamp) { const p = new T.PointLight(c.lamp[0], c.lamp[1], 11); p.position.set(...c.lamp[2]); g.add(p); }
  return {
    group: g, luz: c,
    dispose() { g.traverse((n) => { if (n.geometry) n.geometry.dispose(); if (n.material) { if (n.material.map) n.material.map.dispose(); n.material.dispose(); } }); },
  };
}

// Céu do cenário "dia" (um quadro só, sem repetir): só a faixa de baixo aparece atrás do livro, então as nuvens ficam ali.
function ceu() {
  const W = 1280, H = 1024, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const x = cv.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2f8fdc'); g.addColorStop(0.55, '#74bdf0'); g.addColorStop(1, '#d9f1ff');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  [[360, 800, 62, 0.95], [560, 905, 38, 0.8], [760, 760, 70, 0.95], [920, 880, 48, 0.9], [500, 700, 44, 0.75], [1010, 740, 36, 0.7], [270, 900, 34, 0.75]]
    .forEach(([cx, cy, r, a]) => nuvem(x, cx, cy, r, a));
  [['#a9d98f', 0.012, 40, 0], ['#86c46d', 0.02, 24, 2]].forEach(([cor, f, alt, fase]) => { // colinas no horizonte
    x.fillStyle = cor; x.beginPath(); x.moveTo(0, H);
    for (let u = 0; u <= W; u += 8) x.lineTo(u, H - 22 - alt * (0.5 + 0.5 * Math.sin(u * f + fase)));
    x.lineTo(W, H); x.fill();
  });
  const t = new T.CanvasTexture(cv); t.encoding = T.sRGBEncoding; return t;
}

function grama([base, claro, escuro]) { // chão de grama (azulejo que se espelha, sem emenda)
  const S = 512, cv = document.createElement('canvas'); cv.width = cv.height = S;
  const x = cv.getContext('2d');
  x.fillStyle = base; x.fillRect(0, 0, S, S);
  for (let i = 0; i < 30; i++) { // manchas grandes, para o gramado não parecer uniforme
    const px = Math.random() * S, py = Math.random() * S, r = 40 + Math.random() * 80, g = x.createRadialGradient(px, py, 0, px, py, r);
    g.addColorStop(0, Math.random() < 0.5 ? claro : escuro); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.globalAlpha = 0.22; x.fillStyle = g; x.fillRect(px - r, py - r, r * 2, r * 2);
  }
  x.globalAlpha = 1; x.lineWidth = 1.3; x.lineCap = 'round';
  for (let i = 0; i < 7000; i++) { // folhinhas
    const px = Math.random() * S, py = Math.random() * S, k = Math.random();
    x.strokeStyle = k < 0.4 ? claro : k < 0.75 ? escuro : base; x.globalAlpha = 0.5 + Math.random() * 0.4;
    x.beginPath(); x.moveTo(px, py); x.lineTo(px + (Math.random() - 0.5) * 4, py - (5 + Math.random() * 9)); x.stroke();
  }
  const t = new T.CanvasTexture(cv); t.encoding = T.sRGBEncoding; t.wrapS = t.wrapT = T.MirroredRepeatWrapping; return t;
}
