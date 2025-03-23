
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

interface DrugData {
  id: string;
  name: string;
  price: string;
  Is_discontinued: string;
  manufacturer_name: string;
  type: string;
  pack_size_label: string;
  short_composition1: string;
  short_composition2: string;
}

interface DrugDataContextType {
  allDrugData: DrugData[];
  drugDataByLetter: Record<string, DrugData[]>;
  isLoading: boolean;
  error: string | null;
  fetchDrugData: () => Promise<void>;
  searchDrugs: (query: string) => DrugData[];
  fetchLetterData: (letter: string) => Promise<DrugData[]>;
  activeLetter: string;
  setActiveLetter: (letter: string) => void;
  paginatedData: DrugData[];
  loadMoreData: () => void;
  hasMoreData: boolean;
  visibleItems: number;
  searchSuggestions: DrugData[];
  setSearchTerm: (term: string) => void;
  searchTerm: string;
}

const DrugDataContext = createContext<DrugDataContextType | undefined>(undefined);

export const useDrugData = () => {
  const context = useContext(DrugDataContext);
  if (!context) {
    throw new Error('useDrugData must be used within a DrugDataProvider');
  }
  return context;
};

export const DrugDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allDrugData, setAllDrugData] = useState<DrugData[]>([]);
  const [drugDataByLetter, setDrugDataByLetter] = useState<Record<string, DrugData[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeLetter, setActiveLetter] = useState<string>('a');
  const [visibleItems, setVisibleItems] = useState<number>(20);
  const [loadingLetters, setLoadingLetters] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [drugCache, setDrugCache] = useState<Map<string, DrugData[]>>(new Map());

  // Paginated data based on active letter
  const paginatedData = useMemo(() => {
    const letterData = drugDataByLetter[activeLetter] || [];
    return letterData.slice(0, visibleItems);
  }, [drugDataByLetter, activeLetter, visibleItems]);

  const hasMoreData = useMemo(() => {
    const letterData = drugDataByLetter[activeLetter] || [];
    return letterData.length > visibleItems;
  }, [drugDataByLetter, activeLetter, visibleItems]);

  const loadMoreData = useCallback(() => {
    setVisibleItems(prev => prev + 20);
  }, []);

  // Function to fetch data for a specific letter with caching
  const fetchLetterData = useCallback(async (letter: string): Promise<DrugData[]> => {
    if (drugDataByLetter[letter]?.length > 0) {
      return drugDataByLetter[letter];
    }

    if (loadingLetters.has(letter)) {
      return [];
    }

    // Add to loading state
    setLoadingLetters(prev => new Set(prev).add(letter));
    
    try {
      // Try to get from cache first
      if (drugCache.has(letter)) {
        const cachedData = drugCache.get(letter) || [];
        setDrugDataByLetter(prev => ({
          ...prev,
          [letter]: cachedData
        }));
        return cachedData;
      }

      const url = `https://cdn.jsdelivr.net/gh/aashif000/Drug_Data@main/${letter}.json`;
      console.log(`Fetching data from ${url}`);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data for ${letter}.json`);
      }
      
      const data = await response.json();
      
      const normalizedData: DrugData[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item["price(₹)"],
        Is_discontinued: item.Is_discontinued,
        manufacturer_name: item.manufacturer_name,
        type: item.type,
        pack_size_label: item.pack_size_label,
        short_composition1: item.short_composition1,
        short_composition2: item.short_composition2
      }));
      
      // Update cache
      setDrugCache(prev => {
        const newCache = new Map(prev);
        newCache.set(letter, normalizedData);
        return newCache;
      });
      
      // Update state
      setDrugDataByLetter(prev => ({
        ...prev,
        [letter]: normalizedData
      }));
      
      return normalizedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error(`Error fetching ${letter}.json:`, errorMessage);
      return [];
    } finally {
      setLoadingLetters(prev => {
        const newSet = new Set(prev);
        newSet.delete(letter);
        return newSet;
      });
    }
  }, [drugDataByLetter, loadingLetters, drugCache]);

  // More efficient fetch that fetches data in sequence, not in parallel
  const fetchDrugData = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Only fetch a few letters initially
      const initialLetters = 'abcde'.split('');
      
      let allData: DrugData[] = [];
      
      // Sequential fetching to avoid overwhelming the CDN
      for (const letter of initialLetters) {
        const letterData = await fetchLetterData(letter);
        allData = [...allData, ...letterData];
      }
      
      setAllDrugData(prevData => {
        // Merge new data with existing data
        const uniqueIds = new Set(prevData.map(item => item.id));
        const newItems = allData.filter(item => !uniqueIds.has(item.id));
        return [...prevData, ...newItems];
      });
      
      toast.success('Drug data loaded successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast.error(`Error loading drug data: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-fetch the active letter whenever it changes
  useEffect(() => {
    if (!drugDataByLetter[activeLetter]) {
      fetchLetterData(activeLetter);
    }
  }, [activeLetter, fetchLetterData, drugDataByLetter]);

  // Load initial data on mount
  useEffect(() => {
    fetchDrugData();
  }, []);

  // Search suggestions based on current search term
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const firstLetter = searchTerm.toLowerCase()[0];
    const lowerCaseQuery = searchTerm.toLowerCase();
    
    // Try to find matches in the current letter data first
    if (drugDataByLetter[firstLetter]) {
      return drugDataByLetter[firstLetter]
        .filter(drug => 
          drug.name.toLowerCase().includes(lowerCaseQuery) ||
          drug.manufacturer_name.toLowerCase().includes(lowerCaseQuery) ||
          drug.short_composition1.toLowerCase().includes(lowerCaseQuery)
        )
        .slice(0, 10);
    }
    
    // Fall back to searching all loaded data
    return allDrugData
      .filter(drug => 
        drug.name.toLowerCase().includes(lowerCaseQuery) ||
        drug.manufacturer_name.toLowerCase().includes(lowerCaseQuery) ||
        drug.short_composition1.toLowerCase().includes(lowerCaseQuery)
      )
      .slice(0, 10);
  }, [searchTerm, drugDataByLetter, allDrugData]);

  // Full search function
  const searchDrugs = useCallback((query: string): DrugData[] => {
    if (!query || query.length < 2) return [];
    
    const firstLetter = query.toLowerCase()[0];
    const lowerCaseQuery = query.toLowerCase();
    
    // Trigger fetch for this letter if not loaded
    if (
      /^[a-z]$/.test(firstLetter) && 
      (!drugDataByLetter[firstLetter] || drugDataByLetter[firstLetter].length === 0)
    ) {
      fetchLetterData(firstLetter);
    }
    
    // Search in the target letter first
    if (drugDataByLetter[firstLetter]) {
      const results = drugDataByLetter[firstLetter].filter(drug => 
        drug.name.toLowerCase().includes(lowerCaseQuery) ||
        drug.manufacturer_name.toLowerCase().includes(lowerCaseQuery) ||
        drug.short_composition1.toLowerCase().includes(lowerCaseQuery) ||
        drug.short_composition2?.toLowerCase().includes(lowerCaseQuery)
      );
      
      if (results.length > 0) {
        return results.slice(0, 50); 
      }
    }
    
    // Fall back to searching all loaded data
    return allDrugData.filter(drug => 
      drug.name.toLowerCase().includes(lowerCaseQuery) ||
      drug.manufacturer_name.toLowerCase().includes(lowerCaseQuery) ||
      drug.short_composition1.toLowerCase().includes(lowerCaseQuery) ||
      drug.short_composition2?.toLowerCase().includes(lowerCaseQuery)
    ).slice(0, 50);
  }, [drugDataByLetter, allDrugData, fetchLetterData]);

  return (
    <DrugDataContext.Provider
      value={{
        allDrugData,
        drugDataByLetter,
        isLoading,
        error,
        fetchDrugData,
        searchDrugs,
        fetchLetterData,
        activeLetter,
        setActiveLetter,
        paginatedData,
        loadMoreData,
        hasMoreData,
        visibleItems,
        searchSuggestions,
        setSearchTerm,
        searchTerm
      }}
    >
      {children}
    </DrugDataContext.Provider>
  );
};
