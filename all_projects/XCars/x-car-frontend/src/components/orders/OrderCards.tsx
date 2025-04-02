import { routes } from '@/config/routes';
import Link from 'next/link';

export default function OrderCards({
  id,
  status,
  amount,
}: {
  id: string;
  amount: number;
  status: string;
}) {
  return (
    <Link
      href={routes.account.children.orders.build(id)}
      className="w-full flex justify-between items-center bg-gray-200 rounded-md p-4 bg-opacity-75"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span>Order Id:</span>
          <span className="font-semibold text-gray-700 text-sm">{id}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Amount: </span>
          <span className="font-semibold text-gray-700 text-sm">
            ₹ {amount}/-
          </span>
        </div>
      </div>
      <div className="font-semibold text-gray-700 text-sm">{status}</div>
    </Link>
  );
}
