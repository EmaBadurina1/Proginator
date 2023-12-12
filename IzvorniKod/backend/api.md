# API Documentation

## Accounts

### Get all users

#### Request

- **Endpoint:** `/users`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "employees": [
            {
               "OIB": "12345678901",
               "date_of_birth": "Fri, 02 Feb 1990 00:00:00 GMT",
               "email": "john.smith@example.com",
               "is_active": false,
               "is_admin": true,
               "name": "John",
               "phone_number": "0910000000",
               "surname": "Smith",
               "user_id": 1
            },
            ...
         ],
         "patients": [
            {
               "MBO": "123456789",
               "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
               "email": "jane.smith@fer.hr",
               "name": "Jane",
               "phone_number": "0910000001",
               "surname": "Smith",
               "user_id": 2
            },
            ...
         ]
      },
      "status": 200
   }
   ```

### Get all patients

#### Request

- **Endpoint:** `/patients`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "patients": [
            {
               "MBO": "123456789",
               "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
               "email": "jane.smith@fer.hr",
               "name": "Jane",
               "phone_number": "0910000001",
               "surname": "Smith",
               "user_id": 1
            },
            ...
         ]
      },
      "status": 200
   }
   ```

### Get one patient

#### Request

- **Endpoint:** `/patients/<user_id>`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "patient": {
            "MBO": "123456789",
            "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
            "email": "jane.smith@fer.hr",
            "name": "Jane",
            "phone_number": "0910000001",
            "surname": "Smith",
            "user_id": <user_id>
         }
      },
      "status": 200
   }
   ```

### Create patient

#### Request

- **Endpoint:** `/patients`
- **Method:** `POST`
- **Require authorization**
- **Body:**
   - `name` (string): User's first name.
   - `surname` (string): User's last name.
   - `email` (string): User's email address (must be unique).
   - `phone_number` (string): User's phone number (must be unique).
   - `date_of_birth` (string): User's date of birth in the format `YYYY-MM-DD`.
   - `MBO` (string): User's MBO (must be unique).
   - `password` (string): User's password.
- **Notes:**
   - All request parameters are required.

#### Response

- **Success Code:** `201 Created`
- **Content:**

   ```json
   {
      "data": {
         "patient": {
            "MBO": "123456789",
            "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
            "email": "jane.smith@fer.hr",
            "name": "Jane",
            "phone_number": "0910000001",
            "surname": "Smith",
            "user_id": 1
         }
      },
      "message": "Patient added: Jane Smith",
      "status": 201
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If required fields are missing.
      - If required fields are empty.
      - If data is not unique or in right format.
      - If `MBO` does not exist.
      - If data is not correct.
   - `500 Internal Server Error`
      - If there was a problem with storing data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Update patient

#### Request

- **Endpoint:** `/patients/<user_id>`
- **Method:** `PATCH`
- **Require authorization**
- **Body:**
   - `name` (string): User's first name.
   - `surname` (string): User's last name.
   - `email` (string): User's email address (must be unique).
   - `phone_number` (string): User's phone number (must be unique).
   - `date_of_birth` (string): User's date of birth in the format `YYYY-MM-DD`.
   - `MBO` (string): User's MBO (must be unique).
- **Notes:**
   - All request parameters are optional.

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "patient": {
            "MBO": "123456789",
            "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
            "email": "jane.smith@fer.hr",
            "name": "Jane",
            "phone_number": "0910000001",
            "surname": "Smith",
            "user_id": <user_id>
         }
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there are no patients with `user_id`.
      - If request paramaters does not match external database.
      - If request parameters are not in right format.
   - `500 Internal Server Error`
      - If there was a problem storing data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Delete patient

#### Request

- **Endpoint:** `/patients/<user_id>`
- **Method:** `DELETE`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "message": "Deleted",
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there are no patients with `user_id`.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

### Get all employees

#### Request

- **Endpoint:** `/employees`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "employees": [
            {
               "OIB": "12345678901",
               "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
               "email": "jane.smith@fer.hr",
               "is_active": false,
               "is_admin": true,
               "name": "Jane",
               "phone_number": "0910000001",
               "surname": "Smith",
               "user_id": 1
            },
            ...
         ]
      },
      "status": 200
   }
   ```

### Get one employee

#### Request

- **Endpoint:** `/employees/<user_id>`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "employee": {
            "OIB": "12345678901",
            "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
            "email": "jane.smith@fer.hr",
            "is_active": false,
            "is_admin": true,
            "name": "Jane",
            "phone_number": "0910000001",
            "surname": "Smith",
            "user_id": <user_id>
         }
      },
      "status": 200
   }
   ```

### Create employee

#### Request

- **Endpoint:** `/employees`
- **Method:** `POST`
- **Require authorization**
- **Body:**
   - `name` (string): User's first name.
   - `surname` (string): User's last name.
   - `email` (string): User's email address (must be unique).
   - `phone_number` (string): User's phone number (must be unique).
   - `date_of_birth` (string): User's date of birth in the format `YYYY-MM-DD`.
   - `OIB` (string): User's OIB (must be unique).
   - `password` (string): User's password.
   - `is_active` (boolean): Is employee active.
   - `is_admin` (boolean): Is employee admin.
- **Notes:**
   - All request parameters are required.

#### Response

- **Success Code:** `201 Created`
- **Content:**

   ```json
   {
      "data": {
         "employee": {
            "OIB": "12345678901",
            "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
            "email": "jane.smith@fer.hr",
            "is_active": false,
            "is_admin": true,
            "name": "Jane",
            "phone_number": "0910000001",
            "surname": "Smith",
            "user_id": 1
         }
      },
      "message": "Employee added: Jane Smith",
      "status": 201
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If required fields are missing.
      - If required fields are empty.
      - If `OIB` is not 11 characters long.
      - If data is not unique.
      - If data is not in right format.
   - `500 Internal Server Error`
      - If there was a problem with storing data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Update employee

#### Request

- **Endpoint:** `/employees/<user_id>`
- **Method:** `PATCH`
- **Require authorization**
- **Body:**
   - `name` (string): User's first name.
   - `surname` (string): User's last name.
   - `email` (string): User's email address (must be unique).
   - `phone_number` (string): User's phone number (must be unique).
   - `date_of_birth` (string): User's date of birth in the format `YYYY-MM-DD`.
   - `OIB` (string): User's OIB (must be unique).
   - `password` (string): User's password.
   - `is_active` (boolean): Is employee active.
   - `is_admin` (boolean): Is employee admin.
- **Notes:**
   - All request parameters are optional.

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "employee": {
            "OIB": "12345678901",
            "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
            "email": "jane.smith@fer.hr",
            "is_active": false,
            "is_admin": true,
            "name": "Jane",
            "phone_number": "0910000001",
            "surname": "Smith",
            "user_id": <user_id>
         }
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there are no employees with `user_id`.
      - If request parameters are not in right format.
   - `500 Internal Server Error`
      - If there was a problem storing data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Delete employee

#### Request

- **Endpoint:** `/employees/<user_id>`
- **Method:** `DELETE`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "message": "Deleted",
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there are no employees with `user_id`.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

## Authorization

### Login

#### Request

- **Endpoint:** `/login`
- **Method:** `POST`

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "user": {
            "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
            "email": "jane.smith@fer.hr",
            "name": "Jane",
            "phone_number": "0910000001",
            "surname": "Smith",
            "user_id": 1
         }
      },
      "message": "Login successful",
      "status": 200
   }
   ```

- **Error Codes:**
   - `401 Unauthorized`
      - If the credidentials are wrong.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 401
   }
   ```

### Logout

#### Request

- **Endpoint:** `/logout`
- **Method:** `POST`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "message": "Logout successful",
      "status": 200
   }
   ```
### Change password

#### Request

- **Endpoint:** `/users/<user_id>/password`
- **Method:** `PATCH`
- **Require authorization**
- **Body:**
   - `old_password` (string): User's old password.
   - `new_password` (string): User's new password.
   - `new_password_rep` (string): New password repeated.
- **Notes:**
   - All request parameters are required.

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "message": "Password changed",
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If required fields are missing.
      - If `old_password` does not match.
      - if `new_password` and `new_password_rep` does not match.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

## Appointments

### Get all appointments

#### Request

- **Endpoint:** `/appointments`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "appointments": [
            {
               "appointment_id": 1,
               "comment": "Some comment.",
               "date_from": "Sun, 10 Dec 2023 15:30:00 GMT",
               "date_to": "Sun, 10 Dec 2024 15:30:00 GMT",
               "employee": {
                  "OIB": "00000000001",
                  "date_of_birth": "Thu, 22 Aug 1990 00:00:00 GMT",
                  "email": "john.doe@fer.hr",
                  "is_active": true,
                  "is_admin": false,
                  "name": "John",
                  "phone_number": "0996531908",
                  "surname": "Doe",
                  "user_id": 2
               },
               "room": {
                  "capacity": 3,
                  "in_use": true,
                  "room_num": "A001"
               },
               "status": {
                  "status_id": 1,
                  "status_name": "Waiting"
               },
               "therapy": {
                  "date_from": "Tue, 12 Dec 2023 00:00:00 GMT",
                  "date_to": "Sun, 24 Dec 2023 00:00:00 GMT",
                  "disease_descr": "Broken leg.",
                  "doctor_id": 1,
                  "patient": {
                     "MBO": "123123123",
                     "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
                     "email": "john.smith@fer.hr",
                     "name": "John",
                     "phone_number": "0911231231",
                     "surname": "Smith",
                     "user_id": 1
                  },
                  "req_treatment": "Vježbanje uz povećanje napora.",
                  "therapy_id": 1,
                  "therapy_type": {
                     "therapy_type_descr": "Therapy type description.",
                     "therapy_type_id": 1,
                     "therapy_type_name": "Phisical therapy"
                  }
               }
            },
            ...
         ]
      },
      "status": 200
   }
   ```

### Get appointment

#### Request

- **Endpoint:** `/appointments/<appointment_id>`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "appointment": {
            "appointment_id": 1,
            "comment": "Some comment.",
            "date_from": "Sun, 10 Dec 2023 15:30:00 GMT",
            "date_to": "Sun, 10 Dec 2024 15:30:00 GMT",
            "employee": {
               "OIB": "00000000001",
               "date_of_birth": "Thu, 22 Aug 1990 00:00:00 GMT",
               "email": "john.doe@fer.hr",
               "is_active": true,
               "is_admin": false,
               "name": "John",
               "phone_number": "0996531908",
               "surname": "Doe",
               "user_id": 2
            },
            "room": {
               "capacity": 3,
               "in_use": true,
               "room_num": "A001"
            },
            "status": {
               "status_id": 1,
               "status_name": "Waiting"
            },
            "therapy": {
               "date_from": "Tue, 12 Dec 2023 00:00:00 GMT",
               "date_to": "Sun, 24 Dec 2023 00:00:00 GMT",
               "disease_descr": "Broken leg.",
               "doctor_id": 1,
               "patient": {
                  "MBO": "123123123",
                  "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
                  "email": "john.smith@fer.hr",
                  "name": "John",
                  "phone_number": "0911231231",
                  "surname": "Smith",
                  "user_id": 1
               },
               "req_treatment": "Vježbanje uz povećanje napora.",
               "therapy_id": 1,
               "therapy_type": {
                  "therapy_type_descr": "Therapy type description.",
                  "therapy_type_id": 1,
                  "therapy_type_name": "Phisical therapy"
               }
            }
         }
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no id `appointment_id`.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

### Create appointment

#### Request

- **Endpoint:** `/appointments`
- **Method:** `POST`
- **Require authorization**
- **Body:**
   - `therapy_id` (integer): Reference to therapy.
   - `date_from` (string): Start of the appointment session.
   - `comment` (string): Comment after appointment.
   - `room_num` (string): Reference to a room.
   - `employee_id` (integer): Reference to a employee that is on appointment session.
   - `date_to` (string): End of appointent session.
- **Notes:**
   - `therapy_id` and `date_from` are required, other fields are optional.

#### Response

- **Success Code:** `201 Created`
- **Content:**

   ```json
   {
      "data": {
         "appointment": {
            "appointment_id": 1,
            "comment": "Some comment.",
            "date_from": "Sun, 10 Dec 2023 15:30:00 GMT",
            "date_to": "Sun, 10 Dec 2024 15:30:00 GMT",
            "employee": {
               "OIB": "00000000001",
               "date_of_birth": "Thu, 22 Aug 1990 00:00:00 GMT",
               "email": "john.doe@fer.hr",
               "is_active": true,
               "is_admin": false,
               "name": "John",
               "phone_number": "0996531908",
               "surname": "Doe",
               "user_id": 2
            },
            "room": {
               "capacity": 3,
               "in_use": true,
               "room_num": "A001"
            },
            "status": {
               "status_id": 1,
               "status_name": "Waiting"
            },
            "therapy": {
               "date_from": "Tue, 12 Dec 2023 00:00:00 GMT",
               "date_to": "Sun, 24 Dec 2023 00:00:00 GMT",
               "disease_descr": "Broken leg.",
               "doctor_id": 1,
               "patient": {
                  "MBO": "123123123",
                  "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
                  "email": "john.smith@fer.hr",
                  "name": "John",
                  "phone_number": "0911231231",
                  "surname": "Smith",
                  "user_id": 1
               },
               "req_treatment": "Vježbanje uz povećanje napora.",
               "therapy_id": 1,
               "therapy_type": {
                  "therapy_type_descr": "Therapy type description.",
                  "therapy_type_id": 1,
                  "therapy_type_name": "Phisical therapy"
               }
            }
         }
      },
      "status": 201
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If required fields are missing.
      - If data is not valid or in right format.
   - `500 Internal Server Error`
      - If there was a problem storing your data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Update appointment

#### Request

- **Endpoint:** `/appointments/<appointment_id>`
- **Method:** `PATCH`
- **Require authorization**
- **Body:**
   - `therapy_id` (integer): Reference to therapy.
   - `date_from` (string): Start of the appointment session.
   - `comment` (string): Comment after appointment.
   - `room_num` (string): Reference to a room.
   - `employee_id` (integer): Reference to a employee that is on appointment session.
   - `date_to` (string): End of appointent session.
- **Notes:**
   - All request parameters are optional.

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "appointment": {
            "appointment_id": 1,
            "comment": "Some comment.",
            "date_from": "Sun, 10 Dec 2023 15:30:00 GMT",
            "date_to": "Sun, 10 Dec 2024 15:30:00 GMT",
            "employee": {
               "OIB": "00000000001",
               "date_of_birth": "Thu, 22 Aug 1990 00:00:00 GMT",
               "email": "john.doe@fer.hr",
               "is_active": true,
               "is_admin": false,
               "name": "John",
               "phone_number": "0996531908",
               "surname": "Doe",
               "user_id": 2
            },
            "room": {
               "capacity": 3,
               "in_use": true,
               "room_num": "A001"
            },
            "status": {
               "status_id": 1,
               "status_name": "Waiting"
            },
            "therapy": {
               "date_from": "Tue, 12 Dec 2023 00:00:00 GMT",
               "date_to": "Sun, 24 Dec 2023 00:00:00 GMT",
               "disease_descr": "Broken leg.",
               "doctor_id": 1,
               "patient": {
                  "MBO": "123123123",
                  "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
                  "email": "john.smith@fer.hr",
                  "name": "John",
                  "phone_number": "0911231231",
                  "surname": "Smith",
                  "user_id": 1
               },
               "req_treatment": "Vježbanje uz povećanje napora.",
               "therapy_id": 1,
               "therapy_type": {
                  "therapy_type_descr": "Therapy type description.",
                  "therapy_type_id": 1,
                  "therapy_type_name": "Phisical therapy"
               }
            }
         }
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no id `appointment_id`.
      - If data is not valid or in right format.
   - `500 Internal Server Error`
      - If there was a problem storing your data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Delete appointment

#### Request

- **Endpoint:** `/appointments/<appointment_id>`
- **Method:** `DELETE`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "message": "Deleted",
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no id `appointment_id`.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

### Get all statuses

#### Request

- **Endpoint:** `/statuses`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
      "statuses": [
            {
               "status_id": 1,
               "status_name": "Waiting"
            },
            ...
         ]
      },
      "status": 200
   }
   ```

### Get status

#### Request

- **Endpoint:** `/statuses/<status_id>`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "status": {
            "status_id": 1,
            "status_name": "Waiting"
         }
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no id `status_id`

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

### Create status

#### Request

- **Endpoint:** `/statuses`
- **Method:** `POST`
- **Require authorization**
- **Body:**
   - `status_name` (string): Status name.
- **Notes:**
   - All request parameters are required. 

#### Response

- **Success Code:** `201 Created`
- **Content:**

   ```json
   {
      "data": {
         "status": {
               "status_id": 5,
               "status_name": "Odobreno"
         }
      },
      "status": 201
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If required fields are missing.
      - If data is not in right format.
   - `500 Internal Server Error`
      - If there was a problem storiny your data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Update status

#### Request

- **Endpoint:** `/statuses/<status_id>`
- **Method:** `PATCH`
- **Require authorization**
- **Body:**
   - `status_name` (string): Status name.
- **Notes:**
   - All request parameters are optional.

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "status": {
            "status_id": <status_id>,
            "status_name": "Waiting"
         }
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no ID `status_id`.
      - If data is not in right format.
   - `500 Internal Server Error`
      - If there was a problem storing your data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Delete status

#### Request

- **Endpoint:** `/statuses/<status_id>`
- **Method:** `DELETE`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "message": "Deleted",
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no ID `status_id`.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

## Device

### Get all devices

#### Request

- **Endpoint:** `/devices`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "devices": [
            {
               "device_id": 1,
               "device_type": {
                  "device_type_descr": "Device for something.",
                  "device_type_id": 1,
                  "device_type_name": "Device name"
               },
               "room": {
                  "capacity": 3,
                  "in_use": true,
                  "room_num": "A001"
               }
            },
            ...
         ]
      },
      "status": 200
   }
   ```

### Get device

#### Request

- **Endpoint:** `/devices/<device_id>`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "device": {
            "device_id": 1,
            "device_type": {
               "device_type_descr": "Device for something.",
               "device_type_id": 1,
               "device_type_name": "Device name"
            },
            "room": {
               "capacity": 3,
               "in_use": true,
               "room_num": "A001"
            }
         }
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no id `device_id`

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

### Create device

#### Request

- **Endpoint:** `/devices`
- **Method:** `POST`
- **Require authorization**
- **Body:**
   - `device_type_id` (integer): Device type_id.
   - `room_num` (string): Reference to a room.
- **Notes:**
   - `device_type_id` is required.

#### Response

- **Success Code:** `201 Created`
- **Content:**

   ```json
   {
      "data": {
         "device": {
            "device_id": 1,
            "device_type": {
               "device_type_descr": "Device for something.",
               "device_type_id": 1,
               "device_type_name": "Device name"
            },
            "room": {
               "capacity": 3,
               "in_use": true,
               "room_num": "A001"
            }
         }
      },
      "status": 201
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If required fields are missing.
      - If data is not in right format.
   - `500 Internal Server Error`
      - If there was a problem storiny your data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Update device

#### Request

- **Endpoint:** `/devices/<device_id>`
- **Method:** `PATCH`
- **Require authorization**
- **Body:**
   - `device_type_id` (integer): Device type_id.
   - `room_num` (string): Reference to a room.
- **Notes:**
   - All request params are opritonal.

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "device": {
            "device_id": 1,
            "device_type": {
               "device_type_descr": "Device for something.",
               "device_type_id": 1,
               "device_type_name": "Device name"
            },
            "room": {
               "capacity": 3,
               "in_use": true,
               "room_num": "A001"
            }
         }
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no ID `device_id`.
      - If data is not in right format.
   - `500 Internal Server Error`
      - If there was a problem storing your data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Delete device

#### Request

- **Endpoint:** `/devices/<device_id>`
- **Method:** `DELETE`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "message": "Deleted",
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no ID `device_id`.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

### Get all device types

#### Request

- **Endpoint:** `/device-types`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "device_types": [
            {
               "device_type_descr": "Device for something.",
               "device_type_id": 1,
               "device_type_name": "Device name"
            },
            ... 
         ]
      },
      "status": 200
   }
   ```

### Get device type

#### Request

- **Endpoint:** `/device-types/<device_type_id>`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "device_types": [
            {
               "device_type_descr": "Device for something.",
               "device_type_id": 1,
               "device_type_name": "Device name"
            },
            ...
         ]
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no id `device_type_id`

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

### Create device type

#### Request

- **Endpoint:** `/device-types`
- **Method:** `POST`
- **Require authorization**
- **Body:**
   - `device_type_name` (string): Device type name.
   - `device_type_descr` (string): Description of the device type.
- **Notes:**
   - `device_type_name` is required.

#### Response

- **Success Code:** `201 Created`
- **Content:**

   ```json
   {
      "data": {
         "device_types": [
            {
               "device_type_descr": "Device for something.",
               "device_type_id": 1,
               "device_type_name": "Device name"
            },
            ...
         ]
      },
      "status": 201
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If required fields are missing.
      - If data is not in right format.
   - `500 Internal Server Error`
      - If there was a problem storiny your data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Update device

#### Request

- **Endpoint:** `/device-types/<device_type_id>`
- **Method:** `PATCH`
- **Require authorization**
- **Body:**
   - `device_type_name` (string): Device type name.
   - `device_type_descr` (string): Description of the device type.
- **Notes:**
   - All request params are opritonal.

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "device": {
            "device_id": 1,
            "device_type": {
               "device_type_descr": "Device for something.",
               "device_type_id": 1,
               "device_type_name": "Device name"
            },
            "room": {
               "capacity": 3,
               "in_use": true,
               "room_num": "A001"
            }
         }
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no ID `device_type_id`.
      - If data is not in right format.
   - `500 Internal Server Error`
      - If there was a problem storing your data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Delete device

#### Request

- **Endpoint:** `/device-types/<devic_type_id>`
- **Method:** `DELETE`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "message": "Deleted",
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no ID `device_type_id`.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

## Room

### Get all rooms

#### Request

- **Endpoint:** `/rooms`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "rooms": [
            {
               "capacity": 3,
               "in_use": true,
               "room_num": "A001"
            },
            ...
         ]
      },
      "status": 200
   }
   ```

### Get room

#### Request

- **Endpoint:** `/rooms/<room_num>`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "room": {
            "capacity": 3,
            "in_use": true,
            "room_num": <room_num>
         }
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no id `room_num`

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

### Create room

#### Request

- **Endpoint:** `/rooms`
- **Method:** `POST`
- **Require authorization**
- **Body:**
   - `room_num` (string): Room number.
   - `capacity` (string): Capacity of a room.
   - `in_use` (boolean): If room is in use.
- **Notes:**
   - All request params are required.

#### Response

- **Success Code:** `201 Created`
- **Content:**

   ```json
   {
      "data": {
         "room": {
            "capacity": 3,
            "in_use": true,
            "room_num": "A001"
         }
      },
      "status": 201
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If required fields are missing.
      - If data is not in right format.
   - `500 Internal Server Error`
      - If there was a problem storiny your data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Update room

#### Request

- **Endpoint:** `/rooms/<room_num>`
- **Method:** `PATCH`
- **Require authorization**
- **Body:**
   - `room_num` (string): Room number.
   - `capacity` (string): Capacity of a room.
   - `in_use` (boolean): If room is in use.
- **Notes:**
   - All request params are optional.

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "room": {
            "capacity": 3,
            "in_use": true,
            "room_num": "A001"
         }
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no ID `room_num`.
      - If data is not in right format.
   - `500 Internal Server Error`
      - If there was a problem storing your data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Delete room

#### Request

- **Endpoint:** `/rooms/<room_num>`
- **Method:** `DELETE`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "message": "Deleted",
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no ID `room_num`.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

## Therapy

### Get all therapies

#### Request

- **Endpoint:** `/therapies`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "therapies": [
            {
               "date_from": "Tue, 12 Dec 2023 00:00:00 GMT",
               "date_to": "Sun, 24 Dec 2023 00:00:00 GMT",
               "disease_descr": "Broken leg.",
               "doctor_id": 1,
               "patient": {
                  "MBO": "123123123",
                  "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
                  "email": "john.smith@fer.hr",
                  "name": "John",
                  "phone_number": "0911231231",
                  "surname": "Smith",
                  "user_id": 1
               },
               "req_treatment": "Vježbanje uz povećanje napora.",
               "therapy_id": 1,
               "therapy_type": {
                  "therapy_type_descr": "Therapy type description.",
                  "therapy_type_id": 1,
                  "therapy_type_name": "Phisical therapy"
               }
            },
            ...
         ]
      },
      "status": 200
   }
   ```

### Get therapy

#### Request

- **Endpoint:** `/therapies/<therapy_id>`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "therapy": {
            "date_from": "Tue, 12 Dec 2023 00:00:00 GMT",
            "date_to": "Sun, 24 Dec 2023 00:00:00 GMT",
            "disease_descr": "Broken leg.",
            "doctor_id": 1,
            "patient": {
               "MBO": "123123123",
               "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
               "email": "john.smith@fer.hr",
               "name": "John",
               "phone_number": "0911231231",
               "surname": "Smith",
               "user_id": 1
            },
            "req_treatment": "Vježbanje uz povećanje napora.",
            "therapy_id": 1,
            "therapy_type": {
               "therapy_type_descr": "Therapy type description.",
               "therapy_type_id": 1,
               "therapy_type_name": "Phisical therapy"
            }
         }
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no id `therapy_id`

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

### Create therapy

#### Request

- **Endpoint:** `/therapies`
- **Method:** `POST`
- **Require authorization**
- **Body:**
   - `doctor_id` (integer): Reference to a doctor in external database.
   - `disease_descr` (string): Disease description.
   - `patient_id` (integer): Reference to a patient that requested therapy.
   - `date_from` (string): Start of the therapy in format `YYYY-MM-DD`.
   - `req_treatment` (string): Patient's requested treatment.
   - `date_to` (string): End of the therapy in format `YYYY-MM-DD`.
   - `therapy_type_id` (integer): Reference to a therapy type.
- **Notes:**
   - `doctor_id`, `disease_descr`, `patient_id`, `date_from` are required.

#### Response

- **Success Code:** `201 Created`
- **Content:**

   ```json
   {
      "data": {
         "therapy": {
            "date_from": "Tue, 12 Dec 2023 00:00:00 GMT",
            "date_to": "Sun, 24 Dec 2023 00:00:00 GMT",
            "disease_descr": "Broken leg.",
            "doctor_id": 1,
            "patient": {
               "MBO": "123123123",
               "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
               "email": "john.smith@fer.hr",
               "name": "John",
               "phone_number": "0911231231",
               "surname": "Smith",
               "user_id": 1
            },
            "req_treatment": "Vježbanje uz povećanje napora.",
            "therapy_id": 1,
            "therapy_type": {
               "therapy_type_descr": "Therapy type description.",
               "therapy_type_id": 1,
               "therapy_type_name": "Phisical therapy"
            }
         }
      },
      "status": 201
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If required fields are missing.
      - If data is not in right format.
   - `500 Internal Server Error`
      - If there was a problem storiny your data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Update therapy

#### Request

- **Endpoint:** `/therapies/<therapy_id>`
- **Method:** `PATCH`
- **Require authorization**
- **Body:**
   - `doctor_id` (integer): Reference to a doctor in external database.
   - `disease_descr` (string): Disease description.
   - `patient_id` (integer): Reference to a patient that requested therapy.
   - `date_from` (string): Start of the therapy in format `YYYY-MM-DD`.
   - `req_treatment` (string): Patient's requested treatment.
   - `date_to` (string): End of the therapy in format `YYYY-MM-DD`.
   - `therapy_type_id` (integer): Reference to a therapy type.
- **Notes:**
   - All request params are optional.

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "therapy": {
            "date_from": "Tue, 12 Dec 2023 00:00:00 GMT",
            "date_to": "Sun, 24 Dec 2023 00:00:00 GMT",
            "disease_descr": "Broken leg.",
            "doctor_id": 1,
            "patient": {
               "MBO": "123123123",
               "date_of_birth": "Mon, 01 Jan 1990 00:00:00 GMT",
               "email": "john.smith@fer.hr",
               "name": "John",
               "phone_number": "0911231231",
               "surname": "Smith",
               "user_id": 1
            },
            "req_treatment": "Vježbanje uz povećanje napora.",
            "therapy_id": 1,
            "therapy_type": {
               "therapy_type_descr": "Therapy type description.",
               "therapy_type_id": 1,
               "therapy_type_name": "Phisical therapy"
            }
         }
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no ID `therapy_id`.
      - If data is not in right format.
   - `500 Internal Server Error`
      - If there was a problem storing your data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Delete therapy

#### Request

- **Endpoint:** `/therapies/<therapy_id>`
- **Method:** `DELETE`
- **Require authorization**
- **Notes:**
   - Deleting therapy will cascade to appointments so if you delete therapy all the appointments refering to a therapy will also be deleted.

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "message": "Deleted",
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no ID `therapy_id`.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

### Get all therapy types

#### Request

- **Endpoint:** `/therapy-types`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "therapy_types": [
            {
               "therapy_type_descr": "Therapy for something.",
               "therapy_type_id": 1,
               "therapy_type_name": "Therapy type name"
            },
            ...
         ]
      },
      "status": 200
   }
   ```

### Get therapy type

#### Request

- **Endpoint:** `/therapy-types/<therapy_type_id>`
- **Method:** `GET`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "therapy_type": {
               "therapy_type_descr": "Therapy for something.",
               "therapy_type_id": 1,
               "therapy_type_name": "Therapy type name"
         }
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no id `therapy_type_id`

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```

### Create therapy type

#### Request

- **Endpoint:** `/therapy-types`
- **Method:** `POST`
- **Require authorization**
- **Body:**
   - `therapy_type_name` (string): Therapy type name.
   - `therapy_type_descr` (string): Therapy type description.
- **Notes:**
   - `therapy_type_name` is required.

#### Response

- **Success Code:** `201 Created`
- **Content:**

   ```json
   {
      "data": {
         "therapy_type": {
               "therapy_type_descr": "Therapy for something.",
               "therapy_type_id": 1,
               "therapy_type_name": "Therapy type name"
         }
      },
      "status": 201
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If required fields are missing.
      - If data is not in right format.
   - `500 Internal Server Error`
      - If there was a problem storiny your data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Update therapy type

#### Request

- **Endpoint:** `/therapy-types/<therapy-types_id>`
- **Method:** `PATCH`
- **Require authorization**
- **Body:**
   - `therapy_type_name` (string): Therapy type name.
   - `therapy_type_descr` (string): Therapy type description.
- **Notes:**
   - All request params are optional.

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "data": {
         "therapy_type": {
               "therapy_type_descr": "Therapy for something.",
               "therapy_type_id": 1,
               "therapy_type_name": "Therapy type name"
         }
      },
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no ID `therapy_type_id`.
      - If data is not in right format.
   - `500 Internal Server Error`
      - If there was a problem storing your data.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```
   ```json
   {
      "error": "Error message",
      "status": 500
   }
   ```

### Delete therapy type

#### Request

- **Endpoint:** `/therapy-types/<therapy_type_id>`
- **Method:** `DELETE`
- **Require authorization**

#### Response

- **Success Code:** `200 OK`
- **Content:**

   ```json
   {
      "message": "Deleted",
      "status": 200
   }
   ```

- **Error Codes:**
   - `400 Bad Request`
      - If there is no ID `therapy_type_id`.

- **Error:**
   ```json
   {
      "error": "Error message",
      "status": 400
   }
   ```