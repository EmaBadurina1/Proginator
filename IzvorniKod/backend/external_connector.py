import os
import psycopg2
import dotenv

dotenv.load_dotenv()
url = os.getenv("EXTERNAL_DB_URL")
#print(url)  

def MBO_exists(MBO):
    # open connection to externalDatabase/patientMBO
    conn = psycopg2.connect(url)
    c = conn.cursor()
    # check if MBO exists in external database
    c.execute("SELECT * FROM person WHERE MBO=%s", (MBO,))
    result = c.fetchone()
    conn.close()
    if result:
        return True
    else:
        return False
    
def get_patient_data(MBO):
    '''
    Returns patient data from external database.
    If MBO does not exist in external database, returns None.
    '''

    # Open connection to externalDB, connection and cursor are closed automatically
    with psycopg2.connect(url) as conn:
        with conn.cursor() as c:
            c.execute("SELECT * FROM person WHERE mbo=%s", (MBO,))
            result = c.fetchone()

    if not result:
        return None

    # Convert the result to a dictionary
    patient_dict = None
    if result:
        columns = [desc[0] for desc in c.description]
        # replace mbo with MBO
        columns[4] = 'MBO'
        # convert date_of_birth to string
        result = list(result)
        result[3] = result[3].strftime('%Y-%m-%d')
        patient_dict = dict(zip(columns, result))
    
    return patient_dict

    
def setup_patients_database(patients_list):
    '''
    Creates external database if it does not exist.
    '''
    conn = psycopg2.connect(url)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS person
                (MBO text PRIMARY KEY, 
                 name text, 
                 surname text, 
                 date_of_birth text)''')
    
    # fill database with dummy data
    for patient in patients_list:
        c.execute("INSERT INTO person VALUES (%s, %s, %s, %s)", (patient['MBO'], patient['name'], patient['surname'], patient['date_of_birth']))
    conn.commit()
    conn.close()

def insert_patient_data(MBO, name, surname, date_of_birth):
    '''
    Inserts patient data into external database.
    '''
    conn = psycopg2.connect(url)
    c = conn.cursor()
    c.execute("INSERT INTO person VALUES (%s, %s, %s, %s)", (MBO, name, surname, date_of_birth))
    conn.commit()
    conn.close()

def get_table_and_columns(table_name):
    '''
    Returns a list of columns for a given table.
    '''
    conn = psycopg2.connect(url)
    c = conn.cursor()
    c.execute(f"SELECT * FROM {table_name} LIMIT 0",)
    columns = [desc[0] for desc in c.description]
    conn.close()
    return columns

# get list of doctors from external database in dict format
def get_doctors_from_external_db():
    conn = psycopg2.connect(url)
    c = conn.cursor()
    c.execute("SELECT * FROM doctor")
    result = c.fetchall()
    conn.close()
    doctors = []
    for row in result:
        columns = [desc[0] for desc in c.description]
        doctor_dict = dict(zip(columns, row))
        doctors.append(doctor_dict)
    return doctors

def get_doctor_from_external_db(doctor_id):
    conn = psycopg2.connect(url)
    c = conn.cursor()
    c.execute("SELECT * FROM doctor WHERE doctor_id = %s", (doctor_id,))
    result = c.fetchone()
    conn.close()
    if result:
        columns = [desc[0] for desc in c.description]
        doctor_dict = dict(zip(columns, result))
        return doctor_dict
    else:
        return None

if __name__ == '__main__':
    pass
