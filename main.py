from flask import Flask, request, jsonify, render_template
from geopy.distance import geodesic
import os

app = Flask(__name__)
update = False


@app.route('/data/', methods=['POST'])
def get_data():
    X = request.form['x']
    Y = request.form['y']
    Z = request.form['z']
    lat = request.form['lat']
    lon = request.form['lon']
    if float(Y) > 1:
        with open(r"./moderate.txt", "r+") as f:
            rows = f.readlines()
            prevlat = rows[-1].split(',')[0]
            prevlon = rows[-1].split(',')[1]
            location1 = (float(prevlat), float(prevlon))
            location2 = (float(lat), float(lon))
            distance = geodesic(location1, location2).m
            # print(distance)
            if distance < 100:
                print("Same Location")
            else:
                f.write(f"{lat},{lon},\n")
                update = True
    elif float(Y) > 2:
        with open(r"./severe.txt", "r+") as f:
            rows = f.readlines()
            prevlat = rows[-1].split(',')[0]
            prevlon = rows[-1].split(',')[1]
            location1 = (float(prevlat), float(prevlon))
            location2 = (float(lat), float(lon))
            distance = geodesic(location1, location2).m
            print(distance)
            if distance < 100:
                print("Same Location")
            else:
                f.write(f"{lat},{lon},\n")
                update = True
    with open(r"./data.txt", "r") as f:
        rows = f.readlines()[1:]
    print(len(rows))
    rows.append(f"{X},{Y},{Z},{lat},{lon}\n")
    with open(r"./data.txt", "w") as f:
        f.writelines(rows)
    return 'hi'


@app.route('/data/', methods=['GET'])
def post_data():
    X = []
    Y = []
    Z = []
    lat = []
    lon = []
    with open(r"./data.txt", "r") as f:
        rows = f.readlines()
    for row in rows:
        data = row.split(',')
        X.append(float(data[0]))
        Y.append(float(data[1]))
        Z.append(float(data[2]))
        lat.append(float(data[3]))
        lon.append(float(data[4].split("\n")[0]))
    json = {
        "x": X,
        "y": Y,
        "z": Z,
        "lat": lat,
        "lon": lon
    }
    return jsonify(json)


@app.route('/', methods=['GET'])
def dashboard():
    return render_template('./index.html')


@app.route("/src.html", methods=['GET'])
def src():
    return render_template('./src.html')


@app.route("/src2.html", methods=['GET'])
def src2():
    return render_template('./src2.html')


@app.route("/markers", methods=['GET'])
def markers():
    moderateX = []
    moderateY = []
    severeX = []
    severeY = []

    if os.stat(r"./moderate.txt").st_size != 0:
        with open(r"./moderate.txt", "r") as f:
            moderate = f.readlines()
            for row in moderate:
                moderateX.append(row.split(',')[0])
                moderateY.append(row.split(',')[1])

    if os.stat(r"./severe.txt").st_size != 0:
        with open(r"./severe.txt", "r") as f:
            severe = f.readlines()
            for row in severe:
                severeX.append(row.split(',')[0])
                severeY.append(row.split(',')[1])

    json = {
        "moderate": {
            "x": moderateX,
            "y": moderateY
        },
        "severe": {
            "x": severeX,
            "y": severeY
        }

    }
    return jsonify(json)


if __name__ == '__main__':
    app.run(debug=True)
