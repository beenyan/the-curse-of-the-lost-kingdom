const express = require('express');
const path = require('path');
const { dirname } = require('path');
const moment = require('moment');
const treasureList = require(path.join(__dirname, '../assets/treasure'));
const db = require(path.join(dirname(require.main.filename), 'connect'));

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
  db.query('SELECT `id`, `name`, `money`, `kind`, `horus` FROM team WHERE id = ?', [id])
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
  const { id } = req.session.team;
  const teamName = name.trim();

  db.query('UPDATE team SET name = ? WHERE id = ?', [teamName, id])
    .then(([ResultSetHeader]) => {
      if (ResultSetHeader.affectedRows === 0) {
        return res.status(403).json({ msg: 'fail' });
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
router.post('/backpack', async (req, res) => {
  const { code } = req.body;
  const { id } = req.session.team;

  // 寶物碼錯誤
  if (!Object.prototype.hasOwnProperty.call(treasureList, code)) {
    return res.status(403).json({ msg: 'fail' });
  }

  const treasure = treasureList[code];
  // 新增寶物
  treasure.getHandler(id, req, res);
});

router.all('*', (req, res) => {
  res.status(404).json({ msg: 'Not Found' });
});

module.exports = router;
