const path = require('path');
const { dirname } = require('path');
const db = require(path.join(dirname(require.main.filename), 'connect'));
const moment = require('moment');

const back = (msg = '', status = false) => {
  return { status, msg };
};

const lightUp = (team_id) => {
  return new Promise((resolve, reject) => {
    db.query('UPDATE team SET horus += 20 WHERE team_id = ?', [team_id]).then(() => {
      resolve(back('success', true));
    });
  });
};

let useHandlerMap = {
  ComePass(team_id) {
    return new Promise((resolve, reject) => {
      resolve(treasureList.ComePassPuzzle.getHandler(team_id));
    });
  },
  async Ramses6a6y(team_id) {
    return await lightUp(team_id);
  },
  async Finallyucango(team_id) {
    return await lightUp(team_id);
  },
  async GodTear(team_id) {
    return await lightUp(team_id);
  },
  async annnkaaa(team_id) {
    return await lightUp(team_id);
  },
  async kwnatl45678(team_id) {
    return await lightUp(team_id);
  },
  CobraVenom() {
    return back('success', true);
  },
  SourceOfHorus() {
    return back('success', true);
  },
};

class Treasure {
  constructor(_name, _dependList = [], _consumables = false) {
    this.name = _name;
    this.dependList = _dependList;
    this.consumables = _consumables;
  }
  async isUsed(team_id) {
    /**
     * @return {boolean} ture: already used this treasure.
     */
    return await this.isInBackpack(team_id, true);
  }
  isInBackpack(team_id, is_used) {
    /**
     * @return {boolean} ture: already has this treasure.
     */
    return new Promise((resolve, reject) => {
      const limit = is_used ? 'AND is_used = 1' : '';
      const sql = `SELECT count(id) as count FROM backpack WHERE team_id = ? AND treasure_code = ? ${limit}`;
      db.query(sql, [team_id, this.name]).then(([rows]) => {
        resolve(rows[0].count);
      });
    });
  }
  inserToDb(team_id) {
    /**
     * @return {boolean} ture: Insert into mysql successed.
     */
    return new Promise((resolve, reject) => {
      const upload_date = moment().format('YYYY-MM-DD HH:mm:ss');
      const sql = 'INSERT INTO `backpack` (team_id, treasure_code, upload_date) VALUES (?, ?, ?)';
      db.query(sql, [team_id, this.name, upload_date]).then(([rows]) => {
        resolve(true);
      });
    });
  }
  async getHandler(team_id) {
    // 檢查寶物是否已經取得
    if (await this.isInBackpack(team_id)) {
      return back('Already has it.');
    }

    // 檢查是否已取得依賴的寶物
    for (const treasureCode of this.dependList) {
      const treasure = treasureList[treasureCode];
      if (await treasure.isUsed(team_id)) {
        return back("Didn't has depend treasure.");
      }
    }

    // 刪除依賴寶物
    for (const treasureCode of this.dependList) {
      const treasure = treasureList[treasureCode];
      treasure.removeHandler(team_id);
    }

    if (await this.inserToDb(team_id)) {
      return back('success', true);
    }
  }
  async useHandler(team_id) {
    if (!this.consumables) {
      return back('This treasure cannot be used.');
    } else if (await this.isUsed(team_id)) {
      return back('This treasure already be used.');
    }

    // 使用此寶物
    const result = await useHandlerMap[this.name](team_id);
    if (!result.status) return result;
    this.removeHandler();
    return result;
  }
  removeHandler(team_id) {
    db.query('UPDATE backpack SET is_used = 1 WHERE team_id = ? AND treasure_code = ?', [team_id, this.name]);
  }
}

const treasureList = {
  Compass: new Treasure('Compass'),
  '6ad6a6y': new Treasure('6ad6a6y'),
  SkyEnglish: new Treasure('SkyEnglish'),
  SleepYandSand: new Treasure('SleepYandSand'),
  ComePass: new Treasure('ComePass', ['Compass', 'SkyEnglish', 'SleepYandSand'], true),
  ComePassPuzzle: new Treasure('ComePassPuzzle', ['ComePass']),
  BoneBoneBone: new Treasure('BoneBoneBone', ['NorthWater']),
  '0x480x650x78': new Treasure('0x480x650x78'),
  FreshPootau: new Treasure('FreshPootau'),
  YouCantDrive: new Treasure('YouCantDrive'['FreshPootau']),
  Max6a6y: new Treasure('Max6a6y', ['6ad6a6y', '0x480x650x78', 'YouCantDrive']),
  Ramses6a6y: new Treasure('Ramses6a6y', ['Max6a6y', 'BoneBoneBone'], true),
  Illusions: new Treasure('Illusions'),
  Paraohmask: new Treasure('Paraohmask'),
  Overmydeadbody: new Treasure('Overmydeadbody'),
  shitBeetles: new Treasure('shitBeetles', ['Illusions', 'Paraohmask', 'Overmydeadbody']),
  Finallyucango: new Treasure('Finallyucango', ['shitBeetles'], true),
  LionMao: new Treasure('LionMao'),
  Muddddd: new Treasure('Muddddd'),
  MaskPeitai: new Treasure('MaskPeitai', ['Muddddd']),
  HundredShenwood: new Treasure('HundredShenwood'),
  OldGodWood: new Treasure('OldGodWood', ['HundredShenwood']),
  Questionnaire: new Treasure('Questionnaire', ['LionMao', 'MaskPeitai', 'OldGodWood']),
  C37: new Treasure('C37'),
  GoldSilverMoney: new Treasure('GoldSilverMoney'),
  UglyFlower: new Treasure('UglyFlower'),
  GodTear: new Treasure('GodTear', ['C37', 'GoldSilverMoney', 'UglyFlower'], true),
  arcanapoke: new Treasure('arcanapoke'),
  materiasss: new Treasure('materiasss', ['arcanapoke']),
  materiastone: new Treasure('materiastone', ['materiasss']),
  solaramber: new Treasure('solaramber'),
  setekhskeletal: new Treasure('setekhskeletal'),
  blazeanima: new Treasure('blazeanima'),
  mamahaha: new Treasure('mamahaha', ['blazeanima', 'setekhskeletal', 'solaramber']),
  sandstormlance: new Treasure('sandstormlance', ['mamahaha', 'materiastone']),
  annnkaaa: new Treasure('annnkaaa', ['sandstormlance'], true),
  konpinla1: new Treasure('konpinla1'),
  konpinla2: new Treasure('konpinla2'),
  doyapin55: new Treasure('doyapin55', ['konpinla1']),
  '1lowwoo36': new Treasure('1lowwoo36', ['konpinla2']),
  shoutomiti69: new Treasure('shoutomiti69', ['doyapin55', '1lowwoo36']),
  leader: new Treasure('leader', ['shoutomiti69']),
  kaichishco56: new Treasure('kaichishco56'),
  samyanshi29: new Treasure('samyanshi29', ['kaichishco56']),
  shiya5ucha1: new Treasure('shiya5ucha1', ['samyanshi29']),
  chz0innochi: new Treasure('chz0innochi', ['shiya5ucha1', 'shoutomiti69']),
  kwnatl45678: new Treasure('kwnatl45678', ['chz0innochi'], true),
  TheSixth: new Treasure('TheSixth'),
  GodKnows: new Treasure('GodKnows'),
  ChefKnows: new Treasure('ChefKnows'),
  DoctorKnows: new Treasure('DoctorKnows'),
  CobraVenom: new Treasure('CobraVenom', ['GodKnows', 'ChefKnows', 'DoctorKnows'], true),
  SourceOfHorus: new Treasure('SourceOfHorus', [], true),

  //支線
  iToldYouDo: new Treasure('iToldYouDo'),
  iron123: new Treasure('iron123'),
  letter456: new Treasure('letter456'),
  lunardiamond: new Treasure('lunardiamond'),
  Afterglow: new Treasure('Afterglow'),
};

module.exports = treasureList;
