// O juiz. Nao importa nada de `hipergrafo.js`.
//
// A varredura decide a pintura percorrendo mascaras de bits de 0 a 2^v. O juiz
// decide por BUSCA: atribui cor a um vertice de cada vez e volta atras quando
// uma aresta fecha monocromatica. Sao dois algoritmos diferentes para a mesma
// pergunta — e e so a concordancia deles que faz o numero valer.

/**
 * O hipergrafo admite duas cores, decidido por atribuicao com volta atras.
 *
 * As arestas chegam como listas de vertices, nao como mascaras: e de proposito,
 * para o juiz nem compartilhar a representacao com a varredura.
 */
export function admiteDuasCoresPorBusca(arestasComoListas, v) {
  const cor = new Int8Array(v).fill(-1);

  function arestaFechouMonocromatica(a) {
    const primeira = cor[a[0]];
    if (primeira === -1) return false;
    for (const x of a) {
      if (cor[x] === -1) return false; // ainda ha vertice sem cor
      if (cor[x] !== primeira) return false;
    }
    return true;
  }

  function desce(i) {
    if (i === v) return true;
    for (const c of [0, 1]) {
      cor[i] = c;
      let ruim = false;
      for (const a of arestasComoListas) {
        if (arestaFechouMonocromatica(a)) {
          ruim = true;
          break;
        }
      }
      if (!ruim && desce(i + 1)) return true;
      cor[i] = -1;
    }
    return false;
  }

  const deu = desce(0);
  return { admite: deu, cor: deu ? Array.from(cor) : null };
}

/**
 * Confere uma pintura dada: nenhuma aresta pode ficar de uma cor so.
 *
 * E a conferencia mais crua que existe, e e a que separa "o programa disse que
 * da" de "a pintura esta aqui e funciona".
 */
export function pinturaEhValida(arestasComoListas, cor) {
  for (const a of arestasComoListas) {
    const primeira = cor[a[0]];
    if (a.every((x) => cor[x] === primeira)) return false;
  }
  return true;
}

/**
 * Os minimos conhecidos. Estao aqui para DISCORDAR da varredura se ela errar,
 * nao para serem copiados para a tabela.
 *
 * m(4) = 23 so foi fechado em 2017 e esta muito alem do que esta varredura
 * alcanca: ele aparece na tabela como "nao medido aqui".
 */
export const MINIMOS_CONHECIDOS = { 2: 3, 3: 7, 4: 23 };

/** Ate onde a varredura deste repositorio chega de verdade. */
export const ALCANCE = { uniformidade: 3, vertices: 7 };

/**
 * Quantas copias rotuladas o plano de Fano tem: 7! dividido pela ordem do grupo
 * de automorfismos, que e 168.
 *
 * O numero e previsao: a varredura sobre 7 vertices tem que achar exatamente
 * essa quantidade de hipergrafos sem a propriedade B com 7 arestas.
 */
export const COPIAS_DO_FANO = 5040 / 168;
