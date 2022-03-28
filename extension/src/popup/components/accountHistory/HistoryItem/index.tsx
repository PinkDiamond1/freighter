import React from "react";
import { camelCase } from "lodash";
import { Icon } from "@stellar/design-system";
import { BigNumber } from "bignumber.js";

import { OPERATION_TYPES } from "constants/transaction";
import { METRIC_NAMES } from "popup/constants/metricsNames";

import { emitMetric } from "helpers/metrics";

import { HorizonOperation } from "@shared/api/types";

import { TransactionDetailProps } from "../TransactionDetail";
import "./styles.scss";

export type HistoryItemOperation = HorizonOperation & { isPayment?: boolean };

interface HistoryItemProps {
  operation: HistoryItemOperation;
  publicKey: string;
  url: string;
  setDetailViewProps: (props: TransactionDetailProps) => void;
  setIsDetailViewShowing: (isDetailViewShowing: boolean) => void;
}

export const HistoryItem = ({
  operation,
  publicKey,
  url,
  setDetailViewProps,
  setIsDetailViewShowing,
}: HistoryItemProps) => {
  const {
    amount,
    asset_code: assetCode,
    created_at: createdAt,
    id,
    to,
    type,
    transaction_attr: { operation_count: operationCount },
    isPayment,
  } = operation;

  const operationType = camelCase(type) as keyof typeof OPERATION_TYPES;
  const operationString = OPERATION_TYPES[operationType];
  const date = new Date(Date.parse(createdAt))
    .toDateString()
    .split(" ")
    .slice(1, 3)
    .join(" ");
  const operationAssetCode = assetCode || "XLM";

  let isRecipient = false;
  let paymentDifference = "";
  let IconComponent = <Icon.Shuffle className="HistoryItem__icon--default" />;
  let PaymentComponent = null as React.ReactElement | null;

  if (isPayment) {
    isRecipient = to === publicKey;
    paymentDifference = isRecipient ? "+" : "-";
    PaymentComponent = (
      <>
        {paymentDifference}
        {new BigNumber(amount).toFixed(2).toString()} {operationAssetCode}
      </>
    );
    IconComponent = isRecipient ? (
      <Icon.ArrowDown className="HistoryItem__icon--received" />
    ) : (
      <Icon.ArrowUp className="HistoryItem__icon--sent" />
    );
  }

  const renderPaymentComponent = () => PaymentComponent;
  const renderIcon = () => IconComponent;
  const recipientLabel = isRecipient ? "Received" : "Sent";

  return (
    <div
      className="HistoryItem"
      onClick={() => {
        emitMetric(METRIC_NAMES.historyOpenItem);
        setDetailViewProps({
          operation,
          isRecipient,
          headerTitle: isPayment
            ? `${recipientLabel} ${operationAssetCode}`
            : operationString,
          operationText: isPayment
            ? `${paymentDifference}${amount} ${operationAssetCode}`
            : operationString,
          externalUrl: `${url}/op/${id}`,
          setIsDetailViewShowing,
        });
        setIsDetailViewShowing(true);
      }}
    >
      <div className="HistoryItem__row">
        <div className="HistoryItem__icon">{renderIcon()}</div>
        <div className="HistoryItem__operation">
          {isPayment ? operationAssetCode : operationString}
          {operationCount > 1 && !isPayment
            ? ` + ${operationCount - 1} ops`
            : null}
          <div className="HistoryItem__date">
            {recipientLabel} • {date}
          </div>
        </div>

        <div>{renderPaymentComponent()}</div>
      </div>
    </div>
  );
};