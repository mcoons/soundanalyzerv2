////////////////////////////////////

window.onload = function() {
  
    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");

    $('.new_Btn').bind("click" , function () {
        $('#thefile').click();
    });
    
    file.onchange = function() {
      var files = this.files;
      audio.src = URL.createObjectURL(files[0]);
      audio.load();
      audio.play();
      var context = new AudioContext();
      var src = context.createMediaElementSource(audio);
      var analyser = context.createAnalyser();

  
      var canvas = document.getElementById("canvas2D");

      var ctx = canvas.getContext("2d");

      canvas.style.width = canvas.width;
      canvas.style.height = canvas.height;

      src.connect(analyser);
      analyser.connect(context.destination);
  
      analyser.fftSize = 128;
  
      var bufferLength = analyser.frequencyBinCount;
      console.log(bufferLength);
  
      var dataArray = new Uint8Array(bufferLength);
  
      var WIDTH = canvas.width;
      var HEIGHT = canvas.height;
  
      var dataLength = bufferLength-15; 
      var barWidth = (WIDTH / dataLength) -2 ;
      var barHeight;
      var x = 0;
  
      var dpi = window.devicePixelRatio;

      document.getElementById("title").innerHTML = files[0].name;

      
      function fix_dpi() {
      //create a style object that returns width and height
        let style = {
          height() {
            return +getComputedStyle(canvas).getPropertyValue('height').slice(0,-2);
          },
          width() {
            return +getComputedStyle(canvas).getPropertyValue('width').slice(0,-2);
          }
        }
      //set the correct attributes for a crystal clear image!
        canvas.setAttribute('width', style.width() * dpi);
        canvas.setAttribute('height', style.height() * dpi);
      }

      function render2DFrame() {
        requestAnimationFrame(render2DFrame);
  
        x = 0;
  
        analyser.getByteFrequencyData(dataArray);
  
        fix_dpi();

        WIDTH = canvas.width;
        HEIGHT = canvas.height;
    
        barWidth = (WIDTH / dataLength) -2;

        ctx.clearRect(0, 0, WIDTH, HEIGHT);
  
        for (var i = 0; i < bufferLength-10; i++) {
          barHeight = dataArray[i]*1.5;
          
          var r = barHeight + (.22 * (i/dataLength));
          var g = 250 * (i/dataLength);
          var b = 250;
  
          ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
  
          x += barWidth + 2;
        }
      }
  
      audio.play();
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