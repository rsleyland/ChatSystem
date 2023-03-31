# Realtime Chat System
### :earth_americas: Example
[https://easychats.herokuapp.com](https://easychats.herokuapp.com)  (allow 1 min to start as will idle when inactive)

Test accounts: [{acc1@easychats.com, test.123}, {acc2@easychats.com, test.123}]

### :computer: Tech
##### Frontend
- React
- Redux
- Websockets

##### Backend
- Django (DRF)
- Redis
- Channels
- Daphne
- Cors
- Whitenoise
- JWT (http only cookies)

### :information_source: Steps (manual)

- ```git clone git@github.com:rsleyland/ChatSystem.git```

##### Frontend
- ```cd ChatSystem\frontend```
- ```npm start```
- running on localhost:3000

##### Backend

- ```cd ChatSystem\backend```
- ```python -m venv myenv```
- ```myenv\Scripts\activate```
- ```pip install -r requirements.txt```
- ```python manage.py runserver```
- running on localhost:8000

##### Redis (must have docker installed)
- ```docker run -p 6379:6379 -d redis:5```


### :information_source: Steps (Docker - must have docker installed)

- ```git clone git@github.com:rsleyland/ChatSystem.git```
- ```cd ChatSystem```
- ```git checkout dockered```
- ```docker-compose build```
- ```docker-compose-up```
- backend running on localhost:8000
- frontend running on localhost:3000
- redis running on localhost:6379
