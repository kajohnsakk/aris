import React from "react";
// import ReactPlayer from 'react-player'
import { Dialog, DialogContent, DialogActions, Button } from "@material-ui/core";
import { Trans, withTranslation } from "react-i18next";
import i18n from "./i18n";

class AboutUs extends React.Component {
    render() {
        const { show, onClose } = this.props;

        return (
            <Dialog
                open={show}
                onClose={onClose}
                maxWidth="md"
                className={"" + i18n.language.includes("en") ? "en" : "th"}
                // fullWidth={true}
            >
                {/* <DialogTitle> */}
                <div className="p-6">
                    <Trans i18nKey="navigation.about-us">About us</Trans>
                </div>
                {/* </DialogTitle> */}
                <DialogContent className="pb-20">
                    {i18n.language === "th" ? (
                        <iframe
                            title="Aris trailer TH"
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/LH8kkyMa6Wk"
                            frameBorder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <iframe
                            title="Aris trailer EN"
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/MHSgpZ5LxfU"
                            frameborder="0"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    )}
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

export default withTranslation()(AboutUs);
