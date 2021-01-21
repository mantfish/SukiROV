from flask import Flask, render_template, jsonify
import serial
import time

# set the project root directory as the static folder, you can set others.
app = Flask(__name__, static_url_path='')


@app.route("/")
def home():
    return render_template('home.html')
    

#app routes for keyboard

@app.route("/up")
def up():
    print("up")
    return "recieved"

@app.route("/down")
def down():
    print("down")
    return "recieved"

@app.route("/forward")
def forward():
    print("forward")
    return "recieved"

@app.route("/backward")
def backward():
    print("backward")
    return "recieved"


@app.route("/left")
def left():
    print("left")
    return "recieved"


@app.route("/right")
def right():
    print("right")
    return "recieved"


@app.route("/panUp")
def panUp():
    serialWrite('b')
    print("panUp")
    return "recieved"

@app.route("/panDown")
def panDown():
    serialWrite('a')
    print("panDown")
    return "recieved"


@app.route("/stop")
def stop():
    print("stop")
    return "recieved"


@app.route("/stopPan")
def stopPan():
    print("stopPan")
    return "recieved"

@app.route("/stopHorizontal")
def stopHorizontal():
    print("stopH")
    return "recieved"

@app.route("/stopVertical")
def stopVertical():
    print("stopV")
    return "recieved"

@app.route("/on")
def lightsOn():
    print("On")
    return "recieved"

@app.route("/off")
def lightsOff():
    print("Off")
    return "recieved"

#routes for keypad

@app.route("/left/<value>")
def leftThruster(value):
    print("left "+ value)
    return "recieved"

@app.route("/right/<value>")
def rightThruster(value):
    print("right " + value)
    return "recieved"

@app.route("/vertical/<value>")
def vertical(value):
    print("Vertical "+ value)
    return "recieved"

@app.route('/updateValues', methods= ['GET'])
def updateValues():
    print("asked")
    roll, pitch = request_values()

    return jsonify(roll=roll,pitch = pitch)

def serialWrite(towrite):

    if isConnected == True:
        ser.write(towrite.encode())

def request_values():
    if isConnected == False:
        roll = 0
        pitch = 0
        yaw = 0
    else:
        ser.write(b"1\n")
        if ser.in_waiting > 0:
            roll = ser.readline().decode('utf-8').rstrip()
            print(roll)
        else:
            roll = 0

        ser.write(b"2\n")
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