import React, { Component } from "react";
import { Trans, withTranslation } from "react-i18next";
import { withStyles } from '@material-ui/core/styles';
// import i18n from '../../../../i18n';

import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const styles = theme => ({
    
});

class ConfirmModal extends Component {
    state = {
        confirmMessage: ""
    };

    componentDidMount() {
        this.setState({confirmMessage: this.props.confirmMessage});
    }

    componentDidUpdate(prevProps, prevState) {
        if( this.props.confirmMessage && this.state.confirmMessage !== this.props.confirmMessage ) {
            this.setState({confirmMessage: this.props.confirmMessage});
        }
    }

    render() {
        const { confirmMessage } = this.state;

        return (

            <Dialog
                open={true}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.props.handleCancelBtn}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                maxWidth="sm"
                fullWidth={true}
            >
                <div id="alert-dialog-slide-title" className="p-12 font-medium text-xl">
                    <Trans i18nKey="settings.store-package-info.message-from-system">Message from system</Trans>
                </div>
                <div className="px-12 pt-8 pb-24">
                    <div className="flex flex-col m-auto my-12">
                        <div className="flex pb-6">
                            <div dangerouslySetInnerHTML={{ __html: confirmMessage }} />
                        </div>
                    </div>
                </div>
                <div className="p-12 mt-24 flex justify-end">
                    { ( typeof this.props.handleAcceptBtn === "function" ) ? (
                        <div className="mr-16">
                            <button className="button" onClick={(event) => {
                                    event.preventDefault();
                                    this.props.handleAcceptBtn();
                                }}>
                                <Trans i18nKey="main.accept-btn">Accept</Trans>
                            </button>
                        </div>
                    ) : (null) }
                    <div>
                        <button className="" onClick={(event) => {
                            event.preventDefault();
                            this.props.handleCancelBtn();
                        }}>
                            <Trans i18nKey="main.reject-btn">Reject</Trans>
                        </button>
                    </div>
                </div>
            </Dialog>
            
        );
    }
}

export default (withStyles(styles, { withTheme: true })(withTranslation()(ConfirmModal)));
