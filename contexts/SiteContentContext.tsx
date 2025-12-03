import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { SiteContent } from '../types';
import { getSiteContent } from '../services/dbService';

interface SiteContentContextType {
  content: SiteContent | null;
  isLoading: boolean;
  refreshContent: () => void;
  saveSiteContent?: (docId: keyof SiteContent | 'paymentSettings', data: any) => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const fetchedContent = await getSiteContent();
      setContent(fetchedContent);
    } catch (error) {
      console.error("Failed to load site content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSiteContent = async (docId: keyof SiteContent | 'paymentSettings', data: any) => {
    try {
      await updateSiteContent(docId, data);
      await fetchContent();
    } catch (error) {
      console.error('Failed to save site content:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);
  
  const value = useMemo(() => ({
    content,
    isLoading,
    refreshContent: fetchContent,
    saveSiteContent
  }), [content, isLoading]);

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = (): SiteContentContextType => {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
};