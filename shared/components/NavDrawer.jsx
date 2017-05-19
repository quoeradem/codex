import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, makeSelectable} from 'material-ui/List';

const SelectableList = makeSelectable(List);

const styles = {
  listItem: {
    fontSize: '13px',
    lineHeight: '13px',
    fontWeight: 'bold',
    color: '#212121',
  },
  container: {
    paddingTop: '15px',
    paddingRight: '0px',
    paddingBottom: '15px',
    paddingLeft: '22px',
  },
  heart: {
    fontSize: '14px',
    color: '#e51d66'
  }
};

export default class NavDrawer extends Component {
  static propTypes = {
    className: PropTypes.string,
    docked: PropTypes.bool.isRequired,
    location: PropTypes.string.isRequired,
    onChangeList: PropTypes.func.isRequired,
    onRequestChange: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    style: PropTypes.object
  }

  state = {}

  componentDidMount = () => {
    const _pages = this.props.pages;
    const pages = _pages.map((obj, i) => (
      <ListItem
        value={obj.permalink}
        primaryText={obj.title}
        key={i}
        containerElement={<Link to={obj.permalink} />}
        innerDivStyle={styles.container}
        style={styles.listItem}
      />
    ))
    this.setState({pages});
  }

  render() {
    const {
      className,
      docked,
      location,
      onChangeList,
      onRequestChange,
      open,
      style
    } = this.props;

    const {pages} = this.state;
    if (!pages) return null;

    return (
      <Drawer
        width={240}
        containerStyle={style}
        docked={docked}
        open={open}
        onRequestChange={onRequestChange}
        className={className}
        zDepth={1}
      >
        <div className="nav-container">
          <nav>
            <SelectableList children={pages} value={location} onChange={onChangeList} />
          </nav>
          <div className="nav-footer">
            <p>Codex &copy; 2017</p>
            <p>Coded with <span style={styles.heart}>&#4326;</span> by Trevor Kulhanek</p>
          </div>
        </div>
      </Drawer>
    );
  }
}