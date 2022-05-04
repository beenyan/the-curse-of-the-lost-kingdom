const express = require('express');
const path = require('path');
const { dirname } = require('path');
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
 * @description 登入
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
 * @description 檢查是否登入
 */
router.all('*', (req, res, next) => {
  if (!isLogin(req)) return res.status(401).json({ msg: "You didn't log in." });
  next();
});

/**
 * @description 取得隊伍狀況
 */
router.get('/team', (req, res) => {
  const { id } = req.session.team;
  db.query('SELECT `id`, `name`, `kind`, `horus` FROM team WHERE id = ?', [id])
    .then(([team]) => {
      return res.status(200).json(team[0]);
    })
    .catch(() => {
      return res.status(500).json({ msg: 'fail' });
    });
});

/**
 * @description 輸入隊伍暱稱
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
 * @description 取得背包擁有的寶物
 */
router.get('/backpack', (req, res) => {
  const { id } = req.session.team;
  db.query('SELECT * FROM backpack WHERE team_id = ? AND is_used = 0', [id])
    .then(([backpack]) => {
      return res.status(200).json(backpack);
    })
    .catch(() => {
      return res.status(500).json({ msg: 'fail' });
    });
});

/**
 * @description 背包新增寶物
 */
router.post('/backpack', async (req, res) => {
  const { code } = req.body;
  const { id } = req.session.team;

  if (!Object.prototype.hasOwnProperty.call(treasureList, code)) {
    // 寶物碼錯誤
    return res.status(403).json({ msg: 'Treasure Code not found.' });
  }

  // 新增寶物
  const treasure = treasureList[code];
  const result = await treasure.getHandler(id);
  if (!result.status) {
    return res.status(403).json({ msg: result.msg });
  }

  res.json({ msg: result.msg });
});

/**
 * @description 使用背包的物品
 */
router.post('/backpack/use', async (req, res) => {
  const { code } = req.body;
  const { id } = req.session.team;

  if (!Object.prototype.hasOwnProperty.call(treasureList, code)) {
    // 寶物碼錯誤
    return res.status(403).json({ msg: 'Treasure Code not found.' });
  }

  // 新增寶物
  const treasure = treasureList[code];
  const result = await treasure.useHandler(id);
  if (!result.status) {
    return res.status(403).json({ msg: result.msg });
  }

  const ret = { msg: result.msg };
  if (result.data) {
    ret.data = result.data;
  }
  res.json(ret);
});

/**
 * @description 遊戲結束
 */
router.post('/game-end', async (req, res) => {
  const { choose } = req.body;
  const { id } = req.session.team;

  const pathMap = {
    path1: 1, // 法老
    path2: 2, // 現實
  };

  if (!pathMap.hasOwnProperty(choose)) {
    return res.status(403).json({ msg: 'Choose error.' });
  }

  const [team] = await db.query('SELECT horus, choose FROM team WHERE team = ?', [id]);
  if (team.horus !== 5 || team.choose !== 0) {
    return res.status(403).json({ msg: '條件未達成' });
  }

  await db.query('UPDATE team SET choose = ? WHERE team = ?', [pathMap[choose], id]);
  return res.status(200).json({ msg: 'success' });
});

router.all('*', (req, res) => {
  res.status(404).json({ msg: '404 Not Found' });
});

module.exports = router;
