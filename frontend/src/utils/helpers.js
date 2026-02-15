/**
 * Format date to readable string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date and time to readable string
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get status badge class based on status
 */
export const getStatusBadgeClass = (status) => {
  const statusMap = {
    UPLOADED: 'status-uploaded',
    PROCESSING: 'status-processing',
    COMPLETED: 'status-completed',
  };
  return statusMap[status] || '';
};

/**
 * Format status text for display
 */
export const formatStatus = (status) => {
  return status?.toLowerCase().replace('_', ' ') || status;
};
