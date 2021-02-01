import React, { Component } from 'react';
import {
    Hidden,
    Icon,
    IconButton,
    Typography,
    // withStyles
} from '@material-ui/core';
import { FuseAnimate } from '@fuse';
import { connect } from 'react-redux';
// import * as Actions from './store/actions';

class StoreManagementHeader extends Component {

    render() {
        const { pageLayout } = this.props;

        return (
            <div className="flex flex-1 items-center justify-between p-8 sm:p-24">

                <div className="flex flex-shrink items-center sm:w-250">
                    <Hidden lgUp>
                        <IconButton
                            onClick={(ev) => pageLayout().toggleLeftSidebar()}
                            aria-label="open left sidebar"
                        >
                            <Icon>menu</Icon>
                        </IconButton>
                    </Hidden>

                    <div className="flex items-center">
                        <div className="flex flex-col min-w-0">
                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                <Typography className="text-16 sm:text-20 truncate">
                                    Store Management
                                </Typography>
                            </FuseAnimate>
                            <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                                <Typography variant="caption">Chatbot</Typography>
                            </FuseAnimate>
                        </div>
                    </div>
                </div>

                {/* <div className="flex flex-1 items-center justify-center pr-8 sm:px-12">

                    <MuiThemeProvider theme={mainTheme}>
                        <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                            <Paper className="flex p-4 items-center w-full max-w-512 px-8 py-4" elevation={1}>

                                <Icon className="mr-8" color="action">search</Icon>

                                <Input
                                    placeholder="Search for anything"
                                    className="flex flex-1"
                                    disableUnderline
                                    fullWidth
                                    value={searchText}
                                    inputProps={{
                                        'aria-label': 'Search'
                                    }}
                                    onChange={setSearchText}
                                />
                            </Paper>
                        </FuseAnimate>
                    </MuiThemeProvider>
                </div> */}
            </div>
        )
            ;
    }
}

function mapDispatchToProps(dispatch) {
    // return bindActionCreators({
    //     setSearchText: Actions.setSearchText
    // }, dispatch);
}

function mapStateToProps({ contactsApp, fuse }) {
    // return {
    //     searchText: contactsApp.contacts.searchText,
    //     mainTheme: fuse.settings.mainTheme
    // }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreManagementHeader);