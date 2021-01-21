/*Code for SUKI ROV, developed by mantfish
this code uses a sony playstantion controller 
or a keyboard, no guarantee it will work for you 
**NOTE** needs to be using firefox with this: 
dom.gamepad.non_standard_events.enabled set to 
True. check about:config to change it*/

//variable for lights, initially set to off
var isOn = false;
const log = document.getElementById('log');

//add listeners for gamepad

window.addEventListener("gamepadbuttondown", buttonDown);
window.addEventListener("gamepadbuttonup", buttonUp);

//define variable of gamepad

var gamepadSupportAvailable = navigator.getGamepads || !!navigator.webkitGetGamepads || !!navigator.webkitGamepads;

//sets up events to listen for keydown and keyup events stop key refers to up key

document.addEventListener('keydown', logKey);
document.addEventListener('keyup',stopKey);

//starts the mainloop of the function

var intervalID = setInterval(mainLoop, 100);
var valuesIntervalID = setInterval(update_values, 200);

//here is said function

function mainLoop(){

    sendAxisData();

}

//function that decides what each of the key presses do

function logKey(e) {
    console.log(e.keyCode);
    console.log(isOn);

    if(e.repeat){ return};

    switch(e.keyCode){

        //W key is forward
        case 87:
            sendForward();
            break;
        
        //S key s backwards
        case 83:
            sendBackward();
            break;

        //A key is left
        case 65:
            sendLeftSwing();
            break;

        //D key is right
        case 68:
            sendRightSwing();
            break;

        //I key is up
        case 73:
            sendUp();
            break;

        //K key is down
        case 75:
            sendDown();
            break;

        //Space is toggle lights
        case 32:
            toggleLights();
            break;

        //J key is pan up
        case 74:
            panUp();
            break;

        //L key is pan down
        case 76:
            panDown();
            break;
    }
}

/*This is the function that sends stop moving commands to the ROV
Every key up position will stop the ROV, however only when WASD
is "unpressed" willl it stop moving HORIZONTALLY, and only when 
I/K is "unpressed" will it stop moving VERTICALLY */

function stopKey(d) {
    if(d.repeat){return};
    if (d.keyCode == 32){return true;}

    if (d.keyCode == 87 || d.keyCode == 83 || d.keyCode == 65 || d.keyCode == 68){
        stopHorizontal();
        return true;
    }
    if (d.keyCode == 74 || d.keyCode == 76){
        stopPan();
        return true;
    }
    if (d.keyCode == 73 || d.keyCode == 75){
        stopVertical();
        return true;
    }
    else {        
        stop();
    }
}

//The following functions define what to send to the flask server
//**NOTE*** might get rid and replace with flask send above

function sendUp() {

    flaskSend("up");
    return true;

}
    
function sendDown() {

    flaskSend("down");
    return true;

}

function sendForward() {

    flaskSend("forward");
    return true;

}

function sendBackward() {

    flaskSend("backward");
        return true;

}

function sendLeftSwing() {

    flaskSend("left");
    return true;

}
function sendRightSwing() {

    flaskSend("right");
    return true;

}

//panning function

function panUp(){
    flaskSend("panUp");
}
function panDown() {
    flaskSend("panDown");
}

//Stop functions begin

function stop() {

        flaskSend("stop");
        return true;

}
function stopPan() {

        flaskSend("stopPan");
        return true;

}

function stopHorizontal() {

        flaskSend("stopHorizontal");
        return true;

}
function stopVertical() {

        flaskSend("stopVertical");
        return true;

}

//lights toggling function

function toggleLights() {
    console.log(isOn);
    
    if (isOn == true){
        flaskSend("off");
        isOn = false;
        return true;
    }
    
    if (isOn == false){
        flaskSend("on");
        isOn = true;
        return true;
    }
}

//This is the function which sends the urls to flask

function flaskSend(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", '/' + url , true); // false for synchronous request
        xmlHttp.send( null ); 
        return true;
    }

//function that displays the instructions to the Robot

function displayElement(element) {
    var x = document.getElementById(element);
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }




//Here begin the gamepad code

function buttonUp(e){
    console.log("button up");
    return true;
}



//Here begins the gamepad code


function sendAxisData(){
    var gamepad = navigator.getGamepads()[0];

    //if gamepad means if gamepad variablbe isn't null    

    if (gamepad){
        //define the axis in correlation with controller and floor the num of deimels


        var leftAxis = (gamepad.axes[1]).toFixed(2);  
        var rightAxis = (gamepad.axes[4]).toFixed(2);
        var downAxis = (gamepad.axes[2]).toFixed(2);
        var upAxis = (gamepad.axes[5]).toFixed(2);

        var zvalue = 0.0;

        /*

        

        */

        thrusterSend("left",leftAxis);
        thrusterSend("right",rightAxis);

        if (upAxis < -0.9){
            if(downAxis < -0.9){
                zvalue = 0.0;
            }
            if(downAxis > 0){
                zvalue = -1*downAxis;
            }
        }
        
        else{
            if (upAxis > 0){
                zvalue = upAxis;
            }
            else{
                zvalue = 0;
            }
        }

        thrusterSend("vertical",zvalue);

        console.log("left axis: ",leftAxis);
        console.log("right axis: ",rightAxis);
        console.log("z axis: ",zvalue);

        //send the value of the vertical thruster through
        

    }

    return true;
    

}

function buttonDown(e){

    switch (e.button){
        case 2:
            panUp();
            break;
        case 0:
            panDown();
            break;
        case 1:
            toggleLights();
    }

}



function thrusterSend(thruster,power) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", '/' + thruster + '/' + power , true ); // false for synchronous request
    xmlHttp.send( null ); 
    return true;

}

function update_values() {
    $SCRIPT_ROOT = "http://raspberrypi.local:8000";
    $.getJSON($SCRIPT_ROOT+"/updateValues",
                function(data) {
            document.getElementById("Roll").innerHTML = data.roll;
            document.getElementById("Pitch").innerHTML = data.pitch;
            console.log(data.roll);
            console.log(data.pitch)
        });
}
