export const formatPrice = (price) => {
  return `Rs. ${Number(price).toLocaleString('en-NP')}`;
};

export const getStatusColor = (status) => {
  const colors = {
    Pending: 'text-yellow-600 bg-yellow-100',
    Processing: 'text-blue-600 bg-blue-100',
    Shipped: 'text-purple-600 bg-purple-100',
    Delivered: 'text-green-600 bg-green-100',
    Cancelled: 'text-red-600 bg-red-100',
    Paid: 'text-green-600 bg-green-100',
    Failed: 'text-red-600 bg-red-100',
    Refunded: 'text-gray-600 bg-gray-100',
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
