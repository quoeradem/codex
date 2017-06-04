import React, {Component, PropTypes} from 'react';
import fetch from 'isomorphic-fetch';

const remark = require('remark');
const reactRenderer = require('remark-react');
const toc = require('../utils/mdtoc');
const mdsections = require('../utils/mdsections');
const mdpre = require('../utils/mdpre');

const md = remark()
  .use(toc, {maxDepth: 2, tight: true, className: "page-toc"})
  .use(mdpre)
  .use(mdsections)
  .use(reactRenderer, {sanitize: false});

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
    const markup = md.processSync(content).contents;

    return (
      <div className="page-content">
        <h1 className="page-title">{title}</h1>
        <div className="page-markdown" children={markup} />
      </div>
    );
  }
}