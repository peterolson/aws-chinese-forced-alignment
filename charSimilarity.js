let { getEntries } = require("chinese-lexicon");
let { getDifference } = require("./pinyinToZhuyin");

function compareChar(a, b) {
    let aEntries = getEntries(a);
    let bEntries = getEntries(b);
    let minDifference = 10;
    for (let aEntry of aEntries) {
        for (let bEntry of bEntries) {
            minDifference = Math.min(minDifference, getDifference([aEntry.pinyin], [bEntry.pinyin]));
        }
    }
    return minDifference;
}

function areSimilar(char1, char2) {
    return compareChar(char1, char2) <= 3;
}

module.exports = { areSimilar, compareChar };