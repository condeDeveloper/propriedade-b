# propriedade-b

Pintar os vértices de um hipergrafo com **duas cores** sem deixar nenhuma
aresta inteira de uma cor só. Num grafo comum isso é só "ser bipartido"; em
hipergrafos `n`-uniformes — toda aresta com exatamente `n` vértices — a pergunta
fica bem mais dura, e a quantidade **mínima** de arestas de um hipergrafo que
não admite essa pintura é um número com nome:

```
m(2) = 3     o triangulo
m(3) = 7     o plano de Fano
m(4) = 23    so fechado em 2017
```

Aqui o domínio é finito e aberto inteiro: **todos** os hipergrafos 3-uniformes
sobre 7 vértices, aresta por aresta. São 8.731.847 hipergrafos.

Sem dependência nenhuma. 21 testes.

## Os quatro achados

**1. `m(3) = 7`, estabelecido por varredura e não por citação.** Dos 2.007.327
hipergrafos com até seis arestas, **nenhum** perde a propriedade B. A primeira
exceção aparece exatamente em sete arestas. "Não existe com seis" não se
demonstra com exemplo — só varrendo.

**2. Os 30 achados são exatamente as cópias rotuladas do plano de Fano.** Com
sete arestas a varredura encontra 30 hipergrafos sem a propriedade B, e 30 é
`7!/168` — o fatorial dos rótulos dividido pela ordem do grupo de automorfismos
do Fano. Todos saem **3-regulares**, com todo par de pontos em exatamente uma
aresta. O Fano é o único, a menos de renomear os pontos, e isso saiu da
contagem, não de um teorema citado.

**3. Dois algoritmos diferentes concordam em 52.360 hipergrafos, sem uma
discordância.** Um percorre as máscaras de bits de 0 a `2^v`; o outro atribui
cor a um vértice de cada vez e volta atrás. Não compartilham nem a
representação das arestas.

**4. Fixar o vértice 0 numa cor corta as pinturas de 128 para 64 e nunca muda a
resposta.** Trocar as duas cores dá a mesma partição, então metade do trabalho
é redundante — e isso foi **medido** em 324.632 hipergrafos, não deduzido.

## Como rodar

```bash
node --test testes/*.test.js
node ferramentas/medidor.js
node ferramentas/medidor.js fano
```

## As tabelas

### Hipergrafos 3-uniformes sobre 7 vértices

```
  arestas  olhados    sem propriedade B
        1       35                    0
        2      595                    0
        3     6545                    0
        4    52360                    0
        5   324632                    0
        6  1623160                    0
        7  6724520                   30
```

### O plano de Fano

```
  reta: 0 1 2
  reta: 0 3 4
  reta: 1 3 5
  reta: 2 4 5
  reta: 2 3 6
  reta: 1 4 6
  reta: 0 5 6
```

Sete pontos, sete retas, três pontos por reta, três retas por ponto, cada par
de pontos em exatamente uma reta — e nenhuma pintura de duas cores que evite
uma reta monocromática.

### O caso 2-uniforme, que é grafo comum

```
  arestas  olhados  sem propriedade B
        1       10                  0
        2       45                  0
        3      120                 10
        4      210                 70
```

Os dez primeiros são os dez triângulos de `K5`, que é `C(5,3)`. É o `m(2) = 3`.

## O que as medidas me corrigiram

**Escrevi as sete retas do plano de Fano de cabeça, e errei.** As máscaras que
digitei deixavam o par de pontos `1,3` em **duas** retas e o par `1,4` em
**nenhuma** — não era plano projetivo coisa nenhuma. O erro apareceu na primeira
conferência, antes de contaminar qualquer tabela, porque a propriedade "cada par
em exatamente uma reta" é barata de checar e eu checei.

O conserto não foi corrigir os números à mão: foi **gerar** o Fano. Os pontos
são os sete vetores não nulos de `F_2^3`, e três pontos formam reta quando
`c = a xor b`. Sete retas saem sozinhas, certas por construção. Figura conhecida
escrita de memória é chute com cara de constante, e quando dá para construir, o
certo é construir.

**E a varredura por pouco não ficou sem dizer onde parou.** `m(4) = 23` está na
tabela de mínimos conhecidos, mas esta varredura não chega nem perto dele — são
hipergrafos 4-uniformes com 23 arestas, um espaço de outra ordem de grandeza. A
tabela de alcance existe para dizer isso com todas as letras, e o teste exige
que `m(4)` apareça marcado como **não medido aqui**.

## Os arquivos

```
src/hipergrafo.js  as arestas, a pintura por mascara, a varredura, o Fano gerado
src/juiz.js        a pintura por atribuicao com volta atras, e os minimos conhecidos
src/medidas.js     uma funcao por tabela
ferramentas/medidor.js
testes/nucleo.test.js    13 testes
testes/medidas.test.js    8 testes
```

A varredura decide a pintura percorrendo máscaras de bits; o juiz decide por
busca, recebendo as arestas como listas de vértices em vez de máscaras — nem a
representação eles compartilham.
