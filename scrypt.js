const canvas = document.getElementById("jogoCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 600;

// Esconde o canvas até o jogo iniciar
canvas.style.display = "none";

let jogoAtivo = false;
let pontuacao = 0;
let carro, obstaculos, faixaY, teclado;
let velocidadeObstaculos = 5;
let velocidadeFaixa = 5;
let intervaloObstaculos = 0;
let pontosParaAumentoVelocidade = 20;

function iniciarJogo(dificuldade) {
    console.log("iniciarJogo chamado com dificuldade:", dificuldade);
    document.getElementById("menu").style.display = "none";
    document.getElementById("gameOver").style.display = "none";
    canvas.style.display = "block";

    jogoAtivo = true;
    pontuacao = 0;
    intervaloObstaculos = 0;
    pontosParaAumentoVelocidade = 20;

    if (dificuldade === "facil") velocidadeObstaculos = 4;
    else if (dificuldade === "medio") velocidadeObstaculos = 6;
    else if (dificuldade === "dificil") velocidadeObstaculos = 8;
    else velocidadeObstaculos = 5; // padrão

    velocidadeFaixa = velocidadeObstaculos;

    carro = {
        x: canvas.width / 2 - 25,
        y: canvas.height - 120,
        largura: 50,
        altura: 90,
        velocidade: 6,
        cor: "#00f"
    };

    obstaculos = [];
    faixaY = 0;
    teclado = {};

    // Começa o loop
    requestAnimationFrame(atualizarJogo);
}

function atualizarJogo() {
    if (!jogoAtivo) {
        console.log("jogoAtivo == false, saindo do loop");
        return;
    }
    // limpeza e desenho
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharEstrada();
    desenharCarro();
    moverCarro();
    desenharObstaculos();
    moverObstaculos();
    detectarColisao();
    atualizarPontuacao();

    if (intervaloObstaculos % 100 === 0) {
        gerarObstaculo();
    }
    intervaloObstaculos++;

    if (pontuacao >= pontosParaAumentoVelocidade) {
        velocidadeObstaculos += 0.3;
        pontosParaAumentoVelocidade += 20;
        console.log("Aumentando velocidade para", velocidadeObstaculos);
    }

    requestAnimationFrame(atualizarJogo);
}

// ... as demais funções permanecem como você já tinha (desenharEstrada, desenharCarro, etc.)

window.addEventListener("keydown", e => {
    teclado[e.key] = true;
    // console.log("keydown:", e.key);
});
window.addEventListener("keyup", e => {
    teclado[e.key] = false;
    // console.log("keyup:", e.key);
});
