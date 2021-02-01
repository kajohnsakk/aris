import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Classnames from 'classnames';

const styles = theme => ({
    root: {
        color: '#BABABA'
    }
});


class AddFormInfo extends Component {

    render() {
        const { classes, children, handleClick } = this.props;

        return (
            <React.Fragment>
                <div onClick={(event) => {
                    event.preventDefault();
                    handleClick();
                }} className={Classnames("flex flex-1 font-light rounded border border-dashed justify-center cursor-pointer py-32", classes.root)}>
                    {children}
                </div>
            </React.Fragment>
        );
    }
}


export default (withStyles(styles, { withTheme: true })(withRouter(AddFormInfo)));