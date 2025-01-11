/**
 * Tracks and logs API errors for monitoring
 */
interface ErrorLog {
  timestamp: string;
  error: string;
  endpoint: string;
  details?: any;
}

const errorLogs: ErrorLog[] = [];

export const trackError = (error: Error, endpoint: string, details?: any) => {
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    error: error.message,
    endpoint,
    details,
  };

  errorLogs.push(errorLog);
  console.error('API Error:', errorLog);

  // In a production environment, you would send this to a monitoring service
  if (process.env.NODE_ENV === 'production') {
    // TODO: Send to monitoring service
  }
};

export const getErrorLogs = () => errorLogs;