import React from 'react';
import Link from 'next/link';
import SocialIcon from '@/components/ui/SocialIcon';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ];

  const socialLinks = [
    { platform: 'twitter', href: '#', title: 'Twitter' },
    { platform: 'github', href: '#', title: 'GitHub' },
    { platform: 'linkedin', href: '#', title: 'LinkedIn' },
    { platform: 'telegram', href: '#', title: 'Telegram' },
    { platform: 'discord', href: '#', title: 'Discord' },
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-dark-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold text-gradient-primary flex items-center mb-4">
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">Trade</span>
              <span className="text-white">Tools</span>
            </Link>
            <p className="text-gray-400 mb-6">
              Your one-stop marketplace for high-quality trading tools, indicators, and expert advisors.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(social => (
                <SocialIcon key={social.platform} platform={social.platform as any} href={social.href} title={social.title} location="footer" />
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-0.5 after:bg-primary-500">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="mr-2 text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-0.5 after:bg-primary-500">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to get the latest updates and exclusive offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-3 w-full rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-medium px-4 py-3 rounded-r-lg transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-6 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-10 after:h-0.5 after:bg-primary-500">Contact Us</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-3 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>123 Trading St, Finance District, NY 10001</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>support@tradetools.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 mb-4 md:mb-0">&copy; {currentYear} TradeTools. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="text-gray-500 hover:text-gray-300 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
