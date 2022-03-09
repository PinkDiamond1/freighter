import React, { useState } from "react";
import { useSelector } from "react-redux";

import {
  ActionStatus,
  transactionSubmissionSelector,
} from "popup/ducks/internalTransaction";
import { PopupWrapper } from "popup/basics/PopupWrapper";

import { SubmitFail, SubmitPending, SubmitSuccess } from "./SubmitResult";
import { TransactionDetails } from "./TransactionDetails";

import "../styles.scss";

export const SendConfirm = ({
  publicKey,
  amount,
  asset,
  destination,
  transactionFee,
  memo,
}: {
  publicKey: string;
  amount: string;
  asset: string;
  destination: string;
  transactionFee: string;
  memo: string;
}) => {
  const submission = useSelector(transactionSubmissionSelector);
  const [isSendComplete, setIsSendComplete] = useState(false);

  const render = () => {
    const transactionDetailsProps = {
      publicKey,
      amount,
      asset,
      destination,
      transactionFee,
      memo,
      isSendComplete,
    };

    if (isSendComplete) {
      return <TransactionDetails {...transactionDetailsProps} />;
    }
    switch (submission.status) {
      case ActionStatus.IDLE:
        return <TransactionDetails {...transactionDetailsProps} />;
      case ActionStatus.PENDING:
        return <SubmitPending />;
      case ActionStatus.SUCCESS:
        return (
          <SubmitSuccess
            amount={amount}
            asset={asset}
            destination={destination}
            viewDetails={() => setIsSendComplete(true)}
          />
        );
      case ActionStatus.ERROR:
        return <SubmitFail destination={destination} />;
      default:
        return <TransactionDetails {...transactionDetailsProps} />;
    }
  };

  return <PopupWrapper>{render()}</PopupWrapper>;
};