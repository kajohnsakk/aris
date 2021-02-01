import React from "react";
import { Dialog, DialogContent, DialogActions, Button } from "@material-ui/core";
import { Trans, withTranslation } from "react-i18next";
import i18n from "./i18n";
import ig from "../assets/black-ig.svg";
import facebook from "../assets/black-facebook.svg";
class ContactUs extends React.Component {
    render() {
        const { show, onClose } = this.props;

        return (
            <Dialog open={show} onClose={onClose} maxWidth="sm" fullWidth={true} className={"" + i18n.language.includes("en") ? "en" : "th"}>
                <div className="p-6">
                    <Trans i18nKey="navigation.contact-us">Contact us</Trans>
                </div>
                <DialogContent className="pb-20">
                    {/* <ul>
                        <li><Trans i18nKey="">Contact us on ARIS facebook </Trans> <a rel="noopener noreferrer" href="https://www.facebook.com/arislablive/" className="click-link" target="_blank">here</a></li>
                        <li><Trans i18nKey="">Call us at </Trans><a href={"tel: +6661-286-6328"}>+6661-286-6328</a></li>
                        <li><Trans i18nKey="">Email us at </Trans><a href={"mailto: contactus@arislab.ai"}> contactus@arislab.ai </a></li>
                    </ul> */}
                    <div className="mb-2">
                        <a href="https://www.instagram.com/arislab_official/">
                            <img className="social-icon mr-2" src={ig} alt="ig" />
                        </a>

                        <a href="https://www.facebook.com/arislablive/">
                            <img className="social-icon" src={facebook} alt="facebook" />
                        </a>
                    </div>
                    {i18n.language.includes("en") ? (
                        <React.Fragment>
                            <div>Phone No.: 061-286-6328</div>
                            <div>Email: contactus@arislab.ai</div>
                            <div className="mt-4">
                                <div>38 Lasalle 41</div>
                                <div>Thanon Sukhumvit 105,</div>
                                <div>Bang Na, Bangkok 10260</div>
                            </div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div>เบอร์โทรศัพท์: 061-286-6328</div>
                            <div>Email: contactus@arislab.ai</div>
                            <div className="mt-4">
                                <div>38 ซอยลาซาล 41 ถนน สุขุมวิท 105</div>
                                <div>แขวง บางนาใต้ เขต บางนา</div>
                                <div>กรุงเทพ  10260</div>
                            </div>
                        </React.Fragment>
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

export default withTranslation()(ContactUs);
