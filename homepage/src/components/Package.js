import React, { Component } from "react";
import check from "../assets/check.svg";
import Fade from "react-reveal/Fade";
import { Trans, withTranslation } from "react-i18next";
import Cookies from "js-cookie";
import Axios from "axios";
import TagManager from "react-gtm-module";
import Footer from "./Footer";

class Package extends Component {
    state = {
        email: ""
    };

    async componentDidMount() {
        if (Cookies.get("isLoggedIn") === "true") {
            let cookieValue = Cookies.get("email");
            let res = await Axios.get("https://beta.arislab.ai/api/utility/emailDecoder/encodedEmail/" + cookieValue);
            let email = res.data.result;
            this.setState({
                email: email
            });
        }

        if (Cookies.get("ALLOW_COOKIE")) {
            this.setState({
                allowCookie: true
            });
        }

        const tagManagerArgs = {
            dataLayer: {
                event: "ARIS",
                pageCategory: "Package",
                pageAction: "View",
                pageLabel: "View package",
                pageUser: this.state.email || "Anonymous"
            }
        };
        TagManager.dataLayer(tagManagerArgs);
    }

    clickPackage = packageName => {
        const tagManagerArgs = {
            dataLayer: {
                event: "ARIS",
                pageCategory: "Package",
                pageAction: "Click",
                pageLabel: "Click " + packageName,
                pageUser: this.state.email || "Anonymous"
            }
        };
        TagManager.dataLayer(tagManagerArgs);
    };

    render() {
        return (
            <React.Fragment>
                <Fade>
                    <div className="scrolling-wrapper mb-24">
                        <div className="pricing-table-container text-grey-darkest">
                            <div className=""></div>
                            <div className="pricing-table-header py-2 leading-tight">
                                <div>Beginner</div>
                                <div>0</div>
                                <div>
                                    <Trans i18nKey="package.baht">บาท</Trans>
                                    <Trans i18nKey="package.per-month">/เดือน</Trans>
                                </div>
                            </div>
                            <div className="pricing-table-header py-2 leading-tight">
                                <div>Standard</div>
                                <div>990</div>
                                <div>
                                    <Trans i18nKey="package.baht">บาท</Trans>
                                    <Trans i18nKey="package.per-month">/เดือน</Trans>
                                </div>
                            </div>
                            <div className="pricing-table-header py-2 leading-tight">
                                <div>Pro</div>
                                <div>4900</div>
                                <div>
                                    <Trans i18nKey="package.baht">บาท</Trans>
                                    <Trans i18nKey="package.per-month">/เดือน</Trans>
                                </div>
                            </div>
                            <div className="pricing-table-header py-2 leading-tight">
                                <div>Expert</div>
                                <div>9900</div>
                                <div>
                                    <Trans i18nKey="package.baht">บาท</Trans>
                                    <Trans i18nKey="package.per-month">/เดือน</Trans>
                                </div>
                            </div>

                            <div className="pricing-table-row1 b-top">
                                <Trans i18nKey="package.service-fees">ค่าบริการ</Trans>
                            </div>
                            <div className="pricing-table-row1">4%</div>
                            <div className="pricing-table-row1">3%</div>
                            <div className="pricing-table-row1">1%</div>
                            <div className="pricing-table-row1 last">0%</div>

                            <div className="pricing-table-row2">
                                <Trans i18nKey="package.transaction-fees">ค่าบริการธุรกรรมการเงิน</Trans>
                            </div>
                            <div className="pricing-table-row2">1%</div>
                            <div className="pricing-table-row2">1%</div>
                            <div className="pricing-table-row2">1%</div>
                            <div className="pricing-table-row2 last">1%</div>

                            {/* <div className="pricing-table-row1">
                                <div>
                                    <Trans i18nKey="package.credit-card-fees">ค่าธรรมเนียมบัตรเครดิต</Trans>
                                </div>
                                <div>
                                    (<Trans i18nKey="package.if-enable">กรณีที่เปิดใช้งาน</Trans>)
                                </div>
                            </div>
                            <div className="pricing-table-row1">2.9%</div>
                            <div className="pricing-table-row1">2.9%</div>
                            <div className="pricing-table-row1">2.9%</div>
                            <div className="pricing-table-row1 last">2.9%</div> */}

                            <div className="pricing-table-row1">
                                <Trans i18nKey="package.unlimited-live-session">ไลฟ์ไม่จำกัดเวลา</Trans>
                            </div>
                            <div className="pricing-table-row1">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row1">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row1">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row1 last">
                                <img alt="" src={check} />
                            </div>

                            <div className="pricing-table-row2">
                                <Trans i18nKey="package.unlimited-number-of-orders">ไม่จำกัดจำนวนสินค้า</Trans>
                            </div>
                            <div className="pricing-table-row2">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row2">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row2">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row2 last">
                                <img alt="" src={check} />
                            </div>

                            <div className="pricing-table-row1 b-bottom">
                                <Trans i18nKey="package.dedicated-support">Dedicated support</Trans>
                            </div>
                            <div className="pricing-table-row1">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row1">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row1">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row1 last">
                                <img alt="" src={check} />
                            </div>

                            <div className=""></div>
                            <div className="pricing-table-br">
                                <Trans i18nKey="package.new-features">ฟีเจอร์ใหม่เร็ว ๆ นี้</Trans>
                            </div>

                            <div className="pricing-table-row1 b-top">
                                <Trans i18nKey="package.multi-admin">ระบบจัดการแอดมิน</Trans>
                            </div>
                            <div className="pricing-table-row1">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row1">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row1">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row1 last">
                                <img alt="" src={check} />
                            </div>

                            <div className="pricing-table-row2">
                                <Trans i18nKey="package.store-dashboard">หน้าสรุปข้อมูลร้านค้า</Trans>
                            </div>
                            <div className="pricing-table-row2">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row2">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row2">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row2 last">
                                <img alt="" src={check} />
                            </div>

                            <div className="pricing-table-row1 b-bottom">
                                <Trans i18nKey="package.orders-management">ระบบจัดการคำสั่งซื้อ</Trans>
                            </div>
                            <div className="pricing-table-row1">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row1">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row1">
                                <img alt="" src={check} />
                            </div>
                            <div className="pricing-table-row1 last">
                                <img alt="" src={check} />
                            </div>

                            <div className=""></div>
                            <div
                                className="pricing-table-button text-white"
                                onClick={() => {
                                    this.props.selectPackage("Beginner", "0");
                                    this.clickPackage("Beginner");
                                }}
                            >
                                <Trans i18nKey="package.select">เลือก</Trans>
                            </div>
                            <div
                                className="pricing-table-button text-white"
                                onClick={() => {
                                    this.props.selectPackage("Standard", "990");
                                    this.clickPackage("Standard");
                                }}
                            >
                                <Trans i18nKey="package.select">เลือก</Trans>
                            </div>
                            <div
                                className="pricing-table-button text-white"
                                onClick={() => {
                                    this.props.selectPackage("Pro", "4900");
                                    this.clickPackage("Pro");
                                }}
                            >
                                <Trans i18nKey="package.select">เลือก</Trans>
                            </div>
                            <div
                                className="pricing-table-button text-white"
                                onClick={() => {
                                    this.props.selectPackage("Expert", "9900");
                                    this.clickPackage("Expert");
                                }}
                            >
                                <Trans i18nKey="package.select">เลือก</Trans>
                            </div>
                        </div>
                    </div>
                    {/* <div className="md:mx-32 mx-4 md:mt-16 mt-8">
                    <div>* เมื่อหมดระยะเวลาช่วงทดลองใช้ฟรีแล้วระบบจะเปลี่ยนเป็นแพ็คเกจ BEGINNER อัตโนมัติ</div>
                    <div>** ลูกค้าสามารถยกเลิกแพ็คเกจต่างๆ ได้ทุกเมื่อ ระบบจะเปลี่ยนเป็นแพ็คเกจ BEGINNER ในรอบบิลถัดไป</div>
                    <div>
                        *** ลูกค้าสามารถใช้ระบบ ARIS ได้ตลอดชีพฟรีทุกฟีเจอร์ตามปกติ โดยไม่เสียค่าแพ็คเกจรายเดือน
                        แต่ระบบจะคิดค่าบริการและค่าบริการธุรกรรมการเงินตามแพ็คเกจ BEGINNER ตามปกติ
                    </div>
                </div> */}
                </Fade>
                <Fade>
                    <Footer clickSignUpBtn={this.props.clickSignUpBtn}></Footer>
                </Fade>
            </React.Fragment>
        );
    }
}

export default withTranslation()(Package);
