import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FusePageSimple } from '@fuse';

const styles = theme => ({
    layoutRoot: {}
});

class Live extends Component {

    render() {
        const { classes } = this.props;
        return (
            <FusePageSimple
                classes={{
                    root: classes.layoutRoot
                }}
                content={
                    <div className="p-24">
                        <h4>Live</h4>
                        <br />
                    </div>
                }
            />
        )
    }
}

export default withStyles(styles, { withTheme: true })(Live);