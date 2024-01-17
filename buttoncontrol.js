
//Home buton

const homeButton = document.createElement('button');
homeButton.innerHTML='<img src="image/home.png" alt="" style="width:20px; height:20px">';
homeButton.className = 'myButton';

const homeElement = document.createElement('div');
homeElement.className = 'homeButtonDiv';
homeElement.appendChild(homeButton);

export const homeControl = new ol.control.Control({
    element:homeElement,
    
})

homeButton.addEventListener('click',()=>{
    location.href = "index.html"
})



//Thêm fullscreen
const fsButton = document.createElement('button');
fsButton.innerHTML='<img src="image/fullscreen.png" alt="" style="width:20px; height:20px">';
fsButton.className = 'myButton';

const fsElement = document.createElement('div');
fsElement.className = 'fsButtonDiv';
fsElement.appendChild(fsButton);

export const fsControl = new ol.control.Control({
    element:fsElement,
})

fsButton.addEventListener('click',()=>{
    const mapEle = document.getElementById("map");

    if(mapEle.requestFullscreen){
        mapEle.requestFullscreen();
    }else if(mapEle.msRequestFullscreen){
        mapEle.msRequestFullscreen();
    }else if(mapEle.mozRequestFullscreen){
        mapEle.mozRequestFullscreen();
    }else if(mapEle.mswebkitRequestFullscreen){
        mapEle.mswebkitRequestFullscreen();
    }
})


//Bật tắt trường thông tin
var featureInfoButton = document.createElement('button');
featureInfoButton.innerHTML='<img src="image/info.png" alt="" style="width:20px; height:20px">';
featureInfoButton.className = 'myButton';
featureInfoButton.id = 'featureInfoButton';

var featureInfoElement = document.createElement('div');
featureInfoElement.className = 'featureInfoDiv';
featureInfoElement.appendChild(featureInfoButton);

export var featureInfoControl = new ol.control.Control({
    element:featureInfoElement,
    
})
export var featureInfoflag = false;
featureInfoButton.addEventListener('click',()=>{
    featureInfoButton.classList.toggle('clicked');
    featureInfoflag = !featureInfoflag;
})