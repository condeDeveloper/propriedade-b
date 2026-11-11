import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  arestasPossiveis, admiteDuasCores, admiteDuasCoresMetade,
  varrer, verticesDe, planoDeFano, FANO,
} from '../src/hipergrafo.js';
import {
  admiteDuasCoresPorBusca, pinturaEhValida, COPIAS_DO_FANO, MINIMOS_CONHECIDOS,
} from '../src/juiz.js';

test('quantas arestas possiveis: C(v, n), contadas e nao calculadas', () => {
  assert.equal(arestasPossiveis(7, 3).length, 35);
  assert.equal(arestasPossiveis(5, 2).length, 10);
  assert.equal(arestasPossiveis(6, 3).length, 20);
});

test('toda aresta gerada tem exatamente n vertices, e nao ha repetida', () => {
  for (const [v, n] of [[7, 3], [6, 2], [8, 4]]) {
    const todas = arestasPossiveis(v, n);
    assert.equal(new Set(todas).size, todas.length, 'ha aresta repetida');
    for (const a of todas) assert.equal(verticesDe(a).length, n);
  }
});

test('o plano de Fano e GERADO, nao digitado, e fecha', () => {
  const retas = planoDeFano();
  assert.equal(retas.length, 7);
  for (const r of retas) assert.equal(verticesDe(r).length, 3);
  // cada ponto em 3 retas
  for (let p = 0; p < 7; p++) {
    assert.equal(retas.filter((r) => (r >> p) & 1).length, 3, `ponto ${p}`);
  }
  // cada par de pontos em exatamente uma reta
  for (let x = 0; x < 7; x++) {
    for (let y = x + 1; y < 7; y++) {
      const q = retas.filter((r) => ((r >> x) & 1) && ((r >> y) & 1)).length;
      assert.equal(q, 1, `par ${x},${y}`);
    }
  }
});

test('o plano de Fano NAO admite duas cores', () => {
  assert.equal(admiteDuasCores(FANO, 7).admite, false);
  assert.equal(admiteDuasCoresMetade(FANO, 7).admite, false);
  assert.equal(admiteDuasCoresPorBusca(FANO.map(verticesDe), 7).admite, false);
});

test('o triangulo NAO admite duas cores, e o caminho admite', () => {
  const triangulo = [0b011, 0b110, 0b101];
  assert.equal(admiteDuasCores(triangulo, 3).admite, false);
  const caminho = [0b011, 0b110];
  assert.equal(admiteDuasCores(caminho, 3).admite, true);
});

test('quando a varredura diz que admite, a pintura devolvida funciona', () => {
  for (let k = 1; k <= 4; k++) {
    const possiveis = arestasPossiveis(6, 3);
    for (let i = 0; i + k <= possiveis.length; i += 37) {
      const arestas = possiveis.slice(i, i + k);
      const r = admiteDuasCores(arestas, 6);
      if (!r.admite) continue;
      const cor = Array.from({ length: 6 }, (_, x) => (r.pintura >> x) & 1);
      assert.ok(pinturaEhValida(arestas.map(verticesDe), cor),
        `a pintura devolvida nao serve: ${arestas}`);
    }
  }
});

test('o atalho de fixar o vertice 0 da sempre a mesma resposta', () => {
  const possiveis = arestasPossiveis(6, 3);
  for (let i = 0; i + 4 <= possiveis.length; i += 13) {
    const arestas = possiveis.slice(i, i + 4);
    assert.equal(
      admiteDuasCores(arestas, 6).admite,
      admiteDuasCoresMetade(arestas, 6).admite,
      `${arestas}`
    );
  }
});

test('a mascara e a busca concordam, hipergrafo a hipergrafo', () => {
  const possiveis = arestasPossiveis(6, 3);
  for (let i = 0; i + 3 <= possiveis.length; i += 7) {
    const arestas = possiveis.slice(i, i + 3);
    assert.equal(
      admiteDuasCoresMetade(arestas, 6).admite,
      admiteDuasCoresPorBusca(arestas.map(verticesDe), 6).admite,
      `${arestas}`
    );
  }
});

test('nenhum hipergrafo de ate 6 arestas sobre 7 vertices perde a propriedade B', () => {
  for (let k = 1; k <= 6; k++) {
    assert.equal(varrer(7, 3, k).semPropriedadeB, 0, `${k} arestas`);
  }
});

test('o primeiro grafo sem propriedade B tem 3 arestas: o triangulo', () => {
  assert.equal(varrer(5, 2, 1).semPropriedadeB, 0);
  assert.equal(varrer(5, 2, 2).semPropriedadeB, 0);
  // os 10 triangulos de K5
  assert.equal(varrer(5, 2, 3).semPropriedadeB, 10);
  assert.equal(MINIMOS_CONHECIDOS[2], 3);
});

test('verticesDe e a volta de uma mascara', () => {
  assert.deepEqual(verticesDe(0b1011), [0, 1, 3]);
  assert.deepEqual(verticesDe(0), []);
  for (const a of arestasPossiveis(7, 3)) {
    let m = 0;
    for (const x of verticesDe(a)) m |= 1 << x;
    assert.equal(m, a);
  }
});

test('o numero de copias rotuladas do Fano e 7!/168', () => {
  assert.equal(COPIAS_DO_FANO, 30);
  assert.equal(5040 / 168, 30);
});

test('o orcamento para a varredura e marca que ela nao completou', () => {
  const r = varrer(7, 3, 5, { orcamento: 1000 });
  assert.equal(r.completou, false);
  assert.ok(r.olhados <= 1000);
});
