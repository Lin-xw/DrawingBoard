var canvas = document.getElementById("drawing-board");
var ctx = canvas.getContext("2d");
var eraser = document.getElementById("eraser");
var brush = document.getElementById("brush");
var reSetCanvas = document.getElementById("clear");
var save = document.getElementById("save");
var clear = false;
var aColorBtn = document.getElementsByClassName("color-item");
var activeColor = 'black';

autoSetSize(canvas);
// setCanvasBGC('white');
listenToUser(canvas);

function autoSetSize(canvas){
  canvasSetSize();

  function canvasSetSize() {
    var pageWidth = document.documentElement.clientWidth;
    var pageHeight = document.documentElement.clientHeight;

    canvas.width = pageWidth;
    canvas.height = pageHeight;
  }

  window.onresize = function () {
    canvasSetSize();
  }
}

function setCanvasBGC(color) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";
}

function listenToUser(canvas) {
  var painting = false;
  var lastPoint = {x:undefined,y:undefined};

  if(document.body.ontouchstart !== undefined){
    canvas.ontouchstart = function (e) {
      painting = true;
      var x = e.touches[0].clientX;
      var y = e.touches[0].clientY;
      if(clear){
        ctx.clearRect(x - 5, y - 5, 10, 10)
      }else {
        lastPoint = {"x": x, "y": y};
        drawCircle(x, y, 3);
      }
    }
    canvas.ontouchmove = function (e) {
      if(painting){
        var x = e.touches[0].clientX;
        var y = e.touches[0].clientY;
        var newPoint = {"x": x, "y": y};
        if(clear){
          ctx.clearRect(x - 5, y - 5, 10, 10)
        }else {
          drawCircle(x, y, 3);
          drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        }
        lastPoint = newPoint;
      }
    }

    canvas.ontouchend = function (e){
      painting = false;
    }
  }else{
    canvas.onmousedown = function (e) {
      painting = true;
      var x = e.clientX;
      var y = e.clientY;
      if(clear){
        ctx.clearRect(x - 5, y - 5, 10, 10)
      }else {
        lastPoint = {"x": x, "y": y};
        drawCircle(x, y, 3);
      }
    }
    canvas.onmousemove = function (e) {
      if(painting){
        var x = e.clientX;
        var y = e.clientY;
        var newPoint = {"x": x, "y": y};
        if(clear){
          ctx.clearRect(x - 5, y - 5, 10, 10)
        }else {
          drawCircle(x, y, 3);
          drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y);
        }
        lastPoint = newPoint;
      }
    }

    canvas.onmouseup = function (e){
      painting = false;
    }
  }
}

function drawCircle(x,y,radius) {
  ctx.beginPath();
  // ctx.fillStyle = "black";
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(x1,y1,x2,y2) {
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineWidth = 6;
  ctx.lineTo(x2,y2);
  ctx.stroke();
  ctx.closePath();
}

eraser.onclick = function(){
  clear = true;
  this.classList.add("active");
  brush.classList.remove("active");
}

brush.onclick = function(){
  clear = false;
  this.classList.add("active");
  eraser.classList.remove("active");
}

reSetCanvas.onclick = function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

save.onclick = function () {
  var imgUrl = canvas.toDataURL("image/png");
  var saveA = document.createElement("a");
  document.body.appendChild(saveA);
  saveA.href = imgUrl;
  saveA.download = "zspic"+(new Date).getTime();
  saveA.target = "_blank";
  saveA.click();
}
for(var i=0;i<aColorBtn.length;i++){
  aColorBtn[i].onclick = function () {
    for(var i=0;i<aColorBtn.length;i++) {
      aColorBtn[i].classList.remove("active");
      this.classList.add("active");
      activeColor = this.style.backgroundColor;
      ctx.fillStyle = activeColor;
      ctx.strokeStyle = activeColor;
    }
  }
}