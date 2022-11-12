const svgNS = "http://www.w3.org/2000/svg";
const svg=document.getElementById("ping-pong");
const leftRacket=document.createElementNS(svgNS, "rect");
const rightRacket=document.createElementNS(svgNS, "rect");
const ballElement=document.createElementNS(svgNS, "circle");
const btn=document.getElementById("start");
const firstScore=document.getElementById("first-player-score");
const secondScore=document.getElementById("second-player-score");

let timer=null;
let timerScore=null;
let counter=null;

let court={
    width : 600,
    height: 350,
}

function createField(width,height){
    const field=document.createElementNS(svgNS, "rect");
    field.setAttributeNS(null,"x",0);
    field.setAttributeNS(null,"y", 0);
    field.setAttributeNS(null,"width", width);
    field.setAttributeNS(null,"height", height);
    field.setAttributeNS(null,"fill", "black");
    svg.append(field);
}
createField(court.width,court.height);


let firstPlayer={
    posX : 0,
    posY : 0,
    speedY : 40,
    width : 10,
    height: 100,
    score:0,

    update : function() {
        leftRacket.setAttributeNS(null,"x",this.posX);
        leftRacket.setAttributeNS(null,"y",this.posY);
        leftRacket.setAttributeNS(null,"width",this.width);
        leftRacket.setAttributeNS(null,"height",this.height);
        leftRacket.setAttributeNS(null,"fill", "rgb(116, 0, 0)");
        svg.append(leftRacket);
        firstScore.textContent=`${this.score}`;
    }
}
firstPlayer.update();


let secondPlayer={
    posX : court.width - 10,
    posY : 0,
    speedY : 40,
    width : 10,
    height: 100,
    score:0,
    
    update : function() {
        rightRacket.setAttributeNS(null,"x",this.posX);
        rightRacket.setAttributeNS(null,"y",this.posY);
        rightRacket.setAttributeNS(null,"width",this.width);
        rightRacket.setAttributeNS(null,"height",this.height);
        rightRacket.setAttributeNS(null,"fill", "rgb(170, 5, 5)");
        svg.append(rightRacket);
        secondScore.textContent=`${this.score}`;
    }
}
secondPlayer.update();


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
    this.update();
}

function movementUp(){
    this.posY+=(-this.speedY);
        if (this.posY<0 ) {
            this.posY=0;
        }
    this.update();
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

    update : function() {
        ballElement.setAttributeNS(null,"cx",this.posX);
        ballElement.setAttributeNS(null,"cy",this.posY);
        ballElement.setAttributeNS(null,"r",this.radius);
        ballElement.setAttributeNS(null,"fill", "white");
        svg.append(ballElement);
    }
}
ball.update();



btn.addEventListener("click",start);
function start(){
    timer=setInterval(tick,40);
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

function countdown(){
    counter=4;
    timerScore=setInterval(nextTick,1000);
}

let num=document.createElementNS(svgNS, "text");
num.setAttributeNS(null,"x",court.width/2);
num.setAttributeNS(null,"y",50);
num.setAttributeNS(null,"font-size",45);
num.setAttributeNS(null,"fill","white");
num.setAttributeNS(null,"text-anchor","middle");
num.textContent="";
svg.append(num);

function nextTick(){
    counter --;
    num.textContent=`${counter}`;
    if(!counter){
        num.textContent="";
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
    checkKeys();

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
        clearInterval(timer);
        clearInterval(timerScore);
        let gameOver=document.createElementNS(svgNS, "text");
        gameOver.setAttributeNS(null,"x",court.width/2);
        gameOver.setAttributeNS(null,"y",50);
        gameOver.setAttributeNS(null,"font-size",45);
        gameOver.setAttributeNS(null,"fill","white");
        gameOver.setAttributeNS(null,"text-anchor","middle");
        gameOver.textContent="GAME OVER";
        svg.append(gameOver);
    }
    ball.update();
}

ball.update();