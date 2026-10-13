import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  goBack: () => void;
  params: Record<string, string>;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function getPathFromHash(): string {
  const hash = window.location.hash;
  if (!hash || hash === '#') return '/';
  const clean = hash.slice(1);
  const pathWithoutQuery = clean.split('?')[0];
  return pathWithoutQuery.startsWith('/') ? pathWithoutQuery : `/${pathWithoutQuery}`;
}

export function matchPath(pattern: string, path: string): { matches: boolean; params: Record<string, string> } {
  const patternSegments = pattern.split('/').filter(Boolean);
  const pathSegments = path.split('/').filter(Boolean);

  if (patternSegments.length !== pathSegments.length) {
    return { matches: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSeg = patternSegments[i];
    const pathSeg = pathSegments[i];

    if (patternSeg.startsWith(':')) {
      const paramName = patternSeg.slice(1);
      params[paramName] = decodeURIComponent(pathSeg);
    } else if (patternSeg !== pathSeg) {
      return { matches: false, params: {} };
    }
  }

  return { matches: true, params };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(getPathFromHash());
  const [historyStack, setHistoryStack] = useState<string[]>([getPathFromHash()]);

  useEffect(() => {
    const handleHashChange = () => {
      const newPath = getPathFromHash();
      setPath(newPath);
      setHistoryStack((prev) => [...prev, newPath]);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (to: string) => {
    const normalized = to.startsWith('/') ? to : `/${to}`;
    if (window.location.hash !== `#${normalized}`) {
      window.location.hash = normalized;
    }
  };

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/home');
    }
  };

  const contextValue = useMemo(() => ({
    path,
    navigate,
    goBack,
    params: {},
  }), [path]);

  return <RouterContext.Provider value={contextValue}>{children}</RouterContext.Provider>;
};

export const useRouter = () => {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
};

export const Link: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ to, children, className = '', onClick }) => {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    navigate(to);
  };

  return (
    <a href={`#${to.startsWith('/') ? to : `/${to}`}`} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};
