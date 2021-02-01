import React, {Component} from 'react';
import {Button, MenuItem, Menu} from '@material-ui/core';
import {connect} from 'react-redux';
import * as authActions from 'app/auth/store/actions';
import {bindActionCreators} from 'redux';

import i18n from '../../i18n';

class LanguageMenu extends Component {

    state = {
        anchorEl: null,
        changed: false
    };
    
    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget,
        changed: true });
    };
    
    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleChangeLanguage = (newLanguage) => {
        i18n.changeLanguage(newLanguage)
            .then(() => {
                localStorage.setItem('i18nextLng', newLanguage);

                this.setState({ anchorEl: null, changed: true});
                this.forceUpdate();
                // window.location.reload(); 
            });
    }

    checkLanguage = (language) => {
        for (let i = 0; i < i18n.languages.length; i++){
            if (language === i18n.languages[i]){
                this.handleChangeLanguage(language)
            }
        }
    }

    render()
    {
        const { anchorEl } = this.state;

        return (
            <React.Fragment>
                <Button
                    aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    { i18n.languages[0] }
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    {/* <MenuItem selected={ i18n.languages[0] === 'en' } onClick={() => this.handleChangeLanguage('en')}>EN</MenuItem>
                    <MenuItem selected={ i18n.languages[0] === 'th' } onClick={() => this.handleChangeLanguage('th')}>TH</MenuItem> */}
                    <MenuItem onClick = {() => this.checkLanguage('th')}> TH </MenuItem>
                    <MenuItem onClick = {() => this.checkLanguage('en')}> EN </MenuItem>

                </Menu>
            </React.Fragment>
        );
    }
}

function mapDispatchToProps(dispatch)
{
    return bindActionCreators({
        logout: authActions.logoutUser
    }, dispatch);
}

function mapStateToProps({auth})
{
    return {
        user: auth.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguageMenu);
