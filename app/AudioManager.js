export class AudioManager {

    constructor() {
        // this.fileInput = document.getElementById("fileInput");
        // this.audio = document.getElementById("audio");
        
        this.fileInput = $("#fileInput")[0];
        this.audio = $("#audio")[0];
        
        this.audioCtx = new AudioContext();
        this.audioSrc = this.audioCtx.createMediaElementSource(this.audio);

        this.frAnalyser = this.audioCtx.createAnalyser();
        this.frAnalyser.fftSize = 1024;
        this.frAnalyser.smoothingTimeConstant = 0.9;
        this.frBufferLength = this.frAnalyser.frequencyBinCount;
        this.frDataLength = this.frBufferLength - 64;
        this.frDataArray = new Uint8Array(this.frBufferLength);
        this.frDataArrayNormalized = new Uint8Array(this.frBufferLength);

        this.tdAnalyser = this.audioCtx.createAnalyser();
        this.tdAnalyser.fftSize = 4096;
        this.tdAnalyser.smoothingTimeConstant = 0.9;
        this.tdBufferLength = this.tdAnalyser.frequencyBinCount;
        this.tdDataLength = this.tdBufferLength - 64;
        this.tdDataArray = new Uint8Array(this.tdBufferLength);
        this.tdDataArrayNormalized = new Uint8Array(this.frBufferLength);

        // this.tdHistory = [];
        this.arraySize = 4096;
        this.tdHistory = Array(this.arraySize).fill(0);

        this.audioSrc.connect(this.frAnalyser);
        this.frAnalyser.connect(this.tdAnalyser);
        this.tdAnalyser.connect(this.audioCtx.destination);

        setInterval(() => {
            this.analyzeData();
        }, 10);

    }

    initAudio(elem) {
        var url = elem.attr('audiourl');

        this.audio.src = "app/assets/tracks/" + url;
        this.audio.load();

        $('.playlist li').removeClass('active');
        elem.addClass('active');
    }

    analyzeData() {
        ////////////////////////////////////
        // get FREQUENCY data for this frame

        this.frAnalyser.getByteFrequencyData(this.frDataArray);

        // get highest and lowest FREQUENCY for this frame
        let frCurrentHigh = 0;
        let frCurrentLow = 255;
        this.frDataArray.forEach(f => {
            if (f > frCurrentHigh) frCurrentHigh = f;
            if (f < frCurrentLow) frCurrentLow = f;
        });

        // normalize the data   0..1
        this.frDataArrayNormalized = this.normalizeData(this.frDataArray);

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
        if (this.tdHistory.length > this.arraySize) {
            this.tdHistory.shift();
        }
    }

    normalizeData(sourceData) {
        const multiplier = Math.pow(Math.max(...sourceData), -1);
        return sourceData.map(n => n * multiplier * 255);
    }

}