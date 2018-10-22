var cols = 50;
var rows = 50;
var enableStatus = false;

function nextFruitPos() {
  var oldX = nextFruitPos.x;
  var oldY = nextFruitPos.y;
  var newPos = genNewPos(oldX, oldY);

  oldX++;
  if (oldX > cols) {
    oldX = 1;
  }
  nextFruitPos.x = oldX;
  return newPos;
}
function genNewPos(x, y) {
  return {
    x: x,
    y: Math.floor(Math.sin(x) * 3) + rows/2 + 1
  };
}
nextFruitPos.x = 1;
nextFruitPos.y = 1;

function game(speed, num) {
  var SnakeX = Math.floor(Math.random()*(cols)+1);
  var SnakeY = Math.floor(Math.random()*(rows)+1);

  var FruitX = 5;
  var FruitY = 5;
  var isFruitEaten = true;

  var IntervalID;
  this.speed = speed;
  var score = 0;
  var snakeNum = num;

  var gameContext = this;

  var eating = function() {
    if(isFruitEaten) {
      createNewFruit();
      drawFruit();
    }
    
    drawSnake();
    snakeLogic();
  }
  
  gameContext.start = function() {
    IntervalID = setInterval(eating, gameContext.speed);
  }
  
  gameContext.start();

  var createNewFruit = function() {
    var newFruitPos = nextFruitPos();
    FruitX = newFruitPos.x;
    FruitY = newFruitPos.y;
    // FruitX = Math.floor(Math.random()*(cols)+1);
    // FruitY = Math.floor(Math.random()*(rows)+1);
    isFruitEaten = false;
  }

  var replaceClass = function(element, oldClassName, newClassName) {
    element.className = element.className.replace(new RegExp('\b' + oldClassName + '\b', 'g'), '');
    element.className = newClassName;
  }

  var getElement = function(x, y) {
    return document.getElementById(x.toString() + '-' + y.toString());
  }

  var drawSnake = function() {
    var snakeCell = getElement(SnakeX, SnakeY);
    replaceClass(snakeCell, 'cell', 'snake');
    if (enableStatus) {
      snakeCell.innerHTML = '<div class="snakeNum">'+snakeNum+':'+score+'</div>';
    }
  }

  var eraseSnake = function() {
    var snakeCell = getElement(SnakeX, SnakeY);
    replaceClass(snakeCell, 'snake', 'cell');
    if (enableStatus) {
      snakeCell.innerHTML = '';
    }
  }

  var eraseFruit = function() {
    var fruitCell = getElement(FruitX, FruitY);
    replaceClass(fruitCell, 'fruit', 'cell');
  }
  
  var drawFruit = function() {
    var fruitCell = getElement(FruitX, FruitY);
    replaceClass(fruitCell, 'cell', 'fruit');
  }

  var eatFruit = function() {
    var fruitCell = getElement(FruitX, FruitY);
    replaceClass(fruitCell, 'fruit', 'snake');
    isFruitEaten = true;
    score++;
  }

  gameContext.getScore = function() {
    return score;
  }

  var snakeLogic = function() {
    eraseSnake();
    if((SnakeX < FruitX) && SnakeY == FruitY) {
      SnakeX++;
    } else if((SnakeX > FruitX) && SnakeY == FruitY) {
        SnakeX--;
      }

    if(SnakeY < FruitY) {
      SnakeY++;
    } else if(SnakeY > FruitY) {
        SnakeY--;
      }
    
    if((SnakeX == FruitX)&&(SnakeY == FruitY)) {
      eatFruit();
    } else {
      drawSnake();
    }
  }
  
  gameContext.stopEating = function() {
    clearInterval(IntervalID);
  }
  
  gameContext.destroyGame = function() {
    gameContext.stopEating();
    eraseFruit();
    eraseSnake();
  }
}

var snakes = [];
var MAXIMUM;
var speeds;

populate = function() {
  GlobalTimer.start();
  for(var i=0; i<MAXIMUM; i++) {
    snakes[i] = new game(speeds, i);
  }
}

setPause = function() {
  GlobalTimer.pause();
  for(var i=0; i<MAXIMUM; i++) {
    snakes[i].stopEating();
  }
}

play = function() {
  GlobalTimer.resume();
  for(var i=0; i<MAXIMUM; i++) {
    snakes[i].start();
  }
}

restart = function() {
  GlobalTimer.reset();
  for(var i=0; i<MAXIMUM; i++) {
    snakes[i].destroyGame();
    delete snakes[i];
  }
  
  var counterInput = document.getElementById('counterinput');
  var speedInput = document.getElementById('speedinput');
  MAXIMUM = parseInt(counterInput.value);
  speeds = parseInt(speedInput.value);
  populate(); 
}

restart_speed_only = function() {
  var speedInput = document.getElementById('speedinput');
  speeds = parseInt(speedInput.value);
  for(var i=0; i<MAXIMUM; i++) {
    snakes[i].stopEating();
    snakes[i].speed = speeds;
    snakes[i].start();
  }
}



GlobalTimer = {
  seconds: 0,
  seconds2: 0,
  timerId: -1,
  timeoutId: -1,
  globalTimerContext: this,
  reset: function() {
    var timer = this;
    timer.seconds = 0;
    timer.seconds2 = 0;
    timer.stop();
    timer.start();
  },
  
  start: function() {
    var timer = this;
    var globalTimer = document.getElementById('GlobalTimer');
    var globalTimer2 = document.getElementById('GlobalTimer2');
    timerId = setInterval(
      function() {
        timer.seconds += 1;
        globalTimer.innerText = timer.seconds;
        // if((timer.seconds % 15) === 0) {
        //   setPause();                   
        //   play();
        // }
      }, 1000);
    timeoutId = setTimeout(timeout, 1000);
    function timeout() {
      timer.seconds2++;
      globalTimer2.innerText = timer.seconds2;
      timeoutId = setTimeout(timeout, 1000);
    }
  },
  
  // TODO: исправить глюк при смене скорости, когда этот таймер скачет на 2 секунды
  
  stop: function() {
    var timer = this;
    clearInterval(timerId);
    clearTimeout(timeoutId);
    timer.seconds = 0;
    timer.seconds2 = 0;
  },
  
  pause: function() {
    clearInterval(timerId);
    clearTimeout(timeoutId);
  },
  
  resume: function() {
    this.start();
  }
}

// $(function() {
document.addEventListener('DOMContentLoaded', function() {
  var playGround = document.getElementById('playground');
  var playGroundHTML = '';
  for(var i=0; i<cols; i++) {
    for(var j=0; j<rows; j++) {
      playGroundHTML += '<div class="cell" id="' + (j + 1).toString() + '-' + (i + 1).toString() + '"></div>';
      // $('#playground').append('<div class="cell" id="'+(j+1).toString()+'-'+(i+1).toString()+'"></div>');
    }
  }
  playGround.innerHTML = playGroundHTML;

  playground.addEventListener('click', function(evt) {
    var cell = evt.target;
    if (['cell', 'snake', 'fruit'].indexOf(cell.className) >= 0) {
      var infoPanel = document.getElementById('infopanel');
      infoPanel.innerText = 'INFO: ' + cell.getAttribute('id');
    }
  });

  var counterInput = document.getElementById('counterinput');
  var speedInput = document.getElementById('speedinput');
  MAXIMUM = parseInt(counterInput.value);
  speeds = parseInt(speedInput.value);
  //MAXIMUM = parseInt($('#counterinput').val());
  //speeds = parseInt($('#speedinput').val());

  populate();
});