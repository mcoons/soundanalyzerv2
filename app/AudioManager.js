// the full domain extends from 0 to 22,050 Hz
// frequencies are spread linearly from 0 to 1/2 of the sample rate
// for 48000 sample rate, the last item of the array will represent the decibel value for 24000 Hz
// minDecibels - 0 dB is the loudest possible sound, default min is -100 dB
// maxDecibels - default value is -30 dB

export class AudioManager {


    constructor(options) {

        this.options = options;

        this.fileInput = $("#fileInput")[0];
        this.audio = $("#audio")[0];
        
        this.streams;
        

        this.audio.volume = .7;
        this.smoothingConstant = .9;
        this.maxAverages = 50;
        this.minDecibels = -100;  // -100
        this.maxDecibels = 0;   // -30 
        this.tdHistoryArraySize = 64;  // 4096



        this.audio.addEventListener("loadstart", function () {
            //grabbing the file
            console.log("Loading has started");
        });

        this.audio.addEventListener("durationchange", function () {
            //you can display the duration now
            console.log("Duration has changed");
        });

        this.audio.addEventListener("loadedmetadata", function () {
            //you can display the duration now
            console.log("Metadata has been loaded");
        });

        this.audio.addEventListener("loadeddata", function () {
            //you could display the playhead now
            console.log("Data has been loaded");
        });

        this.audio.addEventListener("progress", function () {
            // you could let the user know the media is downloading
            console.log("Download in progress");
        });

        this.audio.addEventListener("canplay", function () {
            //audio is ready to play
            console.log("Media ready to be played");
        });

        this.audio.addEventListener("canplaythrough", function () {
            //audio is ready to play all the way through
            console.log("Media is ready to be played completely through");
        });

        this.audio.addEventListener("suspend", function () {
            console.log("Download has suspended");
        });

        this.audio.addEventListener("abort", function () {
            console.log("Download has aborted");
        });

        this.audio.addEventListener("error", function () {
            console.log("Download has errored");
        });

        this.audio.addEventListener("emptied", function () {
            console.log("Media buffer has been emptied");
        });

        this.audio.addEventListener("stalled", function (e) {
            console.log("Download has stalled");
            console.log(e);

            // var audio = this;
            // audio.load();
    
            // // Threw in these two lines for good measure.
            // audio.play();
            // audio.pause();
        });

        try {
            // Fix up for prefixing
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContext();
        } catch (e) {
            alert('Web Audio API is not supported in this browser');
        }

        // this.unlockAudioContext(this.audioCtx);

        this.audioSrc = this.audioCtx.createMediaElementSource(this.audio); /* <<<<<<<<<<<<<<<<<<< */

        this.fr64Analyser = this.audioCtx.createAnalyser();
        this.fr64Analyser.fftSize = 128;
        this.fr64Analyser.minDecibels = this.minDecibels;
        this.fr64Analyser.maxDecibels = this.maxDecibels;
        this.fr64Analyser.smoothingTimeConstant = this.smoothingConstant;
        this.fr64BufferLength = this.fr64Analyser.frequencyBinCount;
        this.fr64DataLength = this.fr64BufferLength;
        this.fr64DataArray = new Uint8Array(this.fr64BufferLength);
        this.fr64DataArrayNormalized = new Uint8Array(this.fr64BufferLength);


        this.fr128Analyser = this.audioCtx.createAnalyser();
        this.fr128Analyser.fftSize = 256;
        this.fr128Analyser.minDecibels = this.minDecibels;
        this.fr128Analyser.maxDecibels = this.maxDecibels;
        this.fr128Analyser.smoothingTimeConstant = this.smoothingConstant;
        this.fr128BufferLength = this.fr128Analyser.frequencyBinCount;
        this.fr128DataLength = this.fr128BufferLength;
        this.fr128DataArray = new Uint8Array(this.fr128BufferLength);
        this.fr128DataArrayNormalized = new Uint8Array(this.fr128BufferLength);


        this.fr256Analyser = this.audioCtx.createAnalyser();
        this.fr256Analyser.fftSize = 512;
        this.fr256Analyser.minDecibels = this.minDecibels;
        this.fr256Analyser.maxDecibels = this.maxDecibels;
        this.fr256Analyser.smoothingTimeConstant = this.smoothingConstant;
        this.fr256BufferLength = this.fr256Analyser.frequencyBinCount;
        this.fr256DataLength = this.fr256BufferLength;
        this.fr256DataArray = new Uint8Array(this.fr256BufferLength);
        this.fr256DataArrayNormalized = new Uint8Array(this.fr256BufferLength);


        this.fr512Analyser = this.audioCtx.createAnalyser();
        this.fr512Analyser.fftSize = 1024;
        this.fr512Analyser.minDecibels = this.minDecibels;
        this.fr512Analyser.maxDecibels = this.maxDecibels;
        this.fr512Analyser.smoothingTimeConstant = this.smoothingConstant;
        this.fr512BufferLength = this.fr512Analyser.frequencyBinCount;
        this.fr512DataLength = this.fr512BufferLength;
        this.fr512DataArray = new Uint8Array(this.fr512BufferLength);
        this.fr512DataArrayNormalized = new Uint8Array(this.fr512BufferLength);


        this.fr1024Analyser = this.audioCtx.createAnalyser();
        this.fr1024Analyser.fftSize = 2048;
        this.fr1024Analyser.minDecibels = this.minDecibels;
        this.fr1024Analyser.maxDecibels = this.maxDecibels;
        this.fr1024Analyser.smoothingTimeConstant = this.smoothingConstant;
        this.fr1024BufferLength = this.fr1024Analyser.frequencyBinCount;
        this.fr1024DataLength = this.fr1024BufferLength;
        this.fr1024DataArray = new Uint8Array(this.fr1024BufferLength);
        this.fr1024DataArrayNormalized = new Uint8Array(this.fr1024BufferLength);


        this.fr2048Analyser = this.audioCtx.createAnalyser();
        this.fr2048Analyser.fftSize = 4096;
        this.fr2048Analyser.minDecibels = this.minDecibels;
        this.fr2048Analyser.maxDecibels = this.maxDecibels;
        this.fr2048Analyser.smoothingTimeConstant = this.smoothingConstant;
        this.fr2048BufferLength = this.fr2048Analyser.frequencyBinCount;
        this.fr2048DataLength = this.fr2048BufferLength;
        this.fr2048DataArray = new Uint8Array(this.fr2048BufferLength);
        this.fr2048DataArrayNormalized = new Uint8Array(this.fr2048BufferLength);


        this.fr4096Analyser = this.audioCtx.createAnalyser();
        this.fr4096Analyser.fftSize = 8192;
        this.fr4096Analyser.minDecibels = this.minDecibels;
        this.fr4096Analyser.maxDecibels = this.maxDecibels;
        this.fr4096Analyser.smoothingTimeConstant = this.smoothingConstant;
        this.fr4096BufferLength = this.fr4096Analyser.frequencyBinCount;
        this.fr4096DataLength = this.fr4096BufferLength;
        this.fr4096DataArray = new Uint8Array(this.fr4096BufferLength);
        this.fr4096DataArrayNormalized = new Uint8Array(this.fr4096BufferLength);


        this.fr8192Analyser = this.audioCtx.createAnalyser();
        this.fr8192Analyser.fftSize = 16384;
        this.fr8192Analyser.minDecibels = this.minDecibels;
        this.fr8192Analyser.maxDecibels = this.maxDecibels;
        this.fr8192Analyser.smoothingTimeConstant = this.smoothingConstant-.05;
        this.fr8192BufferLength = this.fr8192Analyser.frequencyBinCount;
        this.fr8192DataLength = this.fr8192BufferLength;
        this.fr8192DataArray = new Uint8Array(this.fr8192BufferLength);
        this.fr8192DataArrayNormalized = new Uint8Array(this.fr8192BufferLength);


        this.fr16384Analyser = this.audioCtx.createAnalyser();
        this.fr16384Analyser.fftSize = 32768;
        this.fr16384Analyser.minDecibels = this.minDecibels;
        this.fr16384Analyser.maxDecibels = this.maxDecibels;
        this.fr16384Analyser.smoothingTimeConstant = this.smoothingConstant-.1;
        this.fr16384BufferLength = this.fr16384Analyser.frequencyBinCount;
        this.fr16384DataLength = this.fr16384BufferLength;
        this.fr16384DataArray = new Uint8Array(this.fr16384BufferLength);
        this.fr16384DataArrayNormalized = new Uint8Array(this.fr16384BufferLength);






        this.frAnalyser = this.audioCtx.createAnalyser();
        this.frAnalyser.fftSize = 256;
        this.frAnalyser.minDecibels = this.minDecibels;
        this.frAnalyser.maxDecibels = this.maxDecibels;
        this.frAnalyser.smoothingTimeConstant = this.smoothingConstant;
        this.frBufferLength = this.frAnalyser.frequencyBinCount;
        this.frDataLength = this.frBufferLength;
        this.frDataArray = new Uint8Array(this.frBufferLength);
        this.frDataArrayNormalized = new Uint8Array(this.frBufferLength);

        this.frAnalyserAll = this.audioCtx.createAnalyser();
        this.frAnalyserAll.fftSize = 32768;
        this.frAnalyserAll.minDecibels = this.minDecibels;
        this.frAnalyserAll.maxDecibels = this.maxDecibels;
        this.frAnalyserAll.smoothingTimeConstant = this.smoothingConstant;
        this.frBufferLengthAll = this.frAnalyserAll.frequencyBinCount;
        this.frDataLengthAll = this.frBufferLengthAll;
        this.frDataArrayAll = new Uint8Array(this.frBufferLengthAll);
        this.frDataArrayNormalizedAll = new Uint8Array(this.frBufferLengthAll);


        this.tdAnalyser = this.audioCtx.createAnalyser();
        this.tdAnalyser.fftSize = 4096;
        this.tdAnalyser.minDecibels = this.minDecibels;
        this.tdAnalyser.maxDecibels = this.maxDecibels;
        this.tdAnalyser.smoothingTimeConstant = this.smoothingConstant;
        this.tdBufferLength = this.tdAnalyser.frequencyBinCount;
        this.tdDataLength = this.tdBufferLength;
        this.tdDataArray = new Uint8Array(this.tdBufferLength);
        this.tdDataArrayNormalized = new Uint8Array(this.frBufferLength);

        // this.tdHistory = [];
        this.tdHistory = Array(this.tdHistoryArraySize).fill(0);

        this.sample1 = [];
        this.sample1Normalized = [];
        this.sample1Totals = [];
        this.sample1Averages = [];

        this.clearSampleArrays();

        this.soundArrays = [
            this.fr64DataArray,
            this.fr128DataArray,
            this.fr256DataArray,
            this.fr512DataArray,
            this.fr1024DataArray,
            this.fr2048DataArray,
            this.fr4096DataArray,
            this.fr8192DataArray,
            this.fr16384DataArray
        ];

        this.analyzerArray = [
            this.fr64Analyser,
            this.fr128Analyser,
            this.fr256Analyser,
            this.fr512Analyser,
            this.fr1024Analyser,
            this.fr2048Analyser,
            this.fr4096Analyser,
            this.fr8192Analyser,
            this.fr16384Analyser,
            this.frAnalyser,
            this.frAnalyserAll
        ];


        this.audioSrc.connect(this.fr16384Analyser);
        this.fr16384Analyser.connect(this.fr8192Analyser);
        this.fr8192Analyser.connect(this.fr4096Analyser);
        this.fr4096Analyser.connect(this.fr2048Analyser);
        this.fr2048Analyser.connect(this.fr1024Analyser);
        this.fr1024Analyser.connect(this.fr512Analyser);
        this.fr512Analyser.connect(this.fr256Analyser);
        this.fr256Analyser.connect(this.fr128Analyser);
        this.fr128Analyser.connect(this.fr64Analyser);
        this.fr64Analyser.connect(this.frAnalyserAll);
        this.frAnalyserAll.connect(this.frAnalyser);
        this.frAnalyser.connect(this.tdAnalyser);
        this.tdAnalyser.connect(this.audioCtx.destination);

        this.siteIndex = Math.round(Math.random() * 12) + 1;
        this.localIndex = 1;

        this.fileList = [];

        this.isSiteTrack = true;
        this.isMic = false;

        let current = $('.playlist li:nth-child(' + this.siteIndex + ')');

        if (this.options.showTitle){
            title.innerHTML = current[0].innerHTML;
        }

        this.unlockAudioContext(this.audioCtx);

        setTimeout(this.initAudio($(current)), 5000);

    }


    initAudio(elem) {
        console.log("entered initAudio");
        var url = elem.attr('audiourl');

        this.audio.src = "app/assets/tracks/" + url;
        this.audio.load()
        
        this.audio.play()            
        .then(function () {
            console.log("Audio Successfully Playing");
        })
        .catch(function () {
            console.log("Audio Failed Playing");
        });

        $('.playlist li').removeClass('active');
        elem.addClass('active');

    }

    initMic() {

        function errorMsg(msg, error) {
            alert("Error: " + msg);
            if (typeof error !== 'undefined') {
                console.error(error);
            }
        }

        function hasGetUserMedia() {
            return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
        }

        if (hasGetUserMedia()) {
            alert("gtg");
        } else {
            alert('getUserMedia() is not supported by your browser');
            return;
        }

        'use strict';

        var constraints = window.constraints = {
            audio: true
        };

        let me = this;

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (streams) {

                // var audioTracks = streams.getAudioTracks();

                // setTimeout(() => {
                //     console.log(streams.getTracks());
                //     streams.getTracks().forEach(function (track) {
                //         track.stop();
                //         console.log('Track Stopped');
                //         clearInterval(interval);
                //     })
                // }, 1000);


                // Create a MediaStreamAudioSourceNode
                // Feed the HTMLMediaElement into it
                // var audioCtx = new AudioContext();

                me.streams = streams;
                me.audioSrc = me.audioCtx.createMediaStreamSource(me.streams);


                // var fr64Analyser = audioCtx.createAnalyser();
                // fr64Analyser.fftSize = 128;
                // fr64Analyser.smoothingTimeConstant = this.smoothingConstant;
                // fr64DataArray = new Uint8Array(fr64Analyser.frequencyBinCount);

                // source.connect(fr64Analyser);

                // let interval = setInterval(() => {
                //     fr64Analyser.getByteFrequencyData(fr64DataArray);
                //     console.log(fr64DataArray[32]);
                // }, 20);

            })
            .catch(function (error) {
                if (error.name === 'PermissionDeniedError') {
                    errorMsg('Permissions have not been granted to use your camera and ' +
                        'microphone, you need to allow the page access to your devices in ' +
                        'order for the demo to work.');
                }
                errorMsg('getUserMedia error: ' + error.name, error);
            });
    }

    getFrequencyValue(frequency, dataSource) {
        let nyquist = this.audioCtx.sampleRate / 2;
        let index = Math.round(frequency / nyquist * dataSource.length);
        return dataSource[index];
    }





    analyzeData() {
        ////////////////////////////////////
        // get FREQUENCY data for this frame

        this.frAnalyser.getByteFrequencyData(this.frDataArray);
        this.frAnalyserAll.getByteFrequencyData(this.frDataArrayAll);

        this.fr64Analyser.getByteFrequencyData(this.fr64DataArray);
        this.fr128Analyser.getByteFrequencyData(this.fr128DataArray);
        this.fr256Analyser.getByteFrequencyData(this.fr256DataArray);
        this.fr512Analyser.getByteFrequencyData(this.fr512DataArray);
        this.fr1024Analyser.getByteFrequencyData(this.fr1024DataArray);
        this.fr2048Analyser.getByteFrequencyData(this.fr2048DataArray);
        this.fr4096Analyser.getByteFrequencyData(this.fr4096DataArray);
        this.fr8192Analyser.getByteFrequencyData(this.fr8192DataArray);
        this.fr16384Analyser.getByteFrequencyData(this.fr16384DataArray);



        // normalize the data   0..1
        this.frDataArrayNormalized = this.normalizeData(this.frDataArray);
        this.frDataArrayNormalizedAll = this.normalizeData(this.frDataArrayAll);



        // log sample

        for (let index = 0; index < 64; index++) { //  64*9 = 576

            this.sample1[index] = (this.soundArrays[8])[index];
            this.sample1[index + 64] = (this.soundArrays[8])[index + 64];
            this.sample1[index + 128] = (this.soundArrays[7])[index + 64];
            this.sample1[index + 192] = (this.soundArrays[6])[index + 64];
            this.sample1[index + 256] = (this.soundArrays[5])[index + 64];
            this.sample1[index + 320] = (this.soundArrays[4])[index + 64];
            this.sample1[index + 384] = (this.soundArrays[3])[index + 64];
            this.sample1[index + 448] = (this.soundArrays[2])[index + 64];
            this.sample1[index + 512] = (this.soundArrays[1])[index + 64];

        }

        // get highest,lowest and average FREQUENCIES for this frame
        let frCurrentHigh = 0;
        let frCurrentLow = 255;

        this.sample1.forEach((f, i) => {
            if (f > frCurrentHigh) frCurrentHigh = f;
            if (f < frCurrentLow) frCurrentLow = f;

            this.sample1Totals[i].values.push(f / 10); //  /255
            if (this.sample1Totals[i].values.length > this.maxAverages) {
                this.sample1Totals[i].values.shift()
            };

            let total = 0;
            this.sample1Totals[i].values.forEach(v => {
                total += v;
            })
            this.sample1Averages[i].value = total / this.sample1Totals[i].values.length;
        });

        this.sample1Normalized = this.normalizeData(this.sample1);





        //////////////////////////////////////
        // get TIME DOMAIN data for this frame

        this.tdAnalyser.getByteTimeDomainData(this.tdDataArray);

        // get the highest for this frame
        let highest = 0;
        this.tdDataArray.forEach(d => {
            if (d > highest) highest = d;
        });

        // normalize the data   0..1
        this.tdDataArrayNormalized = this.normalizeData(this.tdDataArray);

        // TODO: historical data for wave form       TODO:    TODO:
        this.tdHistory.push(highest);
        if (this.tdHistory.length > this.tdHistoryArraySize) {
            this.tdHistory.shift();
        }
    }

    normalizeData(sourceData) {
        const multiplier = Math.pow(Math.max(...sourceData), -1) || 0;
        return sourceData.map(n => n * multiplier * 255);
    }

    unlockAudioContext(audioCtx) {
        console.log("entering unlock");

        this.audio.src = "app/nothing.wav";
        this.audio.load();
        this.audio.play()            
        .then(function () {
            console.log("Audio Successfully Playing in unlock");
        })
        .catch(function (error) {
            console.log("Audio Failed Playing in unlock");
            console.log(error);
        });

        if (audioCtx.state !== 'suspended'){

            console.log("Audio ! suspended in unlock");
            this.audio.pause()
            this.audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=';            return;
        } 

        console.log("Audio is suspended in unlock");

        const b = document.body;
        const events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
        events.forEach(e => b.addEventListener(e, unlock, false));

        this.audio.pause()
        this.audio.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAVFYAAFRWAAABAAgAZGF0YQAAAAA=';            return;

        function unlock() {
            audioCtx.resume().then(clean);
        }

        function clean() {
            events.forEach(e => b.removeEventListener(e, unlock));
        }
    }


    clearSampleArrays() {
        // this.sampleCount = 0;

        for (let index = 0; index < 576; index++) {
            this.sample1[index] = 0;
            this.sample1Normalized[index] = 0;
            this.sample1Totals[index] = {
                index: index,
                values: []
            };
            this.sample1Averages[index] = {
                index: index,
                values: []
            };
        }
    }


    getTopBuckets() {

        let clone2 = [];
        for (let index = 0; index < 9; index++) {

            let clone = this.sample1Averages.slice(index * 64, index * 64 + 64);

            clone.sort((a, b) => b.value - a.value);

            for (let index = 0; index < 64; index++) {
                clone2.push(clone[index]);
            }

        }

        clone2.sort((a, b) => a.index - b.index);

        // clone2.forEach(b => {
        //     console.log(b);
        // });

        return clone2;

    }


}

//                 32                 +               32                       64 wide         32-63 of 64
//         32      +       32         +        32      +       32              32 wide         32-63 of 128
//     32  +   32  +   32  +   32     +    32  +   32  +   32  +   32          16 wide         32-63 of 256
//   32+32 + 32+32 + 32+32 + 32+32    +  32+32 + 32+32 + 32+32 + 32+32          8 wide         32-63 of 512
//                                                                              4 wide         32-63 of 1024
//                                                                              2 wide         32-63 of 2048
//                                                                              1 wide         32-63 of 4096
//                                                                             .5 wide          0-63 of 8192

//                                                                             32*9  =  288

//                                                                             0-287 objects