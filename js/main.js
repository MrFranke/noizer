(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas     = document.querySelector('#layout')
  , context    = canvas.getContext('2d');

resize();

var visualizer =  new Visualizer({ ctx: context })
  , player     =  new Player({ tracks: ['The Prodigy - Climbatize (Original Mix).mp3'], visualizer: visualizer });

function init () {
    bindEvents();
}

function bindEvents () {
    document.ready = resize;
    window.addEventListener('resize', resize);
    document.querySelector('.js-play').addEventListener('click', player.play);
    document.querySelector('.js-stop').addEventListener('click', player.stop);
    document.querySelector('.js-pause').addEventListener('click', player.pause);
}

function resize () {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
}

init();