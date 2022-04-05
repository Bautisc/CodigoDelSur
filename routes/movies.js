const express = require("express");
const router = express.Router();
const fs = require("fs");
const utils = require("../utils/utils");
const fetch = require("node-fetch");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const PATH_fav = "./favoritos.txt";
//==Middleware==//
router.use(bodyParser.json());
//==The movie data base==//
dotenv.config();
const tmdb = `https://api.themoviedb.org/3/discover/movie/?api_key=${process.env.TMDB_API_KEY} `;

//Obtener Peliculas
router.get("/:keyword?", utils.verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err) => {
    if (err) {
      res.sendStatus(403);
    } else {
      const response = fetch(tmdb)
        .then((res) => {
          return res.json();
        })
        .then((response) => {
          const movieResult = response.results;
          const movieData = movieResult.map(function (movie) {
            return { id: movie.id, title: movie.title, suggestionScore: utils.randomNum() };
          });

          const movieSorted = movieData.sort(utils.orderBy);
          if (req.params.keyword) {
            const movieFilter = movieSorted.filter(filterByKeyword);
            res.json(movieFilter);
          } else {
            res.json(movieSorted);
          }
          function filterByKeyword(movie) {
            if (movie.title.toLowerCase().includes(req.params.keyword.toLowerCase())) {
              return true;
            } else {
              return false;
            }
          }
        });
    }
  });
});

//Agregar a favoritos
router.post("/addFav", utils.verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    fs.readFile(PATH_fav, "utf-8", (err, data) => {
      if (err) {
        res.status(400);
        return;
      }
      const email = req.body.email;
      const idMovie = req.body.movieID;
      const movieTitle = req.body.title;
      const favorites = data ? JSON.parse(data) : [];
      const checkFavs = favorites.find((favorite) => email === favorite.email && idMovie === favorite.movieID);
      if (!checkFavs) {
        favorites.push({
          email,
          movieID: idMovie,
          title: movieTitle,
          addedAt: Date.now(),
        });
        fs.writeFile(PATH_fav, JSON.stringify(favorites), "utf-8", (err) => {
          if (err) {
            res.send(400);
          }
          res.status(200).json({
            msg: "Movie added to favorites.",
          });
        });
      } else {
        res.status(200).json({
          msg: "Movie already in favorites.",
        });
      }
    });
  });
});
//Obtener favoritos
router.get("/getFavs/:userEmail", utils.verifyToken, (req, res) => {
  jwt.verify(req.token, "secretkey", (err) => {
    if (err) {
      res.send(403);
      return;
    }
    fs.readFile(PATH_fav, "utf-8", (err, data) => {
      if (err) {
        res.send(400);
        return;
      }
      const favorites = data ? JSON.parse(data) : [];
      const userFavs = favorites.filter((fav) => {
        return utils.filterByFavorite(fav, req.params.userEmail);
      });

      const suggestedMovie = userFavs.map((fav) => {
        return { title: fav.title, suggestionForTodayScore: utils.randomNum() };
      });
      res.json(suggestedMovie);
    });
  });
});

module.exports = router;
