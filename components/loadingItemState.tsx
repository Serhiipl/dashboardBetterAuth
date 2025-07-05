// Компонент завантаження
const LoadingState: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="bg-white rounded-lg shadow-md p-4 animate-pulse"
      >
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
        <div className="flex justify-between mb-3">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    ))}
  </div>
);
export default LoadingState;
