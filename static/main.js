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

function upPop() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

//Here begin the gamepad code

function buttonDown(e){
    console.log("button pressed");
    return true;
}

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

        var yAxis = (gamepad.axes[1]).toFixed(2);
        var xAxis = (gamepad.axes[0]).toFixed(2);  
        var zAxis = (gamepad.axes[4]).toFixed(2);
 //       var panAxis = (gamepad.axes[?].toFixed(2))

        //log each of the axis values *COMMENT OUT*

        /*

        console.log("y axis: ",yAxis);
        console.log("x axis: ",xAxis);
        console.log("z axis: ",zAxis);

        */

        //send the value of the vertical thruster through

        verticalThrusters = -1*zAxis;
        thrusterSend("vertical",verticalThrusters)

        //In this case the joystick is in the middle position

        if(yAxis == 0){

            //this means we send the opposite values to ensure max turning

            leftThruster = xAxis
            rightThruster = -1*xAxis

            //log thruster values COMMENT OUT

            console.log("right thruster: ",rightThruster);
            console.log("left thruster: ",leftThruster);

            //send the values to the thrusters

            thrusterSend("left",leftThruster);
            thrusterSend("right",rightThruster);

            return true;
        }
        

        if(xAxis > 0){  

            //this is the strange circle equation, sometimes buggy

            var leftThruster = -1*yAxis;
            var rightThruster = (-1*yAxis)*(1-xAxis);

            console.log("right thruster: ",rightThruster);
            console.log("left thruster: ",leftThruster);

            
        }
        else{

            //opposite circle equation, we have some kind of error here

            var rightThruster = -1*yAxis;
            var leftThruster = (-1*yAxis)*(1+xAxis);

            console.log("right thruster: ",rightThruster);
            console.log("left thruster: ",leftThruster);


        }

        //send those values
        
        thrusterSend("left",leftThruster);
        thrusterSend("right",rightThruster);
    }

    return true;
    

}

function buttonDown(e){

    switch (e.button){
        case 6:
            panUp;
            break;
        case 7:
            panDown;
            break;
        case 1:
            toggleLights();
    }

}



function thrusterSend(thruster,power) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", '/' + thruster + '/' + power , false ); // false for synchronous request
    xmlHttp.send( null ); 
    return true;

}
