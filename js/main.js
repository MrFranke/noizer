(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

var canvas     = document.querySelector('#layout')
  , context    = canvas.getContext('2d')
  , favicons   = {play: 'styles/img/play.ico', pause: 'styles/img/stop.ico'};

favicons.play = new Image();
favicons.pause = new Image();
favicons.play.src = 'styles/img/play.ico';
favicons.pause.src = 'styles/img/stop.ico';

resize();

var visualizer = new Visualizer({ ctx: context })
  , player     = new Player({ tracks: ['The Prodigy - Firestarter.mp3'], visualizer: visualizer })
  , favicon    = new Favico();

function init () {
    bindEvents();
}

function bindEvents () {
    window.addEventListener('resize', resize);
    document.querySelector('.js-play').addEventListener('click', function () {
        player.play();
        favicon.image(favicons.play);
    });
    document.querySelector('.js-stop').addEventListener('click', function () {
        player.stop();
        favicon.image(favicons.pause);
    });
    document.querySelector('.js-pause').addEventListener('click', function () {
        player.pause();
        favicon.image(favicons.pause);
    });
}

function resize () {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;
}

init();