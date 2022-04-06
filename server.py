from flask import Flask, render_template, jsonify
import requests
from urllib.parse import urlparse

app = Flask(__name__)

BASE_URL = 'https://swapi.dev/api'
PLANETS = 'planets'


@app.route('/')
def index():
    planets_raw_data = get_raw_planets()
    planet_data = get_planets(planets_raw_data)
    pagination = get_pagination(planets_raw_data)

    return render_template('index.html', title='Star Wars universe planets', planets=planet_data, pagination=pagination)


@app.route('/planets/<page_id>')
def next_page(page_id):
    planets_raw_data = get_raw_planets('?page={}'.format(page_id))
    planet_data = get_planets(planets_raw_data)
    pagination = get_pagination(planets_raw_data)

    return render_template('index.html', title='Star Wars universe planets', planets=planet_data, pagination=pagination)


@app.route('/planet/<planet_id>/residents')
def residents(planet_id):
    planet_raw_data = get_raw_planets(planet_id)
    residents = []
    for url in planet_raw_data['residents']:
        response = requests.get(url).json()
        residents.append(response)
    return render_template('residents.html', title='Star Wars universe planets', planet=planet_raw_data, residents=residents)


def get_raw_planets(parameter=''):
    url = '{}/{}/{}'.format(BASE_URL, PLANETS, parameter)
    response = requests.get(url)
    return response.json()


def get_planets(api_response):
    planet_data = api_response['results']
    generate_planet_ids(planet_data)
    return planet_data


def generate_planet_ids(planet_data):
    for planet in planet_data:
        planet_id = urlparse(planet['url'])[2].split('/')[3]
        planet['id'] = planet_id
    return planet_data


# def get_raw_planet(planet_id):
#     url = '{}/{}/{}'.format(BASE_URL, PLANETS, planet_id)
#     response = requests.get(url)
#     return response.json()


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
