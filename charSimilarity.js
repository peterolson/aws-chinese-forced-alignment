const fs = require("fs");
const syllabToPhonemes = require("./syllabToPhonemes");

let syllabDict = {};
for (let [syllab, phonemes] of syllabToPhonemes) {
    syllabDict[syllab] = phonemes.split(" ");
}

let initials = new Set(["b", "c", "ch", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "sh", "t", "x", "z", "zh"]);
let finals = new Set(["n", "ng"]);

const defaultSeparation = { tone: 5, initial: "", vowel: "", final: "" };


function separatePhonemes(pinyin) {
    if (!pinyin) return defaultSeparation;
    let tone = pinyin.slice(-1);
    let remainder = pinyin.replace(/[0-9]/, "").replace("u:", "v");
    let phonemes = syllabDict[remainder];
    if (!phonemes) return defaultSeparation;
    let initial = "";
    if (initials.has(phonemes[0])) {
        initial = phonemes[0];
        phonemes = phonemes.slice(1);
    }
    let final = "";
    if (finals.has(phonemes[phonemes.length - 1])) {
        final = phonemes[phonemes.length - 1];
        phonemes = phonemes.slice(0, -1);
    }
    let vowel = phonemes[0] || "";

    return { tone, initial, vowel, final };
}

const initialChart = `		b	c	ch	d	f	g	h	j	k	l	m	n	p	q	r	s	sh	t	x	z	zh
	3	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0	0
b		3			2	2	1				1	2		2								
c			3	2											1		2	1	2		2	1
ch				3	1				1						2	1		2			2	2
d					3		1		1		2		2			1			2		2	1
f						3		2				1		2								
g							3	1	1	2												
h								3		2												
j									3						2			1		2	1	2
k										3				1					1			
l											3		2			2	1		1			
m												3	2									
n													3			1			1			
p														3					1			
q															3			1	2	2	1	
r																3	1	2			1	2
s																	3	1	1	1	2	1
sh																		3		1	1	2
t																			3		1	
x																				3		
z																					3	2
zh																						3`;

const vowelChart = `		a	i	iou	u	x	e	ii	ua	ie	ou	uo	io	o	v	ia	uei	ve	ao	ue	ai	iao	ei	va	uai
	3																								
a		3							2							2			2		2	1		1	1
i			3					1		1			1		2	1	1				1		2		1
iou				3	1						2	2	2	2					1			1			
u					3				2		2	2	1		2		1	1	1	1				1	1
x						3																			
e							3	2		2							1	2		2			2		
ii								3																	
ua									3			2				2	1	1	2	1				2	2
ie										3						2	2	2		2			1		
ou											3	2	1	2					2			2			
uo												3		2					1	1		1			
io													3	2					1			2			
o														3					2			1			
v															3			2		1				2	
ia																3					1	2			
uei																	3	1		2			2		1
ve																		3		2				2	
ao																			3		1	2			
ue																				3				1	
ai																					3		1		
iao																						3			1
ei																							3		
va																								3	1
uai																									3`;

const finalChart = `		n	ng
	3	0	0
n		3	2
ng			3`;

function createComparison(chart) {
    let lines = chart.split("\n").map(x => x.split("\t").slice(1));
    let columns = lines[0];
    let comparisons = {};
    lines = lines.slice(1);
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let x = columns[i];
        comparisons[x] = comparisons[x] || {};
        for (let j = 0; j < line.length; j++) {
            let y = columns[j];
            comparisons[y] = comparisons[y] || {};
            let amount = lines[i][j];
            comparisons[x][y] = Math.max(+comparisons[x][y] || 0, +amount);
            comparisons[y][x] = Math.max(+comparisons[y][x] || 0, +amount);
        }
    }
    return (a, b) => comparisons[a][b] || 0;
}

let compareInitial = createComparison(initialChart);
let compareVowel = createComparison(vowelChart);
let compareFinal = createComparison(finalChart);

function comparePinyin(a, b) {
    a = separatePhonemes(a);
    b = separatePhonemes(b);
    let score = 0;
    score += compareInitial(a.initial, b.initial);
    score += compareVowel(a.vowel, b.vowel);
    score += compareFinal(a.final, b.final);
    if (a.tone === b.tone) score++;
    return score / 10;
}

let { getEntries } = require("chinese-lexicon");
function compareChar(a, b) {
    let aEntries = getEntries(a);
    let bEntries = getEntries(b);
    let maxSimilarity = 0;
    for (let aEntry of aEntries) {
        for (let bEntry of bEntries) {
            maxSimilarity = Math.max(maxSimilarity, comparePinyin(aEntry.pinyinTones, bEntry.pinyinTones));
        }
    }
    return maxSimilarity;
}

module.exports = { compareChar };