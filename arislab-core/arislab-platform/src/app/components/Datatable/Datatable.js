import React from "react";
import PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import MaterialTable, { MTableToolbar } from "material-table";

const styles = {
  container: {
    boxShadow: "0 0 0 0",
  },
  boxToolbar: {
    padding: "0px !important",
  },
  toolbar: {
    padding: "0px !important",
  },
};

const Datatable = (props) => {
  const tableRef = React.createRef();
  const {
    classes,
    title,
    columns,
    data,
    usageRefreshData = false,
    usageRemoteData = false,
    remoteDataSetting,
    onSelectionChange,
    actionProps = [],
    optionProps = {},
    loading = true,
  } = props;

  const remoteData = (query) => {
    return new Promise((resolve, reject) => {
      const { url } = remoteDataSetting;

      let _url = `${url}?`;
      _url += `per_page=${query.pageSize}`;
      _url += `&page=${query.page + 1}`;
      _url += `&search=${query.search ? query.search : ""}`;
      _url += `&order_by=${query.orderBy ? query.orderBy.field : ""}`;
      _url += `&order_direction=${query.orderDirection}`;

      fetch(_url)
        .then((response) => response.json())
        .then((result) => {
          resolve({
            data: result.data,
            page: result.page - 1,
            totalCount: result.total,
          });
        });
    });
  };

  const setActions = () => {
    const _actions = [...actionProps];

    if (usageRefreshData) {
      _actions.push({
        icon: "refresh",
        isFreeAction: true,
        onClick: () => tableRef.current && tableRef.current.onQueryChange(),
      });
    }

    return _actions;
  };

  return (
    <MaterialTable
      title={title}
      tableRef={tableRef}
      columns={columns}
      isLoading={loading}
      data={usageRemoteData ? remoteData : data}
      actions={[...setActions()]}
      onSelectionChange={onSelectionChange}
      options={{
        showTextRowsSelected: false,
        ...optionProps,
      }}
      components={{
        Container: (props) => (
          <Paper {...props} classes={{ root: classes.container }} />
        ),
        Toolbar: (props) => (
          <div classes={classes.boxToolbar}>
            <MTableToolbar {...props} classes={{ root: classes.toolbar }} />
          </div>
        ),
      }}
    />
  );
};

Datatable.propTypes = {
  title: PropTypes.string,
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  usageRefreshData: PropTypes.bool,
  usageRemoteData: PropTypes.bool,
  remoteDataSetting: PropTypes.object,
  onSelectionChange: PropTypes.func,
  actionProps: PropTypes.array,
  optionProps: PropTypes.object,
};

export default withStyles(styles)(Datatable);
