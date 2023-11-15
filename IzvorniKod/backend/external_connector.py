import sqlite3, os


absolute_path = os.path.abspath(os.path.dirname(__file__))
database_path = os.path.join(absolute_path, 'externalDatabases', 'patientsMBO.sqlite')

def MBO_exists(MBO):
    # open connection to externalDatabase/patientMBO
    conn = sqlite3.connect(database_path)
    c = conn.cursor()
    # check if MBO exists in external database
    c.execute("SELECT * FROM patientMBO WHERE MBO=?", (MBO,))
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
    # open connection to externalDatabase/patientMBO
    conn = sqlite3.connect(database_path)
    c = conn.cursor()

    c.execute("SELECT * FROM patientMBO WHERE MBO=?", (MBO,))
    result = c.fetchone()
    conn.close()

    if not result:
        return None

    # Convert the result to a dictionary
    patient_dict = None
    if result:
        columns = [desc[0] for desc in c.description]
        patient_dict = dict(zip(columns, result))
    
    return patient_dict

    
def setup_patients_database():
    '''
    Creates external database if it does not exist.
    '''
    conn = sqlite3.connect(database_path)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS patientMBO
                (MBO text PRIMARY KEY, 
                 name text, 
                 surname text, 
                 date_of_birth text)''')
    
    # fill database with dummy data
    c.execute("INSERT INTO patientMBO VALUES ('123456789', 'John', 'Doe', '1990-01-01')")
    c.execute("INSERT INTO patientMBO VALUES ('987654321', 'Jane', 'Doe', '1990-01-01')")
    c.execute("INSERT INTO patientMBO VALUES ('123123123', 'John', 'Smith', '1990-01-01')")
    c.execute("INSERT INTO patientMBO VALUES ('321321321', 'Jane', 'Smith', '1990-01-01')")
    c.execute("INSERT INTO patientMBO VALUES ('111111111', 'John', 'Doe', '1990-01-01')")
    c.execute("INSERT INTO patientMBO VALUES ('222222222', 'Jane', 'Doe', '1990-01-01')")
    c.execute("INSERT INTO patientMBO VALUES ('333333333', 'John', 'Smith', '1990-01-01')")
    c.execute("INSERT INTO patientMBO VALUES ('444444444', 'Jane', 'Smith', '1990-01-01')")
    c.execute("INSERT INTO patientMBO VALUES ('555555555', 'John', 'Doe', '1990-01-01')")
    c.execute("INSERT INTO patientMBO VALUES ('666666666', 'Jane', 'Doe', '1990-01-01')")
    c.execute("INSERT INTO patientMBO VALUES ('777777777', 'John', 'Smith', '1990-01-01')")
    c.execute("INSERT INTO patientMBO VALUES ('888888888', 'Jane', 'Smith', '1990-01-01')")
    c.execute("INSERT INTO patientMBO VALUES ('999999999', 'John', 'Doe', '1990-01-01')")
    c.execute("INSERT INTO patientMBO VALUES ('000000000', 'Jane', 'Doe', '1990-01-01')")
    conn.commit()
    conn.close()


if __name__ == '__main__':
    setup_patients_database()
    print(get_patient_data('123456789'))
    print(get_patient_data('1234567890'))
    print(MBO_exists('123456789'))
    print(MBO_exists('1234567890'))