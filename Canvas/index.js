const canvas = document.getElementById("ping-pong");
const ctx = canvas.getContext('2d');

const btn=document.getElementById("start");
const firstScore=document.getElementById("first-player-score");
const secondScore=document.getElementById("second-player-score");

let timer=null;
let timerScore=null;
let counter=null;
let gameOver="";

let court={
    width : 600,
    height: 350,
    posX:0,
    posY:0,
    color:"black",
}

let firstPlayer={
    posX : 0,
    posY : 0,
    speedY : 10,
    width : 10,
    height: 100,
    score:0,
    color:"rgb(116, 0, 0)",
}

let secondPlayer={
    posX : court.width - 10,
    posY : 0,
    speedY : 10,
    width : 10,
    height: 100,
    score:0,
    color:"rgb(170, 5, 5)",
}

function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

let keysDown = [];

window.addEventListener("keydown", function(event) {
keysDown[event.code] = true;
});

window.addEventListener("keyup", function(event) {
delete keysDown[event.code];
});

function movementDown(){
    this.posY+=this.speedY;
        if (this.posY+this.height>court.height) {
            this.posY=court.height-this.height;
        }
}

function movementUp(){
    this.posY+=(-this.speedY);
        if (this.posY<0 ) {
            this.posY=0;
        }
}

function checkKeys() {

    if (keysDown['ShiftLeft']){
            firstPlayer.moveUp=movementUp;
            firstPlayer.moveUp();
    }

    if (keysDown['ControlLeft']){
            firstPlayer.moveDown=movementDown;
            firstPlayer.moveDown();
    }

    if (keysDown['ArrowUp']){
            secondPlayer.moveUp=movementUp;
            secondPlayer.moveUp();
    }

    if (keysDown['ArrowDown']){   
            secondPlayer.moveDown=movementDown;
            secondPlayer.moveDown();
    }

}

let ball={
    posX : court.width/2,
    posY : court.height/2,
    speed : 7,
    accelX : 5,
    accelY : 5,
    radius : 10,
    color:"white",
}


function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

function collision(b,p){
        b.top=b.posY-b.radius;
        b.bottom=b.posY+b.radius;
        b.left=b.posX-b.radius;
        b.right=b.posX+b.radius;

        p.top=p.posY;
        p.bottom=p.posY+p.height;
        p.left=p.posX;
        p.right=p.posX+p.width;

        return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;            
}

function drawText(text,x,y){
        ctx.fillStyle = "white";
        ctx.font = "45px fantasy";
        ctx.textAlign = 'center';
        ctx.fillText(text, x, y);
}

function countdown(){
    counter=3;
    timerScore=setInterval(nextTick,1000);
}

function nextTick(){
    drawRect(court.width/2-20, 0, 60, 60, "black");
    drawText(counter,court.width/2,50);
    counter --;
    if(!counter){
        counter="";
        clearInterval(timerScore);
        start();
    }
}

function resetBall(){
    ball.posX = court.width/2;
    ball.posY = court.height/2;
    ball.accelX = -ball.accelX;
    ball.speed = 7;
}

function tick() {

    ball.posX+=ball.accelX;
    ball.posY+=ball.accelY;

    if(ball.posY-ball.radius<0 || ball.posY+ball.radius>court.height){
        ball.accelY= -ball.accelY;
    }

    let player=(ball.posX+ball.radius < court.width/2) ? firstPlayer : secondPlayer;

    if(collision(ball,player)){
        let collidePoint=(ball.posY-(player.posY+player.height/2));
        collidePoint=collidePoint/(player.height/2);

        let angleRad=collidePoint*(Math.PI/4);

        let direction=(ball.posX+ball.radius<court.width/2) ? 1: -1;

        ball.accelX=direction*ball.speed*Math.cos(angleRad);
        ball.accelY=ball.speed*Math.sin(angleRad);
        ball.speed+=0.1;
    }

    if(ball.posX-ball.radius<0){
        firstPlayer.score++;
        firstScore.textContent=`${firstPlayer.score}`;
        clearInterval(timer);
        countdown()
        resetBall();
    }else if(ball.posX+ball.radius>court.width){
        secondPlayer.score++;
        secondScore.textContent=`${secondPlayer.score}`;
        clearInterval(timer);
        countdown()
        resetBall();
    }

    if((firstScore.textContent=="5")|| (secondScore.textContent=="5")){
        gameOver="GAME OVER";
        clearInterval(timer);
        clearInterval(timerScore);
    }
}

function render(){
    drawRect(0, 0, canvas.width, canvas.height, "rgb(49, 49, 49)");
              
    drawRect(court.posX, court.posY, court.width, court.height, court.color);
        
    drawRect(firstPlayer.posX, firstPlayer.posY, firstPlayer.width, firstPlayer.height, firstPlayer.color);
        
    drawRect(secondPlayer.posX, secondPlayer.posY, secondPlayer.width, secondPlayer.height, secondPlayer.color);
        
    drawArc(ball.posX, ball.posY, ball.radius, ball.color);

    drawText(gameOver,court.width/2,50);

}
render();

function game(){
    tick();
    render();
    checkKeys();
}

btn.addEventListener("click",start);
function start(){
    timer=setInterval(game,40);
}