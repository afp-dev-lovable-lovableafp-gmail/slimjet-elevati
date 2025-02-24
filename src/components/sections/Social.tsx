
import React from 'react';
import { Facebook, Linkedin, Instagram, Youtube, Twitter, LucideIcon } from "lucide-react";
import { Icon } from '@iconify/react';

interface SocialLink {
  icon: LucideIcon | string;
  href: string;
  label: string;
  isLucide: boolean;
}

const socialLinks: SocialLink[] = [
  { icon: Instagram, href: "https://www.instagram.com/elevati", label: "Instagram", isLucide: true },
  { icon: Youtube, href: "https://youtube.com/@elevati", label: "YouTube", isLucide: true },
  { icon: "simple-icons:tiktok", href: "https://tiktok.com/@elevati", label: "TikTok", isLucide: false },
  { icon: Linkedin, href: "https://www.linkedin.com/in/elevati", label: "LinkedIn", isLucide: true },
  { icon: Twitter, href: "https://x.com/@elevati", label: "X", isLucide: true },
  { icon: Facebook, href: "https://www.facebook.com/elevati", label: "Facebook", isLucide: true }
];

const SocialLink: React.FC<SocialLink> = ({ href, icon, label, isLucide }) => {
  const IconComponent = isLucide ? (
    React.createElement(icon as LucideIcon, {
      className: "w-6 h-6"
    })
  ) : (
    <Icon 
      icon={icon as string} 
      className="w-6 h-6"
      style={{ color: 'currentColor' }} 
    />
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
      aria-label={label}
    >
      <span className="text-teal-600 w-6 h-6 flex items-center justify-center">
        {IconComponent}
      </span>
    </a>
  );
};

const Social: React.FC = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl text-teal-600 font-bold tracking-wider leading-relaxed mb-8 md:mb-0">
            Empresa dedicada à Tecnologia da Informação
          </h2>
          <div className="flex items-center space-x-4">
            {socialLinks.map((link) => (
              <SocialLink key={link.href} {...link} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Social;
