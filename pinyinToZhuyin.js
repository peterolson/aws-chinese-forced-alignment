// https://github.com/nathanathan/pinyinToZhuyin

//Primary reference: http://www.yellowbridge.com/chinese/pinyin-combo.php
var initials = {
    b: 'ㄅ',
    p: 'ㄆ',
    m: 'ㄇ',
    f: 'ㄈ',
    d: 'ㄉ',
    t: 'ㄊ',
    n: 'ㄋ',
    l: 'ㄌ',
    g: 'ㄍ',
    k: 'ㄎ',
    h: 'ㄏ',
    j: 'ㄐ',
    q: 'ㄑ',
    x: 'ㄒ',
    zh: 'ㄓ',
    ch: 'ㄔ',
    sh: 'ㄕ',
    r: 'ㄖ',
    z: 'ㄗ',
    c: 'ㄘ',
    s: 'ㄙ'
};
var finals = {
    a: 'ㄚ',
    o: 'ㄛ',
    e: 'ㄜ',
    ai: 'ㄞ',
    ei: 'ㄟ',
    ao: 'ㄠ',
    ou: 'ㄡ',
    an: 'ㄢ',
    ang: 'ㄤ',
    en: 'ㄣ',
    eng: 'ㄥ',
    er: 'ㄦ',
    u: 'ㄨ',
    ua: 'ㄨㄚ',
    uo: 'ㄨㄛ',
    uai: 'ㄨㄞ',
    ui: 'ㄨㄟ',
    uan: 'ㄨㄢ',
    uang: 'ㄨㄤ',
    un: 'ㄨㄣ',
    //This one might not occur.
    ueng: 'ㄨㄥ',
    ong: 'ㄨㄥ',
    i: 'ㄧ',
    ia: 'ㄧㄚ',
    ie: 'ㄧㄝ',
    iao: 'ㄧㄠ',
    iu: 'ㄧㄡ',
    ian: 'ㄧㄢ',
    iang: 'ㄧㄤ',
    'in': 'ㄧㄣ',
    ing: 'ㄧㄥ',
    'ü': 'ㄩ',
    'üe': 'ㄩㄝ',
    'ue': 'ㄩㄝ',
    'üan': 'ㄩㄢ',
    'ün': 'ㄩㄣ',
    iong: 'ㄩㄥ'
};
var individuals = {
    //individual initials
    zhi: 'ㄓ',
    chi: 'ㄔ',
    shi: 'ㄕ',
    ri: 'ㄖ',
    zi: 'ㄗ',
    ci: 'ㄘ',
    si: 'ㄙ',
    //individual finals
    a: 'ㄚ',
    o: 'ㄛ',
    e: 'ㄜ',
    ai: 'ㄞ',
    ei: 'ㄟ',
    ao: 'ㄠ',
    ou: 'ㄡ',
    an: 'ㄢ',
    ang: 'ㄤ',
    en: 'ㄣ',
    eng: 'ㄥ',
    er: 'ㄦ',
    r: 'ㄦ',
    wu: 'ㄨ',
    wa: 'ㄨㄚ',
    wo: 'ㄨㄛ',
    wai: 'ㄨㄞ',
    wei: 'ㄨㄟ',
    wan: 'ㄨㄢ',
    wang: 'ㄨㄤ',
    wen: 'ㄨㄣ',
    weng: 'ㄨㄥ',
    yi: 'ㄧ',
    ya: 'ㄧㄚ',
    ye: 'ㄧㄝ',
    yao: 'ㄧㄠ',
    you: 'ㄧㄡ',
    yan: 'ㄧㄢ',
    yang: 'ㄧㄤ',
    yin: 'ㄧㄣ',
    ying: 'ㄧㄥ',
    yu: 'ㄩ',
    yue: 'ㄩㄝ',
    yuan: 'ㄩㄢ',
    yun: 'ㄩㄣ',
    yong: 'ㄩㄥ'
};
var toneMap = {
    'ā': 'a1',
    'á': 'a2',
    'ǎ': 'a3',
    'à': 'a4',
    'ē': 'e1',
    'é': 'e2',
    'ě': 'e3',
    'è': 'e4',
    'ī': 'i1',
    'í': 'i2',
    'ǐ': 'i3',
    'ì': 'i4',
    'ō': 'o1',
    'ó': 'o2',
    'ǒ': 'o3',
    'ò': 'o4',
    'ū': 'u1',
    'ú': 'u2',
    'ǔ': 'u3',
    'ù': 'u4',
    'ǖ': 'ü1',
    'ǘ': 'ü2',
    'ǚ': 'ü3',
    'ǜ': 'ü4',
};
var findAccentedChars = function (text) {
    var accentsFound = {};
    for (var i = 0; i < text.length; i++) {
        for (var accentedChar in toneMap) {
            if (text[i].toLowerCase() === accentedChar) {
                if (text[i].toLowerCase() === text[i]) {
                    accentsFound[i] = toneMap[accentedChar];
                } else {
                    accentsFound[i] = toneMap[accentedChar].toUpperCase();
                }
            }
        }
    }
    return accentsFound;
};
var removeAccents = function (accentedChars, text) {
    var output = '';
    for (var i = 0; i < text.length; i++) {
        if (i in accentedChars) {
            output += accentedChars[i][0];
        } else {
            output += text[i];
        }
    }
    return output;
};
var getKeys = function (obj) {
    var output = [];
    for (var key in obj) {
        output.push(key);
    }
    return output;
};
var findBetween = function (list, min, max) {
    var i = 0;
    while (i < list.length) {
        if (list[i] > max) break;
        if (list[i] >= min) {
            return list[i];
        }
        i++;
    }
    return -1;
};
var toLower = function (x) {
    if (x) return x.toLowerCase();
};
//I sort the regex options by length so the longer ones have precedence
var lenComp = function (a, b) {
    if (a.length === b.length) return 0;
    return (a.length < b.length) ? 1 : -1;
};
var individualRexp = new RegExp('^(' +
    getKeys(individuals).sort(lenComp).join('|') +
    ')(\\d)?', 'i');
var initialFinalRexp = new RegExp('^(' +
    getKeys(initials).sort(lenComp).join('|') + ')(' +
    getKeys(finals).sort(lenComp).join('|') +
    ')(\\d)?', 'i');

const toneNumberToSymbol = {
    0: "˙",
    1: "",
    2: "ˊ",
    3: "ˇ",
    4: "ˋ",
    5: "˙",
};

var pinyinToZhuyin = function (pinyinText) {
    if (!pinyinText) return pinyinText;
    var accentedChars = findAccentedChars(pinyinText);
    var sortedAccentedIndicies = getKeys(accentedChars).map(function (x) {
        return parseInt(x, 10);
    });
    var text = removeAccents(accentedChars, pinyinText);

    var parseToken = function (i) {
        var parse, detectedToneIdx;
        var token = {
            start: i
        };
        parse = text.slice(i).match(initialFinalRexp);
        if (parse) {
            parse = parse.map(toLower);
            token.zhuyin = initials[parse[1]] + finals[parse[2]];
            token.type = 'pinyin';
            if (typeof (parse[3]) !== 'undefined') {
                token.tone = parseInt(parse[3], 10);
            } else {
                detectedToneIdx = findBetween(sortedAccentedIndicies, i, i + parse[0].length);
                if (detectedToneIdx >= 0) {
                    token.tone = accentedChars[detectedToneIdx][1];
                } else {
                    token.tone = 5;
                }
            }
        } else {
            parse = text.slice(i).match(individualRexp);
            if (parse) {
                parse = parse.map(toLower);
                token.zhuyin = individuals[parse[1]];
                token.type = 'pinyin';
                if (typeof (parse[2]) !== 'undefined') {
                    token.tone = parseInt(parse[2], 10);
                } else {
                    detectedToneIdx = findBetween(sortedAccentedIndicies, i, i + parse[0].length);
                    if (detectedToneIdx >= 0) {
                        token.tone = accentedChars[detectedToneIdx][1];
                    } else {
                        token.tone = 5;
                    }
                }
            } else {
                token.type = 'other';
                parse = [text[i]];
            }
        }
        token.parse = parse;
        return token;
    };
    var tokens = [];
    var curToken;
    var i = 0;
    while (i < text.length) {
        curToken = parseToken(i);
        tokens.push(curToken);
        i += curToken.parse[0].length;
    }
    return tokens.map(function (token) {
        if (token.type === 'other') return token.parse.join('');
        return token.zhuyin + toneNumberToSymbol[token.tone];
    }).join('').replace(/ㄐㄨ/g, "ㄐㄩ").replace(/ㄑㄨ/g, "ㄑㄩ").replace(/ㄒㄨ/g, "ㄒㄩ") //ju qu xu are actually pronounced as ü
        .replace(/ㄓㄧ/g, "ㄓ").replace(/ㄔㄧ/g, "ㄔ").replace(/ㄕㄧ/g, "ㄕ").replace(/ㄖㄧ/g, "ㄖ") // zhi chi shi ri
        .replace(/ㄗㄧ/g, "ㄗ").replace(/ㄘㄧ/g, "ㄘ").replace(/ㄙㄧ/g, "ㄙ") // zi ci si
        .replace(/​'/g, "");  // pinyin syllable separator not necessary
};

const zhuyinInitials = new Set("ㄅㄆㄇㄈㄉㄊㄋㄌㄍㄎㄏㄐㄑㄒㄓㄔㄕㄖㄗㄘㄙ".split(""));
const zhuyinTones = /[ˉˊˇˋ˙]/;
function getParts(syllable) {
    let initial = "", mid = "", final = "", tone = 1;
    if (zhuyinInitials.has(syllable[0])) {
        initial = syllable[0];
        syllable = syllable.slice(1);
    }
    if (zhuyinTones.test(syllable)) {
        if (syllable.includes("ˊ")) tone = 2;
        else if (syllable.includes("ˇ")) tone = 3;
        else if (syllable.includes("ˋ")) tone = 4;
        else if (syllable.includes("˙")) tone = 5;
        syllable = syllable.replace(zhuyinTones, "");
    }
    final = syllable;
    if (final.length > 1) {
        mid = final[0];
        final = final[1];
    }
    return { initial, mid, final, tone };
}

let initGroups = {
    1: ["ㄅㄆ", "ㄇㄋ", "ㄋㄌ", "ㄌㄖ", "ㄉㄊ", "ㄍㄎ", "ㄎㄏ", "ㄐㄑㄒ", "ㄓㄔㄕㄖ", "ㄗㄘㄙ", "ㄐㄓㄗ", "ㄑㄔㄘ", "ㄒㄕㄙ"],
    2: ["ㄅㄆㄇㄈ", "ㄉㄊㄋㄌ", "ㄍㄎㄏ", "ㄅㄉㄍ", "ㄆㄊㄎ"]
}
let midGroups = ["ㄧㄩ", "ㄨㄩ"];
let finalGroups = {
    1: ["ㄢㄣ", "ㄤㄥ", "ㄢㄤ", "ㄣㄥ", "ㄧㄩ", "ㄨㄩ", "ㄛㄡㄨ", "ㄞㄟ", "ㄠㄡ"],
    2: ["ㄚㄞㄠㄢㄤ", "ㄜㄝㄟㄣㄥ", "ㄛㄜㄡㄨ"]
}

function getZhuyinDifference(syllableA, syllableB) {
    let a = getParts(syllableA);
    let b = getParts(syllableB);
    let initialDifference = 3, toneDifference = 1, midDifference = 2, finalDifference = 3;
    if (a.initial === b.initial) initialDifference = 0;
    if (a.mid === b.mid) midDifference = 0;
    if (a.final === b.final) finalDifference = 0;
    if (a.tone === b.tone) toneDifference = 0;
    else if (a.tone === 5 || b.tone === 5) toneDifference = 0.5;
    for (let difference in initGroups) {
        if (initialDifference < +difference) break;
        let groups = initGroups[difference];
        for (let group of groups) {
            if (group.includes(a.initial) && group.includes(b.initial)) {
                initialDifference = +difference;
                break;
            }
        }
    }
    for (let group of midGroups) {
        if (midDifference < 2) break;
        if (group.includes(a.mid) && group.includes(b.mid)) {
            midDifference = 1;
            break;
        }
    }
    for (let difference in finalGroups) {
        if (finalDifference < +difference) break;
        let groups = finalGroups[difference];
        for (let group of groups) {
            if (group.includes(a.final) && group.includes(b.final)) {
                finalDifference = +difference;
                break;
            }
        }
    }

    return initialDifference + toneDifference + midDifference + finalDifference;
}

function getDifference(pinyin1, pinyin2) {
    let zhuyin1 = pinyin1.map(pinyinToZhuyin);
    let zhuyin2 = pinyin2.map(pinyinToZhuyin);
    let minDifference = Infinity;
    for (let a of zhuyin1) {
        for (let b of zhuyin2) {
            let difference = getZhuyinDifference(a, b);
            if (difference < minDifference) minDifference = difference;
        }
    }
    return minDifference;
}

module.exports = { getDifference };