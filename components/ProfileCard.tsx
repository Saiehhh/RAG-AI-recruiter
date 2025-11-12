import React from 'react';
import { Profile } from '../types';

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <div className="bg-[#F5F0E4] border border-[#E0DACE] rounded-xl p-4 flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:border-[#A67B5B]/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200 h-full">
      <img
        src={profile.avatarUrl}
        alt={profile.name}
        className="w-24 h-24 rounded-full mb-4 border-2 border-white/50 ring-4 ring-[#E0DACE]/50"
      />
      <h3 className="font-bold text-lg text-[#654321]">{profile.name}</h3>
      <p className="text-sm text-[#8D6E63] mb-2">{profile.title}</p>
      <p className="text-xs text-[#A67B5B] mb-4">{profile.experienceYears} years of experience</p>
      <div className="flex flex-wrap justify-center gap-2 mt-auto">
        {profile.skills.slice(0, 4).map(skill => (
          <span key={skill} className="bg-[#E0DACE]/60 text-[#8D6E63] text-xs font-medium px-2.5 py-1 rounded-full">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;