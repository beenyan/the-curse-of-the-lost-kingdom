const express = require('express');
const path = require('path');
const { dirname } = require('path');
const moment = require('moment');
const CryptoJS = require('crypto-js');
const db = require(path.join(dirname(require.main.filename), 'connect'));

CryptoJS.key = 'secret';
const router = express.Router();
const isLogin = (req) => {
  if (req.session.team === undefined) return false;
  const { id } = req.session.team;

  return db
    .query('SELECT * FROM `team` WHERE `id` = ? LIMIT 1', [id])
    .then(([teams]) => {
      if (teams.length !== 1) return false;
      const team = teams[0];
      req.session.team = team;
      return true;
    })
    .catch(() => {
      return false;
    });
};

/**
 * 登入
 */
router.post('/login', (req, res) => {
  const { id } = req.body;
  if (id === undefined) return res.status(401).json({ msg: 'fail' });
  const teamID = id.trim();

  db.query('SELECT * FROM `team` WHERE id = ?', [teamID])
    .then(([teams]) => {
      if (teams.length !== 1) return res.status(401).json({ msg: 'undefined' });
      const team = teams[0];
      req.session.team = team;
      res.status(200).json({ msg: 'success' });
    })
    .catch(() => {
      res.status(500).json({ msg: 'unknown error' });
    });
});

/**
 * 檢查是否登入
 */
router.all('*', (req, res, next) => {
  if (!isLogin(req)) return res.status(401).json({ msg: "You don't login" });
  next();
});

/**
 * 取得隊伍狀況
 */
router.get('/team', (req, res) => {
  const { id } = req.session.team;
  db.query('SELECT * FROM team WHERE id = ?', [id])
    .then(([team]) => {
      return res.status(200).json(team[0]);
    })
    .catch(() => {
      return res.status(500).json({ msg: 'fail' });
    });
});

/**
 * 輸入隊伍暱稱
 */
router.post('/team_name', (req, res) => {
  const { name } = req.body;
  if (name === undefined) return res.status(401).json({ msg: 'fail' });
  const teamName = name.trim();

  db.query('INSERT INTO (name) VALUES (?)', [teamName])
    .then(([ResultSetHeader]) => {
      if (ResultSetHeader.affectedRows === 0) {
        return res.status(401).json({ msg: 'fail' });
      }
      return res.status(200).json({ msg: 'success' });
    })
    .catch(() => {
      return res.status(500).json({ msg: 'fail' });
    });
});

/**
 * 取得背包擁有的寶物
 */
router.get('/backpack', (req, res) => {
  const { id } = req.session.team;
  db.query('SELECT * FROM backpack WHERE team_id = ?', [id])
    .then(([backpack]) => {
      return res.status(200).json(backpack);
    })
    .catch(() => {
      return res.status(500).json({ msg: 'fail' });
    });
});

/**
 * 背包新增寶物
 */
router.post('/backpack', (req, res) => {
  const { code, qrcode } = req.session.team;
  if (code === undefined && qrcode === undefined) return res.status(400).join({ msg: 'fail' });
  const team_id = req.session.team.id;

  const insert_backpack = (res, team_id, treasure_code) => {
    db.query('INSERT INTO backpack (team_id, treasure_code) VALUE (?, ?)', [team_id, treasure_code])
      .then(([ResultSetHeader]) => {
        if (ResultSetHeader.affectedRows === 0) {
          return res.status(401).json({ msg: 'fail' });
        }
        return res.status(200).json({ msg: 'success' });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).join({ msg: 'fail' });
      });
  };
  if (code) {
    const team_id = req.session.team.id;
    insert_backpack(res, team_id, code);
  } else if (qrcode) {
    const { team, treasure } = CryptoJS.AES.decrypt(qrcode, CryptoJS.key).toString(CryptoJS.enc.Utf8);
    if (team === undefined || treasure === undefined) return res.status(400).join({ msg: 'fail' });
    else if (team !== team_id) return res.status(400).join({ msg: '隊伍錯誤' });

    insert_backpack(res, team, treasure);
  }
});

/**
 * 取得背包擁有的寶物
 */
router.get('/use_treasure/:code', (req, res) => {
  const { code } = req.params;
  const { id } = req.session.team;
  const sql = 'SELECT * FROM backpack LEFT JOIN treasure AS t on t.code = ? WHERE team_id = ? AND treasure_code = ?';
  db.query(sql, [code, id, code])
    .then(([treasureList]) => {
      if (treasureList.length === 0) return res.status(400).join({ msg: 'fail' });
      const treasure = treasureList[0];
    })
    .catch((err) => {
      return res.status(400).join({ msg: 'fail' });
    });
});

router.all('*', (req, res) => {
  res.status(404).json({ msg: 'Not Found' });
});

module.exports = router;
