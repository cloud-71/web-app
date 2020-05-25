import React from 'react';
import { TagCloud } from 'react-tagcloud';

const data = [
  { value: 'jQuery', count: 25 },
  { value: 'MongoDB', count: 18 },
  { value: 'JavaScript', count: 38 },
  { value: 'React', count: 30 },
  { value: 'Nodejs', count: 28 },
  { value: 'Express.js', count: 25 },
  { value: 'HTML5', count: 33 },
  { value: 'CSS3', count: 20 },
  { value: 'Webpack', count: 22 },
  { value: 'Babel.js', count: 7 },
  { value: 'ECMAScript', count: 25 },
  { value: 'Jest', count: 15 },
  { value: 'Mocha', count: 17 },
  { value: 'React Native', count: 27 },
  { value: 'Angular.js', count: 30 },
  { value: 'TypeScript', count: 15 },
  { value: 'Flow', count: 30 },
  { value: 'NPM', count: 11 },
];

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
      test[i] = {
        value: counts[i].key,
        count: counts[i].value,
      };
    }
    return test.sort(this.compare).slice(0, this.props.topK);
  }

  render() {
    if (this.props.data != undefined) {
      console.log(this.props.data.length);
      console.log(this.prepareData(this.props.data));
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
