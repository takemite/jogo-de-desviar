const canvas = document.getElementById("jogoCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 480;
canvas.height = 600;

let jogoAtivo = false;
let pontuacao = 0;
let carro, obstaculos, faixaY, teclado;
let velocidadeObstaculos = 5;
let velocidadeFaixa = 5;
let intervaloObstaculos = 0;
let pontosParaAumentoVelocidade = 20;

// Iniciar jogo
function iniciarJogo(dificuldade) {
    document.getElementById("menu").style.display = 'none';
    document.getElementById("gameOver").style.display = 'none';
    jogoAtivo = true;
    pontuacao = 0;

    // Dificuldades
    if (dificuldade === "facil") velocidadeObstaculos = 4;
    if (dificuldade === "medio") velocidadeObstaculos = 6;
    if (dificuldade === "dificil") velocidadeObstaculos = 8;

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
    atualizarJogo();
}

// Desenhar pista
function desenharEstrada() {
    ctx.fillStyle = "#555";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#fff";
    ctx.fillRect(50, 0, 10, canvas.height);
    ctx.fillRect(canvas.width - 60, 0, 10, canvas.height);

    ctx.fillStyle = "#fff";
    for (let i = -20; i < canvas.height; i += 40) {
        ctx.fillRect(canvas.width / 2 - 5, i + faixaY, 10, 20);
    }
    faixaY += velocidadeFaixa;
    if (faixaY >= 40) faixaY = 0;
}

// Desenhar carro
function desenharCarro() {
    ctx.fillStyle = carro.cor;
    ctx.fillRect(carro.x, carro.y, carro.largura, carro.altura);
}

// Mover carro
function moverCarro() {
    if (teclado["ArrowLeft"] && carro.x > 60) carro.x -= carro.velocidade;
    if (teclado["ArrowRight"] && carro.x < canvas.width - carro.largura - 60) carro.x += carro.velocidade;
}

// Obstáculos
function gerarObstaculo() {
    let largura = Math.random() * 100 + 40;
    let x = Math.random() * (canvas.width - largura - 120) + 60;
    obstaculos.push({ x, y: -50, largura, altura: 30 });
}

function desenharObstaculos() {
    ctx.fillStyle = "#f00";
    obstaculos.forEach(o => ctx.fillRect(o.x, o.y, o.largura, o.altura));
}

function moverObstaculos() {
    obstaculos.forEach((o, i) => {
        o.y += velocidadeObstaculos;
        if (o.y > canvas.height) {
            obstaculos.splice(i, 1);
            pontuacao += 10;
        }
    });
}

// Colisão
function detectarColisao() {
    for (let o of obstaculos) {
        if (
            carro.x < o.x + o.largura &&
            carro.x + carro.largura > o.x &&
            carro.y < o.y + o.altura &&
            carro.y + carro.altura > o.y
        ) {
            jogoAtivo = false;
            fimDeJogo();
        }
    }
}

// Atualizar pontuação
function atualizarPontuacao() {
    document.getElementById("pontuacao").innerText = "Pontuação: " + pontuacao;
}

// Fim de jogo
function fimDeJogo() {
    document.getElementById("gameOver").style.display = 'block';
    document.getElementById("pontuacaoFinal").innerText = "Sua pontuação: " + pontuacao;
}

// Voltar ao menu
function voltarMenu() {
    document.getElementById("menu").style.display = 'block';
    document.getElementById("gameOver").style.display = 'none';
    document.getElementById("pontuacao").innerText = "Pontuação: 0";
}

// Atualizar jogo
function atualizarJogo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharEstrada();
    desenharCarro();
    moverCarro();
    desenharObstaculos();
    moverObstaculos();
    detectarColisao();
    atualizarPontuacao();

    if (intervaloObstaculos % 100 === 0) gerarObstaculo();
    intervaloObstaculos++;

    if (pontuacao >= pontosParaAumentoVelocidade) {
        velocidadeObstaculos += 0.3;
        pontosParaAumentoVelocidade += 20;
    }

    if (jogoAtivo) requestAnimationFrame(atualizarJogo);
}

// Controles
window.addEventListener("keydown", e => teclado[e.key] = true);
window.addEventListener("keyup", e => teclado[e.key] = false);