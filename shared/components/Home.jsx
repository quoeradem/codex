import React, {Component} from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SvgIcon from 'material-ui/SvgIcon';

const IconCube = (props) => (
  <SvgIcon {...props}>
    <path d="M1317 4333c-556-296-912-491-934-512-19-18-44-52-54-75-18-39-19-85-19-1021 0-1078-4-1007 60-1040 16-8 52-15 79-15 47 0 113 33 952 468 596 309 913 479 936 501 20 19 44 53 54 75 18 39 19 89 19 1033l0 993-29 32c-26 30-34 32-97 35l-69 3-898-477zM2744 4776l-34-34 0-993c0-946 1-996 19-1035 10-22 34-56 54-75 23-22 339-192 936-501 840-436 905-468 952-468 27 0 63 7 79 15 64 33 60-38 60 1040 0 933-1 982-19 1021-10 22-34 56-54 75-22 22-358 205-935 512l-900 477-62 0c-57 0-65-3-96-34zM2440 2394c-19-8-451-234-959-502-580-305-937-499-957-519-57-56-55-141 5-181 31-22 1819-826 1909-859 75-28 158-30 228-6 27 9 468 205 979 434 722 325 936 425 958 449 20 23 27 41 27 71 0 66-28 99-132 156-156 86-1708 904-1783 940-62 30-78 33-155 33-53-1-98-6-120-16z" />
  </SvgIcon>
);

const styles = {
  svgIcon: {
    color: '#fff',
    width: 120,
    height: 120
  }
}

export default class Home extends Component {
  render() {
    return (
      <div>
        <header>
          <IconCube style={styles.svgIcon} viewBox="0 0 5120 5120" />
          <h1 className="header-title">Codex</h1>
          <h2 className="header-subtitle">A modern framework for documentation</h2>
        </header>
        <div className="home-content">
          <p>The codex is content-driven React app designed to beautifully present a collection of markdown documents.</p>
          <p>Intended as a framework for app documentation, code references, or notes -- markdown syntax allows for inherent formatting of the content, while Material Design provides an elegant and uniform presentation.</p>
        </div>
        <div className="home-github">
          <h3>View project on GitHub</h3>
          <RaisedButton secondary={true} href="https://github.com/quoeradem/codex" target="_blank" label="GitHub" />
        </div>
        <footer>
          <p>Codex &copy; 2017</p>
          <p>Coded with <span style={{color: '#e51d66'}}>&#4326;</span> by Trevor Kulhanek</p>
        </footer>
      </div>
    );
  }
}