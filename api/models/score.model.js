const sql = require("./db.js");

// constructor
const Score = function(score) {
  this.playerName = score.playerName;
  this.score = score.score;
};

Score.create = (newScore, result) => {
  sql.query("INSERT INTO score SET ?", newScore, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, { id: res.insertId, ...newScore });
  });
};

Score.findById = (id, result) => {
  sql.query(`SELECT * FROM score WHERE id = ${id}`, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    if (res.length) {
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Score.getAll = (sort, maxResults, result) => {
  let query = "SELECT * FROM score";

  if(sort == -1){
    query += ' ORDER BY score DESC';
  }else if(sort == 1){
    query += ' ORDER BY score ASC';
  }

  if (maxResults) {
    query += ` LIMIT ${maxResults}`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    result(null, res);
  });
};


Score.updateById = (id, score, result) => {
  sql.query(
    "UPDATE score SET PlayerName = ?, Score = ? WHERE id = ?",
    [score.playerName, score.score, id],
    (err, res) => {
      if (err) {
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { id: id, ...score });
    }
  );
};

Score.remove = (id, result) => {
  sql.query("DELETE FROM score WHERE Id = ?", id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    result(null, res);
  });
};


module.exports = Score;
