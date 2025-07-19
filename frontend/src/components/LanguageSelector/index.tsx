"use client";
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from "react-country-flag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', countryCode: 'US' },
    { code: 'pt', name: 'Português', countryCode: 'BR' },
  ];

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[180px] bg-transparent border-gray-300">
        <SelectValue>
          <div className="flex items-center gap-2">
            <ReactCountryFlag 
              countryCode={currentLanguage.countryCode}
              svg
              style={{
                width: '1.5em',
                height: '1.5em',
              }}
              title={currentLanguage.name}
            />
            <span className="text-sm">{currentLanguage.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <div className="flex items-center gap-2">
              <ReactCountryFlag 
                countryCode={lang.countryCode}
                svg
                style={{
                  width: '1.5em',
                  height: '1.5em',
                }}
                title={lang.name}
              />
              <span>{lang.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;