var stage = new createjs.Stage('game-canvas');
var queue = new createjs.LoadQueue(false);
var hero;

var TILE_WIDTH = 100;
var TILE_HEIGHT = 83;


queue.addEventListener('complete', init);
queue.loadManifest([
    //{id: 'hero', src: 'img/char-cat-girl.png'},
    {id: 'hero', src: 'img/cat.png'},
    {id: 'stone', src: 'img/stone-block.png'},
    {id: 'water', src: 'img/water-block.png'},
    {id: 'grass', src: 'img/grass-block.png'},
]);


function init(){
    console.log('success load');
    hero = new createjs.Bitmap(queue.getResult('hero'));


    createMap();
    createHero();
    bindEvents();

    createjs.Ticker.addEventListener('tick', stage);

    stage.update();
}

function createHero(){
    hero = new createjs.Bitmap(queue.getResult('hero'));
    resetHero();
    stage.addChild(hero);
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