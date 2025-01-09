import { computed } from 'vue';

import {
  useBookingsStore,
  useExchangeBillsStore,
  useExchangePurchasesStore,
  useExchangeRevenuesStore,
  useExchangeTransactionsStore,
  useUserFeatures,
} from '@/stores';
import { AppUser, ExchangeInvestors, InvestorDetails } from '@/types';

const round2Decimals = (num: number) => Math.round(num * 100) / 100;

const useExchangeInvestorTotals = () => {
  const billsStore = useExchangeBillsStore();
  const purchasesStore = useExchangePurchasesStore();
  const revenuesStore = useExchangeRevenuesStore();
  const transactionsStore = useExchangeTransactionsStore();
  const bookingsStore = useBookingsStore();
  const userFeatures = useUserFeatures();

  const exchangeUserIds = computed(() => {
    return userFeatures.exchangeUsers.map((usr) => usr.userId);
  });

  const investTotals = computed(() => {
    const consumerIds: number[] = [];
    const consumers: { [key: string]: InvestorDetails } = {};
    let totalPrice = 0;

    // if (!purchasesStore.purchases) return null;

    const putPriceOnConsumer = (id: AppUser['userId'], price: number) => {
      const isBuyerFirstTime =
        consumerIds.length === 0 || !consumerIds.includes(id);

      if (isBuyerFirstTime) {
        consumerIds.push(id);
        consumers[id] = {
          balance: 0,
          consumerId: id,
          spent: price,
        };
      } else {
        consumers[id].spent += price;
      }
    };

    /** Purchases */
    purchasesStore.purchases.forEach((item) => {
      if (item.purchaser === ExchangeInvestors.SELECT_ALL) {
        exchangeUserIds.value.forEach((usrId) => {
          const price = +item.price / 2;
          putPriceOnConsumer(usrId, price);
        });
      } else {
        putPriceOnConsumer(item.purchaser, +item.price);
      }
    });

    /** Transactions */
    // Transactions are not add to total Expenses, there are only affects between investors balances
    transactionsStore.transactions.forEach((trans) => {
      const transactionPrice = +trans.price;
      let consumerId;
      // new person declaration
      if (!consumerIds.includes(trans.senderId)) {
        consumerId = trans.senderId;
      }
      if (!consumerIds.includes(trans.receiverId)) {
        consumerId = trans.receiverId;
      }
      if (consumerId) {
        consumerIds.push(consumerId);
        consumers[consumerId] = {
          balance: 0,
          consumerId: consumerId,
          spent: 0,
        };
      }

      const isTransBetweenInvestors =
        exchangeUserIds.value.includes(trans.senderId) &&
        exchangeUserIds.value.includes(trans.receiverId);

      if (isTransBetweenInvestors) {
        consumers[trans.senderId].spent += transactionPrice;
        consumers[trans.receiverId].spent -= transactionPrice;
      } else {
        consumers[trans.senderId].spent += transactionPrice;

        // If sender is not an exchange user then add the money to the receiver as spent
        if (!exchangeUserIds.value.includes(trans.senderId)) {
          consumers[trans.receiverId].spent += transactionPrice;
        }
        if (!exchangeUserIds.value.includes(trans.receiverId)) {
          consumers[trans.receiverId].spent -= transactionPrice;
        }
      }
    });

    /** Monthly Bills */
    billsStore.bills.forEach((bill) => {
      if (bill.payer === ExchangeInvestors.SELECT_ALL) {
        exchangeUserIds.value.forEach((id) => {
          const price = +bill.price / 2;
          putPriceOnConsumer(id, price);
        });
      } else {
        putPriceOnConsumer(bill.payer, +bill.price);
      }
    });

    /** Revenue */
    const sellIncome = revenuesStore.revenue.reduce((acc, currentRevenue) => {
      acc += currentRevenue?.price ? +currentRevenue.price : 0;
      return acc;
    }, 0);

    const bookingsIncome = bookingsStore.bookings.reduce((acc, currentBook) => {
      if (currentBook.is_booking_closed) {
        acc += currentBook?.price ? +currentBook.price : 0;
      }
      return round2Decimals(acc);
    }, 0);

    // Total price
    Object.values(consumers).forEach((consumer) => {
      totalPrice += round2Decimals(consumer.spent);
    });

    // adjust Balance
    const balancePrice = round2Decimals(
      totalPrice / exchangeUserIds.value.length
    );

    const investors: InvestorDetails[] = [];
    Object.values(consumers).forEach((consumer) => {
      const investorDetails = { ...consumer };

      if (exchangeUserIds.value.includes(consumer.consumerId)) {
        investorDetails.balance = round2Decimals(consumer.spent - balancePrice);
        investorDetails.income =
          (sellIncome + bookingsIncome) / exchangeUserIds.value.length;
      } else {
        investorDetails.balance = round2Decimals(consumer.spent);
      }

      investors.push(investorDetails);
    });

    return {
      investors: investors.map((inv) => {
        const consumerName =
          userFeatures.appUsers.find((user) => user.userId === inv.consumerId)
            ?.first_name || '';

        return { ...inv, consumerName };
      }),
      summary: (+totalPrice).toFixed(2),
    };
  });

  return { investTotals };
};

export default useExchangeInvestorTotals;
