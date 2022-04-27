const db = require('../connect');

class Treasure {
  constructor() {
    this.name = '';
    this.dependList = [];
    this.consumables = false;

    Object.assign(this, ...arguments);
  }
  isInBackpack(team_id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT count(id) as count WHERE teamd_id = ? AND treasure_code = ?';
      db.query(sql, [team_id, this.name]).then(([rows]) => {
        resolve(rows[0].count);
      });
    });
  }
  inserToDb() {
    // 將取的寶寶物嘉進資料入
  }
  getHandler(res) {
    // 得到此寶物Handler

    // 檢查是否依賴寶物有取得
    for (const treasureCode of dependList) {
      if (!Object.prototype.hasOwnProperty.call(treasureList, 'treasureCode').checkInBackpack()) {
        return res.status(403).json({ msg: "Don't has depend treasure" });
      }
      // db.query('DELETE FROM `treasure WHERE code = ?`',[treasureCode])
    }

    // 刪除依賴寶物
    for (const treasureCode of dependList) {
      // db.query('DELETE FROM `treasure WHERE code = ?`',[treasureCode])
    }

    this.inserToDb();
  }
  useHandler() {
    // 使用此寶物

    // 如果是消耗品
    if (this.consumables) {
      this.removeHandler();
    }
  }
  removeHandler() {
    // db.query('DELETE FROM `treasure WHERE code = ?`',[this.code])
  }
}

class Konpinla extends Treasure {
  constructor() {
    super({
      dependList: [],
      consumables: true,
    });
  }
  useHandler() {
    // 使用此寶物

    // 如果是消耗品
    if (this.consumables) {
      this.removeHandler();
    }
  }
}

const treasureList = {
  // TreasureCode: new Treasure({

  // }),
  ComePass: new Treasure({
    dependList: ['Compass', 'SkyEnglish', 'SleepYandSand'],
    consumables: true,
    useHandler() {
      // 使用此寶物

      // 如果是消耗品
      if (this.consumables) {
        this.removeHandler();
      }
    },
  }),
  konpinla1: new Konpinla(),
  konpinla2: new Konpinla(),
};

module.exports = treasureList;
