(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var favicons   = { play: new Image(), 
                   pause: new Image() };

favicons.play.src = 'styles/img/play.ico';
favicons.pause.src = 'styles/img/stop.ico';

var visualizer = new Visualizer()
  , player     = new Player({ tracks: ['The Prodigy - Firestarter.mp3'], visualizer: visualizer })
  , favicon    = new Favico();

function init () {
    bindEvents();
}

function bindEvents () {
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

init();