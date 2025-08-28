import React from 'react';
import SocialIcon from '@/components/ui/SocialIcon';

const AppHeader = () => {
  const socialPlatforms = [
    { id: 'twitter', title: 'Twitter', href: 'https://twitter.com/yourhandle' },
    { id: 'github', title: 'GitHub', href: 'https://github.com/yourorg' },
    { id: 'linkedin', title: 'LinkedIn', href: 'https://www.linkedin.com/company/yourcompany' },
    { id: 'telegram', title: 'Telegram', href: 'https://t.me/yourchannel' },
    { id: 'discord', title: 'Discord', href: 'https://discord.gg/yourinvite' },
  ];

  return (
    <div className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">My App</h1>
        </div>
        <div className="flex items-center space-x-4">
          {socialPlatforms.map((platform) => (
            <SocialIcon
              key={platform.id}
              platform={platform.id as any}
              href={platform.href}
              title={platform.title}
              size="md"
              location="header"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
