# Marcador — diretos de ténis de mesa (C. D. C. Navais)

Dados na Firebase (projeto `marcador-ded9b`, Realtime Database):

- `marcador/estado` e `marcador/logos` — marcador em tempo real (leitura pública: direto e sala)
- `marcador/config`, `marcador/assinaturas` — códigos, assinaturas do boletim (só a conta de quem marca)
- `clubes/<id>` — lista única de clubes: nome, emblema, atletas da FPTM (nome + licença) e equipas (A, B…) (só a conta de quem marca)

A lista de atletas da FPTM tem dados pessoais: nunca vai para este repositório.

| Ficheiro | Para quê |
|---|---|
| `index.html` | Marcador do direto (widget Web do PRISM): https://mifalheiro.github.io/marcador/ — `?teste` = fundo verde |
| `controlo.html` | Controlo de quem marca (entrada com email/palavra-passe da Firebase) |
| `duelo.html` | Duelo dos clubes (segundo widget do direto; aparece com o botão ⚔ Duelo do controlo; `?teste` = fundo verde + toque) |
| `sala.html` | Ecrã da sala (tablet/TV); segue o "Trocar lados" |
| `boletim.js` + `boletim-fundo.jpg` | Boletim de jogo ATMP (Swaythling Modificado) dentro do controlo: cabeçalho, equipas, jogos, assinaturas e PDF |
| `firebase-config.js` | Ligação ao projeto Firebase |

