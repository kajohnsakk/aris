import React, { Component } from "react";
import Fade from "react-reveal/Fade";
import { ArisButton } from "./Components";
import Slider from "react-slick";
import Cookies from "js-cookie";
import Axios from "axios";
import TagManager from "react-gtm-module";
import { Trans, withTranslation } from "react-i18next";
import i18n from "./i18n";
import Footer from "./Footer"

import shu from "../assets/shu.png";
import workpoint from "../assets/workpoint.png";
import woodyWorld from "../assets/ww.png";
import tby from "../assets/tby.png";
import curator from "../assets/curator.png";
import koob from "../assets/koob.png";
import zaap from "../assets/zaap.jpg";
import video from "../assets/landing.mp4";
import video2 from "../assets/section2.mp4";
// import cfcc from "../assets/cfcc.svg";
// import order from "../assets/order.svg";
// import questions from "../assets/questions.svg";
import problem1 from "../assets/problem1.svg";
import problem2 from "../assets/problem2.svg";
import problem3 from "../assets/problem3.svg";
import table from "../assets/table.png";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class Home extends Component {
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

        const tagManagerArgs1 = {
            dataLayer: {
                event: "ARIS",
                pageCategory: "Homepage",
                pageAction: "View",
                pageLabel: "View Homepage",
                pageUser: this.state.email || "Anonymous"
            }
        };
        TagManager.dataLayer(tagManagerArgs1);
        const tagManagerArgs2 = {
            dataLayer: {
                event: "ARIS",
                pageCategory: "Homepage",
                pageAction: "View",
                pageLabel: "v2 View Homepage",
                pageUser: this.state.email || "Anonymous"
            }
        };
        TagManager.dataLayer(tagManagerArgs2);
    }

    componentWillUnmount() {
        const tagManagerArgs1 = {
            dataLayer: {
                event: "ARIS",
                pageCategory: "Homepage",
                pageAction: "Leave",
                pageLabel: "Aris Homepage",
                pageUser: this.state.email || "Anonymous"
            }
        };
        TagManager.dataLayer(tagManagerArgs1);
        const tagManagerArgs2 = {
            dataLayer: {
                event: "ARIS",
                pageCategory: "Homepage",
                pageAction: "Leave",
                pageLabel: "v2 Aris Homepage",
                pageUser: this.state.email || "Anonymous"
            }
        };
        TagManager.dataLayer(tagManagerArgs2);
    }

    clickSignUpBtn = async position => {
        const tagManagerArgs1 = {
            dataLayer: {
                event: "ARIS",
                pageCategory: "Homepage",
                pageAction: "Click",
                pageLabel: "Click " + position + " sign up button",
                pageUser: this.props.email || "Anonymous"
            }
        };
        await TagManager.dataLayer(tagManagerArgs1);
        const tagManagerArgs2 = {
            dataLayer: {
                event: "ARIS",
                pageCategory: "Homepage",
                pageAction: "Click",
                pageLabel: "v2 Click " + position + " sign up button",
                pageUser: this.props.email || "Anonymous"
            }
        };
        await TagManager.dataLayer(tagManagerArgs2);
        window.location.href = "https://beta.arislab.ai/";
    };

    render() {
        var settings = {
            autoplay: true,
            centerMode: true,
            centerPadding: "40px",
            slidesToShow: 3,
            autoplaySpeed: 2000,
            arrows: true,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        centerMode: true,
                        // centerPadding: "40px",
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        centerMode: true,
                        // centerPadding: "40px",
                        slidesToShow: 1
                    }
                }
            ]
        };
        const h1 = "header-text gradient-text mb-2";
        const h2 = "mb-6 text-grey-darker";

        return (
            <div className={"" + i18n.language.includes("en") ? "en" : "th"}>
                <div className="md:mt-0 mt-12 leading-normal">
                    <div className="flex md:flex-row flex-col items-center landing-container body-padding">
                        <div className="flex md:w-1/2 w-full justify-center items-center">
                            <Fade>
                                <div className="video flex justify-center items-center">
                                    <video className="" width="100%" height="" autoPlay loop muted>
                                        <source src={video} type="video/mp4" />
                                    </video>
                                </div>
                            </Fade>
                        </div>
                        <div className="md:w-1/2 flex items-center md:justify-start justify-center md:mt-0 mt-6">
                            <div className="">
                                <Fade>
                                    <h1 className={h1 + " md:text-left text-center"}>
                                        <Trans i18nKey="homePage.landing-h1">ยกระดับการ LIVE</Trans>
                                    </h1>
                                    <h2 className={h2 + " md:text-left text-center"}>
                                        <Trans i18nKey="homePage.landing-h2">ขายของบน Facebook แบบมืออาชีพ</Trans>
                                    </h2>
                                    <div className="text-grey-dark">
                                        <div>
                                            <Trans i18nKey="homePage.landing-div-1">ด้วยฟีเจอร์มากมาย เช่น</Trans>
                                        </div>
                                        <div>
                                            • <Trans i18nKey="homePage.landing-div-2">แสดงโลโก้ร้านค้า</Trans>
                                        </div>
                                        <div>
                                            • <Trans i18nKey="homePage.landing-div-3">แสดงรายละเอียดสินค้า ภาพ ราคา รหัสสั่งซื้อ</Trans>
                                        </div>
                                        <div>
                                            • <Trans i18nKey="homePage.landing-div-4">ปิดการขายอัตโนมัติด้วย Chatbot</Trans>
                                        </div>
                                    </div>
                                    <div className="flex md:justify-start justify-center">
                                        <div className="mt-6" onClick={() => this.clickSignUpBtn("top")}>
                                            <ArisButton>
                                                <Trans i18nKey="navigation.sign-up">สมัครใช้บริการ</Trans>
                                            </ArisButton>
                                        </div>
                                    </div>
                                </Fade>
                            </div>
                        </div>
                    </div>

                    <div className="flex md:flex-row flex-col-reverse items-center h-100vh section-2 xl:mt-0 mt-24 body-padding">
                        <div className="md:w-1/2 flex md:justify-end justify-center md:mb-0 lg:mt-6">
                            <div className="flex w-full items-center">
                                <Fade>
                                    <div>
                                        <h1 className={h1 + " md:text-left text-center md:mt-0 mt-6"}>
                                            <Trans i18nKey="homePage.section-2-h1">ปิดการขายอัตโนมัติ</Trans>
                                        </h1>
                                        <h2 className={h2 + " md:text-left text-center"}>
                                            <Trans i18nKey="homePage.section-2-h2">Chatbot ช่วยปิดการขายอัตโนมัติ</Trans>
                                        </h2>
                                        <div className="text-grey-dark">
                                            {i18n.language.includes("en") ? (
                                                <Trans i18nKey="homePage.section-2-div"></Trans>
                                            ) : (
                                                <React.Fragment>
                                                    ลูกค้าซื้อสินค้าได้ง่าย ๆ เพียงแค่ลูกค้าพิมพ์รหัสสินค้าด้วยการคอมเมนต์ใต้โพสต์หรือ Inbox
                                                    ก็สามารถซื้อสินค้าด้วยตัวเองได้ง่าย ๆ <span className="gradient-text">โดยไม่ต้องพึ่งแอดมิน</span>{" "}
                                                    เพราะเรามี Chatbot ที่คอยจัดการการขายให้ตั้งแต่ขั้นตอนการสั่งซื้อสินค้าจนถึงขั้นตอนการชำระเงิน
                                                </React.Fragment>
                                            )}
                                        </div>
                                    </div>
                                </Fade>
                            </div>
                        </div>
                        <div className="flex md:w-1/2 w-full justify-center items-center">
                            <Fade>
                                <div className="w-full lg:w-4/5 flex justify-center items-center">
                                    <video className="" width="100%" height="" autoPlay loop muted>
                                        <source src={video2} type="video/mp4" />
                                    </video>
                                </div>
                            </Fade>
                        </div>
                    </div>

                    <div className="h-100vh section-3 xl:mt-0 mt-32 body-padding flex flex-col justify-center">
                        <Fade>
                            <div className="flex flex-col items-center md:mb-12 text-center">
                                {/* <h3 className="text-grey-darkest mb-2">ปัญหาต่าง ๆ ที่น่ากวนใจ</h3>
                                <div className="text-grey-darker">
                                    เพียงให้ <span className="gradient-text">ARIS</span> เข้ามาช่วย
                                </div> */}
                                <h1 className={h1 + " md:text-left text-center"}>
                                    <Trans i18nKey="homePage.section-3-h1">ปัญหาต่าง ๆ ที่น่ากวนใจ</Trans>
                                </h1>
                                <h2 className={"text-grey-darker md:text-left text-center"}>
                                    {i18n.language.includes("en") ? (
                                        <Trans i18nKey="homePage.section-3-h2"></Trans>
                                    ) : (
                                        <React.Fragment>
                                            เพียงให้ <span className="gradient-text">ARIS</span> เข้ามาช่วย
                                        </React.Fragment>
                                    )}
                                </h2>
                            </div>
                        </Fade>

                        <div className="flex md:flex-row flex-col justify-center solution-container">
                            <div className="text-center md:w-1/3">
                                <Fade>
                                    <img className="problem-img" src={problem1} alt="problem1" />
                                </Fade>
                                <Fade>
                                    <div className="text-grey-dark md:my-0 my-4">
                                        <h3 className="gradient-text md:pt-4">
                                            <Trans i18nKey="homePage.section-3-1-h3">ลูกค้า CF แล้ว CC</Trans>
                                        </h3>
                                        <h4 className="my-2">
                                            <Trans i18nKey="homePage.section-3-1-h4">ช่วยลดการยกเลิกคำสั่งซื้อของลูกค้า</Trans>
                                        </h4>
                                        <div>
                                            <Trans i18nKey="homePage.section-3-1-div">
                                                ลูกค้าที่ต้องการสินค้า แล้วพร้อมชำระเงิน สามารถกด “สั่งซื้อ” และพร้อมชำระเงิน ได้ทันที
                                                ไม่ต้องรอร้านค้าสรุปยอด
                                            </Trans>
                                        </div>
                                    </div>
                                </Fade>
                            </div>
                            <div className="text-center md:mx-12 md:w-1/3">
                                <Fade>
                                    <img className="problem-img" src={problem2} alt="problem2" />
                                </Fade>
                                <Fade>
                                    <div className="text-grey-dark md:my-0 my-4">
                                        <h3 className="gradient-text md:pt-4">
                                            <Trans i18nKey="homePage.section-3-2-h3">ออเดอร์ตกหล่น</Trans>
                                        </h3>
                                        <h4 className="my-2">
                                            <Trans i18nKey="homePage.section-3-2-h4">ไม่พลาดโอกาสทุกๆ การขายด้วยแชทบอท</Trans>
                                        </h4>
                                        <div>
                                            <Trans i18nKey="homePage.section-3-2-div">
                                                ระบบ Ai บริการลูกค้าผ่าน Chatbot ลูกค้าสามารถซื้อสินค้าผ่านระบบ ขายอัตโนมัติได้ตลอด 24 ชั่วโมง
                                            </Trans>
                                        </div>
                                    </div>
                                </Fade>
                            </div>
                            <div className="text-center md:w-1/3">
                                <Fade>
                                    <img className="problem-img" src={problem3} alt="problem3" />
                                </Fade>
                                <Fade>
                                    <div className="text-grey-dark md:my-0 my-4">
                                        <h3 className="gradient-text md:pt-4">
                                            <Trans i18nKey="homePage.section-3-3-h3">บอกรายละเอียดซ้ำ ๆ</Trans>
                                        </h3>
                                        <h4 className="my-2">
                                            <Trans i18nKey="homePage.section-3-3-h4">ให้เอริสเป็นผู้ช่วยร้านค้าของคุณ</Trans>
                                        </h4>
                                        <div>
                                            <Trans i18nKey="homePage.section-3-3-div">
                                                ด้วยฟีเจอร์โชว์ภาพสินค้า ราคา และ รหัสสั่งซื้อ ขณะไลฟ์สด ช่วยให้ลูกค้าที่เข้ามาทีหลังรู้รายละเอียด
                                            </Trans>
                                        </div>
                                    </div>
                                </Fade>
                            </div>
                        </div>
                    </div>

                    <div className="h-100vh section-4 xl:mt-12 mt-24 body-padding flex flex-col justify-center">
                        <Fade>
                            <div className="flex flex-col items-center">
                                <h1 className={h1 + " md:text-left text-center"}>
                                    <Trans i18nKey="homePage.section-4-h1">ระบบช่วยเหลือร้านค้า</Trans>
                                </h1>
                                <h2 className={"md:mb-6 text-grey-darker md:text-left text-center"}>
                                    {i18n.language.includes("en") ? (
                                        <Trans i18nKey="homePage.section-4-h2-1"></Trans>
                                    ) : (
                                        <React.Fragment>
                                            ให้ <span className="gradient-text">ARIS</span> เพิ่มความสะดวก รวดเร็ว และปลอดภัย
                                        </React.Fragment>
                                    )}
                                </h2>
                                {/* <h3 className="text-grey-darkest mb-2">ระบบช่วยเหลือร้านค้า</h3>
                                <div className="text-grey-darker">
                                    ให้ <span className="gradient-text">ARIS</span> เพิ่มความสะดวก รวดเร็ว และปลอดภัย
                                </div> */}
                            </div>
                        </Fade>

                        <div className="flex md:flex-row flex-col items-center justify-center md:mt-12 mt-6">
                            <div className="flex md:w-1/2 w-full md:mr-6 justify-center items-center">
                                <Fade>
                                    <div className="">
                                        <img className="shadow rounded-lg" src={table} alt="table" />
                                    </div>
                                </Fade>
                            </div>
                            <div className="md:w-1/2 w-4/5 md:ml-6 lg:mt-6 flex items-center md:justify-start justify-center">
                                <Fade>
                                    <div className="">
                                        {/* <h1 className={h1 + " md:text-left text-center"}>ยกระดับการ LIVE</h1> */}
                                        <h2 className={h2 + " md:text-left text-center md:mt-0 mt-6"}>
                                            <Trans i18nKey="homePage.section-4-h2-2">จัดการระบบง่าย ๆ ด้วย Platform ของเรา</Trans>
                                        </h2>
                                        <div className="text-grey-dark">
                                            <div>
                                                <Trans i18nKey="homePage.section-4-div-1">เพราะเรามี features ที่พ่อค้าแม่ค้าต้องการ</Trans>
                                            </div>
                                            <div>
                                                •{" "}
                                                <Trans i18nKey="homePage.section-4-div-2">จัดการ Live เปลี่ยนภาพสินค้าระหว่าง Live ได้ตลอดเวลา</Trans>
                                            </div>
                                            <div>
                                                •{" "}
                                                <Trans i18nKey="homePage.section-4-div-3">
                                                    จัดการสต๊อก/ราคาสินค้า และตรวจสอบการชำระเงินของออเดอร์
                                                </Trans>
                                            </div>
                                            <div>
                                                • <Trans i18nKey="homePage.section-4-div-4">เช็คยอดรายได้ของร้านค้า</Trans>
                                            </div>
                                        </div>
                                        {/* <div className="flex justify-center">
                                            <a href="https://beta.arislab.ai">
                                                <ArisButton className="mt-6">สมัครใช้บริการ</ArisButton>
                                            </a>
                                        </div> */}
                                    </div>{" "}
                                </Fade>
                            </div>
                        </div>
                    </div>

                    <div className="section-5 body-padding h-50vh flex flex-col justify-center xl:mt-0 xl:mb-16 mt-32 mb-32">
                        <div className="flex flex-col items-center">
                            <Fade>
                                <h3 className="text-grey-darkest text-center mb-8">
                                    {i18n.language.includes("en") ? (
                                        <Trans i18nKey="homePage.partner"></Trans>
                                    ) : (
                                        <React.Fragment>
                                            เพื่อน ๆ ที่ไว้ใจให้ <span className="gradient-text">ARIS</span> ช่วยจัดการร้านค้า
                                        </React.Fragment>
                                    )}
                                </h3>
                            </Fade>
                        </div>
                        <Fade>
                            <div className="flex justify-center">
                                <Slider className="w-4/5 partner-container flex items-center" {...settings}>
                                    <div className="partner-box">
                                        <img src={workpoint} className="" alt="workpoint" />
                                    </div>
                                    <div className="partner-box">
                                        <img src={tby} className="" alt="tby" />
                                    </div>
                                    <div className="partner-box">
                                        <img src={shu} className="" alt="shu" />
                                    </div>
                                    <div className="partner-box">
                                        <img src={zaap} className="" alt="zaap" />
                                    </div>
                                    <div className="partner-box">
                                        <img src={woodyWorld} className="" alt="woodyworld" />
                                    </div>
                                    <div className="partner-box">
                                        <img src={koob} className="" alt="koob" />
                                    </div>
                                    <div className="partner-box">
                                        <img src={curator} className="p-4" alt="curator" />
                                    </div>
                                </Slider>
                            </div>
                        </Fade>
                    </div>

                    <Footer clickSignUpBtn={this.clickSignUpBtn}></Footer>
                </div>
            </div>
        );
    }
}

export default withTranslation()(Home);
