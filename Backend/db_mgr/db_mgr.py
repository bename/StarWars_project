
"""
Module to manage the procedures used with the web interface DB.
"""

import mysql.connector


class SQLManager(object):

    def __init__(self, sql_host, sql_user, sql_pass, sql_db):
        # if logger:
        #     self.logger = logger
        #     self.logger.info('init db manager')

        self.sql_host = sql_host
        self.sql_user = sql_user
        self.sql_pass = sql_pass
        self.sql_db = sql_db
        # if logger:
        #     self.logger = logger


    def execute(self, query, params=None):
        """
        Execute a single query on a new connection to the database.

        """
        try:
            # if logger:
            #     self.logger.info('Executing query : {}'.format(query))
            db = self.get_db_connection()
            cursor = db.cursor(dictionary=True)
            cursor.execute(query, params)
            columns = None

            if cursor.description:
                columns = [column[0] for column in cursor.description]
                response = cursor.fetchall()
            else:
                print('Recorded')
                response = 'Number of rows: {}'.format(cursor.rowcount)

            return {
                'output': response,
                'columns': columns}

        except Exception as err:
            print('******')
            print(err)

            print('*********')
            # if logger:
            #     self.logger.exception("Invalid query {} with params {}.".format(query, params))

        finally:
            if cursor:
                cursor.close()
                db.commit()
                db.close()


    def get_db_connection(self, sql_host=None, sql_user=None, sql_pass=None, sql_db=None):
        """ Get a new db connection object. """
        # if logger:
        #     self.logger.info('Get db connection')
        sql_host = self.sql_host
        sql_user = self.sql_user
        sql_pass = self.sql_pass
        sql_db = self.sql_db
        db = mysql.connector.connect(user=sql_user, password=sql_pass, host=sql_host, database=sql_db)
        return db

