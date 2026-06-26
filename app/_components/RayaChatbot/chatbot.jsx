"use client";

import Script from 'next/script';
import { useTheme } from 'next-themes';
import Style from './chatbot.module.css';

export default function ChatBot() {
  const { theme, resolvedTheme } = useTheme();

  const getActiveTheme = () => {
    const current = theme === 'system' ? resolvedTheme : theme;
    return current === 'dark' ? 'dark' : 'light';
  };

  const handleScriptLoad = () => {
    if (window.botpress && typeof window.botpress.on === 'function') {
      window.botpress.on('webchat:initialized', () => {
        window.botpress.config({
          configuration: {
            themeMode: getActiveTheme()
          }
        });
      });
    }
  };

  return (
    <div className={Style.botContainer}>
      <Script 
        src="https://cdn.botpress.cloud/webchat/v3.6/inject.js" 
        strategy="afterInteractive" 
        onLoad={handleScriptLoad} // Triggers the instant the script lands in the DOM
      />
      <Script 
        src="https://files.bpcontent.cloud/2026/06/17/12/20260617120413-EXSZUKXZ.js" 
        strategy="lazyOnload" 
      />
      <div id="botContainer"></div>
    </div>
  );
}