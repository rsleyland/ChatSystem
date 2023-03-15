# :star: Realtime Chat System :star:

### :earth_americas: Example
```https://achat.herokuapp.com```

### :computer: Tech
##### Frontend
- React
- Redux
- Websockets

##### Backend
- Django (DRF)
- Redis
- JWT (http only cookies)

### :information_source: Steps (manual)

- ```git clone git@github.com:rsleyland/ChatSystem.git```

##### Frontend
- ```cd ChatSystem\frontend```
- ```npm start```

##### Backend

- ```cd ChatSystem\backend```
- ```python -m venv myenv```
- ```myenv\Scripts\activate```
- ```pip install -r requirements.txt```
- ```python manage.py runserver```

##### Redis (must have docker installed)
- ```docker run -p 6379:6379 -d redis:5```


### :information_source: Steps (docker)

- ```git clone git@github.com:rsleyland/ChatSystem.git```
- ```git checkout dockered```
- ```docker-compose build```
- ```docker-compose-up```