import React, { Component } from 'react';

import withReducer from 'app/store/withReducer';
import reducer from './store/reducers';
import * as Actions from './store/actions';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import _ from '@lodash';
import {
    Typography,
    Grid,
    Divider
} from '@material-ui/core';

const styles = theme => ({
    layoutRoot: {},
    boldDivider: {
        height: '3px',
        marginBottom: '2%',
        marginTop: '2%',
        background: '#C54885'
    },
    normalDivider: {
        height: '2px',
        marginBottom: '3%',
        marginTop: '3%'
    },
    productImage: {
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        border: '2px solid #FFFFFF'
    }
});

class LiveProductInfo extends Component {

    state = {
        data: this.props.productInfo
    }
    eventSource = undefined;

    componentDidMount() {
        const { storeID, productID } = this.props;

        this.eventSource = new EventSource(this.props.getProductInfo({
            storeID: storeID,
            productID: productID
        }));
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.props.productInfo, prevProps.productInfo)) {
            const data = this.props.productInfo;
            this.setState({ data })
        }
    }

    componentWillUnmount() {
        if(this.eventSource)
            this.eventSource.close();
    }

    render() {
        const { classes } = this.props;
        const { data } = this.state;

        let productObj = {};
        let colorIndex;

        if (data !== null && data.hasOwnProperty('productInfo')) {
            productObj = data['productInfo'];
        }

        return (
            <div>
                {!_.isEmpty(productObj) ?
                    <div>
                        <Typography variant="h6" gutterBottom>
                            {productObj['productBrandName'] + " - " + productObj['productName']}
                        </Typography>
                        
                        <div className="p-12 sm:p-10">
                            <div className="flex-1 text-center">
                                <img src={ productObj['productImage'] ? productObj['productImage'] : "https://via.placeholder.com/150"} className={classes.productImage} alt={productObj['productName']} />
                            </div>
                        </div>

                        <Typography variant="button" gutterBottom>
                            Available (N)
                        </Typography>

                        <Divider className={classes.boldDivider} />

                        {productObj['productVariations'].map((variationItem, variationIndex) => {
                            let productVariationsLength = Number(productObj['productVariations'].length - 1);

                            colorIndex = variationIndex;

                            return (
                                <div key={variationIndex}>

                                    <Typography variant="button" gutterBottom>
                                        {productObj['productColorOptions'][variationIndex]['label']}
                                    </Typography>

                                    <Grid container spacing={24}>
                                        {Object.keys(variationItem['size']).map((size, sizeIndex) => {
                                            return (
                                                <Grid item xs={1} key={sizeIndex}>
                                                    <Typography variant="button">
                                                        {_.toUpper(size)}
                                                    </Typography>
                                                </Grid>
                                            )
                                        })}
                                    </Grid>

                                    <Grid container spacing={24}>
                                        {Object.keys(variationItem['size']).map((size, sizeIndex) => {
                                            return (
                                                <Grid item xs={1} key={sizeIndex}>
                                                    <Typography>
                                                        {productObj['productVariations'][colorIndex]['size'][size]['value']['stock']}
                                                    </Typography>
                                                </Grid>
                                            )
                                        })}
                                    </Grid>

                                    {variationIndex !== productVariationsLength ?
                                        <Divider className={classes.normalDivider} /> : null
                                    }
                                    
                                </div>
                            )
                        })}
                    </div>
                : null}
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getProductInfo: Actions.getProductInfo,
    }, dispatch);
}

function mapStateToProps({ liveApp }) {
    return {
        productInfo: liveApp.liveProductInfo
    }
}

export default withReducer('liveApp', reducer)(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(LiveProductInfo))));