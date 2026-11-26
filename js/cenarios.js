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
    casa: { sombra: 0.6, hemi: [0x9fb0ff, 0.7], key: [0x8aa0ff, 0.8], lamp: [0xffb868, 2.2, [2.4, 1.0, -1.2]] } },
];

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


// Cena da página inicial: parede ao fundo e mesa de madeira onde o livro apoia (a sombra do livro fica em y = -1.2).
export const MESA_Y = -1.204;
export function montaCasa(sc, aniso = 1) {
  const c = sc.casa || {}, g = new T.Group();
  const tw = parede(sc.id); tw.encoding = T.sRGBEncoding; tw.repeat.set(10, 8); tw.anisotropy = aniso;
  const wall = new T.Mesh(new T.PlaneGeometry(40, 32), new T.MeshLambertMaterial({ map: tw }));
  wall.position.set(0, MESA_Y + 16, -3.2); wall.receiveShadow = true; g.add(wall);
  const tm = madeira(sc.madeira, false); tm.encoding = T.sRGBEncoding;
  tm.wrapS = tm.wrapT = T.RepeatWrapping; tm.repeat.set(4, 6); tm.anisotropy = aniso;
  const mat = new T.MeshStandardMaterial({ map: tm, roughness: 0.62, envMapIntensity: 0.25, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
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
