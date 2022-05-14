const express = require('express');
const path = require('path');
const { dirname } = require('path');
const moment = require('moment');
const db = require(path.join(dirname(require.main.filename), 'connect'));

const router = express.Router();
const isLogin = (req) => {
  if (req.session.manager === undefined) return false;
  const { id } = req.session.manager;

  return db
    .query('SELECT * FROM `manager` WHERE `id` = ? LIMIT 1', [id])
    .then(([accounts]) => {
      if (accounts.length !== 1) return false;
      const manager = accounts[0];
      req.session.manager = manager;
      return true;
    })
    .catch(() => {
      return false;
    });
};

/**
 * 登出
 */
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

/**
 * 檢查是否登入
 */
router.get('/login', (req, res) => {
  res.send(isLogin(req));
});

/**
 * 登入驗證
 */
router.post('/login', (req, res) => {
  const account = req.body.account.toUpperCase();
  db.query('SELECT * FROM `manager` WHERE `id` = ? LIMIT 1', [account])
    .then(([accounts]) => {
      if (accounts.length === 1) {
        const manager = accounts[0];
        req.session.manager = manager;
        return res.status(200).json({ msg: 'success' });
      }
      return res.status(400).json({ msg: 'fail' });
    })
    .catch(() => {
      return res.status(500).end('未知錯誤');
    });
});

router.all('*', (req, res, next) => {
  if (isLogin(req)) {
    next();
  } else {
    redirect('/');
  }
});

/**
 * 所有管理人員
 */
router.get('/user_list', (req, res) => {
  db.query('SELECT * FROM `manager` LIMIT 100')
    .then(([managers]) => {
      res.status(200).json(managers);
    })
    .catch(() => {
      return res.status(500).json({ msg: 'fail' });
    });
});

/**
 * 新增管理人員
 */
router.post('/user', (req, res) => {
  const { id, role } = req.body;
  db.query('INSERT INTO manager (id, role) VALUES (?, ?)', [id, role])
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
 * 所有隊伍
 */
router.delete('/user/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM manager WHERE id = ?', [id])
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
 * 所有隊伍
 */
router.get('/team_list', (req, res) => {
  db.query('SELECT * FROM `team` LIMIT 100')
    .then(([teams]) => {
      res.status(200).json(teams);
    })
    .catch(() => {
      return res.status(500).json({ msg: 'fail' });
    });
});

/**
 * 新增隊伍
 */
router.post('/team', (req, res) => {
  const { id } = req.body;
  const upload_date = moment().format('YYYY-MM-DD HH:mm:ss');
  db.query('INSERT INTO `team` (id, upload_date) VALUES (?, ?)', [id, upload_date])
    .then(([ResultSetHeader]) => {
      if (ResultSetHeader.affectedRows === 0) {
        return res.status(401).json({ msg: 'fail' });
      }
      return res.status(200).json({ msg: 'success' });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ msg: 'fail' });
    });
});

/**
 * @deprecated 取的所有隊伍進度
 */
router.get('/team_progress', async (req, res) => {
  const sql = `
  SELECT 
    t.*, 
    count(b.id) AS treasure_count,
    GROUP_CONCAT(b.treasure_code) AS treasure_name,
    GROUP_CONCAT(b.is_used) AS treasure_label 
  FROM team AS t
  LEFT JOIN backpack AS b ON b.team_id = t.id
    GROUP BY t.id
    ORDER BY \`choose\` DESC, \`horus\` DESC, \`treasure_count\` DESC, \`kind\` DESC
  `;
  const [teamList] = await db.query(sql);
  return res.json(teamList);
});

router.all('*', (req, res) => {
  res.status(404).json({ msg: '404 Not Found' });
});

module.exports = router;
