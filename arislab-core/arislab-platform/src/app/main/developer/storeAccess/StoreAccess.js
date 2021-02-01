import React, { useState, useEffect } from "react";
import { FusePageSimple } from "@fuse";
import { Tab, Tabs, Card } from "@material-ui/core";
import StoreManagement from "./StoreManagement";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import * as Actions from "app/main/setting/store/actions";
import * as AppConfig from "../../config/AppConfig";

import Loading from "app/components/Loading";

const WEB_URL = AppConfig.WEB_URL;

const StoreAccess = (props) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const tabDataList = [
    {
      tabName: "Store Management",
      tabHash: "storeManagement",
      tabContent: <StoreManagement />,
    },
  ];

  useEffect(() => {
    if (props.businessProfile && !props.businessProfile.isDeveloperStore) {
      window.location.href = WEB_URL;
    } else if (
      props.businessProfile &&
      props.businessProfile.isDeveloperStore
    ) {
      setLoading(false);
    }
  }, [props.businessProfile]);

  const handleChangeTab = (event, newIndex) => {
    setTabValue(newIndex);
  };

  return (
    <>
      {loading ? (
        <div className="text-center p-20">
          <Loading />
        </div>
      ) : (
        <FusePageSimple
          classes={{}}
          content={
            <div className="my-32 lg:px-16">
              <div className="py-16 px-36 bg-white rounded-lg shadow-md">
                <div className="flex flex-col">
                  <div
                    classsName="mx-4 font-extrabold"
                    style={{ fontSize: "32px" }}
                  >
                    Developer Tools
                  </div>
                  <Card className="p-0 my-20">
                    <Tabs
                      value={tabValue}
                      onChange={handleChangeTab}
                      indicatorColor="primary"
                      textColor="primary"
                      className="flex flex-auto"
                      align="center"
                    >
                      {tabDataList.map((item, index) => {
                        return (
                          <Tab
                            className="h-64 normal-case"
                            label={item.tabName}
                            key={item.tabName}
                          />
                        );
                      })}
                    </Tabs>
                  </Card>
                  <div className="flex flex-row">
                    <div className="flex-1">
                      {tabValue >= 0 ? tabDataList[tabValue].tabContent : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      )}
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getBusinessProfile: Actions.getBusinessProfile,
    },
    dispatch
  );
};

const mapStateToProps = ({ storeManagement }) => {
  return {
    businessProfile: storeManagement.businessProfile,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoreAccess);
