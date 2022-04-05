//=== Auth JWT ===//
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== undefined) {
    const bearerToken = bearerHeader.split(" ")[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

//Filters movie by favorite
function filterByFavorite(userFav, userEmail) {
  if (userFav.email.toLowerCase().includes(userEmail.toLowerCase())) {
    return true;
  } else {
    return false;
  }
}
//Returns random Int
function randomNum() {
  var randInt = Math.random() * 100 + 1;
  return parseInt(randInt);
}
// Orders suggestion score desc
function orderBy(a, b) {
  return b.suggestionScore - a.suggestionScore;
}

module.exports = { filterByFavorite, randomNum, orderBy, verifyToken };
