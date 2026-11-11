// Os numeros do README, presos. Nenhum foi digitado de cabeca.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  tabelaPorArestas, tabelaAchados, tabelaContraJuiz,
  tabelaAtalhoDaCor, tabelaGrafos, tabelaAlcance, fanoConferido,
} from '../src/medidas.js';

test('a varredura por numero de arestas, linha a linha', () => {
  const esperado = [
    { k: 1, olhados: 35, sem: 0 },
    { k: 2, olhados: 595, sem: 0 },
    { k: 3, olhados: 6545, sem: 0 },
    { k: 4, olhados: 52360, sem: 0 },
    { k: 5, olhados: 324632, sem: 0 },
    { k: 6, olhados: 1623160, sem: 0 },
    { k: 7, olhados: 6724520, sem: 30 },
  ];
  const linhas = tabelaPorArestas(7, 3, 7);
  for (const e of esperado) {
    const l = linhas.find((x) => x.k === e.k);
    assert.equal(l.olhados, e.olhados, `olhados com ${e.k} arestas`);
    assert.equal(l.semPropriedadeB, e.sem, `sem propriedade B com ${e.k} arestas`);
    assert.equal(l.completou, true);
  }
});

test('o total varrido e 8.731.847, e 2.007.327 deles tem ate 6 arestas', () => {
  const linhas = tabelaPorArestas(7, 3, 7);
  const total = linhas.reduce((a, l) => a + l.olhados, 0);
  assert.equal(total, 8731847);
  const ateSeis = linhas.filter((l) => l.k <= 6).reduce((a, l) => a + l.olhados, 0);
  assert.equal(ateSeis, 2007327);
  // e nenhum desses 2 milhoes perde a propriedade B
  assert.equal(
    linhas.filter((l) => l.k <= 6).reduce((a, l) => a + l.semPropriedadeB, 0),
    0
  );
});

test('os 30 achados sao exatamente as copias rotuladas do plano de Fano', () => {
  const a = tabelaAchados(7, 3, 7);
  assert.equal(a.quantos, 30);
  assert.equal(a.previstos, 30);
  assert.equal(a.bate, true);
  assert.equal(a.todos3Regulares, true);
  assert.equal(a.todoParUmaVez, true);
});

test('o plano de Fano conferido ponto a ponto', () => {
  const f = fanoConferido();
  assert.equal(f.retas, 7);
  assert.deepEqual(f.pontosPorReta, [3, 3, 3, 3, 3, 3, 3]);
  assert.deepEqual(f.graus, [3, 3, 3, 3, 3, 3, 3]);
  assert.equal(f.todoParUmaVez, true);
  assert.equal(f.admiteDuasCores, false);
});

test('os dois algoritmos concordam em 52.360 hipergrafos, sem uma discordancia', () => {
  const r = tabelaContraJuiz(7, 3, 4);
  assert.equal(r.olhados, 52360);
  assert.equal(r.discordancias, 0);
  assert.equal(r.concordam, true);
});

test('o atalho da cor nunca muda a resposta, em 324.632 casos', () => {
  const r = tabelaAtalhoDaCor(7, 3, 5);
  assert.equal(r.olhados, 324632);
  assert.equal(r.iguais, 324632);
  assert.equal(r.sempreIgual, true);
  assert.equal(r.pinturasCheio, 128);
  assert.equal(r.pinturasMetade, 64);
});

test('nos grafos, os primeiros sem propriedade B sao os 10 triangulos de K5', () => {
  const linhas = tabelaGrafos(5, 4);
  assert.equal(linhas.find((l) => l.k === 1).semPropriedadeB, 0);
  assert.equal(linhas.find((l) => l.k === 2).semPropriedadeB, 0);
  assert.equal(linhas.find((l) => l.k === 3).semPropriedadeB, 10);
  assert.equal(linhas.find((l) => l.k === 4).semPropriedadeB, 70);
});

test('a tabela de alcance diz o que foi medido e o que nao foi', () => {
  const linhas = tabelaAlcance();
  const n3 = linhas.find((l) => l.uniformidade === 3);
  assert.equal(n3.minimoConhecido, 7);
  assert.equal(n3.medidoAqui, true);
  const n4 = linhas.find((l) => l.uniformidade === 4);
  assert.equal(n4.minimoConhecido, 23);
  assert.equal(n4.medidoAqui, false, 'm(4) NAO e medido aqui');
});
