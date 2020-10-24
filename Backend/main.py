import requests
from werkzeug.utils import cached_property
from flask import Flask, request
from flask_cors import CORS,cross_origin
from flask_restplus import Api,Resource
from flask_mysqldb import MySQL
import json
from flask import jsonify
import mysql.connector
from db_mgr.db_mgr import SQLManager
from internal._authentication import auth_users
import logging
import os
import binascii

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.register_blueprint(auth_users)
app.config['CORS_HEADERS'] = 'Content-Type'

mysql = MySQL(app)
api = Api(app)
db_mgr = SQLManager('127.0.0.1','root','','my_db')
sign_up = api.namespace('sign_up', description="sign_up")
CORS(app)
links_to_people = {}


@api.route('/get_token_favorites')
class set_suggest(Resource):
    def get(self):

        token = request.args.get('token')
        token_exist = check_if_token_exist(token)

        if not token_exist:
            return {'IsSuccess': False, 'Info': 'Token isnt exsist'}
        else:
            favorites = get_token_favorites(token)
            return {'IsSuccess': True, 'favorites': favorites}


@api.route('/save_suggestions_token')
class set_suggest(Resource):
    def post(self):

        payload = api.payload
        token = payload.get('token')
        favorites = payload.get('favorites')
        token_exist = check_if_token_exist(token)

        if not token_exist:
            save_token_favorites(token,favorites)
        else:
            update_token_favorites(token,favorites)

        return {'IsSuccess': True}


@api.route('/get_token')
class get_token(Resource):
    def get(self):
        token = binascii.hexlify(os.urandom(16))
        return {'Token': token}


@api.route('/characters')
class characters(Resource):
    def get(self):
        response = get_all_data_from_endpoint('https://swapi.dev/api/people', 'people')
        return {'People': response, 'IsSuccess': True}


@api.route('/films')
class films(Resource):
    def get(self):

        # fetch people for build 'links_to_poeple' mapping object
        people = get_all_data_from_endpoint('https://swapi.dev/api/people', 'people')

        films = get_all_data_from_endpoint('https://swapi.dev/api/films', 'films')
        replace_films_links_with_names(films)
        return {'Films': films, 'IsSuccess': True}


def update_token_favorites(token, favorites):
    con=db_mgr.get_db_connection()
    cursor = con.cursor()
    query = "UPDATE zoomin_tokens SET suggestions = %s WHERE token = %s"
    values = (json.dumps(favorites), token)
    cursor.execute(query,values)
    con.commit()
    cursor.close()


def save_token_favorites(token, favorites):
    con=db_mgr.get_db_connection()
    cursor = con.cursor()
    query = "INSERT INTO zoomin_tokens (token, suggestions) VALUES (%s, %s)"
    values = (token,json.dumps(favorites))
    cursor.execute(query,values)
    con.commit()
    cursor.close()


def get_token_favorites(token):
    con=db_mgr.get_db_connection()
    cursor=con.cursor()
    query=("select suggestions from zoomin_tokens where token ='{}'".format(token))
    cursor.execute(query)
    suggestions = cursor.fetchall()
    cursor.close()
    
    return suggestions


def check_if_token_exist(token):
    con=db_mgr.get_db_connection()
    cursor=con.cursor()
    query=("select * from zoomin_tokens where token='{}'".format(token))
    cursor.execute(query)
    table_rows = cursor.fetchall()
    cursor.close()

    print('****')
    print(table_rows)
    print('****')

    for row in table_rows:
        if token in row:
            return True
    
    return False


def get_all_data_from_endpoint(query, type):
    ''' Get all the data form the endpoint'''
    records = []
    next = True
    while next:
        response = requests.get(query)
        json_data = json.loads(response.content)
        for resource in json_data['results']:
            records.append(resource)
            if type == 'people':
                name = resource.get('name')
                url = resource.get('url')
                links_to_people[url] = name
        if bool(json_data['next']):
            query = json_data['next']
        else:
            next = False
    return records


def replace_films_links_with_names(films):
    ''' Replace all characters links with names'''
    for film in films:
        for index in range(len(film['characters'])):
            film['characters'][index] = links_to_people[film['characters'][index]]
    return films


if __name__ == '__main__':
    app.run('139.162.208.159', port='8080')
    # app.run(host='127.0.0.1', port=8080, debug=True)