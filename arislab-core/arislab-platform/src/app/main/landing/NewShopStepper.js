import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Cookies from "js-cookie";
import { UtilityManager } from '../modules/UtilityManager';
import * as Actions from '../setting/store/actions';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import { withRouter } from 'react-router-dom';
import { FacebookService } from "../modules/FacebookService";
import Classnames from 'classnames';

const styles = theme => ({
    root: {
        width: '90%',
    },
    backButton: {
        marginRight: theme.spacing.unit,
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    landingContainer: {
        minHeight: '450px'
    },
    landingLogo: {
        width: '160px'
    }
});

class HorizontalLabelPositionBelowStepper extends React.Component {
    state = {
        activeStep: 0,
        auth0_uid: '',
        email: '',
        storeID: '',
        form: {},
        businessName: ""
    };

    componentDidMount() {
        // let cookieValue = Cookies.get('email');
        let cookieValue = Cookies.get('auth0_uid');

        UtilityManager.getInstance().storeInfoLookup(cookieValue).then((resultStoreInfo) => {
            this.setState({
                auth0_uid: resultStoreInfo[0].auth0_uid,
                email: resultStoreInfo[0].email,
                storeID: resultStoreInfo[0].storeID
            });

            //this.updateBusinessProfileState();
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    onFacebookAuthClicked = () => {
        FacebookService.getInstance().authenticate().then(() => {
            return FacebookService.getInstance().loadPages();
        }).then(this.onFacebookPageLoaded);
    };

    onFacebookPageLoaded = () => {
        // TODO - jump to storemanagement page
    };

    render() {
        const { classes } = this.props;
        // const steps = this.getSteps();
        // const { activeStep } = this.state;

        return (
            <div className={Classnames(classes.landingContainer, "ml-auto my-40 rounded-lg overflow-hidden shadow-lg inline-block w-2/3 mr-auto bg-white")} >
                <div className="py-40 px-40 w-full">
                    <div className="w-1/2 inline-block align-top">
                        <img src="assets/images/landing/welcome-icon.png" alt="" />
                    </div>
                    <div className="w-1/2 inline-block align-middle mt-60">
                        <div className="content-center text-center">
                            <img className={classes.landingLogo} src="assets/images/logos/aris-logo.png" alt="logo" />
                        </div>
                        <div className="content-center text-center mt-28 text-2xl font-extrabold mb-8">
                            Welcome to Aris
                        </div>
                        <div className="content-center text-center mt-18 text-xs text-gray">
                            Sign up for free. No credit card required.
                        </div>
                        <div className="content-center text-center mt-28">
                            <button onClick={this.onFacebookAuthClicked} className="login-facebook-button">SIGN UP
                                WITH FACEBOOK
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

HorizontalLabelPositionBelowStepper.propTypes = {
    classes: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getBusinessProfile: Actions.getBusinessProfile,
        saveBusinessProfile: Actions.saveBusinessProfile
    }, dispatch);
}

function mapStateToProps({ storeManagement }) {
    return {
        businessProfile: storeManagement.businessProfile
        // stepperCount
    }
}

export default withStyles(styles)(withRouter(connect(mapStateToProps, mapDispatchToProps)(HorizontalLabelPositionBelowStepper)));