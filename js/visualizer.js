/*
 * Модуль, отвечающий за визуализирование звука,
 * который проигрывает плеер
 */
var Visualizer = function ( options ) {

    var ctx = options.ctx
      , points = [] // Данные о треке
      , cechePoints = [0]
      , styles = {
            pulse: pulse,
            leftSide: leftSide,
            cardiogram: cardiogram
        }
      , step // Расстояние одной точки от другой
      , style = 'pulse'; // Вид эквалайзера

    function init () {
        updateVars();
        draw();
    }

    function draw () {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        styles[style]();
    }

    function updateVars () {
        for (var i = 0; i < 1024; i++) {
            points[i] = 0;
        }
        cechePoints = points.concat([]); // клонируем массив с данными
        findStepWidth();
    }

    function leftSide () {
        var startCoords = { x: 0, y: ctx.canvas.height/2 };

        
        ctx.beginPath();
        ctx.strokeStyle = '#b94a39';
        ctx.lineWith = 4;
        ctx.shadowColor = 'red';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.moveTo(0,0);

        for (var i = 0; i < 2000; i++) {
           var x = points[i]-100 < 0 ? 0 : points[i]-70
             , y = i*step;
           ctx.lineTo(x,y);
        }

        ctx.stroke();
    }

    function cardiogram () {
        var startCoords = { x: 0, y: ctx.canvas.height/2 }
          , newPoint = points[Math.floor((Math.random()*1024)+1)]; // Точка, которую добавим в

        cechePoints.shift(); // Удаляем старое значение
        cechePoints.shift(); // Удаляем старое значение
        cechePoints.push(newPoint, 0); //Добовляем низкие частоты

        ctx.beginPath();
        ctx.strokeStyle = '#b94a39';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'red';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.lineJoin = 'miter';

        ctx.moveTo( startCoords.x,startCoords.y );

        for (var i = 0; i < cechePoints.length; i++) {
            var y = cechePoints[i]
              , x = i*step;

            if ( cechePoints[i] > 100) {
                y -= 150;
            }

            x += startCoords.x;
            y = startCoords.y - y;

            ctx.lineTo(x,y);
        }

        ctx.stroke();
    }

    function pulse () {
        var startCoords = { x: 0, y: ctx.canvas.height/2 };

        ctx.beginPath();
        ctx.strokeStyle = '#b94a39';
        ctx.fillStyle = '#222';
        ctx.lineWith = 2;
        ctx.shadowColor = 'red';
        ctx.shadowBlur = 5;

        ctx.moveTo( startCoords.x,startCoords.y );

        for (var i = points.length, j = 9; i != 0 ; i--, j++) {
            var y = points[i]-100 < 0 ? 0 : points[i]-100
              , x = j*step;

            x += startCoords.x;
            y = startCoords.y - y;

            ctx.lineTo(x,y);
        }

        startCoords.x = (points.length+10)*step;
        startCoords.y -= points[points.length-1];

        for (var i = 0; i < points.length; i++) {
            var y = points[i]-100 < 0 ? 0 : points[i]-100
              , x = i*step;

            x += startCoords.x;
            y = startCoords.y - y;

            ctx.lineTo(x,y);
        }

        // Низ
        startCoords = { x: 0, y: ctx.canvas.height/2 };

        for (var i = points.length, j = 9; i != 0 ; i--, j++) {
            var y = points[i]-100 < 0 ? 0 : points[i]-100
              , x = j*step;

            x += startCoords.x;
            y = startCoords.y + y;

            ctx.lineTo(x,y);
        }

        startCoords.x = (points.length+10)*step;
        startCoords.y -= points[points.length-1];

        for (var i = 0; i < points.length; i++) {
            var y = points[i]-100 < 0 ? 0 : points[i]-100
              , x = i*step;

            x += startCoords.x;
            y = startCoords.y + y;

            ctx.lineTo(x,y);
        }

        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = '#222';
        startCoords = { x: 0, y: ctx.canvas.height/2 };
        ctx.moveTo(startCoords.x, startCoords.y);
        ctx.lineTo(ctx.canvas.width, startCoords.y);
        ctx.stroke();
    }

    function findStepWidth () {
        step = ctx.canvas.width/1024;
    }

    function update (p) {
        points = p;
        draw();
    }

    function changeStyle ( type ) {
        style = type;
    }

    init();

    return {
        update: update,
        changeStyle: changeStyle
    };
};