import React, {Component, PropTypes} from 'react';
import fetch from 'isomorphic-fetch';

import unified from 'unified';
import reactRenderer from 'remark-react';
import Code from './Code';

const processor = unified().use(reactRenderer, {sanitize: false, remarkReactComponents: {pre: Code}});

export default class Page extends Component {
  static fetchData(match) {
    return fetch(`http://localhost:3000/page?id=${match}`)
  }

  state = {
    data: null
  }

  componentDidMount() {
    if (!this.state.data) {
      const page = this.props.match.params.page;
      this.constructor.fetchData(`/${page}`).then(r => r.json()).then(data => this.setState({data}))
    }
  }

  componentWillReceiveProps = ({match}) => {
    const oldMatch = this.props.match;
    if (oldMatch.params.page !== match.params.page) {
      this.constructor.fetchData(`/${match.params.page}`).then(r => r.json()).then(data => {
        this.setState({data})
      })
    }
  }

  render() {
    if (!this.state.data) return null;

    const {content, title} = this.state.data;
    const _content = processor.runSync(JSON.parse(content));
    const markup = processor.stringify(_content);

    return (
      <div className="page-content">
        <h1 className="page-title">{title}</h1>
        <div className="page-markdown" children={markup} />
      </div>
    );
  }
}