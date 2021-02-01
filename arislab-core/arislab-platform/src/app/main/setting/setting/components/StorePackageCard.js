import React from "react";
import { withStyles, Card, Tooltip, CircularProgress } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import connect from "react-redux/es/connect/connect";
import withReducer from "../../../../store/withReducer";
import * as Actions from "../../store/actions";
import reducer from "../../store/reducers";
import Classnames from "classnames";

import styles from "../../../live/liveEvent/styles/styles";
import UtilityFunction from "../../../modules/UtilityFunction";
import { UtilityManager } from "../../../modules/UtilityManager";

import { Trans, withTranslation } from "react-i18next";
import _ from "@lodash";
import StorePackageModal from "./shared-components/StorePackageModal";
import AlertModal from "./shared-components/AlertModal";
import ConfirmModal from "./shared-components/ConfirmModal";
import i18n from "../../../../i18n";

class StorePackageCard extends React.Component {
  state = {
    storeID: "",
    currentStorePackage: {},
    displayStorePackageModal: false,
    displayAlertModal: false,
    displayConfirmModal: false,
    confirmMessage: "",
    alertMessage: "",
    isProcessSelectedPackage: false,
    selectedPackage: {},
  };

  componentDidMount() {
    this.setState({ storeID: this.props.storeID }, () => {
      this.getCurrentStorePackage();
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !_.isEqual(prevProps.currentStorePackage, this.props.currentStorePackage)
    ) {
      this.setState({ currentStorePackage: this.props.currentStorePackage });
    }
  }

  getCurrentStorePackage = () => {
    this.props.getCurrentStorePackage({
      storeID: this.state.storeID,
    });
  };

  toggleStorePackageModal = () => {
    this.setState({
      displayStorePackageModal: !this.state.displayStorePackageModal,
    });
  };

  isSelectedSubscriptionPackage = (selectedPackage) => {
    let isSelectedSubscriptionPackage = false;
    if (
      selectedPackage.hasOwnProperty("memberPrice") &&
      selectedPackage.memberPrice > 0
    ) {
      isSelectedSubscriptionPackage = true;
    }

    return isSelectedSubscriptionPackage;
  };

  displayConfirmModal = (selectedPackage) => {
    // confirmMessage
    const currentStorePackage = this.state.currentStorePackage;
    const expiryDate = UtilityFunction.convertDate(
      currentStorePackage.expiryDate
    );
    const newActiveDate = UtilityFunction.convertDate(
      currentStorePackage.expiryDate + 24 * 60 * 60 * 1000
    );

    let messageI18n = "";
    let replaceObj = {};
    let isProcessSelectedPackage = null;

    const currentPackageCode = currentStorePackage.packageInfo.code;
    const selectedPackageCode = selectedPackage.code;

    if (currentPackageCode === "000" && selectedPackageCode === "001") {
      messageI18n = "settings.store-package-info.confirm-free-to-beginner";
      isProcessSelectedPackage = true;
    } else if (
      currentPackageCode === "000" &&
      (selectedPackageCode === "002" ||
        selectedPackageCode === "003" ||
        selectedPackageCode === "004")
    ) {
      messageI18n =
        "settings.store-package-info.confirm-free-to-subscription-package";
      isProcessSelectedPackage = true;
    } else if (Number(currentPackageCode) < Number(selectedPackageCode)) {
      messageI18n =
        "settings.store-package-info.confirm-lower-package-to-higher-package";
      isProcessSelectedPackage = true;
    } else {
      if (selectedPackageCode === "001") {
        messageI18n =
          "settings.store-package-info.confirm-higher-package-to-beginner-package";
      } else {
        messageI18n =
          "settings.store-package-info.confirm-higher-package-to-lower-package";
      }
      isProcessSelectedPackage = true;
    }

    replaceObj = {
      currentPackage: currentStorePackage.packageInfo.name,
      newPackage: selectedPackage.name,
      expiryDate: expiryDate,
      newActiveDate: newActiveDate,
      div: "<div>",
      div_mb24: "<div class='mb-24'>",
      end_div: "</div>",
      bold_italic: "<font class='font-extrabold italic'>",
      end_bold_italic: "</font>",
      small_italic: "<font class='text-xs italic'>",
      end_small_italic: "</font>",
      interpolation: { escapeValue: false },
    };

    const message = i18n.t(messageI18n, replaceObj);
    this.setState({
      displayStorePackageModal: false,
      displayConfirmModal: true,
      confirmMessage: message,
      selectedPackage: selectedPackage,
      isProcessSelectedPackage: isProcessSelectedPackage,
    });
  };

  displayCannotChangeModal = () => {
    this.setState(
      {
        displayConfirmModal: false,
        confirmMessage: "",
        displayStorePackageModal: false,
        isProcessSelectedPackage: false,
      },
      () => {
        const currentStorePackage = this.state.currentStorePackage;
        const selectedPackage = this.state.selectedPackage;
        const expiryDate = UtilityFunction.convertDate(
          currentStorePackage.expiryDate - 24 * 60 * 60 * 1000
        );
        const newActiveDate = UtilityFunction.convertDate(
          currentStorePackage.expiryDate
        );

        const messageI18n =
          "settings.store-package-info.can-not-change-package-now";
        const replaceObj = {
          currentPackage: currentStorePackage.packageInfo.name,
          newPackage: selectedPackage.name,
          expiryDate: expiryDate,
          newActiveDate: newActiveDate,
          div: "<div>",
          div_mb24: "<div class='mb-24'>",
          end_div: "</div>",
          bold_italic: "<font class='font-extrabold italic'>",
          end_bold_italic: "</font>",
          interpolation: { escapeValue: false },
        };

        const message = i18n.t(messageI18n, replaceObj);
        this.setState({ displayAlertModal: true, alertMessage: message });
      }
    );
  };

  handleSelectPackageButton = async (selectedPackage) => {
    this.displayConfirmModal(selectedPackage);
  };

  processSelectedPackage = async () => {
    const selectedPackage = this.state.selectedPackage;
    let canChangePackage = false;
    if (this.isSelectedSubscriptionPackage(selectedPackage)) {
      let hasPackagePaymentMethod = await this.hasPackagePaymentMethod();
      if (hasPackagePaymentMethod) {
        canChangePackage = true;
      }
    } else {
      canChangePackage = true;
    }

    if (canChangePackage) {
      const currentStorePackage = this.state.currentStorePackage;
      this.setState(
        { displayStorePackageModal: false, currentStorePackage: {} },
        async () => {
          let saveNewPackage = false;
          let isDowngradePackage = false;
          let activeNewPackageNow = true;
          let alertMessage = i18n.t("error-message.something-went-wrong");

          if (
            currentStorePackage.packageInfo.billingInfo.billingType.length >
              0 &&
            currentStorePackage.packageInfo.billingInfo.billingType === "FIX"
          ) {
            activeNewPackageNow = false;
          } else if (
            currentStorePackage.packageInfo.memberPrice >
            selectedPackage.memberPrice
          ) {
            isDowngradePackage = true;
            activeNewPackageNow = false;
          }

          const resultCalculateStorePackage = await UtilityManager.getInstance().calculateStorePackage(
            selectedPackage,
            currentStorePackage.packageInfo,
            activeNewPackageNow
          );

          let resultInsertRecurring = {};
          if (this.isSelectedSubscriptionPackage(selectedPackage)) {
            const currentCreditCardList = await UtilityManager.getInstance().getCurrentCreditCard(
              this.state.storeID
            );
            const currentCreditCardInfo = currentCreditCardList[0];

            resultInsertRecurring = await UtilityManager.getInstance().insertRecurring(
              currentCreditCardInfo,
              resultCalculateStorePackage.chargePrice,
              selectedPackage,
              isDowngradePackage
            );

            if (resultInsertRecurring.resultStatus === "SUCCESS") {
              saveNewPackage = true;
            } else {
              alertMessage = i18n.t(resultInsertRecurring.errorMessageI18n);
            }
          } else {
            saveNewPackage = true;
          }

          let saveDataFail = true;
          if (saveNewPackage) {
            const createdAt = Date.now();

            const nextStorePackage = await UtilityManager.getInstance().getNextStorePackage(
              this.state.storeID
            );
            if (nextStorePackage.length > 0) {
              for (let i = 0; i < nextStorePackage.length; i++) {
                let processPackage = nextStorePackage[i];
                await UtilityManager.getInstance().inactiveStorePackage(
                  processPackage
                );
              }
            }

            if (activeNewPackageNow) {
              await UtilityManager.getInstance().inactiveStorePackage(
                currentStorePackage
              );
            }

            const resultInsertStorePackage = await UtilityManager.getInstance().insertStorePackage(
              this.state.storeID,
              selectedPackage,
              createdAt,
              resultCalculateStorePackage
            );

            if (
              resultInsertStorePackage.length > 0 &&
              resultInsertStorePackage !== false
            ) {
              if (
                resultInsertRecurring.hasOwnProperty("recurringID") &&
                resultInsertRecurring["recurringID"].length > 0
              ) {
                const newRecurringID = resultInsertRecurring["recurringID"];
                const newStorePackageID = resultInsertStorePackage;
                await UtilityManager.getInstance().updateSectionRecurringInfo(
                  newRecurringID,
                  "STORE_PACKAGE",
                  { storePackageID: newStorePackageID }
                );
              }
              saveDataFail = false;
              if (activeNewPackageNow) {
                alertMessage = i18n.t(
                  "settings.store-package-info.upgrade-package-success-message"
                );
              } else {
                if (isDowngradePackage) {
                  alertMessage = i18n.t(
                    "settings.store-package-info.downgrade-package-success-message"
                  );
                } else {
                  alertMessage = i18n.t(
                    "settings.store-package-info.save-package-success-message"
                  );
                }
              }
            }
          }

          if (saveDataFail) {
            this.setState({
              currentStorePackage: this.props.currentStorePackage,
              alertMessage: alertMessage,
              displayAlertModal: alertMessage.length > 0 ? true : false,
              displayConfirmModal: false,
              confirmMessage: "",
            });
          } else {
            if (activeNewPackageNow) {
              this.setState({
                alertMessage: alertMessage,
                displayAlertModal: alertMessage.length > 0 ? true : false,
                displayConfirmModal: false,
                confirmMessage: "",
              });
              setTimeout(() => {
                this.getCurrentStorePackage({
                  storeID: this.state.storeID,
                });
              }, 3000);
            } else {
              this.setState({
                currentStorePackage: this.props.currentStorePackage,
                alertMessage: alertMessage,
                displayAlertModal: alertMessage.length > 0 ? true : false,
                displayConfirmModal: false,
                confirmMessage: "",
              });
            }
          }
        }
      );
    } else {
      this.toggleStorePackageModal();
      this.props.scrollToPackagePayment();
    }
  };

  hasPackagePaymentMethod = async () => {
    let hasPackagePaymentMethod = false;

    const storeInfo = this.props.businessProfile.storeInfo;
    if (storeInfo.storePackagePaymentInfo.paymentType === "CREDIT_CARD") {
      let currentCreditCardList = await UtilityManager.getInstance().getCurrentCreditCard(
        this.state.storeID
      );
      if (currentCreditCardList.length > 0) {
        hasPackagePaymentMethod = true;
      }
    } else if (storeInfo.storePackagePaymentInfo.paymentType === "BILLING") {
      hasPackagePaymentMethod = true;
    }

    return Promise.resolve(hasPackagePaymentMethod);
  };

  openAlertModal = (message) => {
    this.setState({
      displayConfirmModal: false,
      displayAlertModal: true,
      alertMessage: message,
    });
  };

  toggleAlertModal = () => {
    this.setState({ displayAlertModal: !this.state.displayAlertModal });
  };

  toggleConfirmModal = () => {
    this.setState({ displayConfirmModal: !this.state.displayConfirmModal });
  };

  render() {
    const {
      currentStorePackage,
      displayStorePackageModal,
      displayAlertModal,
      displayConfirmModal,
    } = this.state;
    const { classes } = this.props;

    return currentStorePackage ? (
      currentStorePackage.hasOwnProperty("storePackageID") ? (
        <div className="flex flex-1">
          {displayStorePackageModal ? (
            <StorePackageModal
              handleCancelBtn={this.toggleStorePackageModal}
              currentStorePackage={currentStorePackage}
              handleSelectPackageButton={this.handleSelectPackageButton}
            />
          ) : null}

          {displayAlertModal ? (
            <AlertModal
              alertMessage={this.state.alertMessage}
              handleCancelBtn={this.toggleAlertModal}
            />
          ) : null}

          {displayConfirmModal ? (
            <ConfirmModal
              confirmMessage={this.state.confirmMessage}
              handleAcceptBtn={
                this.state.isProcessSelectedPackage
                  ? this.processSelectedPackage
                  : this.displayCannotChangeModal
              }
              handleCancelBtn={this.toggleConfirmModal}
            />
          ) : null}

          <Card
            className={Classnames(
              "flex flex-1 text-white mx-12 p-8 lg:p-12 lg:mx-0",
              classes.highlightCardBackground
            )}
          >
            <div className="flex flex-1 flex-col">
              <div className="flex flex-row flex-1 justify-between text-xs lg:flex-col">
                <div className="flex flex-row justify-between">
                  <div className="flex font-bold">
                    <Trans i18nKey="settings.store-package-info.my-package">
                      My Package
                    </Trans>
                  </div>
                  <div className="hidden lg:flex">
                    <Tooltip
                      title={
                        <React.Fragment>
                          <p>{`${
                            currentStorePackage.packageInfo.feeInfo.service
                              .feeName
                          }: ${
                            currentStorePackage.packageInfo.feeInfo.service
                              .charge
                          }${
                            currentStorePackage.packageInfo.feeInfo.service
                              .chargeType === "PERCENT"
                              ? "%"
                              : "Baht"
                          }`}</p>
                          <p>{`${
                            currentStorePackage.packageInfo.feeInfo
                              .qrCodeService.feeName
                          }: ${
                            currentStorePackage.packageInfo.feeInfo
                              .qrCodeService.charge
                          }${
                            currentStorePackage.packageInfo.feeInfo
                              .qrCodeService.chargeType === "PERCENT"
                              ? "%"
                              : "Baht"
                          }`}</p>
                          <p>{`${
                            currentStorePackage.packageInfo.feeInfo
                              .creditCardService.feeName
                          }: ${
                            currentStorePackage.packageInfo.feeInfo
                              .creditCardService.charge
                          }${
                            currentStorePackage.packageInfo.feeInfo
                              .creditCardService.chargeType === "PERCENT"
                              ? "%"
                              : "Baht"
                          }`}</p>
                        </React.Fragment>
                      }
                      placement="left-end"
                    >
                      <InfoIcon className="text-xs" />
                    </Tooltip>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex">
                    <Trans i18nKey="settings.store-package-info.expiry-date">
                      Expiry Date
                    </Trans>
                    :{" "}
                    {currentStorePackage.packageInfo.code !== "000" &&
                    currentStorePackage.packageInfo.memberPrice === 0
                      ? "-"
                      : UtilityFunction.convertDate(
                          currentStorePackage.expiryDate
                        )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-1 lg:my-24">
                <div className="font-black text-4xl flex lg:justify-center">{`${
                  currentStorePackage.packageInfo.name
                }`}</div>
                <div className="font-medium text-3xl hidden lg:flex lg:justify-center">{`${
                  currentStorePackage.packageInfo.description.length > 0
                    ? currentStorePackage.packageInfo.description
                    : " "
                }`}</div>
              </div>
              <div className="flex flex-col flex-1 my-12 lg:mb-12 justify-center">
                <div className="flex mx-auto w-1/2">
                  <button
                    className={Classnames(
                      classes.upgradePackagesBtn,
                      "flex flex-1 justify-center py-4"
                    )}
                    onClick={(event) => {
                      this.toggleStorePackageModal();
                    }}
                  >
                    <Trans i18nKey="main.upgrade-btn">Upgrade</Trans>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <div className="flex flex-1 justify-center py-48">
          <CircularProgress className={classes.highlightText} />
        </div>
      )
    ) : (
      <Card
        className={Classnames(
          "flex flex-col flex-1 bg-white mx-12 p-8 lg:p-12 lg:mx-0 items-center"
        )}
      >
        <div className="flex text-red-dark text-center my-4 text-lg">
          <Trans i18nKey="settings.store-package-info.no-package-info">
            Your store has no package or package has already expired. Please
            contact us.
          </Trans>
        </div>
        <div className="text-center text-red-dark text-lg mb-4">
          097-016-6045 / 084-536-0262
        </div>
      </Card>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getCurrentStorePackage: Actions.getCurrentStorePackage,
    },
    dispatch
  );
}

function mapStateToProps({ Settings }) {
  return {
    currentStorePackage: Settings.storePackage.currentStorePackage,
    businessProfile: Settings.businessProfile,
  };
}

export default withReducer("Settings", reducer)(
  withStyles(styles, { withTheme: true })(
    withRouter(
      connect(
        mapStateToProps,
        mapDispatchToProps
      )(withTranslation()(StorePackageCard))
    )
  )
);
