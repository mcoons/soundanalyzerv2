////////////////////////////////////

window.onload = function() {
  
    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");
    var canvas2D = document.getElementById("canvas2D");
    var ctx2D = canvas2D.getContext("2d");
    var title = document.getElementById("title");

    var audioCtx = new AudioContext();
    var audioSrc = audioCtx.createMediaElementSource(audio);
    var analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    analyser.connect(audioCtx.destination);
    audioSrc.connect(analyser);

    $('.new_Btn').bind("click" , function () {
        $('#thefile').click();
    });
    
    file.onchange = function() {
      var files = this.files;

      title.innerHTML = files[0].name;

      audio.src = URL.createObjectURL(files[0]);
      audio.load();
      audio.play();

      canvas2D.style.width = canvas2D.width;
      canvas2D.style.height = canvas2D.height;

  
      var dataArray = new Uint8Array(bufferLength);
  
      var WIDTH = canvas2D.width;
      var HEIGHT = canvas2D.height;
  
      var dataLength = bufferLength-32; 
      var barWidth = (WIDTH / dataLength) -3;
      var barHeight;
      var x = 0;
  
      var dpi = window.devicePixelRatio;
      
      function fix_dpi() {
      //create a style object that returns width and height
        let style = {
          height() {
            return +getComputedStyle(canvas2D).getPropertyValue('height').slice(0,-2);
          },
          width() {
            return +getComputedStyle(canvas2D).getPropertyValue('width').slice(0,-2);
          }
        }
      //set the correct attributes for a crystal clear image!
        canvas2D.setAttribute('width', style.width() * dpi);
        canvas2D.setAttribute('height', style.height() * dpi);
      }

      function render2DFrame() {
        requestAnimationFrame(render2DFrame);
  
        x = 0;
  
        analyser.getByteFrequencyData(dataArray);
  
        fix_dpi();

        WIDTH = canvas2D.width;
        HEIGHT = canvas2D.height;
    
        barWidth = (WIDTH / dataLength) -3;

        ctx2D.clearRect(0, 0, WIDTH, HEIGHT);

        let textColor;
  
        for (var i = 0; i < bufferLength-10; i++) {
          barHeight = dataArray[i]*1+3;
          
          var r = barHeight + (.22 * (i/dataLength));
          var g = 250 * (i/dataLength);
          var b = 250;
  
          if (i==20) textColor = "rgb(" + r + "," + g + "," + b + ")";

          ctx2D.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          ctx2D.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

  
          x += barWidth + 3;
        }
        title.style.color = textColor;

      }
  
    //   audio.play();
      render2DFrame();



    };
  };

////////////////////////////////////

function initializeSoundDevices() {



}

function initializeSoundData() {}

////////////////////////////////////

function initializeCanvas2D() {

}

function initializeCanvas3D() {}

////////////////////////////////////

function showTitle() {}

function updateCanvas2D() {}

function updateCanvas3D() {}

////////////////////////////////////