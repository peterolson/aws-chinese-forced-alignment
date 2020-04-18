# Chinese forced alignment

Tool for aligning Chinese transcripts with audio using the [AWS transcribe service](https://aws.amazon.com/transcribe/).

This project was built for and is used by [Dong Chinese](https://www.dong-chinese.com/).

It can be installed using npm:

    npm install aws-chinese-forced-alignment

## Usage

```
const { getIntervals } = require("aws-chinese-forced-alignment");
getIntervals(ARRAY_OF_WORDS, TRANSCRIBE_JSON_OUTPUT);
```

### Example

```
getIntervals(["你好", "懂", "中文", "很", "酷"], {
    results: {
        items: [{
            "start_time": "1.09",
            "end_time": "1.42",
            "alternatives": [{
                "content": "你好"
            }]
        },
        {
            "start_time": "1.42",
            "end_time": "1.57",
            "alternatives": [{
                "content": "东"
            }]
        },
        {
            "start_time": "1.57",
            "end_time": "1.66",
            "alternatives": [{
                "content": "中文"
            }]
        },
        {
            "start_time": "1.66",
            "end_time": "1.74",
            "alternatives": [{
                "content": "辛苦"
            }]
        }]
    }
});
/// output
[ { xmin: 1.255, xmax: 1.42, text: '你好' },
  { xmin: 1.42, xmax: 1.57, text: '懂' },
  { xmin: 1.57, xmax: 1.66, text: '中文' },
  { xmin: 1.66, xmax: 1.7, text: '很' },
  { xmin: 1.7, xmax: 1.74, text: '酷' } ]
```