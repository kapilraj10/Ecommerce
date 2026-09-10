import { FiCheck, FiClock, FiPackage, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const steps = [
  { key: 'Pending', icon: FiClock, label: 'Pending' },
  { key: 'Processing', icon: FiPackage, label: 'Processing' },
  { key: 'Shipped', icon: FiTruck, label: 'Shipped' },
  { key: 'Delivered', icon: FiCheckCircle, label: 'Delivered' },
];

const statusOrder = { Pending: 0, Processing: 1, Shipped: 2, Delivered: 3, Cancelled: 4 };

const OrderTimeline = ({ currentStatus }) => {
  const currentIdx = statusOrder[currentStatus] ?? 0;
  const isCancelled = currentStatus === 'Cancelled';

  if (isCancelled) {
    return (
      <div className="flex items-center gap-3 py-5">
        <div className="bg-red-50 p-2 rounded-full">
          <FiXCircle className="h-5 w-5 text-red-500" />
        </div>
        <div>
          <p className="font-medium text-red-600">Order Cancelled</p>
          <p className="text-xs text-gray-500">This order has been cancelled</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between py-5 overflow-x-auto">
      {steps.map((step, idx) => {
        const isActive = idx <= currentIdx;
        const isCurrent = idx === currentIdx;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex-1 flex flex-col items-center relative min-w-[70px]">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isActive ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
            } ${isCurrent ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}>
              {isActive && idx < currentIdx ? <FiCheck className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
            </div>
            <span className={`text-xs mt-2 font-medium ${isActive ? 'text-green-600' : 'text-gray-400'}`}>{step.label}</span>
            {idx < steps.length - 1 && (
              <div className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 ${idx < currentIdx ? 'bg-green-200' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;