import React, { Component } from "react";
import { Trans, withTranslation } from "react-i18next";
import i18n from "./i18n";
import Fade from "react-reveal/Fade";
import { ArisButton } from "./Components";
import { Link } from "react-router-dom";
import whiteLogo from "../assets/white-logo.svg";
import ig from "../assets/ig.svg";
import facebook from "../assets/facebook.svg";

class Footer extends Component {
  render() {
    return (
      <div className="footer md:mt-0 mt-16 body-padding">
        <div className="h-50vh pt-20">
          <div className="flex flex-col items-center text-white text-centerflex flex-col items-center text-white text-center mb-6">
            <Fade>
              <div className="text-very-large">
                <Trans i18nKey="homePage.footer-1">ทดลองใช้งาน</Trans>{" "}
                <span className="text-huge text-yellow">
                  <Trans i18nKey="homePage.footer-2">ฟรี</Trans>
                </span>
              </div>
            </Fade>

            <Fade>
              <div>
                <span className="text-yellow">
                  * <Trans i18nKey="homePage.footer-3">ใช้งานฟรี 15 วัน</Trans>
                </span>{" "}
                <Trans i18nKey="homePage.footer-4">
                  พร้อมเลือกแพ็คเกจล่วงหน้า ยกเลิกได้ตลอดเวลา
                </Trans>{" "}
                <Link to="/package">
                  <span className="text-pink">
                    <Trans i18nKey="homePage.footer-5">ดูแพ็คเกจ</Trans>
                  </span>
                </Link>
              </div>
              <div
                className="mt-6"
                onClick={() => this.props.clickSignUpBtn("bottom")}
              >
                <ArisButton>
                  <Trans i18nKey="navigation.sign-up">สมัครใช้บริการ</Trans>
                </ArisButton>
              </div>
            </Fade>
          </div>
        </div>

        <div className="text-white">
          <div className="flex justify-between text-white">
            <div className="text-sm">
              <img src={whiteLogo} alt="logo" />
              <div className="md:block hidden">
                {i18n.language.includes("en") ? (
                  <React.Fragment>
                    <div>38 Lasalle 41</div>
                    <div>Thanon Sukhumvit 105,</div>
                    <div>Bang Na, Bangkok 10260</div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div>38 ซอยลาซาล 41 ถนน สุขุมวิท 105</div>
                    <div>แขวง บางนาใต้ เขต บางนา</div>
                    <div>กรุงเทพ 10260</div>
                  </React.Fragment>
                )}
              </div>
            </div>
            <div className="text-white text-right">
              <h3 className="mb-2">
                <Trans i18nKey="navigation.contact-us">ติดต่อเรา</Trans>
              </h3>
              <div className="mb-2">
                <a href="https://www.instagram.com/arislab_official/">
                  <img className="social-icon mr-2" src={ig} alt="ig" />
                </a>
                <a href="https://www.facebook.com/arislablive/">
                  <img className="social-icon" src={facebook} alt="facebook" />
                </a>
              </div>
              <div>061-286-6328</div>
              <div>contactus@arislab.ai</div>
            </div>
          </div>
          <p className="md:hidden block text-center mt-4">
            {i18n.language.includes("en")
              ? "38 Lasalle 41 Thanon Sukhumvit 105, Bang Na, Bangkok 10260"
              : "38 ซอยลาซาล 41 ถนน สุขุมวิท 105 แขวง บางนาใต้ เขต บางนา กรุงเทพ 10260"}
          </p>
          <div className="text-center pt-4 pb-4">© 2020 Arislab company</div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Footer);
