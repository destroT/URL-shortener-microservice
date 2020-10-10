# API Project: URL Shortener Microservice for freeCodeCamp (https://url-shortener-td.herokuapp.com/)

![N|Solid](https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fen%2Fa%2Fa9%2FHeroku_logo.png&f=1&nofb=1)

#### A microservice project, part of Free Code Camp's curriculum

-   I can POST a URL to [project_url]/api/shorturl/new and I will receive a shortened URL in the JSON response. Example : {"original_url":"www.google.com","short_url":1}
-   If I pass an invalid URL that doesn't follow the valid http(s)://www.example.com(/more/routes) format, the JSON response will contain an error like {"error":"invalid URL"}. HINT: to be sure that the submitted url points to a valid site you can use the function dns.lookup(host, cb) from the dns core module.
-   When I visit the shortened URL, it will redirect me to my original link.

# Installation

This app requires [Node.js](https://nodejs.org/) v12.18.x + to run.
You need a MongoDB uri to run this project [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
After you get the URI, you need to create a file .env in the main folder and add the URI to the variable _DB_URI_.

Install the dependencies

```sh
$ cd URL-shortener-microservice
$ npm install -d
$ npm start
```

#### Dependecies

-   [Node.js](https://nodejs.org/)
-   [mongoose](https://mongoosejs.com/)
-   [Axios](https://github.com/axios/axios)
-   [Bootstrap v5](https://v5.getbootstrap.com/)
-   [notyf](https://www.carlosroso.com/notyf/)
