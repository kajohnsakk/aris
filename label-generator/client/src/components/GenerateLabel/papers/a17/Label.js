import React from "react";
import LabelItem from "./LabelItem";
import "./label.css";

const styles = {
  paperSize: {
    // height: "831.496062992px",
    width: "585.82677165422px",
  },
};

class Label extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      loading: true,
      paperOrders: [],
    };
  }
  componentDidMount() {
    const { orders } = this.props;
    const paperOrders = this.splintPaper(orders);

    this.setState({ paperOrders });
    this.setState({ loading: false });
  }

  splintPaper = (orders) => {
    let tmpOrders = [];
    let splintCount = 0;

    orders &&
      orders.map((order, key) => {
        let index = key + 1;
        if (index % 4 !== 0) {
          if (!tmpOrders[splintCount]) {
            tmpOrders[splintCount] = [order];
          } else {
            tmpOrders[splintCount].push(order);
          }
        } else {
          tmpOrders[splintCount].push(order);
          splintCount++;
        }
      });

    return tmpOrders;
  };

  render() {
    const { paperOrders, loading } = this.state;
    const { info } = this.props;

    return (
      <div style={styles.paperSize}>
        {!loading &&
          paperOrders &&
          paperOrders.map((orders, key) => (
            <div key={key}>
              <div style={styles.paperSize} className="grid grid-cols-2 gap-1">
                {orders &&
                  orders.map((order, orderKey) => (
                    <LabelItem orderKey={orderKey} info={info} order={order} />
                  ))}
              </div>
              <div className="page-break" />
            </div>
          ))}
      </div>
    );
  }
}
export default Label;
