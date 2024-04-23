import { WebContainer } from '@webcontainer/api';
import { createContext } from 'react';

interface WebContainerContext {
  webcontainer: Promise<WebContainer>;
  loaded: boolean;
}

const webcontainer = WebContainer.boot({ workdirName: 'tutorial' });

const webcontainerContext: WebContainerContext = {
  loaded: false,
  webcontainer: webcontainer.then((webcontainer) => {
    webcontainerContext.loaded = true;
    return webcontainer;
  }),
};

export const WebContainerContext = createContext(webcontainerContext);

export function isWebContainerSupported() {
  const hasSharedArrayBuffer = 'SharedArrayBuffer' in window;
  const looksLikeChrome = navigator.userAgent.includes('Chrome');
  const looksLikeFirefox = navigator.userAgent.includes('Firefox');
  const looksLikeSafari = navigator.userAgent.includes('Safari');

  if (hasSharedArrayBuffer && (looksLikeChrome || looksLikeFirefox)) {
    return true;
  }

  if (hasSharedArrayBuffer && looksLikeSafari) {
    // we only support Safari 16.4 and up so we check for the version here
    const match = navigator.userAgent.match(/Version\/(\d+)\.(\d+) (?:Mobile\/.*?)?Safari/);
    const majorVersion = match ? Number(match?.[1]) : 0;
    const minorVersion = match ? Number(match?.[2]) : 0;

    return majorVersion > 16 || (majorVersion === 16 && minorVersion >= 4);
  }

  // Allow overriding the support check with localStorage.webcontainer_any_ua = 1
  try {
    return Boolean(localStorage.getItem('webcontainer_any_ua'));
  } catch {
    return false;
  }
}
