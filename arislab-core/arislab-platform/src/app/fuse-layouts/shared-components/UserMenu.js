import React, {Component} from 'react';
import {Avatar, Button, Icon, ListItemIcon, ListItemText, Popover, MenuItem, Typography} from '@material-ui/core';
import {connect} from 'react-redux';
import * as authActions from 'app/auth/store/actions';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';

import { withTranslation, Trans } from 'react-i18next';

class UserMenu extends Component {

    state = {
        userMenu: null
        // user: "admin"
    };

    userMenuClick = event => {
        this.setState({userMenu: event.currentTarget});
    };

    userMenuClose = () => {
        this.setState({userMenu: null});
    };

    redirectLogout = (event) => {
        event.preventDefault();
        window.location.href = "/logout";
    }

    render()
    {
        const {user, logout} = this.props;
        // const logout = this.props;
        // const user = this.state.user;
        console.log("USERMENU! data role", user)
        const {userMenu} = this.state;

        return (
            <React.Fragment>

                <Button className="h-64" onClick={this.userMenuClick}>
                    {user.data.photoURL ?
                        (
                            <Avatar className="" alt="user photo" src={user.data.photoURL}/>
                        )
                        :
                        (
                            <Avatar className="">
                                {user.data.displayName[0]}
                            </Avatar>
                        )
                    }

                    <div className="hidden md:flex flex-col ml-12 items-start">
                        <Typography component="span" className="normal-case font-600 flex">
                            {user.data.displayName}
                        </Typography>
                        <Typography className="text-11 capitalize" color="textSecondary">
                            {user.role}
                        </Typography>
                    </div>

                    <Icon className="text-16 ml-12 hidden sm:flex" variant="action">keyboard_arrow_down</Icon>
                </Button>

                <Popover
                    open={Boolean(userMenu)}
                    anchorEl={userMenu}
                    onClose={this.userMenuClose}
                    anchorOrigin={{
                        vertical  : 'bottom',
                        horizontal: 'center'
                    }}
                    transformOrigin={{
                        vertical  : 'top',
                        horizontal: 'center'
                    }}
                    classes={{
                        paper: "py-8"
                    }}
                >
                    {user.role !== 'admin' ? (
                        <React.Fragment>
                            <MenuItem component={Link} to="/logout" onClick={this.redirectLogout}>
                                <ListItemIcon>
                                    <Icon>exit_to_app</Icon>
                                </ListItemIcon>
                                <ListItemText
                                    className="pl-0"
                                    primary={
                                        <Trans i18nKey="userMenu.logout">
                                            Logout
                                        </Trans>
                                    }
                                />
                            </MenuItem>
                            <MenuItem component={Link} to="/login">
                                <ListItemIcon>
                                    <Icon>lock</Icon>
                                </ListItemIcon>
                                <ListItemText
                                    className="pl-0"
                                    primary={
                                        <Trans i18nKey="userMenu.login">
                                            Login
                                        </Trans>
                                    }
                                />
                            </MenuItem>
                            <MenuItem component={Link} to="/register">
                                <ListItemIcon>
                                    <Icon>person_add</Icon>
                                </ListItemIcon>
                                <ListItemText
                                    className="pl-0"
                                    primary={
                                        <Trans i18nKey="userMenu.register">
                                            Register
                                        </Trans>
                                    }
                                />
                            </MenuItem>
                        </React.Fragment>
                    ) : 
                    (
                        <React.Fragment>
                            
                            {/* <MenuItem component={Link} to="/pages/profile" onClick={this.userMenuClose}>
                                <ListItemIcon>
                                    <Icon>account_circle</Icon>
                                </ListItemIcon>
                                <ListItemText className="pl-0" primary="My Profile"/>
                            </MenuItem> */}

                                <MenuItem component={Link} to="/platform/setting/storeManagement" onClick={this.userMenuClose}>
                                    <ListItemIcon>
                                        <Icon>store</Icon>
                                    </ListItemIcon>
                                    <ListItemText
                                        className="pl-0"
                                        // primary="Manage store"
                                        primary={
                                            <Trans i18nKey="userMenu.storeManagement">
                                                Manage store
                                            </Trans>
                                        }
                                    />
                                </MenuItem>

                                <MenuItem component={Link} to="/platform/setting/salesChannels" onClick={this.userMenuClose}>
                                    <ListItemIcon>
                                        <Icon>shop</Icon>
                                    </ListItemIcon>
                                    <ListItemText
                                        className="pl-0"
                                        // primary="Sales Channel"
                                        primary={
                                            <Trans i18nKey="userMenu.salesChannel">
                                                Sales Channel
                                            </Trans>
                                        }
                                    />
                                </MenuItem>

                                {/* <MenuItem component={Link} to="/apps/mail" onClick={this.userMenuClose}>
                                    <ListItemIcon>
                                        <Icon>mail</Icon>
                                    </ListItemIcon>
                                    <ListItemText className="pl-0" primary="Policies" />
                                </MenuItem>

                                <MenuItem component={Link} to="/apps/mail" onClick={this.userMenuClose}>
                                    <ListItemIcon>
                                        <Icon>mail</Icon>
                                    </ListItemIcon>
                                    <ListItemText className="pl-0" primary="Payments" />
                                </MenuItem> */}
                           
                            {/* <MenuItem component={Link} to="/apps/mail" onClick={this.userMenuClose}>
                                <ListItemIcon>
                                    <Icon>mail</Icon>
                                </ListItemIcon>
                                <ListItemText className="pl-0" primary="Inbox"/>
                            </MenuItem> */}
                           
                            <MenuItem
                                onClick={() => {
                                    logout();
                                    this.userMenuClose();
                                }}
                            >
                                <ListItemIcon>
                                    <Icon>exit_to_app</Icon>
                                </ListItemIcon>
                                <ListItemText
                                    className="pl-0"
                                    primary={
                                        <Trans i18nKey="userMenu.logout">
                                            Logout
                                        </Trans>
                                    }
                                />
                            </MenuItem>

                        </React.Fragment>
                    )}
                </Popover>
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(UserMenu));
