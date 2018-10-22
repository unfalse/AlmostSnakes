var cols = 50;
var rows = 50;

function game(speed, num)
{
  var SnakeX = 25;
  var SnakeY = 25;

  var FruitX = 5;
  var FruitY = 5;
  var isFruitEaten = true;

  var IntervalID;
  this.speed = speed;
  var score = 0;
  var snakeNum = num;

  var gameContext = this;
  
  var eating = function()
  {
    if(isFruitEaten)
    {
      createNewFruit();
      drawFruit();
    }
    
    drawSnake();
    snakeLogic();
  }
  
  gameContext.start = function()
  {
    IntervalID = setInterval(eating, gameContext.speed);
  }
  
  gameContext.start();
  
  var createNewFruit = function()
  {
    FruitX = Math.floor(Math.random()*(cols)+1);
    FruitY = Math.floor(Math.random()*(rows)+1);
    isFruitEaten = false;
  }

  var drawSnake = function()
  {
    var snakeCell = $('#'+SnakeX.toString()+'-'+SnakeY.toString());
    snakeCell.removeClass('cell').addClass('snake').prepend('<div class="snakeNum">'+snakeNum+':'+score+'</div>');
  }

  var eraseSnake = function()
  {
    $('#'+SnakeX.toString()+'-'+SnakeY.toString()).removeClass('snake').addClass('cell').html('');
  }

  var eraseFruit = function()
  {
    $('#'+FruitX.toString()+'-'+FruitY.toString()).removeClass('fruit').addClass('cell');
  }
  
  var drawFruit = function()
  {
    $('#'+FruitX.toString()+'-'+FruitY.toString()).removeClass('cell').addClass('fruit');
  }

  var eatFruit = function()
  {
    $('#'+FruitX.toString()+'-'+FruitY.toString()).removeClass('fruit').addClass('snake');
    isFruitEaten = true;
    score++;
  }

  gameContext.getScore = function()
  {
    return score;
  }

  var snakeLogic = function()
  {
    eraseSnake();
    if((SnakeX < FruitX) && SnakeY==FruitY)
    {
      SnakeX++;
    }
    else
      if((SnakeX > FruitX) && SnakeY==FruitY)
        SnakeX--;

    if(SnakeY < FruitY)
    {
      SnakeY++;
    }
    else
      if(SnakeY > FruitY)
        SnakeY--;
    
    if((SnakeX == FruitX)&&(SnakeY == FruitY))
      eatFruit();
    else
      drawSnake();
  }
  
  gameContext.stopEating = function()
  {
    clearInterval(IntervalID);
  }
  
  gameContext.destroyGame = function()
  {
    gameContext.stopEating();
    eraseFruit();
    eraseSnake();
  }
}

var snakes = [];
var MAXIMUM;
var speeds;

populate = function()
{
  GlobalTimer.start();
  for(var i=0; i<MAXIMUM; i++)
    snakes[i] = new game(speeds, i);
}

setPause = function()
{
  GlobalTimer.pause();
  for(var i=0; i<MAXIMUM; i++)
    snakes[i].stopEating();
}

play = function()
{
  GlobalTimer.resume();
  for(var i=0; i<MAXIMUM; i++)
    snakes[i].start();
}

restart = function()
{
  GlobalTimer.reset();
  for(var i=0; i<MAXIMUM; i++)
  {
    snakes[i].destroyGame();
    delete snakes[i];
  }
  
  MAXIMUM = parseInt($('#counterinput').val());
  speeds = parseInt($('#speedinput').val());
  populate(); 
}

restart_speed_only = function()
{
  speeds = parseInt($('#speedinput').val());
  for(var i=0; i<MAXIMUM; i++)
  {
    snakes[i].stopEating();
    snakes[i].speed = speeds;
    snakes[i].start();
  }
}

GlobalTimer = {
  seconds: 0,
  
  timerId: -1,
  
  globalTimerContext: this,
  
  reset: function(){
    var timer = this;
    timer.seconds = 0;
    timer.stop();
    timer.start();
  },
  
  start: function(){
    // console.log('timer started at '+new Date());
    var timer = this;
    timerId = setInterval(function(){
                            timer.seconds += 1;
                            // console.log(timer.seconds+' '+new Date());
                            $('#GlobalTimer').text(timer.seconds);
                            if((timer.seconds%15)===0)
                            {
                              setPause();
                              
                              
                              for(var i=0; i<MAXIMUM; i++)
                                console.log('snake '+i+': '+snakes[i].getScore());

                              // Taken from http://www.phpied.com/sleep-in-javascript/
                              // Пауза на пару секунд.
                              // var start = new Date().getTime();
                              // var milliseconds = 2000;
                              // for (var i = 0; i < 1e7; i++) {
                                // if ((new Date().getTime() - start) > milliseconds){
                                  // break;
                                // }
                              // }
                              
                              play();
                            }
                          }, 1000);
  },
  
  // TODO: исправить глюк при смене скорости, когда этот таймер скачет на 2 секунды
  
  stop: function(){
    var timer = this;
    clearInterval(timerId);
    timer.seconds = 0;
  },
  
  pause: function(){
    clearInterval(timerId);
  },
  
  resume: function(){
    this.start();
  }
}

$(function(){
    for(var i=0; i<cols; i++)
      for(var j=0; j<rows; j++)
        $('#playground').append('<div class="cell" id="'+(j+1).toString()+'-'+(i+1).toString()+'"></div>');
      
    $('.cell').click( function(){ $('#infopanel').text('INFO: '+$(this).attr('id')) } );

    MAXIMUM = parseInt($('#counterinput').val());
    speeds = parseInt($('#speedinput').val());

    populate();
});