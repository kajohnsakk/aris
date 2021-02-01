import React, { Component } from 'react';

import withReducer from 'app/store/withReducer';
import reducer from './store/reducers';
import * as Actions from './store/actions';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';

import _ from '@lodash';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const styles = theme => ({
    slideParent: {

    },
    slideItem: {
        background: '#5f9ea0',
        color: '#fff',
        fontSize: '16px',
        width: '98%',
        height: '110px',
        marginLeft: '1px',
        marginRight: '1px',
        paddingLeft: '4%',
        paddingRight: '4%',
        position: 'relative',
        textAlign: 'center',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
        // '&:active': {
        //     border: '1px solid #EC3290'
        // }
    },
    activeSlideItem: {
        background: '#395e60',
        color: '#fff',
        fontSize: '16px',
        width: '98%',
        height: '110px',
        marginLeft: '1px',
        marginRight: '1px',
        paddingLeft: '4%',
        paddingRight: '4%',
        position: 'relative',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
        // '&:active': {
        //     border: '1px solid #EC3290'
        // }
    },
    layoutRoot: {}
});

class LiveProductSlider extends Component {

    state = {
        data: this.props.productListSlider
    }

    componentDidMount() {
        const { productList } = this.props;

        this.props.getProductsList({
            productList: productList
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (!_.isEqual(this.props.productListSlider, prevProps.productListSlider)) {
            const data = this.props.productListSlider;
            this.setState({ data });
        }
    }

    handleSlideItemClick = (storeID, productID, index) => {
        this.props.handleSlideItemClick({
            storeID: storeID,
            productID: productID,
            index: index
        });
    }

    render() {
        const { classes } = this.props;
        const { data } = this.state;
        const SlideSettings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 10,
            slidesToScroll: 10
        };

        return (
            <Slider {...SlideSettings}>
                {data !== null ?
                    (Object.keys(data).map((key, index) => {
                        let item = data[key];
                        return (
                            <div key={index}>
                                <h5
                                    className={ item.productID === this.props.selectedID ? classes.activeSlideItem : classes.slideItem}
                                    onClick={() => {this.handleSlideItemClick(item.storeID, item.productID, index)}}
                                >
                                    {item.productInfo.productName}
                                </h5>
                            </div>
                        )
                    }))
                    : null
                }
            </Slider>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getProductsList: Actions.getProductsList
    }, dispatch);
}

function mapStateToProps({ liveApp }) {
    return {
        productListSlider: liveApp.liveProductSlider
    }
}

export default withReducer('liveApp', reducer)(withStyles(styles, { withTheme: true })(withRouter(connect(mapStateToProps, mapDispatchToProps)(LiveProductSlider))));