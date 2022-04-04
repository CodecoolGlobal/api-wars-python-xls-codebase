from flask import Flask, render_template
import requests

app = Flask(__name__)


@app.route('/')
def index():  # put application's code here
    planets = get_planets()
    return render_template('index.html', title='Star Wars universe planets', planets=planets)



def get_planets():
    url = 'https://swapi.dev/api/planets/'
    response = requests.get(url)
    return response.json()

if __name__ == '__main__':
    app.run()
