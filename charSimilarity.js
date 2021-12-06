let { getEntries } = require("chinese-lexicon");
let { getDifference } = require("./pinyinToZhuyin");

const cache = {};

function compareChar(a, b) {
  const pair = a > b ? a + b : b + a;
  if (pair in cache) {
    return cache[pair];
  }
  let aEntries = getEntries(a);
  let bEntries = getEntries(b);
  let minDifference = 10;
  for (let aEntry of aEntries) {
    for (let bEntry of bEntries) {
      minDifference = Math.min(
        minDifference,
        getDifference(aEntry.pinyin.toLowerCase(), bEntry.pinyin.toLowerCase())
      );
    }
  }
  cache[pair] = minDifference;
  return minDifference;
}

function areSimilar(char1, char2) {
  return compareChar(char1, char2) <= 3;
}

module.exports = { areSimilar, compareChar };
