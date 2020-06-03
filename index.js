const fs = require("fs");
const { longestCommonSubstring, indexOf, bestOffset } = require("./stringAlgorithms");

function isCharacterText(text) {
    // https://stackoverflow.com/questions/21109011/javascript-unicode-string-chinese-character-but-no-punctuation
    return /^([\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d])+$/.test(text);
}

function align(a, b, alignment, aOffset, bOffset, path) {
    if (!a.length) return;
    if (!b.length) return;
    alignment = alignment || new Array(a.length);
    aOffset = aOffset || 0;
    bOffset = bOffset || 0;
    path = path || "";

    let commonSubstring = longestCommonSubstring(a, b);
    let commonLength = commonSubstring.length;
    if (!commonLength) {
        if (a.length === b.length) {
            for (let i = 0; i < a.length; i++) {
                alignment[aOffset + i] = bOffset + i;
            }
            return;
        }
        if (b.length > a.length) {
            let offset = bestOffset(b, a);
            for (let i = 0; i < a.length; i++) {
                alignment[aOffset + i] = bOffset + offset + i;
            }
            return;
        }
        let offset = bestOffset(a, b);
        for (let i = 0; i < b.length; i++) {
            alignment[aOffset + offset + i] = bOffset + i;
        }
        return;
    }
    let aIndex = indexOf(a, commonSubstring);
    let bIndex = indexOf(b, commonSubstring);

    for (let i = 0; i < commonLength; i++) {
        alignment[aOffset + aIndex + i] = bOffset + bIndex + i;
    }

    let leftA = a.slice(0, aIndex);
    let leftB = b.slice(0, bIndex);

    let rightA = a.slice(aIndex + commonLength);
    let rightB = b.slice(bIndex + commonLength);

    align(leftA, leftB, alignment, aOffset, bOffset, path + "l");
    align(rightA, rightB, alignment, aOffset + aIndex + commonLength, bOffset + bIndex + commonLength, path + "r");

    return alignment;
}

function getIntervals(transcriptWords, recognitionOutput) {
    let transcriptChars = transcriptWords.join("").split("").filter(isCharacterText).join("");
    let recogntionItems = recognitionOutput.results.items
        .map(x => ({ start: x.start_time, end: x.end_time, word: x.alternatives[0].content }))
        .filter(x => x.start && x.end && isCharacterText(x.word));
    let recognitionChars = recogntionItems.map(x => x.word).join("").split("").filter(isCharacterText).join("");

    let alignment = align(transcriptChars, recognitionChars);
    let charTimes = [];
    for (let { start, end, word } of recogntionItems) {
        end = +end;
        start = +start;
        let interval = end - start;
        let chars = word.split("").filter(isCharacterText);
        for (let i = 0; i < chars.length; i++) {
            charTimes.push({
                char: chars[i],
                start: start + i * interval / chars.length,
                end: start + (i + 1) * interval / chars.length
            });
        }
    }
    let transcriptTimes = [];
    for (let i = 0; i < transcriptChars.length; i++) {
        let index = alignment[i];
        if (!index) {
            transcriptTimes.push({ char: transcriptChars[i], start: null, end: null });
            continue;
        }
        let { char, start, end } = charTimes[index];
        transcriptTimes.push({ char: transcriptChars[i], mappedChar: char, start, end });
    }

    let intervals = [];
    let i = 0;
    for (let text of transcriptWords) {
        let xmin, xmax;
        for (let char of text) {
            let transcriptTime = transcriptTimes[i++];;
            if (!transcriptTime) continue;
            let { start, end } = transcriptTime;
            if (!xmin) xmin = start;
            xmax = end || xmax;
        }
        intervals.push({ xmin, xmax, text });
    }
    return intervals;
}

module.exports = {
    getIntervals,
    align,
    isCharacterText
};