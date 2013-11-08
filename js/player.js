/*
 * Модуль, проигрывающий музыку и передающий данные о саундтреке в визуализатор
 */
var Player = function ( options ) {
    // переменные для буфера, источника и получателя
    var context
      , buffer // Буфер файла
      , source // Источник
      , destination // Аудиовыход
      , analyser // Анализатор частот
      , gainNode // Блок громкости
      , frequencyData // Данные о треке
      , visualizer = options.visualizer || visualizer
      , musicFiles = options.tracks || ['test.mp3']
      , currentFile = { name: musicFiles[0], url: musicFiles[0] }
      , idFrame // Если true, то визуадизация работает, как только становится false, визуализация выключается
      
      , autoplay
      , volume = 0.5;

    function init () {
        updateVars();
        bindEvents();
        initDropZone();
        setPreloader(true);
    }

    function bindEvents () {
        document.querySelector('.hello__testfile').addEventListener('click', function () {
            loadSoundFile(currentFile.url, function () {
                setPreloader(false);
                preporationForPlay();
            });
            return false;
        });
        document.querySelector('.js-changestyle').addEventListener('change', function () {
            visualizer.changeStyle(this.value);
        });
        document.querySelector('.js-volume').addEventListener('change', setVolume);
    }

    function updateVars () {
        getContext();
        destination = context.destination;
        gainNode = context.createGain();
        document.querySelector('.hello__testfile').innerHTML = currentFile.name;
    }

    function setVolume (e) {
        if(!gainNode) return;
        gainNode.gain.value = this.value/100;
    }
    
    function initDropZone () {
        var dropZone = document.querySelector('.hello__dropfile');
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('drop', handleFileSelect, false);

        function handleDragOver (e) {
            var target = e.target;
            //target.className += ' hover';
            e.stopPropagation();
            e.preventDefault();
        }

        function handleFileSelect (e) {
            var file = e.dataTransfer.files[0]
              , name = file.name
              , reader = new FileReader();

            // После загрузки декодируем фаил
            reader.onloadend = function (e) {
                var arrayBuffer = e.target.result;
                
                setPreloader('Загрузка трека');
                context.decodeAudioData(arrayBuffer, function(decodedArrayBuffer) {
                    buffer = decodedArrayBuffer;

                    // Подгатавливаем плеер к запуску и запускаем трек
                    autoplay = true;
                    currentFile.name = name;
                    setPreloader(false);
                    preporationForPlay();
        
                }, function(e) {
                      console.log('Error decoding file', e);
                });
            };
            
            reader.readAsArrayBuffer(file);

            e.stopPropagation();
            e.preventDefault();
        }
    }

    // Получаем контекст аудио API
    function getContext () {
        try {
            window.AudioContext = window.AudioContext||window.webkitAudioContext;
            context = new AudioContext();
        }
        catch(e) {
            alert('Opps.. Your browser do not support audio API');
        }
    }

    function loadSoundFile (url, callback) {
        setPreloader('Загрузка трека');
        // делаем XMLHttpRequest на сервер
        var xhr = new XMLHttpRequest()
          , counterElement = document.querySelector('#preloader__counter');

        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer'; // важно
        xhr.onload = function(e) {
              // декодируем бинарный ответ
              context.decodeAudioData(this.response, function(decodedArrayBuffer) {
              // получаем декодированный буфер
              buffer = decodedArrayBuffer;
              // Подключаем нужные модули
              autoplay = true;
              callback();
    
              }, function(e) {
                console.log('Error decoding file', e);
              });
        };
        xhr.addEventListener("progress", function (e) {
            var procent = parseInt(( (e.loaded/e.total)*100 ).toFixed(0), 10);
            procent -= 0.1
            counterElement.innerHTML = procent + '%';
        }, false);
        xhr.send();
    }

    // Подготавливаемся к воспроизведению, подключаем источник к аудиовыходу
    function preporationForPlay () {
        document.querySelector('.js-soundtrack').innerHTML = currentFile.name;

        if ( autoplay ) {
            document.querySelector('.js-play').click();
        }
    }

    // Устанавливает прелоадер с нужным текстом
    function setPreloader ( condition ) {
        var preloader = document.querySelector('#preloader')
          , overlay = document.querySelector('#overlay')
          , textElement = document.querySelector('#preloader__text')
          , counterElement = document.querySelector('#preloader__counter')
          , interval;

        if ( !condition ) {
            preloader.style.display = 'none';
            overlay.style.display = 'none';
            return false;
        }

        if ( typeof condition === 'string' ) {
            textElement.innerHTML = condition;
        }

        preloader.style.display = 'block';
        overlay.style.display = 'block';
    }

    // API ===================================================

    function play () {
        source = context.createBufferSource();
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(destination);
        setAnalyzer();
        source.start(0);
    }

    function stop () {
        source.stop(0);
        cancelAnimationFrame(idFrame);
    }

    function pause () {
        source.pause(0);
    }

    function setAnalyzer () {
        analyser = context.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);
        analyser.connect(context.destination);
        frequencyData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencyData);
        
        function step () {
            analyser.getByteFrequencyData(frequencyData); // Обновляем данные о треке
            visualizer.update(frequencyData); // Запускаем отрисовку новых данных
            idFrame = requestAnimationFrame(step); // Запускаем следующий кадр
        }
        
        requestAnimationFrame(step);
    }

    init();

    return{
        play: play,
        stop: stop,
        pause: pause,
        setAnalyzer: setAnalyzer
    };
};