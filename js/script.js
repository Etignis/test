document.addEventListener('DOMContentLoaded', function(){
	let bPlay = false;
	let oPlayButton = document.querySelector("#play");
	let oPauseButton = document.querySelector("#pause");
	let oOpenButton = document.querySelector("#open");
	let oOpenFile = document.querySelector("#files");
	let oAudio = document.querySelector("#audio");
	let oTime = document.querySelector("#time");
	let oTitle = document.querySelector("#title");
	let oScale = document.querySelector("#progress_input");
	let aMusic = [];
	let nTrackIndex = 0;
	let nDuration = 0;
	oOpenButton.onclick = function(){
		oOpenFile.click();
	}
	oOpenFile.onchange = function(){
		var fileList = this.files; /* теперь вы можете работь со списком файлов */
		aMusic = this.files;
		oAudio.src = URL.createObjectURL(aMusic[nTrackIndex]);
	}
	
	oAudio.onend = function(e) {
		nTrackIndex++;
		if(nTrackIndex<aMusic.length){
			oAudio.src = URL.createObjectURL(aMusic[nTrackIndex]);
			play();
		}
  }
	oAudio.addEventListener('timeupdate', function(){
		showDurationProgress();
	}, false);
	
	oAudio.onprogress = function(){
		nDuration = this.duration;
		showDurationProgress();
	}
	
	oPlayButton.onclick = play;
	oPauseButton.onclick = pause;
	
	function setTitle(){
		let sTitle = aMusic[nTrackIndex].name;
		oTitle.innerText = sTitle;
	}
	function getTime(n){
		//let nMinutes =  n%60;
		let nSeconds = ~~(n<60? n :n/60);
		if(nSeconds<10)
			nSeconds="0"+nSeconds;
		let nMinutes = n<60? 0 : ~~(n%60);
		return `${nMinutes}:${nSeconds}`;
	}
	function getPercent(nCur, nMax){
		return ~~(nCur*nMax/100);
	}
	function showDurationProgress (){
		let nFull = getTime(nDuration)
		let nCurrent = getTime(oAudio.currentTime)
		oTime.innerText = `${nCurrent}/${nFull}`;
		
		let nPerc = getPercent(oAudio.currentTime, nDuration);
		oScale.value = nPerc;
		
		oScale.style.background = `linear-gradient(90deg, #d44 ${nPerc}%, #00000099 ${nPerc+0.1}%)`;
	}
	
	function play(){
		oPlayButton.style.display = 'none';
		oPauseButton.style.display = 'flex';
		oAudio.play();
		setTitle();
	} 
	function pause(){
		oPlayButton.style.display = 'flex';
		oPauseButton.style.display = 'none';
		oAudio.pause();
	}

	function init(){
		oPauseButton.style.display = 'none';
	}

	init()
});