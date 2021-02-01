import React from "react";
import LabelItem from "./LabelItem";

class Label extends React.PureComponent {
  render() {
    const { info, orders } = this.props;
    return (
      <div>
        {orders &&
          orders.map((order) => <LabelItem info={info} order={order} />)}
      </div>
    );
  }
}
export default Label;
