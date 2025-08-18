const ErrorMessage = ({ message }) => (
  <div className="text-center p-8 bg-red-100 text-red-700 border border-red-300 rounded-lg">
    <p className="font-semibold">Error:</p>
    <p>{message}</p>
    <p className="mt-2 text-sm">Please ensure all backend services and the API Gateway are running.</p>
  </div>
);

export default ErrorMessage;
