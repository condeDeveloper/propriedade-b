// Uma funcao por tabela do README. Nenhum numero do README e digitado a mao.

import {
  arestasPossiveis, varrer, admiteDuasCores, admiteDuasCoresMetade,
  verticesDe, FANO,
} from './hipergrafo.js';
import {
  admiteDuasCoresPorBusca, pinturaEhValida,
  MINIMOS_CONHECIDOS, ALCANCE, COPIAS_DO_FANO,
} from './juiz.js';

/**
 * Tabela 1 — a varredura por numero de arestas, sobre 7 vertices.
 *
 * E a tabela que estabelece m(3) = 7: zero em toda contagem abaixo de sete, e
 * a primeira excecao exatamente em sete.
 */
export function tabelaPorArestas(v = 7, n = 3, ate = 7) {
  const linhas = [];
  for (let k = 1; k <= ate; k++) {
    const r = varrer(v, n, k);
    linhas.push({
      k,
      olhados: r.olhados,
      semPropriedadeB: r.semPropriedadeB,
      completou: r.completou,
    });
  }
  return linhas;
}

/**
 * Tabela 2 — os hipergrafos sem propriedade B achados, e o que eles tem em
 * comum.
 *
 * Todos deveriam ser copias do plano de Fano: 3-regulares, cada par de pontos
 * em exatamente uma aresta.
 */
export function tabelaAchados(v = 7, n = 3, k = 7) {
  const achados = [];
  varrer(v, n, k, { aoAchar: (a) => achados.push(a.slice()) });

  const todos3Regulares = achados.every((a) =>
    Array.from({ length: v }, (_, p) => a.filter((e) => (e >> p) & 1).length)
      .every((g) => g === 3)
  );
  const todoParUmaVez = achados.every((a) => {
    for (let x = 0; x < v; x++) {
      for (let y = x + 1; y < v; y++) {
        const q = a.filter((e) => ((e >> x) & 1) && ((e >> y) & 1)).length;
        if (q !== 1) return false;
      }
    }
    return true;
  });

  return {
    quantos: achados.length,
    previstos: COPIAS_DO_FANO,
    bate: achados.length === COPIAS_DO_FANO,
    todos3Regulares,
    todoParUmaVez,
  };
}

/**
 * Tabela 3 — a varredura contra o juiz, hipergrafo a hipergrafo.
 *
 * Dois algoritmos diferentes: mascara de bits de 0 a 2^v contra atribuicao com
 * volta atras. Eles tem que concordar em TODOS, nao na maioria.
 */
export function tabelaContraJuiz(v = 7, n = 3, k = 4) {
  const possiveis = arestasPossiveis(v, n);
  let olhados = 0;
  let discordancias = 0;

  const escolhidas = [];
  (function desce(inicio) {
    if (escolhidas.length === k) {
      olhados++;
      const porMascara = admiteDuasCoresMetade(escolhidas, v).admite;
      const listas = escolhidas.map(verticesDe);
      const porBusca = admiteDuasCoresPorBusca(listas, v).admite;
      if (porMascara !== porBusca) discordancias++;
      return;
    }
    for (let i = inicio; i <= possiveis.length - (k - escolhidas.length); i++) {
      escolhidas.push(possiveis[i]);
      desce(i + 1);
      escolhidas.pop();
    }
  })(0);

  return { v, n, k, olhados, discordancias, concordam: discordancias === 0 };
}

/**
 * Tabela 4 — o atalho de fixar o vertice 0 numa cor.
 *
 * Trocar as duas cores da a mesma particao, entao metade das pinturas e
 * redundante. Quanto isso corta de verdade?
 */
export function tabelaAtalhoDaCor(v = 7, n = 3, k = 5) {
  const possiveis = arestasPossiveis(v, n);
  let iguais = 0;
  let olhados = 0;
  const escolhidas = [];
  (function desce(inicio) {
    if (escolhidas.length === k) {
      olhados++;
      const cheio = admiteDuasCores(escolhidas, v).admite;
      const metade = admiteDuasCoresMetade(escolhidas, v).admite;
      if (cheio === metade) iguais++;
      return;
    }
    for (let i = inicio; i <= possiveis.length - (k - escolhidas.length); i++) {
      escolhidas.push(possiveis[i]);
      desce(i + 1);
      escolhidas.pop();
    }
  })(0);
  return { olhados, iguais, sempreIgual: iguais === olhados,
           pinturasCheio: 1 << v, pinturasMetade: 1 << (v - 1) };
}

/**
 * Tabela 5 — o caso 2-uniforme, que e grafo comum.
 *
 * Sem propriedade B, num grafo, quer dizer "nao bipartido". O menor e o
 * triangulo, com 3 arestas: m(2) = 3.
 */
export function tabelaGrafos(v = 5, ate = 4) {
  const linhas = [];
  for (let k = 1; k <= ate; k++) {
    const r = varrer(v, 2, k);
    linhas.push({ k, olhados: r.olhados, semPropriedadeB: r.semPropriedadeB });
  }
  return linhas;
}

/** Tabela 6 — o que esta varredura alcanca, e o que fica de fora. */
export function tabelaAlcance() {
  return Object.entries(MINIMOS_CONHECIDOS).map(([n, m]) => ({
    uniformidade: Number(n),
    minimoConhecido: m,
    medidoAqui: Number(n) <= ALCANCE.uniformidade,
  }));
}

/** O plano de Fano, conferido ponto a ponto. */
export function fanoConferido() {
  const graus = Array.from({ length: 7 }, (_, p) => FANO.filter((e) => (e >> p) & 1).length);
  const pares = [];
  for (let x = 0; x < 7; x++) {
    for (let y = x + 1; y < 7; y++) {
      pares.push(FANO.filter((e) => ((e >> x) & 1) && ((e >> y) & 1)).length);
    }
  }
  return {
    retas: FANO.length,
    pontosPorReta: FANO.map((e) => verticesDe(e).length),
    graus,
    todoParUmaVez: pares.every((q) => q === 1),
    admiteDuasCores: admiteDuasCores(FANO, 7).admite,
  };
}

export { pinturaEhValida, MINIMOS_CONHECIDOS, ALCANCE, COPIAS_DO_FANO };
