from flask import Flask, render_template, jsonify
import requests
from urllib.parse import urlparse

app = Flask(__name__)

BASE_URL = 'https://swapi.dev/api'
PLANETS = 'planets'


@app.route('/')
def index():  # put application's code here
    planets_raw_data = get_raw_planets()
    planet_data = get_planets(planets_raw_data)
    pagination = get_pagination(planets_raw_data)

    return render_template('index.html', title='Star Wars universe planets', planets=planet_data, pagination=pagination)


@app.route('/planets/<page_id>')
def get_next_page(page_id):  # put application's code here
    planets_raw_data = get_raw_planets('?page={}'.format(page_id))
    planet_data = get_planets(planets_raw_data)
    pagination = get_pagination(planets_raw_data)

    return render_template('index.html', title='Star Wars universe planets', planets=planet_data, pagination=pagination)


def get_raw_planets(parameter=''):
    url = '{}/{}/{}'.format(BASE_URL, PLANETS, parameter)
    response = requests.get(url)
    return response.json()


def get_planets(api_response):
    planet_data = api_response['results']
    return planet_data


def get_pagination(api_response):
    if ('previous' in api_response and api_response['previous'] is not None):
        prev = urlparse(api_response['previous'])[4].split('=')[1]
    else:
        prev = None

    if ('next' in api_response and api_response['next'] is not None):
        next = urlparse(api_response['next'])[4].split('=')[1]
    else:
        next = None

    return {'previous': prev, 'next': next}


if __name__ == '__main__':
    app.run()
