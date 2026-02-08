export function MainContainer({ children }) {
  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  );
}

export function TwoColumnLayout({ left, right }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {left}
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {right}
      </div>
    </div>
  );
}
