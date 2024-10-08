console.log('Flappy Bird [ProjectDev]');

let frames = 0;
const somHit = new Audio();
somHit.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height)

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
          );
    },
};

function criaChao() {
  const chao = {
      spriteX: 0,
      spriteY: 610,
      largura: 224,
      altura: 112,
      x: 0,
      y: canvas.height - 112,
      atualiza() {
        const movimentoDoChao = 1;
        const repete = chao.largura / 2;
        const movimentacao = chao.x - movimentoDoChao;
        chao.x = movimentacao % repete;
      },
      desenha() {
        contexto.drawImage(
          sprites,
          chao.spriteX, chao.spriteY,
          chao.largura, chao.altura,
          chao.x, chao.y,
          chao.largura, chao.altura,
        );
        contexto.drawImage(
          sprites,
          chao.spriteX, chao.spriteY,
          chao.largura, chao.altura,
          (chao.x + chao.largura), chao.y,
          chao.largura, chao.altura,
        );
      },
    };
    return chao;
  };
  

  function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if(flappyBirdY >= chaoY) {
        return true;
    }

    return false;
  }

  function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 4.6,
        pula() {
            flappyBird.velocidade = - flappyBird.pulo;
        },
        gravidade: 0.25,
        velocidade: 0,
        atualiza() {
            if(fazColisao(flappyBird, globais.chao)) {
                somHit.play();

                setTimeout(() => {
                    mudaParaTela(telas.inicio);
                }, 500);
                return;
            }
    
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
          {spriteX: 0, spriteY: 0,},
          {spriteX: 0, spriteY: 26,},
          {spriteX: 0, spriteY: 52,},
          {spriteX: 0, spriteY: 26,},
        ],
        frameAtual: 0,
        atualizaFrameAtual() {
          const intervaloDeFrames = 10;
          const passouOIntervalo = frames % intervaloDeFrames === 0;
          if(passouOIntervalo) {
            const baseIncremento = 1;
            const incremento = baseIncremento + flappyBird.frameAtual;
            const baseRepeticao = flappyBird.movimentos.length;
            flappyBird.frameAtual = incremento % baseRepeticao;
          }
        },
        desenha() {
          flappyBird.atualizaFrameAtual();
          const {spriteX, spriteY} = flappyBird.movimentos[flappyBird.frameAtual];
          contexto.drawImage(
            sprites,
            spriteX, spriteY,
            flappyBird.largura, flappyBird.altura,
            flappyBird.x, flappyBird.y,
            flappyBird.largura, flappyBird.altura,
          );
        }
      }
      return flappyBird;
  }

  const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h
        );
    }
  }

  const globais = {};
  let telaAtiva = {};
  function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if(telaAtiva.inicializa) {
      telaAtiva.inicializa();
    }
  }

  function criaCanos() {
    const canos = {
      largura: 52,
      altura: 400,
      chao: {
        spriteX: 0,
        spriteY: 169,
      },
      ceu: {
        spriteX: 52,
        spriteY: 169,
      },
      espaco: 89,
      desenha() {
        
        canos.pares.forEach(function(par) {
          const yRandom = par.y;
          const espacamentoEntreCanos = 90;

          const canoCeuX = par.x;
          const canoCeuY = yRandom;

          contexto.drawImage(
            sprites,
            canos.ceu.spriteX, canos.ceu.spriteY,
            canos.largura, canos.altura,
            canoCeuX, canoCeuY,
            canos.largura, canos.altura,
          )
  
          const canoChaoX = par.x;
          const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;

          contexto.drawImage(
            sprites,
            canos.chao.spriteX, canos.chao.spriteY,
            canos.largura, canos.altura,
            canoChaoX, canoChaoY,
            canos.largura, canos.altura,
          )

          par.canoCeu = {
            x: canoCeuX,
            y: canos.altura + canoCeuY
          }
          par.canoChao = {
            x: canoChaoX,
            y: canoChaoY
          }
        })
      },

      colideComFlappyBird(par) {
        const cabecaFlappy = globais.flappyBird.y;
        const peFlappy = globais.flappyBird.y + globais.flappyBird.altura;

        if(globais.flappyBird.x >= par.x) {
          if(cabecaFlappy <= par.canoCeu.y) {
            return true;
          }
          if(peFlappy >= par.canoChao.y) {
            return true;
          }
        }
      },

      pares: [],
      atualiza() {
        const passou100Frames = frames % 100 === 0;
        if(passou100Frames) {
          canos.pares.push({
            x: canvas.width,
            y: -150 * (Math.random() + 1),
          });
        }

        canos.pares.forEach(function(par) {
          par.x = par.x - 2;

          if(canos.colideComFlappyBird(par)) {
            mudaParaTela(telas.inicio);
          }
          if(par.x + canos.largura <= 0) {
            canos.pares.shift();
          }
        });
      }
    }
    return canos;
  }

  const telas = {
    inicio: {
        inicializa() {
          globais.flappyBird = criaFlappyBird();
          globais.chao = criaChao();
          globais.canos = criaCanos();
        },
        desenha() {
          planoDeFundo.desenha();
          globais.flappyBird.desenha();
          globais.chao.desenha();
          mensagemGetReady.desenha();
        },
        click() {
          mudaParaTela(telas.jogo);
        },
        atualiza() {
        }
    }
  };

  telas.jogo = {
    desenha() {
      planoDeFundo.desenha();
      globais.canos.desenha();
      globais.chao.desenha();
      globais.flappyBird.desenha();
    },
    click() {
      globais.flappyBird.pula();
    },
    atualiza() {
      globais.canos.atualiza();
      globais.chao.atualiza();
      globais.flappyBird.atualiza();
    }
  }

  function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;
    requestAnimationFrame(loop);
  };

  window.addEventListener('click', function() {
    if(telaAtiva.click) {
        telaAtiva.click();
    }
  });

  mudaParaTela(telas.inicio);
  loop();
