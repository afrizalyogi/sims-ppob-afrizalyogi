interface HistoryTransaction {
  invoice_number: string;
  transaction_type: "TOPUP" | "PAYMENT";
  description: string;
  total_amount: number;
  created_on: string;
}

interface HistoryItemProps {
  item: HistoryTransaction;
}

export default function HistoryItem({ item }: HistoryItemProps) {
  const isTopUp = item.transaction_type === "TOPUP";
  const amountSign = isTopUp ? "+" : "-";
  const amountColor = isTopUp ? "text-green-600" : "text-red-600";

  const date = new Date(item.created_on);
  const dateDisplay = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeDisplay = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-3 last:border-b-0">
      {" "}
      <div className="min-w-0 flex-1">
        {" "}
        <p className={`font-semibold ${amountColor}`}>
          {amountSign} Rp{item.total_amount.toLocaleString("id-ID")}{" "}
        </p>{" "}
        <p className="mt-0.5 text-xs text-gray-500">
          {dateDisplay} | {timeDisplay}{" "}
        </p>{" "}
      </div>{" "}
      <div className="text-right">
        {" "}
        <p className="text-sm font-medium text-gray-700">
          {item.description}
        </p>{" "}
        <span
          className={`mt-0.5 inline-block rounded-md px-2 py-0.5 text-xs ${
            isTopUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {item.transaction_type}{" "}
        </span>{" "}
      </div>{" "}
    </div>
  );
}
