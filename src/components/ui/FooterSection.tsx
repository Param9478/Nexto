'use client';

import React from 'react';
import { ThemeToggle } from './ThemeToggle';

export interface FooterLinkGroup {
  title: string;
  links: {
    label: string;
    href: string;
  }[];
}

export interface FooterSectionProps {
  companyName: string;
  companyDescription?: string;
  linkGroups?: FooterLinkGroup[];
  contactInfo?: {
    email?: string;
    phone?: string;
    hours?: string;
  };
  copyright?: string;
  showThemeToggle?: boolean;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  companyName,
  companyDescription,
  linkGroups = [],
  contactInfo,
  copyright,
  showThemeToggle = true,
}) => {
  return (
    <footer className="w-full border-t border-blue-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">
              {companyName}
            </h3>
            {companyDescription && (
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {companyDescription}
              </p>
            )}
            {showThemeToggle && (
              <div className="mt-4">
                <ThemeToggle />
              </div>
            )}
          </div>

          {/* Link Groups */}
          {linkGroups.map((group, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          {contactInfo && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">
                Contact Us
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                {contactInfo.email && <li>Email: {contactInfo.email}</li>}
                {contactInfo.phone && <li>Phone: {contactInfo.phone}</li>}
                {contactInfo.hours && <li>Hours: {contactInfo.hours}</li>}
              </ul>
            </div>
          )}
        </div>

        {/* Copyright */}
        {copyright && (
          <div className="mt-8 pt-6 border-t border-blue-100 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
            {copyright}
          </div>
        )}
      </div>
    </footer>
  );
};

export default FooterSection;
