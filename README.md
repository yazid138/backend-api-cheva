# API SG Cheva

dokumentasi dari API Cheva StudyGroup
Link dokumentasi Postman ['doc_postman'](https://documenter.getpostman.com/view/8802603/TzzDJuag)

## Deklarasi

* host = localhost
* port = 3000
* version = v1

## Status

* 200 - OK &rarr; Call API Success
* 201 - CREATED &rarr; Post Success
* 400 - BAD REQUEST &rarr; Error on Client Side
* 401 - UNAUTHORIZED &rarr; User not Authorized to the request
* 403 - FORBIDDEN &rarr; User not allowed to access request
* 404 - NOT FOUND &rarr; Request Endpoint Not Found
* 500 - INTERNAL SERVER ERROR &rarr; Error on Server Side
* 502 - BAD GATEWAY &rarr; Invalid Response From Another Request

## Environment

server = http://{host}:{port}/api/{version}

example = http://localhost:3000/api/v1

username | password | div | role    | token
---------|----------|-----|---------|-------
yazid    | 123      | web | mentor  | {token}
lucky    | 123      | web | student | {token}

### Headers

key           | value
--------------|--------------------
Authorization | {token from login}

give headers before access group (task, study group, course)

## Group

URL = {server}/{group}/{id}/{subgroup}/{endpoint}

example = http://localhost:3000/api/v1/task/18/quiz/edit

### Authentication

#### 1. Register
method: POST

url: {server}/auth/register

req-form-data:

key                     | value
------------------------|---------------------------------
name                    | input\['name']
username                | input\['username']
password                | input\['password']
div_id                  | input\['div_id']
role_id                 | input\['role_id']
media \(optional)       | input\['media']
media_label \(optional) | input\['media_label']

res:
* 200:
   ```json
   {
      "status": 200,
      "data": {
         "id": 96,
         "result": {
            "fieldCount": 0,
            "affectedRows": 1,
            "insertId": 96,
            "serverStatus": 2,
            "warningCount": 0,
            "message": "",
            "protocol41": true,
            "changedRows": 0
         }
      }
   }
   ```

#### 2.  Login
url: {server}/auth/login

req: 
```json
{
   "username" : "{username}",
   "password" : "{password}"
}
```

res: 
   * 200:
      ```json
      {
      "status": 200,
      "data": {
         "name": "Maisy Yazid I",
         "role_id": 1,
         "div_id": 1,
         "media": null,
         "token": "{token}"
         }
      }
      ```

### Task

#### 1. get all task
   method: GET

   url: {server}/task

   req-query: 

   key      | value
   ---------|---------------
   is_active| \(true/false)

   res:
   * 200 :
      ```json
      {
          "status": 200,
          "data": [
          {
             "task_id": 41,
             "title": "ada apa ini",
             "description": "coba coba",
             "type": "quiz",
             "deadline": "2021-08-20T11:00:00.000Z",
             "is_active": false,
             "mentor": {
                 "name": "Maisy Yazid I",
                 "div": "web"
             },
             "created_at": "2021-08-19T17:00:00.000Z",
             "updated_at": "2021-08-19T17:00:00.000Z",
             "media": {
                 "id": 125,
                 "label": "coba",
                 "uri": "http://localhost:3000/images/1629463009901-557471947-JPEG_20171212_212812.jpg"
             },
             "helper": [
                 {
                     "id": 3,
                     "title": "google",
                     "link": {
                         "id": 48,
                         "uri": "www.google.com"
                     }
                 },
                 {
                     "id": 4,
                     "title": "google",
                     "link": {
                         "id": 49,
                         "uri": "www.google.com"
                     }
                 }
             ]
         }, 
         {
             "task_id": 42,
             "title": "ada apa ini",
             "description": "coba coba",
             "type": "assignment",
             "deadline": "2021-08-20T11:00:00.000Z",
             "is_active": false,
             "mentor": {
                 "name": "Maisy Yazid I",
                 "div": "web"
             },
             "created_at": "2021-08-19T17:00:00.000Z",
             "updated_at": "2021-08-19T17:00:00.000Z",
             "media": {
                 "id": 125,
                 "label": "coba",
                 "uri": "http://localhost:3000/images/1629463009901-557471947-JPEG_20171212_212820.jpg"
             },
             "helper": [
                 {
                     "id": 5,
                     "title": "google",
                     "link": {
                         "id": 50,
                         "uri": "www.google.com"
                     }
                 }
             ]
         }]
      }
      ```

#### 2. get one task
   method: GET   

   url: {server}/task/{id}
   
   example: {server}/task/41

   req: -

   res:
   * 200 :
     ```json
     {
        "status": 200,
        "data": [
            {
                "task_id": 41,
                "title": "ada apa ini",
                "description": "coba coba",
                "type": "quiz",
                "deadline": "2021-08-20T11:00:00.000Z",
                "is_active": false,
                "mentor": {
                    "name": "Maisy Yazid I",
                    "div": "web"
                },
                "created_at": "2021-08-19T17:00:00.000Z",
                "updated_at": "2021-08-19T17:00:00.000Z",
                "media": {
                    "id": 125,
                    "label": "coba",
                    "uri": "http://localhost:3000/images/1629463009901-557471947-JPEG_20171212_212812.jpg"
                },
                "helper": [
                    {
                        "id": 3,
                        "title": "google",
                        "link": {
                            "id": 48,
                            "uri": "www.google.com"
                        }
                    },
                    {
                        "id": 4,
                        "title": "google",
                        "link": {
                            "id": 49,
                            "uri": "www.google.com"
                        }
                    }
                ]
            }
         ]
     }
     ```
#### 3. create task
method: POST

url: {server}/task/create

req-form-data:

key| value
---|-------
media|input\['media']
media_label|input\['media_label']
title|input\['title']
description|input\['description']
deadline|input\['deadline']
type|input\['type']

res:
   *  200: 
      ```json
      {
          "status": 201,
          "data": {
              "task_id": 45,
              "message": "success",
              "student": [
                  {
                      "id": 35
                  }
              ]
          }
      }
      ```

#### 4.  edit task
method: PUT

url: {server}/task/{id}/edit

example: {server}/task/45/edit

req: 
```json
{
   "title" : "{title}",
   "description" : "{description}",
   "deadline" : "{deadline}"
}
```

res:
   * 200:
      ```json
      {
          "status": 200,
          "data": {
              "fieldCount": 0,
              "affectedRows": 1,
              "insertId": 0,
              "serverStatus": 2,
              "warningCount": 0,
              "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
              "protocol41": true,
              "changedRows": 1
          }
      }
      ```

### **Study Group**
