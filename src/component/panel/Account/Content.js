import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Profile from './Profile';
import Pages from './Pages';
import Support from './Support';
import Storage from './Storage';

import style from '../../../css/account-content.module.scss';
import menuStyle from '../../../css/menu.module.scss';

import Icon from '@material-ui/core/Icon';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { TokenContext } from '../../../contexts/token';

function MenuItem(props) {
  return (
    <ListItem button selected={props.selected} onClick={props.onClick} >
      {props.icon != null ? <ListItemIcon><Icon>{props.icon}</Icon></ListItemIcon> : ''}
      <ListItemText primary={props.caption} />
    </ListItem>
  );
}

function Menu(props) {
  const selectedIndex = typeof props.selectedIndex === 'number' ? props.selectedIndex : -1;

  const data = Array.isArray(props.data) ? props.data : [];

  const menuOnClickHandler = typeof props.onClick === 'function' ? props.onClick : () => { };
  const onClickHandler = index => {
    return (e) => {
      e.preventDefault();

      menuOnClickHandler({
        index,
        url: data[index].url,
      });
    }
  }

  return (
    <div className={menuStyle.container + ' wrapper'}>
      <List component="nav">
        {
          data.map((item, index) => (
            <MenuItem
              key={"menu_item" + index}
              onClick={onClickHandler(index)}
              icon={item.icon}
              caption={item.caption}
              selected={selectedIndex === index}
            />
          ))
        }

      </List>
    </div>
  );
}

class Content extends Component {

  menus = [
    { caption: 'Profil', icon: 'account_circle', url: '/profile' },
    { caption: 'Penyimpanan', icon: 'cloud_upload', url: '/storage' },
    { caption: 'Halaman', icon: 'library_books', url: '/pages' },
    { caption: 'Dukungan', icon: 'face_agent', url: '/support' },
    { caption: 'Logout', icon: 'logout', url: '/logout'}
  ];

  static contextType = TokenContext;
  constructor(props) {
    super(props);

    this.elementRef = React.createRef();
    this.menuRef = React.createRef();
  }

  componentDidMount() {
    // if (!this.props.alwaysActive)
    document.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = e => {
    let scrollY = window.scrollY;
    let firstPosition = this.elementRef.current.offsetTop - 50 || 360;
    if (!this.menuRef || !this.menuRef.current)
      return;

    // if (this.props.firstPosition)
    //   firstPosition = this.props.firstPosition;
    
    if (scrollY > firstPosition) {
      this.menuRef.current.classList.add(style['menu-fly']);
    } else {
      this.menuRef.current.classList.remove(style['menu-fly']);
    }

  }

  getSelectedMenuIndex = () => {
    const { match, location } = this.props;

    return this.menus.findIndex(v => {
      return location.pathname.search(`${match.path}${v.url}`) >= 0;
    });
  }

  onClickHandler = ({ index, url }) => {
    const { match, history } = this.props;

    if (index === 4) {
      // logout
      this.context.setToken('');
      return;
    }

    let loc = '';
    if (match) {
      loc = match.path + url

      if (history) {
        history.push(loc);
      }
    }
  }

  render() {

    return (
      <div ref={this.elementRef} className={style.container + ' wrapper'}>
        <div ref={this.menuRef} className={style.menu} id='mymenu'>
          <Menu
            data={this.menus}
            selectedIndex={this.getSelectedMenuIndex()}
            onClick={this.onClickHandler}
          />
        </div>

        <div className={style.content}>
          <Switch >
            <Redirect from="/account" exact to="/account/profile" />
            <Route path="/account/pages" component={Pages} />
            <Route path="/account/profile" component={Profile} />
            <Route path="/account/storage" component={Storage} />
            <Route path="/account/support" component={Support} />
          </Switch>
        </div>
      </div>
    );
  }
}


export default Content;