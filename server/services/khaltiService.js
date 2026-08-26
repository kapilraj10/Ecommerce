const axios = require("axios");

class KhaltiService {
  constructor() {
    this.baseURL = process.env.KHALTI_BASE_URL || "https://dev.khalti.com/api/v2";
    this.secretKey = process.env.KHALTI_SECRET_KEY;
    this.returnURL = process.env.KHALTI_RETURN_URL;
    this.websiteURL = process.env.WEBSITE_URL;
  }

  async initiatePayment({ amount, orderId, orderName, customerInfo }) {
    try {
      const response = await axios.post(
        `${this.baseURL}/epayment/initiate/`,
        {
          return_url: this.returnURL,
          website_url: this.websiteURL,
          amount: amount,
          purchase_order_id: orderId,
          purchase_order_name: orderName,
          customer_info: {
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone,
          },
        },
        {
          headers: {
            Authorization: `Key ${this.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        pidx: response.data.pidx,
        payment_url: response.data.payment_url,
      };
    } catch (error) {
      const message = error.response?.data?.detail || error.message;
      return { success: false, message };
    }
  }

  async verifyPayment(pidx) {
    try {
      const response = await axios.post(
        `${this.baseURL}/epayment/initiate/`,
        { pidx },
        {
          headers: {
            Authorization: `Key ${this.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        status: response.data.status,
        transaction_id: response.data.transaction_id,
        amount: response.data.amount,
      };
    } catch (error) {
      const message = error.response?.data?.detail || error.message;
      return { success: false, message };
    }
  }
}

module.exports = new KhaltiService();
