import React from 'react';
import { TagCloud } from 'react-tagcloud';

// custom renderer is function which has tag, computed font size and
// color as arguments, and returns react component which represents tag
const customRenderer = (tag, size, color) => (
  <span
    key={tag.value}
    style={{
      transform: `rotate(${Math.random() * 90}deg)`,
      fontSize: `${size / 2}em`,
      margin: `'7px'`,
      padding: '7px',
      display: 'inline-block',
      color: 'black',
    }}
  >
    {tag.value}
  </span>
);

// minSize, maxSize - font size in px
// tags - array of objects with properties value and count
// shuffle - indicates if data should be shuffled (true by default)
// onClick event handler has `tag` and `event` parameter
export default class WordCloud extends React.Component {
  constructor(props) {
    super(props);
  }

  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const valueA = a.count;
    const valueB = b.count;

    let comparison = 0;
    if (valueA > valueB) {
      comparison = 1;
    } else if (valueA < valueB) {
      comparison = -1;
    }
    return comparison;
  }

  prepareData(counts) {
    let test = new Array(counts.length);
    for (let i = 0; i < counts.length; i++) {
      if (stopwords.includes(counts[i].key)) {
        counts[i].value = 0;
      }
      test[i] = {
        value: counts[i].key,
        count: counts[i].value,
      };
    }
    let len = test.length;
    return test.sort(this.compare).slice(len - this.props.topK, len);
  }

  render() {
    if (this.props.data != undefined) {
      //console.log(this.props.data.length);
      //console.log(this.prepareData(this.props.data));
    } else {
      return <div></div>;
    }
    return (
      <TagCloud
        minSize={1}
        maxSize={5}
        renderer={customRenderer}
        tags={this.prepareData(this.props.data)}
        className="simple-cloud"
      />
    );
  }
}

const stopwords = [
  'i',
  'me',
  'my',
  'myself',
  'we',
  'our',
  'ours',
  'ourselves',
  'you',
  'your',
  'yours',
  'yourself',
  'yourselves',
  'he',
  'him',
  'his',
  'himself',
  'she',
  'her',
  'hers',
  'herself',
  'it',
  'its',
  'itself',
  'they',
  'them',
  'their',
  'theirs',
  'themselves',
  'what',
  'which',
  'who',
  'whom',
  'this',
  'that',
  'these',
  'those',
  'am',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'having',
  'do',
  'does',
  'did',
  'doing',
  'a',
  'an',
  'the',
  'and',
  'but',
  'if',
  'or',
  'because',
  'as',
  'until',
  'while',
  'of',
  'at',
  'by',
  'for',
  'with',
  'about',
  'against',
  'between',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'to',
  'from',
  'up',
  'down',
  'in',
  'out',
  'on',
  'off',
  'over',
  'under',
  'again',
  'further',
  'then',
  'once',
  'here',
  'there',
  'when',
  'where',
  'why',
  'how',
  'all',
  'any',
  'both',
  'each',
  'few',
  'more',
  'most',
  'other',
  'some',
  'such',
  'no',
  'nor',
  'not',
  'only',
  'own',
  'same',
  'so',
  'than',
  'too',
  'very',
  's',
  't',
  'can',
  'will',
  'just',
  'don',
  'should',
  'now',
  'rt',
  'co',
  'p',
  'get',
  'https',
];
