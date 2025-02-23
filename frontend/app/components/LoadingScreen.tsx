// components/LoadingScreen.tsx
export default function LoadingScreen() {
    return (
      <div className="flex flex-col justify-center items-center w-full h-screen bg-[#ECFCF8]">
        <div className="flex space-x-2">
          <div className="w-12 h-12 bg-[#9277CC] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-12 h-12 bg-[#9277CC] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-12 h-12 bg-[#9277CC] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="mt-4 text-6xl font-openSans font-thin text-gray-700">Loading Charts...</p>
      </div>
    );
  }
  