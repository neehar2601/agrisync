// Helper function to format numbers as Indian Rupees
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Helper function for date formatting
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Helper function to format numbers with commas
export const formatNumber = (number) => {
  if (number === null || number === undefined) {
    return '0';
  }
  return new Intl.NumberFormat('en-IN').format(number);
};

export const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'];
