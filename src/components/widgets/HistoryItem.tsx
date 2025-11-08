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
    <div className="flex flex-col justify-between gap-2 rounded-sm border border-gray-200 p-4 sm:flex sm:flex-row sm:items-center sm:p-6">
      <div className="min-w-0 flex-1">
        <p className={`font-semibold ${amountColor}`}>
          {amountSign} Rp{item.total_amount.toLocaleString("id-ID")}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">
          {dateDisplay} | {timeDisplay}
        </p>
      </div>
      <div className="text-left sm:text-right">
        <p className="text-sm font-medium text-gray-700">{item.description}</p>
      </div>
    </div>
  );
}
