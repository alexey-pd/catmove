var stage = new createjs.Stage('game-canvas');
var queue = new createjs.LoadQueue(false);
var hero;
var bugs = [];
var TILE_WIDTH = 100;
var TILE_HEIGHT = 83;


queue.addEventListener('complete', init);
queue.loadManifest([
    {id: 'hero', src: 'img/char-pink-girl.png'},
    {id: 'stone', src: 'img/stone-block.png'},
    {id: 'water', src: 'img/water-block.png'},
    {id: 'grass', src: 'img/grass-block.png'},
    {id: 'bug', src: 'img/cat.png'},
]);


function init(){
    console.log('success load');
    hero = new createjs.Bitmap(queue.getResult('hero'));


    createMap();
    createHero();
    createBugs();
    bindEvents();
    createTicker();

    stage.update();
}

function createHero(){
    hero = new createjs.Bitmap(queue.getResult('hero'));
    resetHero();
    stage.addChild(hero);
}

function createBugs(){
    for (var i = 0; i < 5; i++){
        createBug();
    }
}

function createBug(){
    var bug = new createjs.Bitmap(queue.getResult('bug'));
    bugs.push(bug);
    resetBug(bug);
    stage.addChild(bug);
}

function resetBug(bug){
    bug.y = Math.floor(Math.random() * 4) * TILE_HEIGHT;
    bug.x = TILE_WIDTH - 100;
    bug.speed = Math.random() + Math.random();
}

function createTicker(){
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener('tick', onTick);
}

function onTick(e){
    bugs.forEach(function(bug){
        moveBug(bug, e.delta);
    });

    checkHit();
    stage.update();
}

function moveBug(bug,delta){
    bug.x += bug.speed * delta / 5;

    if (bug.x > 7 * TILE_WIDTH){
        resetBug(bug);
    }
}

function checkHit(){
    bugs.forEach(function(bug){
        if(checkCollision(bug)){
            resetHero();
        }
    });
}

function checkCollision(bug){
    return hero.y == bug.y &&
           hero.x < bug.x + TILE_WIDTH * 0.75 &&
           bug.x < hero.x + TILE_WIDTH * 0.75
}

function resetHero(){
    hero.x = 3 * TILE_WIDTH;
    hero.y = 4 * TILE_HEIGHT;
}

function createMap(){
    for (var i = 0; i < 6; i++){
        var type = 'stone';

        if(i === 0){
            type = 'water';
        } else if(i === 5){
            type = 'grass';
        }

        for (var j = 0; j < 7; j++){
            createBlock(type, i, j);
        }
    }
}

function createBlock(type,i,j){
    var block = new createjs.Bitmap(queue.getResult(type));
    block.x = j * TILE_WIDTH;
    block.y = i * TILE_HEIGHT - 50;

    stage.addChild(block);
}

function bindEvents(){
    window.addEventListener('keydown', onKeyDown);
}

function onKeyDown(e){
    var actions = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    }

    moveHero(actions[e.keyCode]);
}

function moveHero(action){
    var newX = hero.x;
    var newY = hero.y;

    switch(action){
        case 'left':
            newX -= TILE_WIDTH;
            break;
        case 'right':
            newX += TILE_WIDTH;
            break;
        case 'up':
            newY -= TILE_HEIGHT;
            break;
        case 'down':
            newY += TILE_HEIGHT;
            break;
    }

    if (tryMove(newX, newY)) {
        hero.x = newX;
        hero.y = newY;
    }

    stage.update();
}

function tryMove(newX,newY){
    if (newY < 0){
        resetHero();
    }

    return  newY >= 0 &&
            newY <= 4 * TILE_HEIGHT &&
            newX >= 0 &&
            newX <= 6 * TILE_WIDTH;
}