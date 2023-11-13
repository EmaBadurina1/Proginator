# API Documentation

## Get User by ID

### Request

- **Endpoint:** `/users/{user_id}`
- **Method:** `GET`

#### Parameters

- `user_id` (integer): ID of the user.

### Response

- **Success Code:** `200 OK`
- **Content:**
  ```json
  {
    "id": 1,
    "name": "John",
    "surname": "Doe",
    "email": "john@example.com",
    "phone_number": "123 Main St",
    "hashed_password": "hashed_password_here"
  }

*** Error Codes: ***
- `404 Not Found`: If the user with the specified ID is not found.


## Get All Users

### Request

- **Endpoint:** `/users`
- **Method:** `GET`

### Response

- **Success Code:** `200 OK`
- **Content:**
  ```json
  {
    "users": [
      {
        "id": 1,
        "name": "John",
        "surname": "Doe",
        "email": "john@example.com",
        "phone_number": "123 Main St",
        "hashed_password": "hashed_password_here"
      },
      {
        "id": 2,
        "name": "Jane",
        "surname": "Doe",
        "email": "jane@example.com",
        "phone_number": "456 Oak St",
        "hashed_password": "hashed_password_here"
      }
    ]
  }
    ```


## User Login

### Request

- **Endpoint:** `/login`
- **Method:** `POST`

#### Parameters

- `email` (string): User's email address.
- `password` (string): User's password.

### Response

- **Success Code:** `200 OK`
- **Content:**
  ```json
  {
    "user_id": 1,
  }
    ```
***Error Codes:***
- `401 Bad Request`: If the email or password is incorrect.

# Create a New User

## Request

- **Endpoint:** `/users`
- **Method:** `POST`

### Parameters

- `name` (string): User's first name.
- `surname` (string): User's last name.
- `email` (string): User's email address (must be unique).
- `phone_number` (string): User's phone number (must be unique).
- `password` (string): User's password.

## Response

- **Success Code:** `200 OK`
- **Content:**
  ```json
  {
    "id": 1
  }
 ```