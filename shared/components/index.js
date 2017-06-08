import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';

import NavDrawer from './NavDrawer';

const muiTheme = getMuiTheme({
  userAgent: global.navigator.userAgent,
  appBar: {
    color: '#01579B',
  },
  drawer: {
    color: '#fff',
  },
  button: {
    height: 32
  }
})

const styles = {
  appBar: {
    position: 'fixed',
    top: 0
  },
  appBarTitle: {
    fontSize: 18,
    textDecoration: 'none',
    color: '#fff',
    cursor: 'pointer'
  }
}

export default class App extends Component {
  state = {
    navDrawerOpen: false,
    navDocked: false,
  }

  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  static childContextTypes = {
    muiTheme: PropTypes.object
  }

  getChildContext = () => {return {muiTheme}}

  componentWillMount = () => {
    if (process.browser) {
      const mql = window.matchMedia(`(min-width: 1480px)`);
      mql.addListener(() => this.setState({navDocked: this.state.mql.matches}))
      this.setState({mql: mql, navDocked: mql.matches});
    }
  }

  componentWillUnmount = () => {
    if (this.state.mql) {
      this.state.mql.removeListener(this.mediaQueryChanged);
    };
  }

  render() {
    const {
      children,
      pages
    } = this.props;

    const location = this.context.router.route.location.pathname;

    return (
      <div>
        <AppBar
          title={<Link style={styles.appBarTitle} to="/">Codex</Link>}
          style={styles.appBar}
          onLeftIconButtonTouchTap={() => this.setState({navDrawerOpen: !this.state.navDrawerOpen})}
          showMenuIconButton={!this.state.navDocked}
          zDepth={0}
        />
        <NavDrawer
          pages={pages ? pages : 'null'}
          docked={this.state.navDocked}
          location={location}
          open={this.state.navDocked ? true : this.state.navDrawerOpen}
          onRequestChange={open => this.setState({navDrawerOpen: open})}
          onChangeList={() => this.setState({navDrawerOpen: false})}
        />
        <div className='layout-content'>
          {children}
        </div>
      </div>
    );
  }
}