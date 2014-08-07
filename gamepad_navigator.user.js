// Gamepad navigator
// version 0.1
// http://www.mrspeaker.net/
//
// ===== INSTRUCTIONS =====
//
// ==UserScript==
// @name           brenden adamczak try
// @namespace      http://www.mrspeaker.net/
// @description    Navigate web pages with your gamepad... only works with Firefox and NES Retrolink gamepad for now!
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
//
// @include        http://*
// @include        https://*
// ==/UserScript==



console.log("this is working");

//GM_addStyle("a:focus { background-color: #ff0; !important }");

console.log("Past GM");
(function() {
    console.log("inside function");
    // These buttons are for a NES retrolink gamepad.
    // Should really be using input.js or something to support more devices.
    var axisX = 4,
        axisY = 5,
        buttonGo = [1, 2],
        buttonBack = [8],
        buttonForward = [9],
        gamepad = null;
    
    var hasGP = false;
    
    /*
    function onX(isRight) {
        var links = $("a"),
            indx = links.index($("a:focus").first());
        links.eq((indx + isRight) % links.length).focus();
    }

    function onY(isUp) {
        var page = $("html, body");
        page.stop();
        if(isUp === 0) {
            setLink();
            return;
        };
        page.animate({ scrollTop: isUp > 0 ? $(document).height() : 0 }, "slow");
    }

    function onFire() {
        var url = $("a:focus").first().attr("href");
        if(url) window.location = url;
    }

    function setLink() {
        var top = $(window).scrollTop(),
            bottom = top + $(window).height(),
            isInView = function(el) {
                var $el = $(el),
                    elTop = !$el.length ? false : $el.offset().top;
                return elTop !== false && elTop >= top && elTop <= bottom;
            };

        if(isInView($("a:focus").first())) {
            return;
        }

        $("a").each(function(i, el) {
            if(isInView(this)) {
                $(this).focus();
                return false;
            }
        });
    }
    */
    var mousePointer = false;
    function reportOnGamepad(){
    var gp = navigator.getGamepads()[0]; //bet i can makes this better for more controllers
    
    var axesLSUpDown = gp.axes[0];
    var axesLSLeftRight = gp.axes[1];
    
    var axesPosition = getPosition(gp.axes[0],gp.axes[1]);
    
    if(!mousePointer){
        if(axesLSLeftRight > .1){
            console.log("working");
        }else if(axesLSLeftRight < -.1){
            console.log("working");
        }
        if(axesLSUpDown > .1){
            console.log("working");
        }else if(axesLSUpDown < -.1) {
            console.log("working");
        }
        if (gp.buttons[9].pressed === true) { 
            console.log("addedMouse");
            mousePointer = true;
            $("body").append("<div class='pointer'>d</div>")
        }
    }
    
    else{
        $(".pointer").css({
            top: function(index, value){
                //console.log(parseInt(value) + axesPosition.y);            
                return parseInt(value) + (axesPosition.y*10 );
            },
            left:function(index, value){
                //console.log(index + "  "+ (axesPosition.y*5 ));
                return parseInt(value) + (axesPosition.x*10 );
            }
        });
        
        if (gp.buttons[9].pressed === true) { //if you hold the button it can not work.
            console.log("removed gamepad");
            mousePointer = false;
            $(".pointer").remove();
        }
        
    }
    
    

}
    
    
    
/********************************************************************************************************/
    // might wan't to look into navigator.webkitGamepads and MozGamepadAxisMove support for older browsers
/********************************************************************************************************/
    
    
    
    var checkForGamepadSupport = function(){
        return "getGamepads" in navigator;
    }
    
    if(checkForGamepadSupport()){
        console.log("there is gamepad support")
        window.addEventListener("gamepadconnected", function(e) {
            console.log("gamepadConnected");
            hasGP = true;
            
            var hasGP = setInterval(reportOnGamepad,100)
            //gamepad = e.gamepad.index;
        }, false);

        window.addEventListener("gamepaddisconnected", function(){
            console.log("gamepadNotConnected");

        }, false);
        
        
        if(navigator.appVersion.indexOf("Chrome") > 0){  //chrome detective
            console.log("Your using Chrome");
            var checkGP = window.setInterval(function(){ // problem with chrome where it can't get detected
                if(navigator.getGamepads()[0]){
                    if(!hasGP) $(window).trigger("gamepadconnected");
                    window.clearInterval(checkGP);
                }
            }, 500);
        }
        
        
    }else{
        console.log("doesn't have gamepad support");
    }
})();






















var haveEvents = 'GamepadEvent' in window;
var controllers = {};
var rAF = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.requestAnimationFrame;

function connecthandler(e) {
  addgamepad(e.gamepad);
}
function addgamepad(gamepad) {
    {//creates the controller
    }
  rAF(updateStatus);
}

function disconnecthandler(e) {
  removegamepad(e.gamepad);
}

function removegamepad(gamepad) {
  var d = document.getElementById("controller" + gamepad.index);
  document.body.removeChild(d);
  delete controllers[gamepad.index];
}

function updateStatus() {
  if (!haveEvents) {
    scangamepads();
  }
  for (j in controllers) {
    var controller = controllers[j];
    var d = document.getElementById("controller" + j);
    var buttons = d.getElementsByClassName("button");
    for (var i=0; i<controller.buttons.length; i++) {
      var b = buttons[i];
      var val = controller.buttons[i];
      var pressed = val == 1.0;
      if (typeof(val) == "object") {
        pressed = val.pressed;
        val = val.value;
      }
      var pct = Math.round(val * 100) + "%"
      b.style.backgroundSize = pct + " " + pct;
      if (pressed) {
        b.className = "button pressed";
      } else {
        b.className = "button";
      }
    }

    var axes = d.getElementsByClassName("axis");
    for (var i=0; i<controller.axes.length; i++) {
      var a = axes[i];
      a.innerHTML = i + ": " + controller.axes[i].toFixed(4);
      a.setAttribute("value", controller.axes[i] + 1);
    }
  }
  rAF(updateStatus);
}

function scangamepads() {
  var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
  for (var i = 0; i < gamepads.length; i++) {
    if (gamepads[i]) {
      if (!(gamepads[i].index in controllers)) {
        addgamepad(gamepads[i]);
      } else {
        controllers[gamepads[i].index] = gamepads[i];
      }
    }
  }
}

window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);
if (!haveEvents) {
  setInterval(scangamepads, 500);
}








































