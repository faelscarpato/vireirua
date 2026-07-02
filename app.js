/*
  Ruas com História - Pedreira/SP v2
  Dados: pedreira.geojson do OSM/IBGE
  Lógica: Cruza nome da rua do geojson com a base de histórias RUAS
*/

/* 
  Base de histórias carregada de ruas_pedreira_final.js
  IMPORTANTE: certifique-se de que ruas_pedreira_final.js está carregado ANTES deste script no HTML
  <script src="ruas_pedreira_final.js"></script>
  <script src="app.js"></script>
*/
// RUAS e TODAS_AS_RUAS são definidas em ruas_pedreira_final.js

/* Mapa */
const map = L.map('map').setView([-22.7410, -46.8995], 14);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap'
}).addTo(map);

const sidebar = document.getElementById('sidebar');
const sidebarContent = document.getElementById('sidebarContent');
const closeBtn = document.getElementById('closeBtn');
const toggleBtn = document.getElementById('toggleBtn');

/* Renderiza card na sidebar */
function renderCard(nomeRua) {
  const rua = RUAS[nomeRua];
  if (!rua) {
    sidebarContent.innerHTML = `
      <div class="card">
        <h2>${nomeRua}</h2>
        <p>História ainda não cadastrada. Quer ajudar? Clique em "Denunciar".</p>
        <button class="btn btn-ghost" onclick="alert('Obrigado! Vamos pesquisar.')">Sugerir história</button>
      </div>
    `;
  } else {
    sidebarContent.innerHTML = `
      <div class="card">
        <span class="badge">${rua.lei}</span>
        <h2>${nomeRua}</h2>
        <p><strong>Quem foi:</strong> ${rua.homenageado}</p>
        <p>${rua.resumo}</p>
        <p class="source">Fonte: <a href="${rua.link}" target="_blank" rel="noopener">${rua.fonte}</a></p>
        <button class="btn btn-ghost" onclick="alert('Obrigado! Vamos revisar.')">Essa info está errada?</button>
      </div>
    `;
  }
  sidebar.classList.remove('hidden');
  sidebar.setAttribute('aria-hidden', 'false');
  closeBtn.style.display = 'block';
}

/* Carrega o GeoJSON com todas as ruas */
fetch('pedreira.geojson')
 .then(res => {
    if (!res.ok) throw new Error('Arquivo pedreira.geojson não encontrado');
    return res.json();
  })
 .then(data => {
    L.geoJSON(data, {
      style: (feature) => {
        const nome = feature.properties.name;
        const temHistoria =!!RUAS[nome];
        return {
          color: temHistoria? '#38bdf8' : '#475569',
          weight: temHistoria? 4 : 2,
          opacity: temHistoria? 0.8 : 0.3
        };
      },
      onEachFeature: (feature, layer) => {
        const nomeRua = feature.properties.name;
        if (!nomeRua) return;

        layer.bindTooltip(nomeRua, { sticky: true });
        layer.on('click', () => {
          map.fitBounds(layer.getBounds(), { padding: [20, 20] });
          renderCard(nomeRua);
        });
        layer.bindPopup(`<strong>${nomeRua}</strong><br>Clique para ver a história`);
      }
    }).addTo(map);
  })
 .catch(err => {
    console.error(err);
    alert('Erro: Coloque o arquivo pedreira.geojson na mesma pasta do index.html');
  });

/* Busca */
document.getElementById('search').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  if (q.length < 3) return;
  const foundName = Object.keys(RUAS).find(name => name.toLowerCase().includes(q));
  if (foundName) {
    // Zoom na primeira rua encontrada com história
    fetch('pedreira.geojson').then(r=>r.json()).then(data=>{
      const feat = data.features.find(f => f.properties.name === foundName);
      if(feat) {
        const layer = L.geoJSON(feat);
        map.fitBounds(layer.getBounds());
        renderCard(foundName);
      }
    });
  }
});

/* Controles UI */
closeBtn.onclick = () => {
  sidebar.classList.add('hidden');
  sidebar.setAttribute('aria-hidden', 'true');
  closeBtn.style.display = 'none';
}
toggleBtn.onclick = () => {
  sidebar.classList.toggle('hidden');
  const isHidden = sidebar.classList.contains('hidden');
  sidebar.setAttribute('aria-hidden', isHidden);
  closeBtn.style.display = isHidden? 'none' : 'block';
}