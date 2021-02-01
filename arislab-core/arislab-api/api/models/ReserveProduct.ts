import { AbstractPersistentModel } from "./AbstractPersistentModel";
import { ElasticsearchClient } from "../components/ElasticsearchClient";
import { Log } from "../ts-utils/Log";
import { Parser } from "json2csv";
import * as moment from "moment";
interface CustomerAddressDetail {
  subDistrict: string;
  district: string;
  province: string;
  postalCode: number;
}

interface CustomerTaxInvoiceDetail {
  personType: string;
  businessType: string;
  businessName: string;
  branchName: string;
  branchId: string;
  taxInvoiceNumber: string;
  invoiceAddress: string;
}

export interface CustomerInfo {
  userID: string;
  userInfo: string;
  customerName: string;
  customerEmail: string;
  customerPhoneNo: number;
  customerAddress: string;
  customerAddressDetails: CustomerAddressDetail;
  customerTaxInvoiceDetails: CustomerTaxInvoiceDetail;
  isEnableTaxInvoice: boolean;
  updatedAt: number;
}

export interface Product {
  productNameWithoutColor: string;
  availableQuantity: number;
  enabledReserveProduct: boolean;
  productValue: any;
  productImage: string;
  productID: string;
  productHashtag: string;
  disableAddress: boolean;
  originalQuantity: string;
  productName: string;
  productType: string;
}

export class ReserveProduct extends AbstractPersistentModel {
  public cartID: string;
  public storeID: string;
  public customerInfo: CustomerInfo;
  public productList: Product[];
  public createdAt: number;

  constructor(
    cartID: string,
    storeID: string,
    customerInfo: CustomerInfo,
    products: Product[]
  ) {
    super();
    this.storeID = storeID;
    this.cartID = cartID;
    this.customerInfo = customerInfo;
    this.productList = products;
    this.createdAt = Date.now();
  }

  public doUpdate(json: any): boolean {
    return true;
  }

  public toJSON(): any {
    return {
      cartID: this.cartID,
      storeID: this.storeID,
      customerInfo: this.customerInfo,
      productList: this.productList,
      createdAt: this.createdAt,
    };
  }

  private static readonly TYPE = "reserve_product";
  protected getType(): string {
    return ReserveProduct.TYPE;
  }

  public static getReserveProductsByStoreID(storeID: string) {
    const query = {
      query: {
        match: { "storeID.keyword": storeID },
      },
    };
    return ElasticsearchClient.getInstance().search(ReserveProduct.TYPE, query);
  }

  public static async exportToCsv(storeID: string) {
    try {
      const reserveProducts = await this.getReserveProductsByStoreID(storeID);

      let output = reserveProducts.map((reserveProduct) => {
        const productInfo = reserveProduct._source.productList[0];
        return {
          reserveOrderNumber: reserveProduct._id,
          customerName: reserveProduct._source.customerInfo.customerName,
          customerEmail: reserveProduct._source.customerInfo.customerEmail,
          customerPhoneNumber: `'${reserveProduct._source.customerInfo.customerPhoneNo}'`,
          productHashtag: productInfo.productHashtag,
          productType: productInfo.productType,
          productName: productInfo.productName,
          productSize: productInfo.productValue.size,
          productColor: productInfo.productValue.color,
          productImage: productInfo.productImage,
          sku: productInfo.productValue.sku ? productInfo.productValue.sku : "",
          quantity: productInfo.originalQuantity,
          price: productInfo.productValue.price,
          reserveProductDate: moment(reserveProduct._source.createdAt).format(
            "DD/MM/YYYY HH:mm:ss"
          ),
        };
      });

      let fields = [
        {
          label: "Reserve Order Number",
          value: "reserveOrderNumber",
        },
        {
          label: "Customer Name",
          value: "customerName",
        },
        {
          label: "Customer Email",
          value: "customerEmail",
        },
        {
          label: "Customer Phone Number",
          value: "customerPhoneNumber",
        },
        {
          label: "Product Hashtag",
          value: "productHashtag",
        },
        {
          label: "Product Type",
          value: "productType",
        },
        {
          label: "Product Name",
          value: "productName",
        },
        {
          label: "Product Size",
          value: "productSize",
        },
        {
          label: "Product Color",
          value: "productColor",
        },
        {
          label: "Product Image",
          value: "productImage",
        },
        {
          label: "SKU",
          value: "sku",
        },
        {
          label: "Quantity",
          value: "quantity",
        },
        {
          label: "Price",
          value: "price",
        },
        {
          label: "Reserve Product Date",
          value: "reserveProductDate",
        },
      ];

      let json2csvParser = new Parser({ fields });
      let csv = json2csvParser.parse(output);

      return csv;
    } catch (error) {
      Log.error("Error while exporting reserve producy to csv with: ", error);
      throw error;
    }
  }
}
