import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createAvatarFromConfig, avatarConfigs } from './avatarConfig';

export default function Conversation() {
  const router = useRouter();
  const [demographicData, setDemographicData] = useState(null);

  const supportAgentConfig = 'whiteFemale' as keyof typeof avatarConfigs;
  const customerConfig = 'blackMale' as keyof typeof avatarConfigs;

  const supportAgentAvatar = createAvatarFromConfig(supportAgentConfig);
  const customerAvatar = createAvatarFromConfig(customerConfig);

  const getSalesPersonLabel = (config: keyof typeof avatarConfigs): string => {
    return config.includes('Female') ? 'Saleswoman' : 'Salesman';
  };

  const handleAnalyticsClick = () => {
    router.push("/charts");
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#FDECE6] via-[#FDECE6] to-[#F9D7C8] font-openSans text-center px-4">
      <div className="h-screen flex justify-center">
        <div className="flex flex-col w-full h-full">
          <h1 className="text-8xl md:text-4xl font-openSans font-thin text-purple-800 mb-8 py-16">
            Chatting with your <span className="font-semibold">customers</span>, made delightful.
          </h1>
          <div className="flex flex-row w-full h-3/4 gap-48 px-24">
            <div className="flex flex-col w-1/2 h-full rounded-lg">
              <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-[#FCE7E0] to-[#F4D4C8] rounded-lg p-8">
                <img 
                  src={supportAgentAvatar.toDataUri()}
                  alt="Sales Agent Avatar"
                  className="w-48 h-48 mb-4"
                />
                <p className="text-lg font-semibold text-purple-800">{getSalesPersonLabel(supportAgentConfig)}</p>
              </div>
            </div>
            <div className="flex flex-col w-1/2 h-full rounded-lg">
              <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-[#FCE7E0] to-[#F4D4C8] rounded-lg p-8">
                <img 
                  src={customerAvatar.toDataUri()}
                  alt="Customer Avatar"
                  className="w-48 h-48 mb-4"
                />
                <p className="text-lg font-semibold text-purple-800">Customer</p>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center w-full h-1/4 gap-12">
            <button className="flex items-center justify-center px-8 py-2 rounded-full bg-[#F4D4C8] border border-[#DDC4BC] shadow-md transition duration-300 ease-in-out hover:bg-[#E9C7B9]">
              Download
            </button>
            <button className="flex items-center justify-center px-8 py-2 rounded-full bg-[#F4D4C8] border border-[#DDC4BC] shadow-md transition duration-300 ease-in-out hover:bg-[#E9C7B9]">
              Play
            </button>
            <button 
              className="flex items-center justify-center px-8 py-2 rounded-full bg-[#F4D4C8] border border-[#DDC4BC] shadow-md transition duration-300 ease-in-out hover:bg-[#E9C7B9]"
              onClick={handleAnalyticsClick}>
              Analytics
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}