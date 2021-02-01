import React, { Component } from "react";
// import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { withStyles } from "@material-ui/core/styles";

import i18n from "../components/i18n";
// import LanguageIcon from "@material-ui/icons/Language";
import th from "../assets/thailand.png";
import en from "../assets/england.png";

const styles = theme => ({
    button: {
        padding: "0.2em 0.2em",
        marginLeft: "0.8em",
        minWidth: "min-content"
    }
});

class LanguageMenu extends Component {
    state = {
        open: false,
        changed: false
    };

    handleClick = event => {
        this.setState({
            anchorEl: event.currentTarget,
            changed: true
        });
    };

    handleToggle = () => {
        this.setState(state => ({ open: !state.open }));
    };

    handleClose = event => {
        if (this.anchorEl.contains(event.target)) {
            return;
        }

        this.setState({ open: false });
    };

    handleChangeLanguage = newLanguage => {
        i18n.changeLanguage(newLanguage).then(() => {
            localStorage.setItem("i18nextLng", newLanguage);

            this.setState({ anchorEl: null, changed: true, currentLanguage: newLanguage.toUpperCase() });
            this.forceUpdate();
            // window.location.reload();
        });
    };

    checkLanguage = language => {
        for (let i = 0; i < i18n.languages.length; i++) {
            if (language === i18n.languages[i]) {
                this.handleChangeLanguage(language);
            }
        }
        this.setState({ dropMenu: !this.state.dropMenu });
    };

    componentDidMount() {
        this.checkCurrentLanguage();
    }

    checkCurrentLanguage = () => {
        let currentLanguage = localStorage.getItem("i18nextLng");
        this.setState({
            currentLanguage: currentLanguage.toUpperCase()
        });
    };

    toggleMenu = () => {
        this.setState({ dropMenu: !this.state.dropMenu });
    };

    render() {
        const { currentLanguage, open } = this.state;
        const { classes } = this.props;
        return (
            <div>
                <Button
                    className={classes.button}
                    buttonRef={node => {
                        this.anchorEl = node;
                    }}
                    aria-owns={open ? "menu-list-grow" : undefined}
                    aria-haspopup="true"
                    onClick={this.handleToggle}
                >
                    <img alt="" className="language-img" src={currentLanguage === "EN" ? en : th} />
                </Button>
                <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="menu-list-grow"
                            style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <MenuList>
                                        <MenuItem
                                            onClick={e => {
                                                this.handleClose(e);
                                                this.checkLanguage("th");
                                            }}
                                        >
                                            <img alt="" src={th} className="language-img" />
                                        </MenuItem>
                                        <MenuItem
                                            onClick={e => {
                                                this.handleClose(e);
                                                this.checkLanguage("en");
                                            }}
                                        >
                                            <img alt="" src={en} className="language-img" />
                                        </MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
            // <React.Fragment>
            //     <Button
            //         aria-owns={anchorEl ? "language-menu" : undefined}
            //         aria-haspopup="true"
            //         onClick={this.handleClick}
            //         className="p-0 text-white text-xs"
            //     >
            //         <img alt="" src={currentLanguage === "EN" ? en : th} />
            //     </Button>
            //     <Menu id="language-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
            //         <MenuItem onClick={() => this.checkLanguage("th")}>
            //             <img alt="" src={th} />
            //         </MenuItem>
            //         <MenuItem onClick={() => this.checkLanguage("en")}>
            //             <img alt="" src={en} />
            //         </MenuItem>
            //     </Menu>
            // </React.Fragment>
        );
    }
}

export default withStyles(styles)(LanguageMenu);
