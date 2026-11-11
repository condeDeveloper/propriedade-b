// Propriedade B: pintar os vertices de DUAS cores sem deixar nenhuma aresta
// inteira de uma cor so.
//
// Num grafo comum (arestas de 2 vertices) isso e so "ser bipartido". Em
// hipergrafos n-uniformes — toda aresta com exatamente n vertices — a pergunta
// fica bem mais dura, e a quantidade MINIMA de arestas de um hipergrafo que
// NAO admite essa pintura e um numero famoso:
//
//     m(2) = 3    o triangulo
//     m(3) = 7    o plano de Fano
//     m(4) = 23   so fechado em 2017
//
// Aqui o dominio e finito e aberto inteiro: todos os hipergrafos 3-uniformes
// sobre 7 vertices, aresta por aresta.

/** As C(v, n) arestas possiveis, cada uma uma mascara de bits. */
export function arestasPossiveis(v, n) {
  const saida = [];
  const atual = [];
  (function desce(inicio) {
    if (atual.length === n) {
      let m = 0;
      for (const x of atual) m |= 1 << x;
      saida.push(m);
      return;
    }
    for (let x = inicio; x < v; x++) {
      atual.push(x);
      desce(x + 1);
      atual.pop();
    }
  })(0);
  return saida;
}

/**
 * O hipergrafo admite duas cores?
 *
 * Percorre as 2^v pinturas possiveis e para na primeira que funciona. A
 * pintura e uma mascara: bit 1 = cor A, bit 0 = cor B. Uma aresta fica
 * monocromatica quando `aresta & pintura` e 0 (toda em B) ou e a propria
 * aresta (toda em A).
 */
export function admiteDuasCores(arestas, v) {
  const total = 1 << v;
  for (let pintura = 0; pintura < total; pintura++) {
    let ok = true;
    for (const a of arestas) {
      const dentro = a & pintura;
      if (dentro === 0 || dentro === a) {
        ok = false;
        break;
      }
    }
    if (ok) return { admite: true, pintura };
  }
  return { admite: false, pintura: -1 };
}

/**
 * Metade das pinturas e redundante: trocar as duas cores da a mesma particao.
 * Fixar o vertice 0 numa cor corta o trabalho pela metade sem perder resposta.
 */
export function admiteDuasCoresMetade(arestas, v) {
  const total = 1 << (v - 1);
  for (let resto = 0; resto < total; resto++) {
    const pintura = (resto << 1) | 1; // o vertice 0 sempre na cor A
    let ok = true;
    for (const a of arestas) {
      const dentro = a & pintura;
      if (dentro === 0 || dentro === a) {
        ok = false;
        break;
      }
    }
    if (ok) return { admite: true, pintura };
  }
  return { admite: false, pintura: -1 };
}

/**
 * Varre TODOS os hipergrafos n-uniformes de `k` arestas sobre `v` vertices.
 *
 * @param {object} opcoes
 *   - `aoAchar`: chamada com a lista de arestas de cada hipergrafo SEM a
 *     propriedade B
 *   - `orcamento`: teto de combinacoes olhadas
 */
export function varrer(v, n, k, opcoes = {}) {
  const { aoAchar = null, orcamento = Infinity } = opcoes;
  const possiveis = arestasPossiveis(v, n);

  let olhados = 0;
  let semPropriedadeB = 0;
  let estourou = false;
  const escolhidas = [];

  function desce(inicio) {
    if (estourou) return;
    if (escolhidas.length === k) {
      olhados++;
      if (olhados >= orcamento) {
        estourou = true;
        return;
      }
      if (!admiteDuasCoresMetade(escolhidas, v).admite) {
        semPropriedadeB++;
        if (aoAchar) aoAchar(escolhidas.slice());
      }
      return;
    }
    // nao adianta comecar se nao sobram arestas suficientes
    for (let i = inicio; i <= possiveis.length - (k - escolhidas.length); i++) {
      escolhidas.push(possiveis[i]);
      desce(i + 1);
      escolhidas.pop();
      if (estourou) return;
    }
  }

  desce(0);
  return { v, n, k, olhados, semPropriedadeB, completou: !estourou };
}

/** Os vertices que uma mascara de aresta contem. */
export function verticesDe(mascara) {
  const saida = [];
  for (let x = 0; mascara; x++, mascara >>= 1) if (mascara & 1) saida.push(x);
  return saida;
}

/**
 * O plano de Fano, GERADO e nao digitado.
 *
 * Eu escrevi as sete retas de cabeca na primeira versao e errei: um par de
 * pontos caiu em duas retas e outro em nenhuma. Figura conhecida escrita de
 * memoria e chute com cara de constante — e aqui dava para checar, entao
 * checar e o certo.
 *
 * A construcao: os pontos sao os 7 vetores nao nulos de F_2^3, e tres pontos
 * formam reta quando somam zero, isto e, quando `c = a xor b`. Cada reta sai
 * tres vezes dessa conta, por isso o conjunto.
 */
export function planoDeFano() {
  const retas = new Set();
  for (let a = 1; a < 8; a++) {
    for (let b = a + 1; b < 8; b++) {
      const c = a ^ b;
      if (c === 0 || c === a || c === b) continue;
      // ponto p (1..7) vira o indice p-1
      const mascara = (1 << (a - 1)) | (1 << (b - 1)) | (1 << (c - 1));
      retas.add(mascara);
    }
  }
  return [...retas].sort((x, y) => x - y);
}

export const FANO = planoDeFano();
