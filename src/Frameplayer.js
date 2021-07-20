import helpers from './helper';
import backwardIcon from '../images/backward-button.svg';
import forwardIcon from '../images/forward-button.svg';
import pauseIcon from '../images/pause-button.svg';
import playIcon from '../images/play-button.svg';
import fullscreenIcon from '../images/fullscreen-button.svg';
import './Frameplayer.css';

var FramePlayer = function(el, options, jsonFile = null) {
  this.divCont = document.getElementById(el);
  this.elem = el;
  this.jsonVideoSrc = jsonFile
    ? jsonFile
    : this.divCont.getAttribute('data-vidsrc');
  (this.rate = 20),
    (this.controls = true),
    (this.paused = false),
    (this.width = '480px'),
    (this.height = '320px');
  this.backwards = false;
  this.currentFrame = -1;
  this.startFrame = 0;
  this.frameLength = 0;
  this.progressMouseDown = false;

  this.progressBarColor = '#f00';

  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
  this.divCont.appendChild(this.canvas);

  this.setOptions(options);
  this.initializeRequestAnimationFrame();
};

FramePlayer.prototype.setOptions = function(options) {
  if ('rate' in options) {
    this.rate = options.rate;
  }
  if ('controls' in options) {
    this.controls = options.controls;
  }
  if ('autoplay' in options) {
    if (!options.autoplay) {
      this.paused = true;
    }
  }
  if ('width' in options) {
    this.width = options.width;
  }
  if ('height' in options) {
    this.height = options.height;
  }
  if ('startFrame' in options) {
    this.startFrame = this.currentFrame = options.startFrame;
  }
  if ('backwards' in options) {
    this.backwards = options.backwards;
  }
  if ('progressBarColor' in options) {
    this.progressBarColor = options.progressBarColor;
  }

  this.divCont.style.width = this.width;
  this.divCont.style.height = this.height;

  if (this.controls) {
    this.createProgressBar();
    this.createControlBar();
  }
};

FramePlayer.prototype.render = function(player) {
  var now,
    then = Date.now(),
    interval = 1000 / player.rate,
    delta,
    videoFramesNum = player.jsonVideoFile.frames.length;

  var processFrame = function() {
    now = Date.now();
    delta = now - then;

    if (delta > interval) {
      then = now - (delta % interval);

      if (!player.paused) {
        player.currentFrame = player.backwards
          ? (player.currentFrame -= 1)
          : (player.currentFrame += 1);

        if (player.currentFrame >= videoFramesNum) player.currentFrame = 0;
        else if (player.currentFrame < 0)
          player.currentFrame = videoFramesNum - 1;

        player.drawFrame(player);
      }
    }

    window.requestAnimationFrame(processFrame);
  };

  window.requestAnimationFrame(processFrame);
};

FramePlayer.prototype.drawFrame = function(player) {
  var img = new Image();
  img.onload = function() {
    player.canvas.width = img.width;
    player.canvas.height = img.height;
    player.context.drawImage(img, 0, 0, img.width, img.height);
  };
  img.src = player.jsonVideoFile.frames[player.currentFrame];

  // Set current time
  var timeCurrent = document.getElementById('time-current-' + this.elem);
  timeCurrent.innerHTML = `${helpers.convertSecondToTime(
    player.currentFrame,
    player.rate,
  )} / ${helpers.convertSecondToTime(player.frameLength, player.rate)}`;

  // Set Progress Bar
  var progress = document.getElementById('progress-filled-' + this.elem);
  progress.style.flexBasis = `${(player.currentFrame / player.frameLength) *
    100}%`;
};

FramePlayer.prototype.createProgressBar = function() {
  var _self = this,
    progressBar = document.createElement('div');
  progressBar.setAttribute('class', 'fp-progress');

  // Show Control Bar when hovering to the el
  _self.divCont.addEventListener(
    'mouseover',
    function() {
      progressBar.classList.remove('control-fade-out');
      progressBar.classList.add('control-fade-in');
    },
    false,
  );

  _self.divCont.addEventListener(
    'mouseout',
    function() {
      progressBar.classList.remove('control-fade-in');
      progressBar.classList.add('control-fade-out');
    },
    false,
  );

  progressBar.addEventListener(
    'click',
    function(e) {
      _self.scrube(e);
    },
    false,
  );

  progressBar.addEventListener(
    'mousemove',
    function(e) {
      _self.progressMouseDown && _self.scrube(e);
    },
    false,
  );

  progressBar.addEventListener(
    'mousedown',
    function() {
      _self.progressMouseDown = true;
    },
    false,
  );

  progressBar.addEventListener(
    'mouseup',
    function() {
      _self.progressMouseDown = false;
    },
    false,
  );

  // progress filled
  var progressFilled = document.createElement('div');
  progressFilled.setAttribute('id', 'progress-filled-' + _self.elem);
  progressFilled.setAttribute('class', 'fp-progress-filled');
  progressFilled.style.background = _self.progressBarColor;
  progressBar.appendChild(progressFilled);

  _self.divCont.appendChild(progressBar);
};

FramePlayer.prototype.createControlBar = function() {
  var _self = this,
    controlBar = document.createElement('div');
  controlBar.setAttribute('class', 'fp-ctrl');
  controlBar.style.width = '100%';

  // Show Control Bar when hovering to the el
  _self.divCont.addEventListener(
    'mouseover',
    function() {
      controlBar.classList.remove('control-fade-out');
      controlBar.classList.add('control-fade-in');
    },
    false,
  );

  _self.divCont.addEventListener(
    'mouseout',
    function() {
      controlBar.classList.remove('control-fade-in');
      controlBar.classList.add('control-fade-out');
    },
    false,
  );

  // Backwards Button
  var btnBackwards = document.createElement('button');
  btnBackwards.setAttribute('id', 'backwards-' + _self.elem);
  btnBackwards.setAttribute('class', 'fp-btn');
  btnBackwards.innerHTML = `<img class="icon" src=${backwardIcon} />`;
  btnBackwards.addEventListener(
    'click',
    function() {
      _self.reverse(true);
    },
    false,
  );
  controlBar.appendChild(btnBackwards);

  // Pause Button
  var btnPause = document.createElement('button');
  btnPause.setAttribute('id', 'pause-' + _self.elem);
  btnPause.setAttribute('class', 'fp-btn');
  btnPause.innerHTML = `<img class="icon" src=${pauseIcon} />`;
  btnPause.addEventListener(
    'click',
    function() {
      _self.pause();
    },
    false,
  );
  controlBar.appendChild(btnPause);

  // Play Button
  var btnPlay = document.createElement('button');
  btnPlay.setAttribute('id', 'play-' + _self.elem);
  btnPlay.setAttribute('class', 'fp-btn');
  btnPlay.innerHTML = `<img class="icon" src=${playIcon} />`;
  btnPlay.addEventListener(
    'click',
    function() {
      _self.resume();
    },
    false,
  );
  controlBar.appendChild(btnPlay);

  // Display Play/Pause Button
  _self.paused
    ? (btnPause.style.display = 'none')
    : (btnPlay.style.display = 'none');

  // Forwards Button
  var forwards = document.createElement('button');
  forwards.setAttribute('id', 'forwards-' + _self.elem);
  forwards.setAttribute('class', 'fp-btn');
  forwards.innerHTML = `<img class="icon" src=${forwardIcon} />`;
  forwards.addEventListener(
    'click',
    function() {
      _self.reverse(false);
    },
    false,
  );
  controlBar.appendChild(forwards);

  // Time Current
  var timeCurrent = document.createElement('div');
  timeCurrent.setAttribute('id', 'time-current-' + _self.elem);
  timeCurrent.setAttribute('class', 'fp-time');
  timeCurrent.innerHTML = `${helpers.convertSecondToTime(
    _self.currentFrame,
    _self.rate,
  )} / ${helpers.convertSecondToTime(_self.frameLength, _self.rate)}`;
  controlBar.appendChild(timeCurrent);

  // Full Screen Button
  var fullScreen = document.createElement('button');
  fullScreen.setAttribute('id', 'fullscreen-' + _self.elem);
  fullScreen.setAttribute('class', 'fp-btn fp-full');
  fullScreen.innerHTML = `<img class="icon" src=${fullscreenIcon} />`;
  fullScreen.addEventListener(
    'click',
    function() {
      _self.fullscreen();
    },
    false,
  );
  controlBar.appendChild(fullScreen);

  // // Filter Select
  // var selectFilter = document.createElement('select'),
  //   options = ['normal', 'grayscale', 'sepia', 'invert'];

  // for (var i = 0, t = options.length; i < t; i++) {
  //   var $option = document.createElement('option');

  //   $option.setAttribute('value', options[i]);
  //   $option.innerHTML = options[i];
  //   selectFilter.appendChild($option);
  // }

  // selectFilter.setAttribute('id', 'filter-' + _self.elem);
  // selectFilter.setAttribute('class', 'fp-select');
  // selectFilter.addEventListener(
  //   'change',
  //   function () {
  //     _self.setFilter(this.value);
  //   },
  //   false,
  // );
  // controlBar.appendChild(selectFilter);

  // Add control bar
  _self.divCont.appendChild(controlBar);
};

FramePlayer.prototype.scrube = function(e) {
  var progressBar = document.getElementsByClassName('fp-progress');
  var progress = document.getElementById('progress-filled-' + this.elem);
  var selectLength = e.offsetX / progressBar[0].offsetWidth;
  progress.style.flexBasis = `${selectLength * 100}%`;
  this.gotoFrame(parseInt(selectLength * this.frameLength));
};

FramePlayer.prototype.play = function() {
  this.getFile(this.jsonVideoSrc, function(player) {
    if (player.paused) {
      player.render(player);
      player.drawFrame(player);
    } else {
      player.render(player);
    }
  });
};

FramePlayer.prototype.resume = function() {
  var btnPlay = document.getElementById('play-' + this.elem),
    btnPause = document.getElementById('pause-' + this.elem);

  btnPlay.style.display = 'none';
  btnPause.style.display = 'block';
  this.paused = false;
};

FramePlayer.prototype.pause = function() {
  var btnPlay = document.getElementById('play-' + this.elem),
    btnPause = document.getElementById('pause-' + this.elem);

  btnPlay.style.display = 'block';
  btnPause.style.display = 'none';
  this.paused = true;
};

FramePlayer.prototype.reverse = function(value) {
  this.backwards = value;
};

FramePlayer.prototype.fullscreen = function() {
  if (
    !document.fullscreenElement && // alternative standard method
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    // current working methods
    if (this.divCont.requestFullscreen) {
      this.divCont.requestFullscreen();
    } else if (this.divCont.msRequestFullscreen) {
      this.divCont.msRequestFullscreen();
    } else if (this.divCont.mozRequestFullScreen) {
      this.divCont.mozRequestFullScreen();
    } else if (this.divCont.webkitRequestFullscreen) {
      this.divCont.webkitRequestFullScreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
};

FramePlayer.prototype.gotoFrame = function(value) {
  if (value !== parseInt(value, 10)) return;

  this.currentFrame = this.startFrame = value;

  if (this.jsonVideoFile === undefined) {
    this.play();
  } else {
    this.drawFrame(this);
  }
};

FramePlayer.prototype.setFilter = function(filter) {
  var canvas = document.querySelector('#' + this.elem + ' canvas');

  switch (filter) {
    case 'normal':
      canvas.setAttribute('class', '');
      break;
    case 'grayscale':
      canvas.setAttribute('class', 'fp-grayscale');
      break;
    case 'sepia':
      canvas.setAttribute('class', 'fp-sepia');
      break;
    case 'invert':
      canvas.setAttribute('class', 'fp-invert');
      break;
    default:
      break;
  }
};

FramePlayer.prototype.getFile = function(src, callback) {
  var _self = this;

  if (typeof src === 'string') {
    var _HTTP = new XMLHttpRequest(),
      p = document.createElement('p');

    if (_HTTP) {
      _HTTP.open('GET', src, true);
      _HTTP.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      _HTTP.send(null);

      _HTTP.onprogress = function() {
        p.innerHTML = 'Loading...';
        p.setAttribute('class', 'fp-loading');
        _self.divCont.appendChild(p);
      };

      if (typeof _HTTP.onload !== undefined) {
        _HTTP.onload = function() {
          _self.divCont.removeChild(p);
          _self.jsonVideoFile = JSON.parse(this.responseText);
          _self.frameLength = _self.jsonVideoFile.frames.length;
          callback(_self);
          _HTTP = null;
        };
      } else {
        _HTTP.onreadystatechange = function() {
          if (_HTTP.readyState === 4) {
            _self.divCont.removeChild(p);
            _self.jsonVideoFile = JSON.parse(this.responseText);
            _self.frameLength = _self.jsonVideoFile.frames.length;
            callback(_self);
            _HTTP = null;
          }
        };
      }
    } else {
      throw 'Error loading file.';
    }
  } else if (src !== null) {
    _self.jsonVideoFile = src;
    _self.frameLength = _self.jsonVideoFile.frames.length;
    callback(_self);
  } else {
    throw 'Error loading file.';
  }
};

// Polyfill
FramePlayer.prototype.initializeRequestAnimationFrame = function() {
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
  // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
  // MIT license

  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x] + 'CancelAnimationFrame'] ||
      window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
};

export default FramePlayer;
