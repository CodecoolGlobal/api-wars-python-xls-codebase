from flask import Flask, render_template, request, redirect, session, jsonify
import requests
from urllib.parse import urlparse
from forms import LoginForm

import os
import psycopg2

def get_db_connection():
    conn = psycopg2.connect(
        database=os.environ.get('DB_DATABASE_NAME'),
        user=os.environ.get('DB_USERNAME'),
        password=os.environ.get('DB_PASSWORD'),
        host=os.environ.get('DB_HOST'))
    return conn

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


@app.route('/user-registration', methods=['GET', 'POST'])
def user_registration():
    form = LoginForm(request.form)

    if request.method == 'POST' and form.validate():  # form.validate_on_submit()
        username = form.username
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('INSERT INTO users (username, password) VALUES (%s, %s)', (form.username.data, form.password.data))
        conn.commit()
        cur.close()
        conn.close()

    return render_template('registration.html', title='Star Wars universe planets - User registration', form=form)






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
