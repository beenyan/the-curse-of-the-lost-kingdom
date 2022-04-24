class Treasure {
  constructor() {
    Object.assign(this, ...arguments);
  }
  getHandler() {
    // 得到此寶物
  }
  useHandler() {
    // 使用此寶物
  }
  remove(teamID) {}
}

const a = new Treasure({
  code: 'c',
});
console.log(a);
