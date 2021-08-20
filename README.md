# API SG Cheva

dokumentasi dari API Cheva StudyGroup

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

user | password | div | role
-----|----------|-----|---------
yazid| 123      | web | mentor
lucky| 123      | web | student

## Group

URL = {server}/{group}/{id}/{subgroup}/{endpoint}

example = http://localhost:3000/api/v1/task/18/quiz/edit

### Task

1. get all task

   url: {server}/task

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
            }
        ]
   }
   ```

2. get one task
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
3. create task

### **Study Group**
