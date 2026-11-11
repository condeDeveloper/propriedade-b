#!/usr/bin/env node
// Roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js
//   node ferramentas/medidor.js arestas

import {
  tabelaPorArestas, tabelaAchados, tabelaContraJuiz,
  tabelaAtalhoDaCor, tabelaGrafos, tabelaAlcance, fanoConferido,
} from '../src/medidas.js';
import { verticesDe, FANO } from '../src/hipergrafo.js';
import { COPIAS_DO_FANO } from '../src/juiz.js';

const tabelas = {
  arestas() {
    console.log('Hipergrafos 3-uniformes sobre 7 vertices, por numero de arestas');
    console.log('---------------------------------------------------------------');
    console.log('  arestas  olhados    sem propriedade B');
    let total = 0;
    for (const l of tabelaPorArestas(7, 3, 7)) {
      console.log('  %s  %s  %s',
        String(l.k).padStart(7), String(l.olhados).padStart(9),
        String(l.semPropriedadeB).padStart(17));
      total += l.olhados;
    }
    console.log();
    console.log('  %d hipergrafos varridos ao todo.', total);
    console.log('  zero em toda contagem abaixo de 7, e a primeira excecao');
    console.log('  exatamente em 7: e isto que estabelece m(3) = 7.');
  },

  fano() {
    console.log('O plano de Fano, conferido ponto a ponto');
    console.log('----------------------------------------');
    const f = fanoConferido();
    console.log('  retas: %d', f.retas);
    console.log('  pontos por reta: %s', f.pontosPorReta.join(', '));
    console.log('  grau de cada ponto: %s', f.graus.join(', '));
    console.log('  cada par de pontos em exatamente uma reta: %s', f.todoParUmaVez);
    console.log('  admite duas cores: %s', f.admiteDuasCores);
    console.log();
    for (const r of FANO) console.log('    reta: %s', verticesDe(r).join(' '));
  },

  achados() {
    console.log('Os hipergrafos sem propriedade B que a varredura achou');
    console.log('------------------------------------------------------');
    const a = tabelaAchados(7, 3, 7);
    console.log('  achados: %d', a.quantos);
    console.log('  previstos (7! / 168): %d', a.previstos);
    console.log('  bate: %s', a.bate);
    console.log('  todos 3-regulares: %s', a.todos3Regulares);
    console.log('  todo par de pontos em exatamente uma aresta: %s', a.todoParUmaVez);
    console.log();
    console.log('  168 e a ordem do grupo de automorfismos do plano de Fano,');
    console.log('  entao 7!/168 = %d e o numero de copias ROTULADAS dele.', COPIAS_DO_FANO);
    console.log('  achar exatamente esse numero diz que o Fano e o unico, a');
    console.log('  menos de renomear os pontos.');
  },

  juiz() {
    console.log('A varredura contra o juiz');
    console.log('--------------------------');
    console.log('  mascara de bits de 0 a 2^v contra atribuicao com volta atras');
    const r = tabelaContraJuiz(7, 3, 4);
    console.log('  %d hipergrafos de 4 arestas, %d discordancias -> %s',
      r.olhados, r.discordancias, r.concordam ? 'concordam' : 'HA DISCORDANCIA');
  },

  atalho() {
    console.log('O atalho de fixar o vertice 0 numa cor');
    console.log('---------------------------------------');
    console.log('  trocar as duas cores da a mesma particao, entao metade das');
    console.log('  pinturas e redundante.');
    const r = tabelaAtalhoDaCor(7, 3, 5);
    console.log('  %d hipergrafos de 5 arestas', r.olhados);
    console.log('  resposta igual em todos: %s', r.sempreIgual);
    console.log('  pinturas olhadas: %d sem o atalho, %d com',
      r.pinturasCheio, r.pinturasMetade);
  },

  grafos() {
    console.log('O caso 2-uniforme: grafo comum, sobre 5 vertices');
    console.log('-------------------------------------------------');
    console.log('  sem propriedade B, num grafo, quer dizer "nao bipartido"');
    console.log('  arestas  olhados  sem propriedade B');
    for (const l of tabelaGrafos(5, 4)) {
      console.log('  %s  %s  %s',
        String(l.k).padStart(7), String(l.olhados).padStart(7),
        String(l.semPropriedadeB).padStart(17));
    }
    console.log();
    console.log('  os 10 primeiros sao os 10 triangulos de K5: m(2) = 3.');
  },

  alcance() {
    console.log('O que esta varredura alcanca');
    console.log('-----------------------------');
    console.log('  uniformidade  minimo conhecido  medido aqui');
    for (const l of tabelaAlcance()) {
      console.log('  %s  %s  %s',
        String(l.uniformidade).padStart(12), String(l.minimoConhecido).padStart(16),
        String(l.medidoAqui).padStart(11));
    }
    console.log();
    console.log('  m(4) = 23 so foi fechado em 2017 e esta muito alem daqui.');
  },
};

const pedida = process.argv[2];
const nomes = pedida ? [pedida] : Object.keys(tabelas);
for (const nome of nomes) {
  if (!tabelas[nome]) {
    console.error('tabela desconhecida: %s', nome);
    console.error('conhecidas: %s', Object.keys(tabelas).join(', '));
    process.exit(1);
  }
  tabelas[nome]();
  console.log();
}
