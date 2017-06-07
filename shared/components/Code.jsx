import React, {Component} from 'react';

export default class Code extends Component {
  state = {
    clicked: false
  }

  styles = {
    pre: {
      position: 'relative',
    }
  }

  handleClick = (e) => {
    const sel = window.getSelection();
    const selLen = sel.toString().length;

    if (!selLen) {
      const range = document.createRange();
      range.selectNodeContents(e.target);
      sel.removeAllRanges();
      sel.addRange(range);
      document.execCommand('copy');
      sel.removeAllRanges();
      this.setState({clicked: true});
    }
  }

  handleMouseLeave = () => {
    this.setState({clicked: false});
  }

  render() {
    const {children, className} = this.props;

    // return 'pre' if element does not contain 'code' child
    if (typeof children[0] === 'string') {
      return (<pre className={className}>{children}</pre>);
    }

    return (
      <pre
        style={this.styles.pre}
        className={this.state.clicked ? `${className} clicked` : className}
        onClick={this.handleClick}
        onMouseLeave={this.handleMouseLeave}
      >
        {children}
      </pre>
    );
  }
}