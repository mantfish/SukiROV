from flask import Flask, render_template, jsonify
import serial
import time

# set percentage of max thrust for movement NOTE must be between 0 -> 0.5
pThrust = 0.25*100
rvDir = 1
rhDir = 1
lvDir = 1
lhDir = 1

lhCode = 350
lvCode = 450
rhCode = 550
rvCode = 650

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')


@app.route("/")
def home():
    return render_template('home.html')
    

#app routes for keyboard

@app.route("/up")
def up():
    serialWrite(lvCode + lvDir*pThrust)
    serialWrite(rvCode + rvDir*pThrust)
    print("up")
    return "recieved"

@app.route("/down")
def down():
    serialWrite(lvCode + -1*lvDir*pThrust)
    serialWrite(rvCode + -1*rvDir*pThrust)
    print("down")
    return "recieved"

@app.route("/forward")
def forward():
    serialWrite(lvCode + 1*lhDir*pThrust)
    serialWrite(rvCode + 1*rhDir*pThrust)
    print("forward")
    return "recieved"

@app.route("/backward")
def backward():
    serialWrite(lvCode + -1*lhDir*pThrust)
    serialWrite(rvCode + -1*rhDir*pThrust)
    print("backward")
    return "recieved"


@app.route("/left")
def left():
    serialWrite(lvCode + -1*lhDir*pThrust)
    serialWrite(rvCode + 1*rhDir*pThrust)
    print("left")
    return "recieved"


@app.route("/right")
def right():
    serialWrite(lvCode + 1*lhDir*pThrust)
    serialWrite(rvCode + -1*rhDir*pThrust)
    print("right")
    return "recieved"


@app.route("/panUp")
def panUp():
    serialWrite(700)
    print("panUp")
    return "recieved"

@app.route("/panDown")
def panDown():
    serialWrite(710)
    print("panDown")
    return "recieved"


@app.route("/stop")
def stop():
    serialWrite(rhCode)
    serialWrite(rvCode)
    serialWrite(lvCode)
    serialWrite(lhCode)
    print("stop")
    return "recieved"

@app.route("/stopHorizontal")
def stopHorizontal():
    serialWrite(lhCode)
    serialWrite(rhCode)
    print("stopH")
    return "recieved"

@app.route("/stopVertical")
def stopVertical():
    serialWrite(rvCode)
    serialWrite(lvCode)
    print("stopV")
    return "recieved"

@app.route("/on")
def lightsOn():
    serialWrite(201)
    print("On")
    return "recieved"

@app.route("/off")
def lightsOff():
    serialWrite(200)
    print("Off")
    return "recieved"

#routes for keypad

@app.route("/left/<value>")
def leftThruster(value):
    value = int(value)
    serialWrite(lhCode+value*0.5*100)
    print("left "+ value)
    return "recieved"

@app.route("/right/<value>")
def rightThruster(value):
    value = int(value)
    serialWrite(rhCode+value*0.5*100)
    print("right " + value)
    return "recieved"

@app.route("/vertical/<value>")
def vertical(value):
    value = int(value)
    serialWrite(lvCode+value*0.5*100)
    serialWrite(rvCode+value*0.5*100)
    print("Vertical "+ value)
    return "recieved"

@app.route('/updateValues', methods= ['GET'])
def updateValues():
    print("asked")
    roll, pitch = request_values()

    return jsonify(roll=roll,pitch = pitch)

def serialWrite(towrite):
    towrite = str(towrite)
    towrite += "\n"
    towrite = towrite.encode('utf-8')

    if isConnected == True:
        ser.write(towrite.encode())

def request_values():
    if isConnected == False:
        roll = 0
        pitch = 0
    else:
        ser.write(120)
        if ser.in_waiting > 0:
            roll = ser.readline().decode('utf-8').rstrip()
            print(roll)
        else:
            roll = 0

        ser.write(121)
        if ser.in_waiting > 0:
            pitch = ser.readline().decode('utf-8').rstrip()
            print(pitch)
        else:
            pitch = 0

    
    return roll, pitch
    
    


if __name__ == "__main__":
    global isConnected
    try:
        ser = serial.Serial('/dev/ttyACM0', 115200, timeout=1)
        ser.flush()
        isConnected = True
        print("***NANO CONNECTED***")
    except:
        try:
            ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
            ser.flush()
            isConnected = True
            print("***NANO CONNECTED***")
        except:
            isConnected = False
    app.run(debug=True, host='0.0.0.0', port=8000) #set up the server in debug mode to the port 8000