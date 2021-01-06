from flask import Flask, render_template

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
    print("panUp")
    return "recieved"

@app.route("/panDown")
def panDown():
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

@app.route("/stopHorizotnal")
def stopHorizotnal():
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



if __name__ == "__main__":
     app.run(debug=True, host='0.0.0.0', port=8000) #set up the server in debug mode to the port 8000