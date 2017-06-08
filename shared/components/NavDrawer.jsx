import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import SvgIcon from 'material-ui/SvgIcon';

const SelectableList = makeSelectable(List);

const AppIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14zM6 13h5v4H6zm6-6h4v3h-4zM6 7h5v5H6zm6 4h4v6h-4z"/>
  </SvgIcon>
);

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
  },
  appBarTitle: {
    fontSize: 18,
    textDecoration: 'none',
    color: '#000',
    cursor: 'pointer'
  },
  appIcon: {
    height: 30,
    width: 30,
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
        containerStyle={style}
        docked={docked}
        open={open}
        onRequestChange={onRequestChange}
        className={className}
        zDepth={1}
      >
        <div className="nav-container">
          <div className="nav-header">
            <Link style={styles.appBarTitle} to="/">
              <AppIcon viewBox="0 0 24 24" style={styles.appIcon} />
              <span>Codex</span>
            </Link>
          </div>
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