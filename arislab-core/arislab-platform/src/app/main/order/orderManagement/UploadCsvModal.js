import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Trans, withTranslation } from "react-i18next";
import i18n from "../../../i18n";
import axios from "axios";
import { Dialog, IconButton } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import UtilityFunction from "../../../main/modules/UtilityFunction";
import CloseIcon from "@material-ui/icons/Close";
import LinearProgress from "@material-ui/core/LinearProgress";

import CSVReader from "react-csv-reader";
import styles from "../styles/styles";

class UploadCsvModal extends Component {
  state = {
    loading: {
      completedTask: 0,
      task: 0,
      percent: 0,
    },
    isUploaded: false,
  };

  handleUpload = async (data, fileInfo) => {
    var loading = {
      ...this.state.loading,
      task: data.length,
    };
    this.setState({ isUploaded: true, loading: loading });

    for (let el of data) {
      if (el.hasOwnProperty("isTrackingSent")) {
        if (el.isTrackingSent === "No") {
          await axios
            .post("/api/order/send/tracking", el)
            .then((res) => {
              if (res.status === 200) {
                loading.completedTask++;
                loading.percent = (loading.completedTask / loading.task) * 100;
                this.setState({ loading: loading });
              } else {
                this.setState({
                  error: `${res.data} ${i18n.t("orders.send-tracking-error")}`,
                });
              }
            })
            .catch((error) => console.log(error));
        } else {
          loading.completedTask++;
          loading.percent = (loading.completedTask / loading.task) * 100;
          this.setState({ loading: loading });
        }
      }

      if (this.state.error) {
        return;
      }
    }
  };

  renderUploadSection = () => {
    const { loading, isUploaded, error } = this.state;
    const papaparseOptions = {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    };

    if (error) {
      return <div className="flex flex-glow justify-center my-12">{error}</div>;
    } else if (isUploaded) {
      return (
        <div className="order-progress-container">
          <LinearProgress variant="determinate" value={loading.percent} />
          <div className="progress-label">
            <Trans i18nKey="orders.sent">ส่งแล้ว</Trans> {loading.completedTask}{" "}
            / <Trans i18nKey="orders.total">ทั้งหมด</Trans> {loading.task}{" "}
            {loading.percent === 100 ? (
              <CheckCircleIcon className="ml-4 text-green" />
            ) : (
              <React.Fragment />
            )}
          </div>
        </div>
      );
    } else {
      return (
        <CSVReader
          cssClass="csv-reader flex flex-col items-center mt-16 justify-center"
          label={i18n.t("orders.select-csv-file")}
          onFileLoaded={this.handleUpload}
          parserOptions={papaparseOptions}
        />
      );
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Dialog
        fullWidth={this.props.fullWidth}
        fullScreen={UtilityFunction.useMediaQuery("(max-width: 767px)")}
        maxWidth="sm"
        open={this.props.open}
        className={classes.dialog}
      >
        <div className="modal-header">
          <h2>
            <Trans i18nKey="orders.upload-title">
              อัพโหลดไฟล์เพื่อส่งหมายเลขพัสดุ
            </Trans>
          </h2>
        </div>

        <div className="absolute right pin-t pin-r">
          <IconButton
            aria-label="Close"
            onClick={() => {
              this.props.toggleDialog(this.props.dialogName);
            }}
          >
            <CloseIcon fontSize="default" />
          </IconButton>
        </div>

        <div className="upload-modal-content flex flex-grow justify-center">
          {this.renderUploadSection()}
          <div className="flex flex-col mt-12">
            <div className="flex-grow">
              {i18n.language === "en" ? (
                <React.Fragment>
                  <h3>
                    <span role="img" aria-label="book">
                      📙
                    </span>{" "}
                    How to use
                  </h3>
                  <div>
                    1. Download csv file by clicking "Download file" button on
                    order page for using it as a templete to upload
                  </div>
                  <div>2. Edit the file</div>
                  <div>
                    - shippingMethod column is shipping company you use to send
                    product (Edit as format below{" "}
                  </div>
                  <div className="ml-32 mt-4 mb-4">
                    <div> EMS Thaipost - EMS</div>
                    <div> Kerry Express - KERRY</div>
                    <div> J&amp;T Express - J&amp;T</div>
                    <div> Ninja van - NINJA</div>
                    <div> Flash Express - FLASH</div>
                    <div> Alpha fast - ALPHA</div>
                    <div> DHL - DHL</div>
                    <div> BEST Express - BEST</div>
                    <div> SCG Express - SCG</div>
                  </div>
                  <div> )</div>
                  <div>
                    - trackingNumber column is tracking number of your product
                    (Edit)
                  </div>
                  <div>
                    - isTrackingSent column is telling you whether tracking
                    number was sent to your customer or not (Don't edit)
                  </div>
                  <div>
                    3. When you finish editing. Upload the same file you
                    download and wait for the progress to finish.
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <h3>
                    <span role="img" aria-label="book">
                      📙
                    </span>{" "}
                    วิธีการใช้งาน
                  </h3>
                  <div>
                    1. ดาวน์โหลดไฟล์ csv โดยการกดปุ่ม "ดาวน์โหลดไฟล์" ในหน้า
                    "รายการสั่งซื้อ" เพื่อใช้ไฟล์ที่ได้เป็นเทมเพลตในการอัพโหลด
                  </div>
                  <div>2. แก้ไขไฟล์ csv โดยมีรายละเอียดที่ควรทราบคือ</div>
                  <div>
                    - คอลัมน์ shippingMethod คือบริษัทขนส่ง (แก้ไขตาม format
                    ดังต่อไปนี้{" "}
                  </div>
                  <div className="ml-32 mt-4 mb-4">
                    <div> กรณีจัดส่งด้วย EMS Thaipost ให้แก้ไขเป็น EMS</div>
                    <div> กรณีจัดส่งด้วย Kerry Express ให้แก้ไขเป็น KERRY</div>
                    <div>
                      {" "}
                      กรณีจัดส่งด้วย J&amp;T Express ให้แก้ไขเป็น J&amp;T
                    </div>
                    <div> กรณีจัดส่งด้วย Ninja van ให้แก้ไขเป็น NINJA</div>
                    <div> กรณีจัดส่งด้วย Flash Express ให้แก้ไขเป็น FLASH</div>
                    <div> กรณีจัดส่งด้วย Alpha fast ให้แก้ไขเป็น ALPHA</div>
                    <div> กรณีจัดส่งด้วย DHL ให้แก้ไขเป็น DHL</div>
                    <div> กรณีจัดส่งด้วย Best Express ให้แก้ไขเป็น BEST</div>
                    <div> กรณีจัดส่งด้วย SCG Express ให้แก้ไขเป็น SCG</div>
                  </div>
                  <div> )</div>
                  <div>
                    - คอลัมน์ trackingNumber คือเลขพัสดุ (แก้ไขตามต้องการ)
                  </div>
                  <div>
                    - คอลัมน์ isTrackingSent
                    คือคอลัมน์ที่ระบุว่าเลขพัสดุได้ถูกส่งไปยังลูกค้าหรือยัง
                    (ไม่ต้องแก้ไข)
                  </div>
                  <div>
                    3. เมื่อแก้ไขแล้ว ให้อัพโหลดไฟล์ที่แก้ไขนั้นขึ้นมา
                    และรอจนเสร็จ
                  </div>
                </React.Fragment>
              )}
            </div>
            <div className="flex-grow mt-12 mb-16">
              {i18n.language === "en" ? (
                <React.Fragment>
                  <h3>
                    <span role="img" aria-label="notes">
                      💡
                    </span>{" "}
                    Notes
                  </h3>
                  <div>
                    - System will check before sending tracking number whether
                    it has been sent or not. If it has already been sent, system
                    will not send that tracking number again.
                  </div>
                  <div>
                    - Incomplete uploading progress may be caused by your
                    internet conection or other factors. You can try to reupload
                    the file again without worrying about tracking number will
                    be sent again.
                  </div>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <h3>
                    <span role="img" aria-label="notes">
                      💡
                    </span>{" "}
                    หมายเหตุ
                  </h3>
                  <div>
                    -
                    ระบบจะมีการเช็คก่อนส่งว่าลูกค้าของคุณได้รับเลขพัสดุแล้วหรือยัง
                    ถ้าส่งแล้ว ระบบจะไม่ส่งซ้ำ
                  </div>
                  <div>
                    - ถ้าอัพโหลดไม่สำเร็จ
                    อาจเกิดจากอินเตอร์เน็ตของคุณหรือสาเหตุอื่น
                    สามารถลองอัพโหลดใหม่ได้เลย เพราะระบบจะไม่ส่งซ้ำ
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default withTranslation()(
  withStyles(styles, { withTheme: true })(UploadCsvModal)
);
