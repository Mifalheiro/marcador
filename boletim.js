// =====================================================================
//  BOLETIM DE JOGO (ATMP · Swaythling Modificado) — parte do controlo
//  Passos: 1 Cabeçalho → 2 Clube visitado (casa) → 3 Clube visitante →
//          4 Jogos (pares + resultados automáticos) → 5 Assinaturas → PDF
//  O boletim fica guardado dentro do estado (marcador/estado/boletim),
//  por isso o "Anular" do controlo também o desfaz.
// =====================================================================

// Ordem dos 7 jogos. c = atleta da casa (0=A,1=B,2=C) · v = visitante (0=X,1=Y,2=Z)
const ORDEM = [
  { c: 0, v: 1, et: "A - Y" }, { c: 1, v: 0, et: "B - X" }, { c: 2, v: 2, et: "C - Z" },
  { par: true, et: "PAR" },
  { c: 0, v: 0, et: "A - X" }, { c: 2, v: 1, et: "C - Y" }, { c: 1, v: 2, et: "B - Z" }
];
const LET_C = ["A", "B", "C", "", ""], LET_V = ["X", "Y", "Z", "", ""];
const JOGOS_PARA_GANHAR = 4;

// Posições (em pontos, folha A4 deitada 841.89 × 595.3) de cada campo no modelo da ATMP.
// [x, y do centro, alinhamento c=centro / l=esquerda]
const P = {"serie":[257.2,127.2,"c"],"atraso":[601.4,127.2,"c"],"jogoN":[424.5,146.3,"c"],"antecipado":[601.4,146.3,"c"],"epoca":[735.4,88.9,"c"],"data":[735.4,108.1,"c"],"jornada":[257.2,165.5,"c"],"divisao":[670.0,165.5,"c"],"inicio":[754.2,127.2,"c"],"fim":[754.2,146.3,"c"],"local":[735.4,188.2,"c"],"clubeCasa":[181.9,211.0,"l"],"clubeVis":[411.5,211.0,"l"],"casaNome0":[151.9,254.2,"l"],"casaLic0":[328.6,254.2,"c"],"visNome0":[385.1,254.2,"l"],"visLic0":[563.2,254.2,"c"],"casaNome1":[151.9,272.6,"l"],"casaLic1":[328.6,272.6,"c"],"visNome1":[385.1,272.6,"l"],"visLic1":[563.2,272.6,"c"],"casaNome2":[151.9,291.1,"l"],"casaLic2":[328.6,291.1,"c"],"visNome2":[385.1,291.1,"l"],"visLic2":[563.2,291.1,"c"],"casaNome3":[151.9,309.6,"l"],"casaLic3":[328.6,309.6,"c"],"visNome3":[385.1,309.6,"l"],"visLic3":[563.2,309.6,"c"],"protCasaSim":[736.8,309.6,"c"],"protCasaNao":[755.7,309.6,"c"],"casaNome4":[151.9,328.0,"l"],"casaLic4":[328.6,328.0,"c"],"visNome4":[385.1,328.0,"l"],"visLic4":[563.2,328.0,"c"],"visitado":[709.5,272.6,"l"],"delegCasa":[709.5,346.5,"l"],"visitante":[709.5,387.4,"l"],"j0nome":[241.2,387.4,"c"],"j0s0":[369.6,387.4,"c"],"j0s1":[397.4,387.4,"c"],"j0s2":[424.6,387.4,"c"],"j0s3":[452.8,387.4,"c"],"j0s4":[481.4,387.4,"c"],"j0venc":[544.0,387.4,"c"],"j1nome":[241.2,405.8,"c"],"j1s0":[369.6,405.8,"c"],"j1s1":[397.4,405.8,"c"],"j1s2":[424.6,405.8,"c"],"j1s3":[452.8,405.8,"c"],"j1s4":[481.4,405.8,"c"],"j1venc":[544.0,405.8,"c"],"j2nome":[241.2,424.3,"c"],"j2s0":[369.6,424.3,"c"],"j2s1":[397.4,424.3,"c"],"j2s2":[424.6,424.3,"c"],"j2s3":[452.8,424.3,"c"],"j2s4":[481.4,424.3,"c"],"j2venc":[544.0,424.3,"c"],"protVisSim":[736.8,424.3,"c"],"protVisNao":[755.7,424.3,"c"],"j3s0":[369.6,452.0,"c"],"j3s1":[397.4,452.0,"c"],"j3s2":[424.6,452.0,"c"],"j3s3":[452.8,452.0,"c"],"j3venc":[544.0,452.0,"c"],"j3nome":[241.2,442.8,"c"],"j3nome2":[241.2,461.2,"c"],"j3s4":[481.4,452.0,"c"],"j4nome":[241.2,479.7,"c"],"j4s0":[369.6,479.7,"c"],"j4s3":[452.8,479.7,"c"],"j4s4":[481.4,479.7,"c"],"j4venc":[544.0,479.7,"c"],"j5nome":[241.2,498.1,"c"],"j5s0":[369.6,498.1,"c"],"j5s1":[397.4,498.1,"c"],"j5s2":[424.6,498.1,"c"],"j5s3":[452.8,498.1,"c"],"j5s4":[481.4,498.1,"c"],"j5venc":[544.0,498.1,"c"],"j6nome":[241.2,516.6,"c"],"j6s0":[369.6,516.6,"c"],"j6s1":[397.4,516.6,"c"],"j6s2":[424.6,516.6,"c"],"j6s3":[452.8,516.6,"c"],"j6s4":[481.4,516.6,"c"],"j6venc":[544.0,516.6,"c"],"resCasa":[308.7,553.8,"c"],"resVis":[335.2,553.8,"c"],"j4s1":[397.4,479.7,"c"],"j4s2":[424.6,479.7,"c"],"favor":[426,553.8,"l"],"arbitro":[677.5,516.6,"l"],"delegVis":[709.5,461.2,"l"]};

let api = null;          // funções do controlo (estado, gravar, clubes…)
let aberto = false;      // painel do boletim aberto?
let assinaturas = {};    // imagens das assinaturas (casa, vis, arb)

/* ------------------------------------------------------------------ */
/*  Dados                                                              */
/* ------------------------------------------------------------------ */
const hoje = () => new Date().toISOString().slice(0, 10);
const horaAgora = () => new Date().toTimeString().slice(0, 5);
const vazio5 = () => [0, 1, 2, 3, 4].map(() => ({ n: "", l: "" }));

function novo(ant) {
  return {
    passo: "cab",
    cab: { serie: ant?.cab?.serie || "", jornada: "", jogoN: "", atraso: false, antecipado: false,
           epoca: ant?.cab?.epoca || "2026/2027", data: hoje(), inicio: horaAgora(), fim: "",
           divisao: ant?.cab?.divisao || "1", local: "" },
    casa: { clubeId: "", nome: "", atl: vazio5() },
    vis: { clubeId: "", nome: "", atl: vazio5() },
    par: { casa: [-1, -1], vis: [-1, -1] },
    jogos: ORDEM.map(() => ({ sets: [], venc: "" })),
    atual: -1,
    assin: { protCasa: "", protVis: "", nomeCasa: "", nomeVis: "", nomeArb: "" }
  };
}

// A Firebase apaga listas vazias e valores nulos: repõe o que faltar.
function norm(b) {
  if (!b) return null;
  const n = novo();
  b.cab = Object.assign(n.cab, b.cab || {});
  ["casa", "vis"].forEach(k => {
    b[k] = Object.assign({ clubeId: "", nome: "" }, b[k] || {});
    const a = b[k].atl || [];
    b[k].atl = [0, 1, 2, 3, 4].map(i => Object.assign({ n: "", l: "" }, a[i] || {}));
  });
  b.par = b.par || { casa: [-1, -1], vis: [-1, -1] };
  b.par.casa = [b.par.casa?.[0] ?? -1, b.par.casa?.[1] ?? -1];
  b.par.vis = [b.par.vis?.[0] ?? -1, b.par.vis?.[1] ?? -1];
  const j = b.jogos || [];
  b.jogos = ORDEM.map((_, i) => {
    const g = j[i] || {};
    const sets = Array.isArray(g.sets) ? g.sets : Object.values(g.sets || {});
    return { sets: sets.map(x => [Number(x[0]) || 0, Number(x[1]) || 0]), venc: g.venc || "" };
  });
  if (typeof b.atual !== "number") b.atual = -1;
  b.assin = Object.assign(n.assin, b.assin || {});
  b.passo = b.passo || "cab";
  return b;
}

function vitorias(b) {
  let casa = 0, vis = 0;
  b.jogos.forEach(g => { if (g.venc === "casa") casa++; else if (g.venc === "vis") vis++; });
  return { casa, vis };
}
const decidido = b => { const w = vitorias(b); return w.casa >= JOGOS_PARA_GANHAR || w.vis >= JOGOS_PARA_GANHAR; };

// Próximo jogo a disputar (-1 se o encontro já está decidido ou acabou)
function proximo(b) {
  if (decidido(b)) return -1;
  return b.jogos.findIndex(g => !g.venc);
}

// Vencedor de um jogo a partir dos sets (precisa de 3 sets ganhos)
function vencedorSets(sets, setsJogo) {
  let c = 0, v = 0;
  sets.forEach(([a, b]) => { if (a > b) c++; else if (b > a) v++; });
  return c >= setsJogo ? "casa" : v >= setsJogo ? "vis" : "";
}

function nomeAtl(b, lado, i) { return i >= 0 ? (b[lado].atl[i]?.n || "").trim() : ""; }

// Nomes de quem joga o jogo g
function nomesJogo(b, g) {
  const o = ORDEM[g];
  if (o.par) {
    return {
      casa: [nomeAtl(b, "casa", b.par.casa[0]), nomeAtl(b, "casa", b.par.casa[1])],
      vis: [nomeAtl(b, "vis", b.par.vis[0]), nomeAtl(b, "vis", b.par.vis[1])]
    };
  }
  return { casa: [nomeAtl(b, "casa", o.c)], vis: [nomeAtl(b, "vis", o.v)] };
}
const juntar = l => l.filter(Boolean).join(" / ");

/* ------------------------------------------------------------------ */
/*  Ligação ao marcador (chamado pelo controlo em cada ponto)          */
/* ------------------------------------------------------------------ */

// Prepara o marcador para o jogo g do boletim
function iniciarJogo(s, g) {
  const b = s.boletim;
  b.atual = g;
  const n = nomesJogo(b, g);
  s.a.atleta = juntar(n.casa); s.b.atleta = juntar(n.vis);
  ["a", "b"].forEach(k => { s[k].pontos = 0; s[k].sets = 0; s[k].timeout = 0; s[k].toInicio = 0; });
  s.saqueInicial = null; s.setFechado = false; s.fimJogo = false;
  const w = vitorias(b); s.a.jogos = w.casa; s.b.jogos = w.vis;
}

// Antes de contar um ponto: se não há jogo em curso no boletim, começa o próximo
window.boletimAntesPonto = function (s) {
  const b = norm(s.boletim); if (!b || b.passo !== "jogos" && b.passo !== "assinar") return;
  s.boletim = b;
  if (b.atual >= 0 && !s.fimJogo) return;
  const g = proximo(b);
  if (g >= 0) iniciarJogo(s, g);
};

// Depois de um set fechar (contagem automática): regista-o no boletim
window.boletimAposSet = function (s, L) {
  const b = norm(s.boletim); if (!b || b.atual < 0) return;
  s.boletim = b;
  const jogo = b.jogos[b.atual];
  jogo.sets.push([s.a.pontos, s.b.pontos]);   // a = casa, b = visitante
  if (s.fimJogo) {
    jogo.venc = L === "a" ? "casa" : "vis";
    b.atual = -1;
    const w = vitorias(b); s.a.jogos = w.casa; s.b.jogos = w.vis;
  }
};

/* ------------------------------------------------------------------ */
/*  Painel                                                             */
/* ------------------------------------------------------------------ */
const $ = id => document.getElementById(id);
const esc = t => String(t ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function bol() { const s = api.estado(); return s && s.boletim ? norm(s.boletim) : null; }

// Altera o boletim e grava (com ou sem entrada no "Anular")
function mudar(fn, comHist = false) {
  api.mutar(s => { s.boletim = norm(s.boletim) || novo(); fn(s.boletim, s); }, comHist);
}

window.abrirBoletim = function () {
  aberto = true;
  const s = api.estado();
  if (!s.boletim) {
    api.lerUltimo().then(ant => { mudar(b => Object.assign(b, novo(ant))); desenhar(); });
  } else desenhar();
  $("bolPainel").style.display = "block";
};
window.fecharBoletim = function () { aberto = false; $("bolPainel").style.display = "none"; api.mostrar(); };
window.bolPasso = function (p) { guardarCampos(); mudar(b => { b.passo = p; }); desenhar(); window.scrollTo(0, 0); $("bolPainel").scrollTop = 0; };

// Chamado pelo controlo sempre que o estado muda
window.boletimMostrar = function (s) {
  faixa(s);
  if (!aberto) return;
  const b = bol();
  if (b && b.passo === "jogos") {
    const foco = document.activeElement;
    if (!foco || !$("bolPainel").contains(foco) || foco.tagName === "BUTTON") desenhar();
  }
};

// Faixa no topo do controlo com o jogo em curso
function faixa(s) {
  const el = $("bolFaixa"); if (!el) return;
  const b = s && s.boletim ? norm(JSON.parse(JSON.stringify(s.boletim))) : null;
  if (!b || (b.passo !== "jogos" && b.passo !== "assinar")) { el.style.display = "none"; return; }
  const w = vitorias(b), g = b.atual >= 0 ? b.atual : proximo(b);
  let txt;
  if (decidido(b)) txt = "Encontro terminado · " + w.casa + " - " + w.vis + " · toca para assinar";
  else if (g >= 0) {
    const n = nomesJogo(b, g);
    txt = (b.atual >= 0 ? "Jogo " : "Próximo: jogo ") + (g + 1) + " · " + ORDEM[g].et + " · " +
          (juntar(n.casa) || "?") + " vs " + (juntar(n.vis) || "?") + " · " + w.casa + " - " + w.vis;
  } else txt = "Boletim · " + w.casa + " - " + w.vis;
  el.textContent = "📋 " + txt;
  el.style.display = "block";
}

function desenhar() {
  const b = bol(); if (!b) return;
  const passos = [["cab", "1 Cabeçalho"], ["casa", "2 Casa"], ["vis", "3 Visitante"], ["jogos", "4 Jogos"], ["assinar", "5 Assinar"]];
  let h = '<div class="bol-topo"><b>Boletim de jogo</b><button onclick="fecharBoletim()">✕ Fechar</button></div>' +
    '<div class="bol-passos">' + passos.map(([p, t]) => '<span class="' + (p === b.passo ? "sel" : "") + '">' + t + "</span>").join("") + "</div>";
  if (b.passo === "cab") h += passoCab(b);
  else if (b.passo === "casa" || b.passo === "vis") h += passoClube(b, b.passo);
  else if (b.passo === "jogos") h += passoJogos(b);
  else if (b.passo === "assinar") h += passoAssinar(b);
  $("bolPainel").innerHTML = h;
  if (b.passo === "assinar") prepararAssinaturas();
}

/* ---------- Passo 1: cabeçalho ---------- */
function campo(id, rot, val, tipo = "text", extra = "") {
  return '<label class="bol-campo"><span>' + rot + '</span><input id="' + id + '" type="' + tipo + '" value="' + esc(val) + '" ' + extra + "></label>";
}
function passoCab(b) {
  const c = b.cab;
  return '<div class="bol-cartao"><div class="bol-grelha">' +
    campo("c_serie", "Série", c.serie) + campo("c_jornada", "Jornada", c.jornada, "number") +
    campo("c_jogoN", "Jogo Nº", c.jogoN, "number") + campo("c_divisao", "Divisão", c.divisao, "number") +
    campo("c_epoca", "Época", c.epoca) + campo("c_data", "Data", c.data, "date") +
    campo("c_inicio", "Hora início", c.inicio, "time") + campo("c_fim", "Hora fim", c.fim, "time") +
    campo("c_local", "Local", c.local) +
    '<label class="bol-check"><input id="c_atraso" type="checkbox" ' + (c.atraso ? "checked" : "") + "> Jogo em atraso</label>" +
    '<label class="bol-check"><input id="c_antecipado" type="checkbox" ' + (c.antecipado ? "checked" : "") + "> Antecipado</label>" +
    "</div></div>" +
    '<div class="bol-nav"><button class="bol-sec" onclick="novoBoletim()">Novo boletim</button><button class="bol-pri" onclick="bolPasso(\'casa\')">Avançar ›</button></div>';
}

// Lê os campos visíveis do passo atual para o estado
function guardarCampos() {
  const b = bol(); if (!b) return;
  const v = id => $(id) ? $(id).value : undefined;
  if (b.passo === "cab" && $("c_serie")) {
    const c = {};
    ["serie", "jornada", "jogoN", "divisao", "epoca", "data", "inicio", "fim", "local"].forEach(k => c[k] = v("c_" + k).trim());
    c.atraso = $("c_atraso").checked; c.antecipado = $("c_antecipado").checked;
    mudar(b => { Object.assign(b.cab, c); });
  }
  if ((b.passo === "casa" || b.passo === "vis") && $("t_n0")) {
    const atl = [0, 1, 2, 3, 4].map(i => ({ n: v("t_n" + i).trim().toUpperCase(), l: v("t_l" + i).trim() }));
    const lado = b.passo;
    mudar(b => { b[lado].atl = atl; });
  }
  if (b.passo === "assinar" && $("a_nomeCasa")) {
    const a = { nomeCasa: v("a_nomeCasa").trim(), nomeVis: v("a_nomeVis").trim(), nomeArb: v("a_nomeArb").trim() };
    const fim = v("a_fim");
    mudar(b => { Object.assign(b.assin, a); if (fim !== undefined) b.cab.fim = fim; });
  }
}

window.novoBoletim = function () {
  if (!confirm("Começar um boletim novo? O atual é apagado.")) return;
  const ant = bol();
  mudar(b => { Object.keys(b).forEach(k => delete b[k]); Object.assign(b, novo(ant)); }, true);
  assinaturas = {}; api.apagarAssinaturas();
  desenhar();
};

/* ---------- Passos 2 e 3: clubes e atletas ---------- */
function passoClube(b, lado) {
  const c = b[lado], letras = lado === "casa" ? LET_C : LET_V;
  const titulo = lado === "casa" ? "Clube visitado (joga em casa)" : "Clube visitante";
  const opcoes = [{ id: "navais", nome: "C. D. C. NAVAIS" }].concat(api.listaClubes())
    .map(x => '<option value="' + x.id + '"' + (x.id === c.clubeId ? " selected" : "") + ">" + esc(x.nome) + "</option>").join("");
  let linhas = "";
  c.atl.forEach((a, i) => {
    linhas += "<tr><td class=\"bol-let\">" + (letras[i] ? letras[i] + " -" : "") + "</td>" +
      '<td><input id="t_n' + i + '" value="' + esc(a.n) + '" placeholder="Nome do atleta"></td>' +
      '<td><input id="t_l' + i + '" value="' + esc(a.l) + '" placeholder="Licença" inputmode="numeric" class="bol-lic"></td></tr>';
  });
  const voltar = lado === "casa" ? "cab" : "casa", seguir = lado === "casa" ? "vis" : "jogos";
  return '<div class="bol-cartao"><div class="bol-sub">' + titulo + "</div>" +
    '<select id="t_clube" onchange="bolClube(\'' + lado + '\', this.value)"><option value="">Escolher clube…</option>' + opcoes + "</select>" +
    '<table class="bol-tab"><tr><th></th><th>Atletas</th><th>Licenças</th></tr>' + linhas + "</table>" +
    '<div class="aviso">Os 3 primeiros jogam os individuais (' + letras.slice(0, 3).join(", ") + '). Os outros dois são suplentes e podem jogar os pares. Os nomes e licenças ficam guardados para a próxima vez.</div></div>' +
    '<div class="bol-nav"><button class="bol-sec" onclick="bolPasso(\'' + voltar + '\')">‹ Voltar</button>' +
    '<button class="bol-pri" onclick="bolConfirmarClube(\'' + lado + '\', \'' + seguir + '\')">Confirmar e avançar ›</button></div>';
}

// Ao escolher o clube, preenche com o plantel guardado da última vez
window.bolClube = async function (lado, id) {
  guardarCampos();
  const nome = id === "navais" ? "C. D. C. NAVAIS" : (api.clube(id)?.nome || "");
  const plantel = id ? await api.lerPlantel(id) : null;
  mudar(b => {
    b[lado].clubeId = id; b[lado].nome = nome;
    if (plantel && plantel.length) b[lado].atl = [0, 1, 2, 3, 4].map(i => Object.assign({ n: "", l: "" }, plantel[i] || {}));
  });
  desenhar();
};

window.bolConfirmarClube = function (lado, seguir) {
  guardarCampos();
  const b = bol(), c = b[lado];
  if (!c.clubeId) { alert("Escolhe o clube."); return; }
  if (c.atl.slice(0, 3).some(a => !a.n)) { alert("Preenche pelo menos os 3 primeiros atletas."); return; }
  api.guardarPlantel(c.clubeId, c.atl);
  if (seguir === "jogos") {
    // marcador: a = casa, b = visitante
    api.aplicarClubes(b.casa.clubeId, b.vis.clubeId).then(() => {
      mudar((b, s) => { b.passo = "jogos"; const w = vitorias(b); s.a.jogos = w.casa; s.b.jogos = w.vis;
        if (b.atual < 0 && proximo(b) >= 0 && !s.a.pontos && !s.b.pontos) iniciarJogo(s, proximo(b)); }, true);
      desenhar();
    });
  } else bolPasso(seguir);
};

/* ---------- Passo 4: jogos ---------- */
function passoJogos(b) {
  const w = vitorias(b), s = api.estado(), prox = proximo(b);
  const opc = (lado, sel) => '<option value="-1">—</option>' + b[lado].atl.map((a, i) => a.n ? '<option value="' + i + '"' + (i === sel ? " selected" : "") + ">" + esc(a.n) + "</option>" : "").join("");
  let linhas = "";
  ORDEM.forEach((o, g) => {
    const jogo = b.jogos[g], n = nomesJogo(b, g);
    const ativo = b.atual === g, fora = !jogo.venc && !ativo && (decidido(b) || g !== prox);
    let nomes;
    if (o.par) {
      nomes = '<div class="bol-par"><select onchange="bolPar(\'casa\',0,this.value)">' + opc("casa", b.par.casa[0]) + "</select>" +
        '<select onchange="bolPar(\'casa\',1,this.value)">' + opc("casa", b.par.casa[1]) + "</select>" +
        '<span>vs</span><select onchange="bolPar(\'vis\',0,this.value)">' + opc("vis", b.par.vis[0]) + "</select>" +
        '<select onchange="bolPar(\'vis\',1,this.value)">' + opc("vis", b.par.vis[1]) + "</select></div>";
    } else nomes = esc(juntar(n.casa)) + " <span class=\"bol-vs\">vs</span> " + esc(juntar(n.vis));
    let sets = "";
    for (let k = 0; k < 5; k++) {
      const x = jogo.sets[k];
      const val = x ? x[0] + "-" + x[1] : "";
      const aoVivo = ativo && k === jogo.sets.length ? ' placeholder="' + (s.a.pontos || 0) + "-" + (s.b.pontos || 0) + '" class="vivo"' : "";
      sets += '<td><input value="' + val + '"' + aoVivo + ' onchange="bolSet(' + g + "," + k + ',this.value)" inputmode="numeric"></td>';
    }
    const venc = jogo.venc ? esc(juntar(n[jogo.venc])) : (ativo ? "<i>a jogar</i>" : "");
    linhas += '<tr class="' + (ativo ? "atual" : fora ? "fora" : "") + '"><td class="bol-let">' + o.et + "</td><td>" + nomes + "</td>" + sets +
      '<td class="bol-venc">' + venc + "</td></tr>";
  });
  let acao = "";
  if (decidido(b)) acao = '<div class="bol-res">Resultado final: <b>' + w.casa + " - " + w.vis + "</b> a favor de <b>" + esc(w.casa > w.vis ? b.casa.nome : b.vis.nome) + "</b></div>";
  else if (b.atual < 0 && prox >= 0) acao = '<button class="bol-pri" onclick="bolComecar(' + prox + ')">▶ Começar jogo ' + (prox + 1) + " (" + ORDEM[prox].et + ")</button>";
  else if (b.atual >= 0) acao = '<div class="aviso">Jogo ' + (b.atual + 1) + " em curso — cada set que fecha no marcador fica registado aqui.</div>";
  return '<div class="bol-cartao"><div class="bol-sub">' + esc(b.casa.nome) + " " + w.casa + " - " + w.vis + " " + esc(b.vis.nome) + "</div>" +
    '<div class="bol-scroll"><table class="bol-tab bol-jogos"><tr><th></th><th>Jogos</th><th>1º</th><th>2º</th><th>3º</th><th>4º</th><th>5º</th><th>Vencedores</th></tr>' + linhas + "</table></div>" +
    acao + '<div class="aviso">Os sets ficam registados sozinhos (com a contagem automática ligada). Para corrigir, escreve no quadrado, por exemplo 11-9.</div></div>' +
    '<div class="bol-nav"><button class="bol-sec" onclick="bolPasso(\'vis\')">‹ Equipas</button>' +
    '<button class="bol-sec" onclick="fecharBoletim()">Marcador</button>' +
    '<button class="bol-pri" onclick="bolPasso(\'assinar\')">✍ Assinar ›</button></div>';
}

window.bolPar = function (lado, i, v) {
  mudar((b, s) => {
    b.par[lado][i] = Number(v);
    if (b.atual === 3) { const n = nomesJogo(b, 3); s.a.atleta = juntar(n.casa); s.b.atleta = juntar(n.vis); }
  });
  desenhar();
};

window.bolComecar = function (g) {
  if (ORDEM[g].par) { const b = bol(); if ([...b.par.casa, ...b.par.vis].some(x => x < 0)) { alert("Escolhe primeiro os 2 atletas de cada equipa para o par."); return; } }
  mudar((b, s) => iniciarJogo(s, g), true);
  desenhar();
};

// Correção manual de um set ("11-9"; vazio apaga)
window.bolSet = function (g, k, txt) {
  const m = String(txt).match(/(\d+)\D+(\d+)/);
  mudar((b, s) => {
    const jogo = b.jogos[g];
    if (m) jogo.sets[k] = [Number(m[1]), Number(m[2])]; else jogo.sets.splice(k, 1);
    jogo.sets = jogo.sets.filter(Boolean);
    jogo.venc = vencedorSets(jogo.sets, s.setsJogo || 3);
    if (jogo.venc && b.atual === g) { b.atual = -1; s.fimJogo = true; }
    const w = vitorias(b); s.a.jogos = w.casa; s.b.jogos = w.vis;
  }, true);
  desenhar();
};

/* ---------- Passo 5: assinaturas ---------- */
function passoAssinar(b) {
  const a = b.assin, w = vitorias(b);
  const prot = (lado, val) => '<div class="bol-prot">Declara protestar o jogo? ' +
    '<button class="' + (val === "sim" ? "sel" : "") + '" onclick="bolProt(\'' + lado + '\',\'sim\')">Sim</button>' +
    '<button class="' + (val === "nao" ? "sel" : "") + '" onclick="bolProt(\'' + lado + '\',\'nao\')">Não</button></div>';
  const pad = (id, rot, nomeId, nome) => '<div class="bol-ass"><div class="bol-ass-rot">' + rot + "</div>" +
    '<input id="' + nomeId + '" value="' + esc(nome) + '" placeholder="Nome (opcional)">' +
    '<canvas id="pad_' + id + '" width="600" height="180"></canvas>' +
    '<button class="bol-limpar" onclick="bolLimpar(\'' + id + '\')">Limpar assinatura</button></div>';
  return (decidido(b) ? "" : '<div class="aviso bol-alerta">Atenção: o encontro ainda não está decidido (' + w.casa + " - " + w.vis + ").</div>") +
    '<div class="bol-cartao"><div class="bol-sub">Clube visitado: ' + esc(b.casa.nome) + "</div>" + prot("Casa", a.protCasa) +
    pad("casa", "Delegado ou Capitão", "a_nomeCasa", a.nomeCasa) + "</div>" +
    '<div class="bol-cartao"><div class="bol-sub">Clube visitante: ' + esc(b.vis.nome) + "</div>" + prot("Vis", a.protVis) +
    pad("vis", "Delegado ou Capitão", "a_nomeVis", a.nomeVis) + "</div>" +
    '<div class="bol-cartao">' + pad("arb", "Árbitro", "a_nomeArb", a.nomeArb) +
    campo("a_fim", "Hora de fim", b.cab.fim || horaAgora(), "time") + "</div>" +
    '<div class="bol-nav"><button class="bol-sec" onclick="bolPasso(\'jogos\')">‹ Jogos</button>' +
    '<button class="bol-pri" id="bolBtPDF" onclick="bolPDF()">📄 Gerar PDF</button></div>';
}

window.bolProt = function (lado, v) { guardarCampos(); mudar(b => { b.assin["prot" + lado] = v; }); desenhar(); };
window.bolLimpar = function (id) { delete assinaturas[id]; api.guardarAssinatura(id, null); const c = $("pad_" + id); c.getContext("2d").clearRect(0, 0, c.width, c.height); };

// Corta o espaço em branco à volta da assinatura (para ficar maior no PDF)
function recortar(c) {
  const d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  let x0 = c.width, y0 = c.height, x1 = -1, y1 = -1;
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
    if (d[(y * c.width + x) * 4 + 3] > 0) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  }
  if (x1 < 0) return null;
  const m = 6; x0 = Math.max(0, x0 - m); y0 = Math.max(0, y0 - m); x1 = Math.min(c.width - 1, x1 + m); y1 = Math.min(c.height - 1, y1 + m);
  const t = document.createElement("canvas"); t.width = x1 - x0 + 1; t.height = y1 - y0 + 1;
  t.getContext("2d").drawImage(c, x0, y0, t.width, t.height, 0, 0, t.width, t.height);
  return t.toDataURL("image/png");
}

// Quadros para assinar com o dedo
function prepararAssinaturas() {
  ["casa", "vis", "arb"].forEach(id => {
    const c = $("pad_" + id), x = c.getContext("2d");
    x.lineWidth = 3; x.lineCap = "round"; x.lineJoin = "round"; x.strokeStyle = "#111";
    if (assinaturas[id]) { const im = new Image(); im.onload = () => x.drawImage(im, (c.width - im.width) / 2, (c.height - im.height) / 2); im.src = assinaturas[id]; }
    let ativo = false;
    const pt = e => { const r = c.getBoundingClientRect(); return [(e.clientX - r.left) * c.width / r.width, (e.clientY - r.top) * c.height / r.height]; };
    c.onpointerdown = e => { ativo = true; c.setPointerCapture(e.pointerId); const [px, py] = pt(e); x.beginPath(); x.moveTo(px, py); };
    c.onpointermove = e => { if (!ativo) return; const [px, py] = pt(e); x.lineTo(px, py); x.stroke(); };
    c.onpointerup = c.onpointercancel = () => {
      if (!ativo) return; ativo = false;
      assinaturas[id] = recortar(c); api.guardarAssinatura(id, assinaturas[id]);
    };
  });
}

/* ------------------------------------------------------------------ */
/*  PDF                                                                */
/* ------------------------------------------------------------------ */
function carregarScript(src) {
  return new Promise((ok, falha) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = falha; document.head.appendChild(s); });
}
const dataPT = d => { const m = String(d || "").match(/(\d{4})-(\d{2})-(\d{2})/); return m ? m[3] + " / " + m[2] + " / " + m[1] : (d || ""); };

window.bolPDF = async function () {
  guardarCampos();
  const b = bol(), w = vitorias(b);
  const botao = document.getElementById("bolBtPDF"); if (botao) { botao.disabled = true; botao.textContent = "A gerar…"; }
  try {
    if (!window.PDFLib) await carregarScript("https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js");
    const { PDFDocument, StandardFonts } = window.PDFLib;
    const W = 841.89, H = 595.28;
    const pdf = await PDFDocument.create();
    const pg = pdf.addPage([W, H]);
    const fundo = await pdf.embedJpg(await fetch("boletim-fundo.jpg").then(r => r.arrayBuffer()));
    pg.drawImage(fundo, { x: 0, y: 0, width: W, height: H });
    const fB = await pdf.embedFont(StandardFonts.HelveticaBold), fN = await pdf.embedFont(StandardFonts.Helvetica);
    const limpar = t => String(t ?? "").replace(/[^\x20-\x7E\xA0-\xFF]/g, "").trim();   // só letras que a fonte do PDF tem

    // escreve um texto no campo k (coordenadas do modelo); encolhe a letra até caber em maxW
    const escrever = (k, txt, tam, maxW, dy = 0, negrito = true) => {
      txt = limpar(txt); if (!txt || !P[k]) return;
      const [x, y, al] = P[k], f = negrito ? fB : fN;
      let t = tam;
      while (maxW && f.widthOfTextAtSize(txt, t) > maxW && t > 5) t -= 0.5;
      const w = f.widthOfTextAtSize(txt, t);
      pg.drawText(txt, { x: al === "c" ? x - w / 2 : x, y: H - (y + dy) - t * 0.35, size: t, font: f });
    };
    const c = b.cab;
    escrever("epoca", c.epoca, 10, 90); escrever("data", dataPT(c.data), 10, 90);
    escrever("inicio", c.inicio, 10, 45); escrever("fim", c.fim, 10, 45);
    escrever("serie", c.serie, 10, 45); escrever("jornada", c.jornada, 10, 45); escrever("jogoN", c.jogoN, 10, 50);
    if (c.atraso) escrever("atraso", "X", 10); if (c.antecipado) escrever("antecipado", "X", 10);
    if (c.divisao) escrever("divisao", c.divisao + "º", 10, 35);
    escrever("local", c.local, 10, 90);
    escrever("clubeCasa", b.casa.nome, 11, 170); escrever("clubeVis", b.vis.nome, 11, 175);
    b.casa.atl.forEach((a, i) => { escrever("casaNome" + i, a.n, 8, 150); escrever("casaLic" + i, a.l, 8, 52, 0, false); });
    b.vis.atl.forEach((a, i) => { escrever("visNome" + i, a.n, 8, 150); escrever("visLic" + i, a.l, 8, 52, 0, false); });

    ORDEM.forEach((o, g) => {
      const jogo = b.jogos[g], n = nomesJogo(b, g);
      if (o.par) {
        escrever("j3nome", [n.casa[0], n.vis[0]].filter(Boolean).join(" - "), 8, 220);
        escrever("j3nome2", [n.casa[1], n.vis[1]].filter(Boolean).join(" - "), 8, 220);
      } else if ((n.casa[0] || n.vis[0]) && (g < 4 || jogo.sets.length || jogo.venc || !decidido(b)))
        // os jogos depois do par só se preenchem se ainda não houver vencedor do encontro
        escrever("j" + g + "nome", n.casa[0] + " - " + n.vis[0], 8, 220);
      jogo.sets.slice(0, 5).forEach((x, k) => escrever("j" + g + "s" + k, x[0] + " - " + x[1], 7.5, 26, 0, false));
      if (jogo.venc) {
        const v = n[jogo.venc].filter(Boolean);
        if (v.length > 1) { escrever("j" + g + "venc", v[0], 7, 95, -5); escrever("j" + g + "venc", v[1], 7, 95, 5); }
        else escrever("j" + g + "venc", v[0], 7.5, 95);
      }
    });

    if (w.casa || w.vis) {
      escrever("resCasa", w.casa, 12, 25); escrever("resVis", w.vis, 12, 25);
      if (decidido(b)) escrever("favor", w.casa > w.vis ? b.casa.nome : b.vis.nome, 10, 165);
    }

    // Lado direito: clubes, protestos e assinaturas
    const a = b.assin;
    escrever("visitado", b.casa.nome, 9, 110); escrever("visitante", b.vis.nome, 9, 110);
    if (a.protCasa) escrever(a.protCasa === "sim" ? "protCasaSim" : "protCasaNao", "X", 10);
    if (a.protVis) escrever(a.protVis === "sim" ? "protVisSim" : "protVisNao", "X", 10);
    const assinar = async (k, img, nome, maxW) => {
      const [x, y] = P[k];
      if (img) {
        const im = await pdf.embedPng(img);
        let h = 26, wImg = h * im.width / im.height;
        if (wImg > maxW) { wImg = maxW; h = wImg * im.height / im.width; }
        pg.drawImage(im, { x, y: H - y - 5, width: wImg, height: h });
        if (nome) pg.drawText(limpar(nome), { x, y: H - y - 13, size: 6, font: fN });
      } else if (nome) escrever(k, nome, 8, maxW, 0, false);
    };
    await assinar("delegCasa", assinaturas.casa, a.nomeCasa, 110);
    await assinar("delegVis", assinaturas.vis, a.nomeVis, 110);
    await assinar("arbitro", assinaturas.arb, a.nomeArb, 135);

    const nomeFicheiro = ("Boletim " + (b.casa.nome || "") + " vs " + (b.vis.nome || "") + " " + (c.data || "")).replace(/[\\/:*?"<>|.]+/g, " ").replace(/\s+/g, "_") + ".pdf";
    const blob = new Blob([await pdf.save()], { type: "application/pdf" });
    const ficheiro = new File([blob], nomeFicheiro, { type: "application/pdf" });
    if (navigator.canShare && navigator.canShare({ files: [ficheiro] }) && confirm("PDF pronto. Partilhar (WhatsApp, email…)?\nCancelar = só descarregar.")) {
      await navigator.share({ files: [ficheiro], title: nomeFicheiro });
    } else {
      const l = document.createElement("a"); l.href = URL.createObjectURL(blob); l.download = nomeFicheiro;
      document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(l.href), 10000);
    }
  } catch (e) {
    alert("Não foi possível gerar o PDF: " + (e && e.message ? e.message : e));
  } finally {
    if (botao) { botao.disabled = false; botao.textContent = "📄 Gerar PDF"; }
  }
};

/* ------------------------------------------------------------------ */
export function instalarBoletim(funcoes) {
  api = funcoes;
  api.lerAssinaturas().then(a => { assinaturas = a || {}; });
}
export const _testes = { novo, norm, vitorias, proximo, vencedorSets, nomesJogo, iniciarJogo };
