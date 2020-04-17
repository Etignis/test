document.addEventListener('DOMContentLoaded', function(){
	let bPlay = false;
	let bMouseDown = false;
	let oPlayButton = document.querySelector("#play");
	let oPauseButton = document.querySelector("#pause");
	let oPrevButton = document.querySelector("#prev");
	let oNextButton = document.querySelector("#next");
	let oOpenButton = document.querySelector("#open");
	let oOpenFile = document.querySelector("#files");
	let oAudio = document.querySelector("#audio");
	let oTime = document.querySelector("#time");
	let oTitle = document.querySelector("#title");
	let oProgress = document.querySelector("#progress_input");
	let oVolume = document.querySelector("#volume_input");
	let aMusic = [];
	let nTrackIndex = 0;
	let nDuration = 0;
	
	let oColors = {};
	
	let aRanges = document.querySelectorAll("input[type='range']");
	
	oOpenButton.onclick = function(){
		oOpenFile.click();
	}
	oOpenFile.onchange = function(){
		var fileList = this.files; /* теперь вы можете работь со списком файлов */
		aMusic = this.files;
		oAudio.src = URL.createObjectURL(aMusic[nTrackIndex]);
		play();
	}
		
	
	oAudio.onended = function(e) {
		next();
  }
	oAudio.addEventListener('timeupdate', function(oEvent){
	
		showDurationProgress(!bMouseDown);
	}, false);
	
	oAudio.onprogress = function(){
		nDuration = this.duration;
		showDurationProgress();
	}
	

	
	oPlayButton.onclick = play;
	oPauseButton.onclick = pause;
	oPrevButton.onclick = prev;
	oNextButton.onclick = next;
	
	oProgress.addEventListener('change',  time_change); 
	//oProgress.addEventListener('click',  pause);  
	oProgress.addEventListener('mousedown',  function(){bMouseDown=true}); 
	//oProgress.addEventListener('mousedown',  time_change); 
	oProgress.addEventListener('mouseup',  function(){bMouseDown=false});
	oVolume.addEventListener('mousemove',  volume_change); 

	
	function setTitle(){
		let sTitle = aMusic[nTrackIndex].name;
		oTitle.innerText = sTitle;
	}
	function getTime(n){
		//let nMinutes =  n%60;
		let nSeconds = ~~(n<60? n :n%60);
		if(nSeconds<10)
			nSeconds="0"+nSeconds;
		let nMinutes = n<60? 0 : ~~(n/60);
		return `${nMinutes}:${nSeconds}`;
	}
	function getPercent(nCur, nMax){
		return ~~(nCur*100/nMax);
	}
	function showDurationProgress (bUpdateValue){
		let nFull = getTime(nDuration)
		let nCurrent = getTime(oAudio.currentTime)
		oTime.innerText = `${nCurrent}/${nFull}`;
		
		let nPerc = getPercent(oAudio.currentTime, nDuration);
		if(bUpdateValue!==false) {
			oProgress.value = nPerc;
		}
		
		oProgress.style.background = `linear-gradient(90deg, ${oColors['main-color']} ${nPerc}%, ${oColors['color']} ${nPerc+0.1}%)`;
	}
	
	function _play(){
		if(oAudio.readyState == 4){
						oPlayButton.style.display = 'none';
						oPauseButton.style.display = 'flex';
						oAudio.play();
						setTitle();
					} else {
						alert("Треки не выбраны или еще не загружены");
					}
	}
	function play(){
		if(oAudio.readyState<4) {
			oAudio.addEventListener('canplay', function() {
					_play();
				},
				{
					once: true
				}
			);			
		} else {
			_play();
		}
	}
	
	function pause(){
		oPlayButton.style.display = 'flex';
		oPauseButton.style.display = 'none';
		oAudio.pause();
	}

	function next(){
		nTrackIndex++;
		if(nTrackIndex<aMusic.length){
			oAudio.src = URL.createObjectURL(aMusic[nTrackIndex]);
			play();
		} else {
			alert("Это последний трек")
		}
	}
	
	function prev(){
		nTrackIndex--;
		if(nTrackIndex>=0){
			oAudio.src = URL.createObjectURL(aMusic[nTrackIndex]);
			play();
		} else {
			alert("Это первый трек")
		}
	}
	
	function time_change(oEvent){
		let nValue = Number(oEvent.target.value);
		let nK = nDuration/100;
		
		let nNewTime = Math.floor(nValue*nK);
		oAudio.currentTime = nNewTime;
	}

	function volume_change(oEvent){
		let nValue = Number(oEvent.target.value)/100;
		oAudio.volume = nValue; 
	}

	function init(){
		// load colors from CSS
		let aCssVars = ['main-color', 'color'];
		aCssVars.forEach(function(sVar){
			let sVal = getComputedStyle(document.documentElement).getPropertyValue(`--${sVar}`); 
			if(sVal) {
				oColors[sVar] = sVal.trim(); 
			}
		});
		
		// init ranges		
		aRanges.forEach(function(oRange){
			let nPerc = getPercent(oRange.value, 100);			
			oRange.style.background = `linear-gradient(90deg, ${oColors['main-color']} ${nPerc}%, ${oColors['color']} ${nPerc+0.1}%)`;
			
			oRange.addEventListener('mousemove', function(oEvent){
				let nPerc = getPercent(oEvent.target.value, 100);			
				oRange.style.background = `linear-gradient(90deg, ${oColors['main-color']} ${nPerc}%, ${oColors['color']} ${nPerc+0.1}%)`;
			});
			oRange.addEventListener('change', function(oEvent){
				let nPerc = getPercent(oEvent.target.value, 100);			
				oRange.style.background = `linear-gradient(90deg, ${oColors['main-color']} ${nPerc}%, ${oColors['color']} ${nPerc+0.1}%)`;
			});
	
			
		});
		
		Audio.volume = 0.5;
		
		// hide pause
		oPauseButton.style.display = 'none';
	}

	init()
});