import React from "react";
// import ReactPlayer from 'react-player'
import { Dialog, DialogContent } from "@material-ui/core";
import { Trans, withTranslation } from "react-i18next";
import i18n from "./i18n";
import correct from "../assets/correct.svg";
import TagManager from "react-gtm-module";

class PackageModal extends React.Component {

    clickRegister = (packageName) => {
        const tagManagerArgs = {
            dataLayer: {
                event: "ARIS",
                pageCategory: "Package",
                pageAction: "Click",
                pageLabel: "Click register " + packageName + " package in modal",
                pageUser: this.props.email || "Anonymous"
            }
        };
        TagManager.dataLayer(tagManagerArgs);
        window.location.href = "https://beta.arislab.ai/login";
    }

    render() {
        const { show, onClose, packageName, packagePrice } = this.props;

        return (
            <Dialog
                open={show}
                onClose={onClose}
                maxWidth="md"
                className={"" + i18n.language.includes("en") ? "en" : "th"}
                // fullWidth={true}
            >
                <DialogContent className="package-modal-container pb-20 text-center">
                    <img alt="" className="mb-6" src={correct} />
                    <div><Trans i18nKey="package.selecting">คุณได้เลือกแพ็คเกจ</Trans> {packageName}</div>
                    <div className="mb-6"><Trans i18nKey="package.price">ราคา</Trans> {packagePrice} <Trans i18nKey="package.baht">บาท</Trans><Trans i18nKey="package.per-month">/เดือน</Trans></div>
                    <div><Trans i18nKey="package.promotion">พิเศษช่วงโปรโมชัน</Trans></div>
                    <div>
                        <span className="text-yellow-dark"><Trans i18nKey="package.register-now">สมัครตอนนี้</Trans></span> <Trans i18nKey="package.promotion-desciption">รับฟรีค่าบริการรายเดือนและค่าบริการ 0% 30 วัน</Trans>
                    </div>
                </DialogContent>

                <div className="z-0 flex justify-center py-4 px-12 gradient-text cursor-pointer" onClick={() => this.clickRegister(packageName)}>
                    <span><Trans i18nKey="package.register">สมัครเลย</Trans></span>
                </div>

                {/* <DialogActions>
                    <Button onClick={onClose}>
                        <Trans i18nKey="main.close-btn">Close</Trans>
                    </Button>
                </DialogActions> */}
            </Dialog>
        );
    }
}

export default withTranslation()(PackageModal);

// import React, { Component } from 'react'
// import Package from './Package'

// class PackageModal extends Component {
//     render () {
//         return <div className="package-modal">
//             asdfsfd
//         </div>
//     }
// }

// export default PackageModal;
