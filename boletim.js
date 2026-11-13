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
const LET_C = ["A", "B", "C", "D", "E"], LET_V = ["X", "Y", "Z", "V", "W"];
const JOGOS_PARA_GANHAR = 4;

// Posições (em pontos, folha A4 deitada 841.89 × 595.3) de cada campo no modelo da ATMP.
// [x, y do centro, alinhamento c=centro / l=esquerda]
const P = {"serie":[256.8,127.2,"c"],"atraso":[600.2,127.2,"c"],"jogoN":[423.7,146.3,"c"],"antecipado":[600.2,146.3,"c"],"epoca":[734.0,88.9,"c"],"data":[734.0,108.1,"c"],"jornada":[256.8,165.5,"c"],"divisao":[668.6,165.5,"c"],"inicio":[752.7,127.2,"c"],"fim":[752.7,146.3,"c"],"local":[734.0,188.2,"c"],"clubeCasa":[181.7,211.0,"l"],"clubeVis":[410.7,211.0,"l"],"casaNome0":[151.8,254.2,"l"],"casaLic0":[327.9,254.2,"c"],"visNome0":[384.3,254.2,"l"],"visLic0":[562.0,254.2,"c"],"casaNome1":[151.8,272.6,"l"],"casaLic1":[327.9,272.6,"c"],"visNome1":[384.3,272.6,"l"],"visLic1":[562.0,272.6,"c"],"casaNome2":[151.8,291.1,"l"],"casaLic2":[327.9,291.1,"c"],"visNome2":[384.3,291.1,"l"],"visLic2":[562.0,291.1,"c"],"casaNome3":[151.8,309.6,"l"],"casaLic3":[327.9,309.6,"c"],"visNome3":[384.3,309.6,"l"],"visLic3":[562.0,309.6,"c"],"protCasaSim":[735.4,309.6,"c"],"protCasaNao":[754.2,309.6,"c"],"casaNome4":[151.8,328.0,"l"],"casaLic4":[327.9,328.0,"c"],"visNome4":[384.3,328.0,"l"],"visLic4":[562.0,328.0,"c"],"visitado":[708.1,272.6,"l"],"delegCasa":[708.1,346.5,"l"],"visitante":[708.1,387.4,"l"],"j0nome":[240.8,387.4,"c"],"j0s0":[368.9,387.4,"c"],"j0s1":[396.7,387.4,"c"],"j0s2":[423.8,387.4,"c"],"j0s3":[451.9,387.4,"c"],"j0s4":[480.5,387.4,"c"],"j0venc":[543.0,387.4,"c"],"j1nome":[240.8,405.8,"c"],"j1s0":[368.9,405.8,"c"],"j1s1":[396.7,405.8,"c"],"j1s2":[423.8,405.8,"c"],"j1s3":[451.9,405.8,"c"],"j1s4":[480.5,405.8,"c"],"j1venc":[543.0,405.8,"c"],"j2nome":[240.8,424.3,"c"],"j2s0":[368.9,424.3,"c"],"j2s1":[396.7,424.3,"c"],"j2s2":[423.8,424.3,"c"],"j2s3":[451.9,424.3,"c"],"j2s4":[480.4,424.3,"c"],"j2venc":[543.0,424.3,"c"],"protVisSim":[735.4,424.3,"c"],"protVisNao":[754.2,424.3,"c"],"j3nome":[240.8,445.5,"c"],"j3s0":[368.9,452.0,"c"],"j3s1":[396.7,452.0,"c"],"j3s2":[423.8,452.0,"c"],"j3s3":[451.9,452.0,"c"],"j3s4":[480.4,452.0,"c"],"j3venc":[543.0,452.0,"c"],"j4nome":[240.8,479.7,"c"],"j4s0":[368.9,479.7,"c"],"j4s3":[451.9,479.7,"c"],"j4s4":[480.4,479.7,"c"],"j4venc":[543.0,479.7,"c"],"j5nome":[240.8,498.1,"c"],"j5s0":[368.9,498.1,"c"],"j5s1":[396.6,498.1,"c"],"j5s2":[423.7,498.1,"c"],"j5s3":[451.9,498.1,"c"],"j5s4":[480.4,498.1,"c"],"j5venc":[543.0,498.1,"c"],"j6nome":[240.8,516.6,"c"],"j6s0":[368.9,516.6,"c"],"j6s1":[396.6,516.6,"c"],"j6s2":[423.7,516.6,"c"],"j6s3":[451.9,516.6,"c"],"j6s4":[480.4,516.6,"c"],"j6venc":[543.0,516.6,"c"],"resCasa":[308.2,553.8,"c"],"resVis":[334.6,553.8,"c"],"j4s1":[396.7,479.7,"c"],"j4s2":[423.8,479.7,"c"],"favor":[426,553.8,"l"],"arbitro":[676.1,516.6,"l"],"delegVis":[708.1,461.2,"l"],"j3nome2":[240.8,458.5,"c"]};

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
    assin: { protCasa: "", protVis: "", nomeCasa: "", nomeVis: "", nomeArb: "", subCasa: false, subVis: false, subArb: false }
  };
}

// A Firebase apaga listas vazias e valores nulos: repõe o que faltar.
function norm(b) {
  if (!b) return null;
  const n = novo();
  b.cab = Object.assign(n.cab, b.cab || {});
  ["casa", "vis"].forEach(k => {
    b[k] = Object.assign({ clubeId: "", nome: "", ok: false }, b[k] || {});
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
// Depois de uma equipa (ou o árbitro) submeter, o boletim fica fechado: não se pode voltar atrás
const bloqueado = b => !!(b && b.assin && (b.assin.subCasa || b.assin.subVis || b.assin.subArb));
window.boletimBloqueado = b => bloqueado(b);
// boletim nos jogos ou nas assinaturas (é aí que o marcador o alimenta)
const emJogo = b => !!b && (b.passo === "jogos" || b.passo === "assinar");
const decidido = b => { const w = vitorias(b); return w.casa >= JOGOS_PARA_GANHAR || w.vis >= JOGOS_PARA_GANHAR; };

// Assinar só depois de o encontro estar decidido (uma equipa com 4 vitórias); em Teste, sempre
const podeAssinar = b => decidido(b) || bloqueado(b) || !!(api && api.estado() && api.estado().teste);

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
// Nome curto (primeiro + último nome; apelidos compostos juntos) — o mesmo do direto
const COMPOSTOS = ["VILAS BOAS", "VILLAS BOAS", "CASTELO BRANCO", "VILA NOVA", "VILA REAL", "VILA VERDE", "MONTE NEGRO",
  "SANTA RITA", "SÃO JOSÉ", "SAO JOSE", "SÃO PEDRO", "SAO PEDRO", "SÃO JOÃO", "SAO JOAO", "BOA VENTURA", "PAIS DE SOUSA"];
function curto(nome) {
  const p = String(nome || "").split(/\s+/).filter(Boolean);
  if (p.length <= 2) return p.join(" ");
  const up = p.map(x => x.toUpperCase());
  let i = p.length - 1;
  for (const c of COMPOSTOS) {
    const n = c.split(" ").length;
    if (p.length - n >= 1 && up.slice(-n).join(" ") === c) { i = p.length - n; break; }
  }
  return [p[0]].concat(p.slice(i)).join(" ");
}

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
  s.saqueInicial = null; s.setFechado = false; s.fimJogo = false; s.parciais = []; s.trocarPendente = false; s.trocaFeita = false;
  const w = vitorias(b); s.a.jogos = w.casa; s.b.jogos = w.vis;
}

// Se não há jogo em curso no boletim, começa o próximo (true se começou)
function comecarSeguinte(s) {
  const b = norm(s.boletim); if (bloqueado(b) || !emJogo(b)) return false;
  s.boletim = b;
  if (b.atual >= 0 && !s.fimJogo) return false;
  const g = proximo(b);
  if (g < 0) return false;
  iniciarJogo(s, g);
  return true;
}
// antes de contar um ponto, e no "Novo jogo" do controlo
window.boletimAntesPonto = s => { comecarSeguinte(s); };
window.boletimNovoJogo = s => comecarSeguinte(s);
// Jogo de pares em curso (ou a seguir) sem os 4 atletas escolhidos: o controlo espera pelo boletim
window.boletimFaltaPar = function (s) {
  if (!s || !s.boletim) return false;
  const b = norm(JSON.parse(JSON.stringify(s.boletim)));
  if (bloqueado(b) || !emJogo(b) || decidido(b)) return false;
  // fim do jogo anterior: primeiro Esconder; depois de esconder, o Novo jogo só fica ativo com o par escolhido
  if (s.fimJogo && s.visivel !== false) return false;
  const g = s.fimJogo ? proximo(b) : b.atual;
  return g >= 0 && !!ORDEM[g].par && [...b.par.casa, ...b.par.vis].some(x => x < 0);
};
// Texto do botão Novo jogo quando há jogo seguinte no boletim (ex.: "Jogo 2 (B - X)")
window.boletimProximoTexto = function (s) {
  if (!s || !s.boletim) return "";
  const b = norm(JSON.parse(JSON.stringify(s.boletim)));
  if (bloqueado(b) || !emJogo(b)) return "";
  const g = proximo(b);
  return g >= 0 ? "Jogo " + (g + 1) + " (" + ORDEM[g].et + ")" : "";
};

// Depois de um set fechar (contagem automática): regista-o no boletim
window.boletimAposSet = function (s, L) {
  const b = norm(s.boletim); if (!b || bloqueado(b) || b.atual < 0) return;
  s.boletim = b;
  const jogo = b.jogos[b.atual];
  jogo.sets.push([s.a.pontos, s.b.pontos]);   // a = casa, b = visitante
  if (s.fimJogo) {
    jogo.venc = L === "a" ? "casa" : "vis";
    b.atual = -1;
    const w = vitorias(b); s.a.jogos = w.casa; s.b.jogos = w.vis;
  }
};

// "Zerar tudo" no controlo: apaga também o boletim e as assinaturas
window.boletimZerar = function (s) {
  s.boletim = null;
  assinaturas = {};
  if (api) api.apagarAssinaturas();
  if (aberto) window.fecharBoletim();
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
  if (!s.boletim) mudar(b => Object.assign(b, novo()));
  else if (bloqueado(norm(s.boletim)) && s.boletim.passo !== "assinar") mudar(b => { b.passo = "assinar"; });
  // estava nas assinaturas mas ainda não se pode assinar (ex.: Teste desligado): volta aos jogos
  else if (s.boletim.passo === "assinar" && !podeAssinar(norm(s.boletim))) mudar(b => { b.passo = "jogos"; });
  desenhar();
  $("bolPainel").style.display = "block";
};
window.fecharBoletim = function () { aberto = false; edicaoLivre = false; $("bolPainel").style.display = "none"; api.mostrar(); };
// Voltar atrás depois de a equipa da casa confirmar a sua equipa precisa do código do boletim
const ORDEM_PASSOS = ["cab", "casa", "vis", "jogos", "assinar"];
async function pedirCodigo(pergunta) {
  if (api.estado() && api.estado().teste) return true;   // em Teste não pede código
  const certo = await api.lerCodigo();
  if (!certo) { alert("É preciso um código. Define-o no controlo, em Definições → Código do boletim."); return false; }
  const c = prompt(pergunta || "Código para voltar atrás:");
  if (c === null) return false;
  if (await resumo(c.trim()) !== certo) { alert("Código errado."); return false; }
  return true;
}
// Edição manual dos sets e dos pares (depois de o par começar) só com o código do boletim;
// fica aberta até fechar o boletim ou carregar em "Terminar edição". Em Teste não pede código.
let edicaoLivre = false;
const podeEditar = () => edicaoLivre || !!(api.estado() && api.estado().teste);
// o par já começou (tem sets ou pontos): a partir daí os atletas do par só mudam com o código
const parComecado = (b, s) => { const j = b.jogos[3]; return !!(j.sets.length || j.venc || (b.atual === 3 && s && ((s.a.pontos || 0) + (s.b.pontos || 0)) > 0)); };
window.bolEditar = async function () {
  if (edicaoLivre) { edicaoLivre = false; desenhar(); return; }
  if (!(await pedirCodigo("Código do boletim para editar os resultados:"))) return;
  edicaoLivre = true; desenhar();
};
window.bolPasso = async function (p) {
  const b0 = bol();
  if (bloqueado(b0) && p !== "assinar") return;
  if (p === "assinar" && !podeAssinar(b0)) { alert("Só se assina quando o encontro terminar (uma equipa com " + JOGOS_PARA_GANHAR + " vitórias)."); return; }
  const de = ORDEM_PASSOS.indexOf(b0.passo), para = ORDEM_PASSOS.indexOf(p);
  if (b0.casa.ok && para < de && para <= 2 && !(await pedirCodigo())) return;
  guardarCampos(); mudar(b => { b.passo = p; }); desenhar(); window.scrollTo(0, 0); $("bolPainel").scrollTop = 0; };

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
  if (!emJogo(b)) { el.style.display = "none"; return; }
  const w = vitorias(b), g = b.atual >= 0 ? b.atual : proximo(b);
  let txt;
  if (bloqueado(b)) txt = "Boletim submetido · " + w.casa + " - " + w.vis + " · toca para gerar o PDF";
  else if (decidido(b)) txt = "Encontro terminado · " + w.casa + " - " + w.vis + " · toca para assinar";
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
  if (b.passo === "assinar") {
    const a = {};
    ["nomeCasa", "nomeVis", "nomeArb"].forEach(k => { if ($("a_" + k)) a[k] = v("a_" + k).trim(); });
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

/* ---------- Lista da FPTM: ligação dos clubes guardados aos clubes do ficheiro ---------- */
const normT = t => String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const GENERICAS = new Set(["clube", "club", "ginasio", "associacao", "recreativa", "recreativo", "cultural", "desportivo",
  "desporto", "centro", "grupo", "tenis", "mesa", "academia", "sport", "futebol", "sociedade", "uniao"]);
const palavras = t => normT(t).replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(x => x.length >= 4 && !GENERICAS.has(x));
const compacto = t => normT(t).replace(/\s+[ab]$/, "").replace(/[^a-z0-9]/g, "");

// Para cada clube guardado, o clube do ficheiro da FPTM que lhe corresponde → { clubeId: chave do ficheiro }
// (primeiro o mesmo clube da importação anterior; senão pelo nome do clube e das equipas, preferindo a ATM Porto)
export function ligarFptm(clubes, lista) {
  const r = {};
  Object.keys(clubes || {}).forEach(id => {
    const c = clubes[id] || {};
    const igual = Object.keys(lista).find(k => c.nomeFptm && compacto(lista[k].nome) === compacto(c.nomeFptm) && (!c.assoc || lista[k].assoc === c.assoc));
    if (igual) { r[id] = igual; return; }
    const nomes = [c.nome].concat(Object.values(c.equipas || {})).filter(Boolean);
    let melhor = "", pontos = 0;
    Object.keys(lista).forEach(k => {
      const f = lista[k];
      let p = 0;
      nomes.forEach(n => {
        const q = compacto(f.nome) === compacto(n) ? 100 : palavras(f.nome).filter(x => palavras(n).includes(x)).length * 10;
        if (q > p) p = q;
      });
      if (p && /porto/i.test(f.assoc || "")) p += 1;
      if (p > pontos) { pontos = p; melhor = k; }
    });
    if (melhor) r[id] = melhor;
  });
  return r;
}

// Lê as linhas do ficheiro da FPTM (Associação / Clube / atletas por baixo) → { chave: {assoc, nome, atl:[[nome, licença]]} }
export function lerListaFptm(linhas) {
  const iCab = linhas.findIndex(l => l.some(x => normT(x) === "licenca") && l.some(x => normT(x) === "nome"));
  if (iCab < 0) throw new Error("Não encontrei as colunas Licença e Nome no ficheiro");
  const cab = linhas[iCab].map(normT);
  const col = n => cab.indexOf(n);
  const iA = col("associacao"), iC = col("clube"), iL = col("licenca"), iN = col("nome"), iCat = col("categoria");
  const chave = t => normT(t).replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 80);
  const clubes = {};
  let assoc = "", atual = null;
  linhas.slice(iCab + 1).forEach(l => {
    const v = i => (i >= 0 && l[i] != null ? String(l[i]).trim() : "");
    if (v(iA)) { assoc = v(iA); atual = null; return; }
    if (v(iC)) { const k = chave(assoc + " " + v(iC)); atual = clubes[k] = clubes[k] || { assoc, nome: v(iC), atl: [] }; return; }
    if (!atual || !v(iL) || !v(iN)) return;
    if (iCat >= 0 && normT(v(iCat)) !== "jogador") return;          // só jogadores
    if (atual.atl.some(a => a[1] === v(iL))) return;                // sem repetidos
    atual.atl.push([v(iN).toUpperCase(), v(iL).replace(/\.0$/, "")]);
  });
  Object.keys(clubes).forEach(k => { if (!clubes[k].atl.length) delete clubes[k]; else clubes[k].atl.sort((a, b) => a[0].localeCompare(b[0], "pt")); });
  return clubes;
}

/* ---------- Passos 2 e 3: clubes e atletas ---------- */
function passoClube(b, lado) {
  const c = b[lado], letras = lado === "casa" ? LET_C : LET_V;
  const titulo = lado === "casa" ? "Clube visitado (joga em casa)" : "Clube visitante";
  const opcoes = api.listaClubes()
    .map(x => '<option value="' + x.id + '"' + (x.id === c.clubeId ? " selected" : "") + ">" + esc(x.nome) + "</option>").join("");
  const lista = c.clubeId ? api.atletas(c.clubeId) : null;   // atletas do clube (da lista da FPTM)
  let linhas = "";
  c.atl.forEach((a, i) => {
    let campoNome;
    if (lista && lista.length) {
      // lista de atletas do clube (FPTM); a última opção deixa escrever ou corrigir o nome
      const j = lista.findIndex(x => x[0] === a.n);
      campoNome = '<select class="bol-atl" onchange="bolAtleta(\'' + lado + '\',' + i + ',this.value)">' +
        '<option value=""' + (a.n ? "" : " selected") + ">— escolher atleta —</option>" +
        (a.n && j < 0 ? '<option value="x" selected>' + esc(a.n) + "</option>" : "") +
        // atletas já escolhidos noutra linha desta equipa ficam desativados
        lista.map((x, k) => {
          const usado = k !== j && c.atl.some((o, oi) => oi !== i && o.n === x[0]);
          return '<option value="' + k + '"' + (k === j ? " selected" : "") + (usado ? " disabled" : "") + ">" + esc(x[0]) + (usado ? " (já escolhido)" : "") + "</option>";
        }).join("") +
        '<option value="__editar">✎ Escrever / corrigir nome…</option></select>' +
        '<input type="hidden" id="t_n' + i + '" value="' + esc(a.n) + '">';
    } else campoNome = '<input id="t_n' + i + '" value="' + esc(a.n) + '" placeholder="Nome do atleta">';
    linhas += "<tr><td class=\"bol-let\">" + (letras[i] ? letras[i] + " -" : "") + "</td><td>" + campoNome + "</td>" +
      '<td><input id="t_l' + i + '" value="' + esc(a.l) + '" placeholder="Licença" inputmode="numeric" class="bol-lic"></td></tr>';
  });
  const fptmLinha = c.clubeId && !(lista && lista.length)
    ? '<div class="aviso">Este clube ainda não tem atletas: importa a lista da FPTM no controlo (Definições), ou escreve os nomes.</div>' : "";
  const voltar = lado === "casa" ? "cab" : "casa", seguir = lado === "casa" ? "vis" : "jogos";
  return '<div class="bol-cartao"><div class="bol-sub">' + titulo + "</div>" +
    '<select id="t_clube" onchange="bolClube(\'' + lado + '\', this.value)"><option value="">Escolher clube…</option>' + opcoes + "</select>" +
    fptmLinha +
    '<table class="bol-tab"><tr><th></th><th>Atletas</th><th>Licenças</th></tr>' + linhas + "</table>" +
    '<div class="aviso">Os 3 primeiros jogam os individuais (' + letras.slice(0, 3).join(", ") + '). Os outros dois são suplentes e podem jogar os pares.</div></div>' +
    '<div class="bol-nav"><button class="bol-sec" onclick="bolPasso(\'' + voltar + '\')">‹ Voltar</button>' +
    '<button class="bol-pri" onclick="bolConfirmarClube(\'' + lado + '\', \'' + seguir + '\')">Confirmar e avançar ›</button></div>';
}

// Escolha do clube (os atletas vêm depois, da lista da FPTM ou escritos à mão)
window.bolClube = function (lado, id) {
  guardarCampos();
  const nome = api.clube(id)?.nome || "";
  mudar(b => { b[lado].clubeId = id; b[lado].nome = nome; });
  desenhar();
};

// Escolha de um atleta da lista: preenche o nome e a licença (a licença continua editável)
window.bolAtleta = function (lado, i, v) {
  guardarCampos();
  const b = bol(), c = b[lado], lista = api.atletas(c.clubeId);
  let n = c.atl[i].n, l = c.atl[i].l;
  if (v === "__editar") {
    const t = prompt("Nome do atleta:", n);
    if (t === null) { desenhar(); return; }
    n = t.trim().toUpperCase();
  } else if (v === "") { n = ""; l = ""; }
  else if (lista[Number(v)]) { n = lista[Number(v)][0]; l = lista[Number(v)][1]; }
  if (n && c.atl.some((o, oi) => oi !== i && o.n === n)) { alert("Esse atleta já está escolhido nesta equipa."); desenhar(); return; }
  mudar(b => { b[lado].atl[i] = { n, l }; });
  desenhar();
};

window.bolConfirmarClube = function (lado, seguir) {
  guardarCampos();
  const b = bol(), c = b[lado];
  if (!c.clubeId) { alert("Escolhe o clube."); return; }
  if (c.atl.slice(0, 3).some(a => !a.n)) { alert("Preenche pelo menos os 3 primeiros atletas."); return; }
  const nomes = c.atl.map(a => a.n.trim().toUpperCase()).filter(Boolean);
  if (new Set(nomes).size !== nomes.length) { alert("Há um atleta repetido nesta equipa."); return; }
  const lics = c.atl.map(a => a.l.trim()).filter(Boolean);
  if (new Set(lics).size !== lics.length) { alert("Há uma licença repetida nesta equipa."); return; }
  mudar(b => { b[lado].ok = true; });   // equipa confirmada (a partir daqui, voltar atrás pede código)
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
  // listas do par: o atleta já escolhido no outro lugar do mesmo par não aparece disponível
  const opc = (lado, sel, outro) => '<option value="-1">—</option>' + b[lado].atl.map((a, i) => a.n ? '<option value="' + i + '"' + (i === sel ? " selected" : "") + (i === outro ? " disabled" : "") + ">" + esc(a.n) + "</option>" : "").join("");
  let linhas = "";
  ORDEM.forEach((o, g) => {
    const jogo = b.jogos[g], n = nomesJogo(b, g);
    const ativo = b.atual === g, fora = !jogo.venc && !ativo && (decidido(b) || g !== prox);
    let nomes;
    if (o.par) {
      const trancado = parComecado(b, s) && !podeEditar() ? " disabled" : "";
      // casa à esquerda (um por baixo do outro), visitante à direita
      nomes = '<div class="bol-par"><select class="c0"' + trancado + ' onchange="bolPar(\'casa\',0,this.value)">' + opc("casa", b.par.casa[0], b.par.casa[1]) + "</select>" +
        '<select class="c1"' + trancado + ' onchange="bolPar(\'casa\',1,this.value)">' + opc("casa", b.par.casa[1], b.par.casa[0]) + "</select>" +
        '<span>vs</span><select class="v0"' + trancado + ' onchange="bolPar(\'vis\',0,this.value)">' + opc("vis", b.par.vis[0], b.par.vis[1]) + "</select>" +
        '<select class="v1"' + trancado + ' onchange="bolPar(\'vis\',1,this.value)">' + opc("vis", b.par.vis[1], b.par.vis[0]) + "</select></div>";
    } else nomes = esc(juntar(n.casa)) + " <span class=\"bol-vs\">vs</span> " + esc(juntar(n.vis));
    let sets = "";
    for (let k = 0; k < 5; k++) {
      const x = jogo.sets[k];
      const val = x ? x[0] + "-" + x[1] : "";
      const aoVivo = ativo && k === jogo.sets.length ? ' placeholder="' + (s.a.pontos || 0) + "-" + (s.b.pontos || 0) + '" class="vivo"' : "";
      sets += '<td><input value="' + val + '"' + aoVivo + (podeEditar() ? "" : " readonly") + ' onchange="bolSet(' + g + "," + k + ',this.value)" inputmode="numeric"></td>';
    }
    const venc = jogo.venc ? esc(b[jogo.venc].nome) : (ativo ? "<i>a jogar</i>" : "");   // vencedor = nome do clube
    linhas += '<tr class="' + (ativo ? "atual" : fora ? "fora" : "") + '"><td class="bol-let">' + o.et + "</td><td>" + nomes + "</td>" + sets +
      '<td class="bol-venc">' + venc + "</td></tr>";
  });
  let acao = "";
  if (decidido(b)) acao = '<div class="bol-res">Resultado final: <b>' + w.casa + " - " + w.vis + "</b> a favor de <b>" + esc(w.casa > w.vis ? b.casa.nome : b.vis.nome) + "</b></div>";
  else if (b.atual < 0 && prox >= 0) acao = '<button class="bol-pri" onclick="bolComecar(' + prox + ')">▶ Começar jogo ' + (prox + 1) + " (" + ORDEM[prox].et + ")</button>";
  else if (b.atual >= 0) acao = '<div class="aviso">Jogo ' + (b.atual + 1) + " em curso — cada set que fecha no marcador fica registado aqui.</div>";
  // formações das duas equipas (com licenças), por cima da tabela dos jogos
  const formacao = (lado, titulo) => {
    const letras = lado === "casa" ? LET_C : LET_V;
    return '<div class="bol-form"><div class="bol-form-tit">' + titulo + ": <b>" + esc(b[lado].nome) + "</b></div>" +
      '<table class="bol-tab"><tr><th></th><th>Atletas</th><th>Licenças</th></tr>' +
      b[lado].atl.map((a, i) => a.n || a.l ? "<tr><td class=\"bol-let\">" + (letras[i] ? letras[i] + " -" : "") + "</td><td>" + esc(a.n) + "</td><td>" + esc(a.l) + "</td></tr>" : "").join("") +
      "</table></div>";
  };
  return '<div class="bol-cartao"><div class="bol-formacoes">' + formacao("casa", "Clube visitado") + formacao("vis", "Clube visitante") + "</div></div>" +
    '<div class="bol-cartao"><div class="bol-sub">' + esc(b.casa.nome) + " " + w.casa + " - " + w.vis + " " + esc(b.vis.nome) + "</div>" +
    '<div class="bol-scroll"><table class="bol-tab bol-jogos"><tr><th></th><th>Jogos</th><th>1º</th><th>2º</th><th>3º</th><th>4º</th><th>5º</th><th>Vencedores</th></tr>' + linhas + "</table></div>" +
    acao + '<div class="bol-editar">' + (podeEditar()
      ? (edicaoLivre ? '<button class="bol-sec" onclick="bolEditar()">🔓 Terminar edição</button>' : "") +
        '<span class="aviso">Edição aberta: escreve no quadrado o resultado do set (ex.: 11-9) ou muda os atletas do par.</span>'
      : '<button class="bol-sec" onclick="bolEditar()">🔒 Editar resultados</button><span class="aviso">Os sets ficam registados sozinhos. Para corrigir é preciso o código do boletim.</span>') +
    "</div></div>" +
    '<div class="bol-nav"><button class="bol-sec" onclick="bolPasso(\'vis\')">‹ Equipas</button>' +
    '<button class="bol-sec" onclick="fecharBoletim()">Marcador</button>' +
    '<button class="bol-pri" onclick="bolPasso(\'assinar\')"' + (podeAssinar(b) ? "" : " disabled") + '>✍ Assinar ›</button></div>' +
    (podeAssinar(b) ? "" : '<div class="aviso" style="margin:0 8px">O Assinar fica disponível quando uma equipa chegar às ' + JOGOS_PARA_GANHAR + " vitórias.</div>");
}

window.bolPar = function (lado, i, v) {
  if (bloqueado(bol()) || (parComecado(bol(), api.estado()) && !podeEditar())) { desenhar(); return; }
  if (Number(v) >= 0 && bol().par[lado][1 - i] === Number(v)) { alert("Esse atleta já está no par."); desenhar(); return; }
  mudar((b, s) => {
    b.par[lado][i] = Number(v);
    if (b.atual === 3) { const n = nomesJogo(b, 3); s.a.atleta = juntar(n.casa); s.b.atleta = juntar(n.vis); }
  });
  desenhar();
};

window.bolComecar = function (g) {
  if (bloqueado(bol())) return;
  if (ORDEM[g].par) { const b = bol(); if ([...b.par.casa, ...b.par.vis].some(x => x < 0)) { alert("Escolhe primeiro os 2 atletas de cada equipa para o par."); return; } }
  const s = api.estado();
  window.fecharBoletim();   // volta ao marcador
  // no fim de um jogo faz o mesmo que o "Novo jogo" do marcador (pede Esconder primeiro, se faltar)
  if (s.fimJogo) { window.acao("novoJogo"); return; }
  mudar((b, s) => iniciarJogo(s, g), true);
};

// Correção manual de um set ("11-9"; vazio apaga)
window.bolSet = function (g, k, txt) {
  if (bloqueado(bol()) || !podeEditar()) { desenhar(); return; }
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
  const a = b.assin, w = vitorias(b), fechado = bloqueado(b);
  const prot = (lado, val) => fechado
    ? '<div class="bol-prot">Declara protestar o jogo? <b>' + (val === "sim" ? "Sim" : "Não") + "</b></div>"
    : '<div class="bol-prot">Declara protestar o jogo? ' +
      '<button class="' + (val === "sim" ? "sel" : "") + '" onclick="bolProt(\'' + lado + '\',\'sim\')">Sim</button>' +
      '<button class="' + (val === "nao" ? "sel" : "") + '" onclick="bolProt(\'' + lado + '\',\'nao\')">Não</button></div>';
  const pad = (id, rot, nomeId, nome) => fechado
    ? '<div class="bol-ass"><div class="bol-ass-rot">' + rot + (nome ? ": <b>" + esc(nome) + "</b>" : "") + "</div>" +
      (assinaturas[id] ? '<img class="bol-ass-img" src="' + assinaturas[id] + '">' : "") +
      "</div>"
    : '<div class="bol-ass"><div class="bol-ass-rot">' + rot + "</div>" +
      '<canvas id="pad_' + id + '" width="600" height="180"></canvas>' +
      '<button class="bol-limpar" onclick="bolLimpar(\'' + id + '\')">Limpar assinatura</button></div>';
  return (decidido(b) ? "" : '<div class="aviso bol-alerta">Atenção: o encontro ainda não está decidido (' + w.casa + " - " + w.vis + ").</div>") +
    (fechado ? '<div class="bol-ok" style="margin:8px">✔ Boletim submetido — já não pode ser alterado.</div>'
             : '<div class="aviso" style="margin:8px">Ao carregar em Gerar PDF, o boletim é submetido (equipas, resultados e assinaturas) e já não pode ser alterado.</div>') +
    '<div class="bol-assinaturas"><div class="bol-cartao"><div class="bol-sub">Clube visitado: ' + esc(b.casa.nome) + "</div>" + prot("Casa", a.protCasa) +
    pad("casa", "Delegado ou Capitão", "a_nomeCasa", a.nomeCasa) + "</div>" +
    '<div class="bol-cartao"><div class="bol-sub">Clube visitante: ' + esc(b.vis.nome) + "</div>" + prot("Vis", a.protVis) +
    pad("vis", "Delegado ou Capitão", "a_nomeVis", a.nomeVis) + "</div>" +
    '<div class="bol-cartao bol-arb">' + pad("arb", "Árbitro", "a_nomeArb", a.nomeArb) +
    (fechado ? '<div class="bol-ass-rot">Hora de fim: <b>' + esc(b.cab.fim) + "</b></div>" : campo("a_fim", "Hora de fim", b.cab.fim || horaAgora(), "time")) + "</div></div>" +
    '<div class="bol-nav">' + (fechado ? '<button class="bol-sec" onclick="bolReabrir()">🔒 ‹ Jogos</button>' : '<button class="bol-sec" onclick="bolPasso(\'jogos\')">‹ Jogos</button>') +
    '<button class="bol-pri" id="bolBtPDF" onclick="bolPDF()">📄 Gerar PDF</button></div>';
}

// Boletim já submetido: voltar aos jogos só com o código (reabre o boletim; as assinaturas ficam)
window.bolReabrir = async function () {
  if (!(await pedirCodigo())) return;
  mudar(b => { b.assin.subCasa = false; b.assin.subVis = false; b.assin.subArb = false; b.passo = "jogos"; }, false);
  desenhar(); $("bolPainel").scrollTop = 0;
};

window.bolProt = function (lado, v) { if (bloqueado(bol())) return; guardarCampos(); mudar(b => { b.assin["prot" + lado] = v; }); desenhar(); };
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
    const c = $("pad_" + id); if (!c) return;
    const x = c.getContext("2d");
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
  let b = bol();
  if (!bloqueado(b)) {
    if (!b.assin.protCasa || !b.assin.protVis) { alert("Falta indicar se cada clube declara protestar o jogo (Sim ou Não)."); return; }
    if (!assinaturas.casa || !assinaturas.vis) { alert("Faltam as assinaturas dos delegados ou capitães dos dois clubes."); return; }
    const semArb = !assinaturas.arb ? "\n\n(Sem assinatura do árbitro.)" : "";
    if (!confirm("Gerar o PDF submete o boletim: equipas, resultados e assinaturas deixam de poder ser alterados. Continuar?" + semArb)) return;
    mudar(x => { if (!x.cab.fim) x.cab.fim = horaAgora(); x.assin.subCasa = true; x.assin.subVis = true; x.assin.subArb = true; }, false);
    desenhar();
    b = bol();
  }
  const w = vitorias(b);
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
    // letras dos suplentes (D, E e V, W): o modelo só traz A-C e X-Z impressas; mesmas letra e posição das de cima
    [3, 4].forEach(i => {
      const base = H - (P["casaNome" + i][1] + 2.8);
      pg.drawText(LET_C[i] + " -", { x: 135.6, y: base, size: 8.8, font: fB });
      pg.drawText(LET_V[i] + "  -", { x: 365.2, y: base, size: 8.8, font: fB });
    });

    ORDEM.forEach((o, g) => {
      const jogo = b.jogos[g], n0 = nomesJogo(b, g);
      const n = { casa: n0.casa.map(curto), vis: n0.vis.map(curto) };   // na grelha dos jogos só primeiro e último nome
      if (o.par) {
        escrever("j3nome", [n.casa[0], n.vis[0]].filter(Boolean).join(" - "), 8, 220);
        escrever("j3nome2", [n.casa[1], n.vis[1]].filter(Boolean).join(" - "), 8, 220);
      } else if ((n.casa[0] || n.vis[0]) && (g < 4 || jogo.sets.length || jogo.venc || !decidido(b)))
        // os jogos depois do par só se preenchem se ainda não houver vencedor do encontro
        escrever("j" + g + "nome", n.casa[0] + " - " + n.vis[0], 8, 220);
      jogo.sets.slice(0, 5).forEach((x, k) => escrever("j" + g + "s" + k, x[0] + " - " + x[1], 7.5, 26, 0, false));
      if (jogo.venc) escrever("j" + g + "venc", b[jogo.venc].nome, 7.5, 95);   // vencedor = nome do clube
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
    await assinar("delegCasa", assinaturas.casa, a.nomeCasa, 100);
    await assinar("delegVis", assinaturas.vis, a.nomeVis, 100);
    await assinar("arbitro", assinaturas.arb, a.nomeArb, 120);

    const nomeFicheiro = ("Boletim " + (b.casa.nome || "") + " vs " + (b.vis.nome || "") + " " + (c.data || "")).replace(/[\\/:*?"<>|.]+/g, " ").replace(/\s+/g, "_") + ".pdf";
    const blob = new Blob([await pdf.save()], { type: "application/pdf" });
    const l = document.createElement("a"); l.href = URL.createObjectURL(blob); l.download = nomeFicheiro;
    document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(l.href), 10000);
  } catch (e) {
    alert("Não foi possível gerar o PDF: " + (e && e.message ? e.message : e));
  } finally {
    if (botao) { botao.disabled = false; botao.textContent = "📄 Gerar PDF"; }
  }
};

/* ------------------------------------------------------------------ */
// Código guardado como resumo (SHA-256), não em texto
export async function resumo(t) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("marcador:" + t));
  return [...new Uint8Array(d)].map(x => x.toString(16).padStart(2, "0")).join("");
}

export function instalarBoletim(funcoes) {
  api = funcoes;
  api.lerAssinaturas().then(a => { assinaturas = a || {}; });
}
