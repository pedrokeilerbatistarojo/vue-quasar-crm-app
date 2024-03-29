export default {
  isTelephoneOrCounterSale: (clientId) => {
    const env = import.meta.env;
    const telephoneSaleClientId = env.VITE_TELEPHONE_SALE_CLIENT_ID;
    const counterSaleClientId = env.VITE_COUNTER_SALE_CLIENT_ID;

    return clientId == telephoneSaleClientId || clientId == counterSaleClientId;
  }
}
