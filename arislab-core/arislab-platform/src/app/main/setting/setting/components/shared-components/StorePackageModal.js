import React, { Component } from "react";
import { Trans, withTranslation } from "react-i18next";
// import i18n from '../../../../i18n';

import { 
    withStyles, 
    Dialog,
    CircularProgress,
    IconButton,
    Slide
} from '@material-ui/core';
// import AnimeSlide from '@material-ui/core/Slide';
import _ from '@lodash';
import CloseIcon from '@material-ui/icons/Close';
import { UtilityManager } from '../../../../modules/UtilityManager';
import UtilityFunction from '../../../../modules/UtilityFunction';
import PackageCard from './PackageCard';

import Slider from "react-slick";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const styles = theme => ({
    closeButton: {
        color: theme.palette.grey[500],
        padding: theme.spacing.unit / 4,
        display: 'flex'
    },
    link: {
        color: theme.palette.primary.color,
        textDecoration: "none"
    }
});

class StorePackageModal extends Component {
    state = {
        isLoadingData: true,
        currentStorePackage: {},
        storePackageList: []
    };

    componentDidMount() {
        this.setState({ currentStorePackage: this.props.currentStorePackage }, () => { this.getStorePackageList() });
    }

    componentDidUpdate(prevProps, prevState) {
        if( !_.isEqual(prevProps.currentStorePackage, this.props.currentStorePackage)) {
            this.setState({ currentStorePackage: this.props.currentStorePackage });
        }
    }

    getStorePackageList = async () => {
        let storePackageList = await UtilityManager.getInstance().getStorePackageList();
        storePackageList.shift();
        this.setState({ storePackageList: storePackageList, isLoadingData: false });
    }

    // handlePin = event => {
    //     this.setState({
    //         pin: event,
    //         errorMessageI18n: ""
    //     });
    // };

    render() {
        const { currentStorePackage, isLoadingData, storePackageList } = this.state;
        const { classes } = this.props;
        let currentStorePackageCode = "";
        if( currentStorePackage.hasOwnProperty('packageInfo') ) {
            currentStorePackageCode = currentStorePackage.packageInfo.code;
        }

        const web = process.env.REACT_APP_HOME_PAGE_URL || 'https://www.arislab.ai';

        return (

            <Dialog
                open={true}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.props.handleCancelBtn}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                maxWidth="md"
                fullWidth={true}
                fullScreen={ UtilityFunction.useMediaQuery('(max-width: 1024px)') }
            >
                <div id="alert-dialog-slide-title" className="p-12 text-xl flex flex-row">
                    <div className="flex flex-1 flex-col lg:flex-row">
                        <div className="flex mr-8"><Trans i18nKey="settings.store-package-info.your-current-package">Your current Package</Trans></div>
                        <div className="flex font-medium text-orange-light">{`${ currentStorePackage.hasOwnProperty('packageInfo') ? currentStorePackage.packageInfo.name : "-" }`}</div>
                    </div>
                    <div className="flex">
                        <IconButton aria-label="Close" className={classes.closeButton} onClick={(event) => {this.props.handleCancelBtn()}}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
                <div className="p-12 flex flex-1 flex-col">
                    { !isLoadingData ? (
                        <div className="lg:flex lg:flex-1 lg:flex-row lg:justify-center">
                            { UtilityFunction.useMediaQuery('(max-width: 1024px)') ? (
                                <Slider
                                    dots={true}
                                    infinite={true}
                                    speed={500}
                                    slidesToShow={1}
                                    slidesToScroll={1}
                                >
                                    {
                                        storePackageList.map((storePackage, index) =>
                                            <div className="pr-8 pt-4 pb-4" key={index}>
                                                <PackageCard
                                                    key={index}
                                                    packageInfo={storePackage}
                                                    isSelectedPackage={ storePackage.code === currentStorePackageCode ? true : false }
                                                    handleSelectPackageButton={this.props.handleSelectPackageButton}
                                                />
                                            </div>
                                        )
                                    }
                                </Slider>
                            ) : (
                                storePackageList.map((storePackage, index) => 
                                    <PackageCard
                                        key={index}
                                        packageInfo={storePackage}
                                        isSelectedPackage={ storePackage.code === currentStorePackageCode ? true : false }
                                        handleSelectPackageButton={this.props.handleSelectPackageButton}
                                    />
                                )
                            ) }
                        </div>
                    ) : (
                        <div className="flex justify-center py-48">
                            <CircularProgress className={classes.highlightText} />
                        </div>
                    ) }
                </div>
                <div className="p-24 flex justify-center">
                    <a href={web+"/package"} target="_blank" className={classes.link} rel="noopener noreferrer">
                        <Trans i18nKey="settings.store-package-info.compare-package">Compare package</Trans>
                    </a>
                </div>
            </Dialog>
            
        );
    }
}

export default (withStyles(styles, { withTheme: true })(withTranslation()(StorePackageModal)));
