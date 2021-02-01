import React from 'react';
// import ReactPlayer from 'react-player'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button
} from '@material-ui/core';
import { Trans, withTranslation } from 'react-i18next';
import i18n from './i18n';
import tutorial1 from '../assets/tutorial1.pdf';
import tutorial2 from '../assets/tutorial2.pdf';
import tutorial3 from '../assets/tutorial3.pdf';
import tutorial4 from '../assets/tutorial4.pdf';

class Tutorial extends React.Component {

    render() {
        const { show, onClose, tutorialNumber } = this.props;
        let tutorial=tutorial1;

        if (tutorialNumber === "1"){
            tutorial = tutorial1;
        } else if (tutorialNumber === "2"){
            tutorial = tutorial2;
        } else if (tutorialNumber === "3"){
            tutorial = tutorial3;
        } else if (tutorialNumber === "4"){
            tutorial = tutorial4;
        }

        return (
            <Dialog
                open={show}
                onClose={onClose}
                maxWidth="lg"
                // fullWidth={true}
                fullScreen={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    <Trans i18nKey="navigation.tutorial">Tutorial</Trans>
                </DialogTitle>
                <DialogContent className="pb-20">
                    <iframe src={tutorial} title="Getting started with ARIS" width="100%" height="100%">  
                    </iframe>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>
                        <Trans i18nKey="main.close-btn">Close</Trans>
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withTranslation()(Tutorial
); 