
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import { DrugDataProvider, useDrugData } from '@/context/DrugDataContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, RefreshCw, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import DrugItem from '@/components/DrugItem';
import LoadMoreTrigger from '@/components/LoadMoreTrigger';
import LetterLoadingIndicator from '@/components/LetterLoadingIndicator';
import { useDebounce } from '@/hooks/use-debounce';

const DatabasePage: React.FC = () => {
  return (
    <DrugDataProvider>
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <div className="container mx-auto pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto mt-8 text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              Drug Database
            </h1>
            <p className="text-gray-600">
              Browse our comprehensive database of medications organized alphabetically
            </p>
          </div>
          <DatabaseContent />
        </div>
      </div>
    </DrugDataProvider>
  );
};

const DatabaseContent: React.FC = () => {
  const { 
    drugDataByLetter, 
    isLoading, 
    error, 
    fetchDrugData, 
    activeLetter, 
    setActiveLetter,
    paginatedData,
    loadMoreData,
    hasMoreData,
    fetchLetterData,
    visibleItems,
    setSearchTerm,
    searchTerm,
    searchDrugs
  } = useDrugData();

  const [letterLoading, setLetterLoading] = React.useState<boolean>(false);
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [isSearchMode, setIsSearchMode] = React.useState<boolean>(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Effect for letter fetching
  useEffect(() => {
    const loadLetterData = async () => {
      setLetterLoading(true);
      await fetchLetterData(activeLetter);
      setLetterLoading(false);
    };

    if (!drugDataByLetter[activeLetter] || drugDataByLetter[activeLetter].length === 0) {
      loadLetterData();
    }
  }, [activeLetter, fetchLetterData, drugDataByLetter]);

  // Effect for search results
  useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      setIsSearchMode(true);
      const results = searchDrugs(debouncedSearchTerm);
      setSearchResults(results);
    } else {
      setIsSearchMode(false);
      setSearchResults([]);
    }
  }, [debouncedSearchTerm, searchDrugs]);

  const handleLetterChange = (letter: string) => {
    setActiveLetter(letter);
    setSearchTerm('');
    setIsSearchMode(false);
  };

  // If we are still loading initial data
  if (isLoading && Object.keys(drugDataByLetter).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading initial drug database...</p>
      </div>
    );
  }

  // If there's an error and we have no data
  if (error && Object.keys(drugDataByLetter).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-center max-w-md">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchDrugData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const currentLetterData = drugDataByLetter[activeLetter] || [];
  const isCurrentLetterLoading = letterLoading && currentLetterData.length === 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Bar */}
      <div className="mb-6 relative">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search medications across all letters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-5 text-base rounded-md shadow-sm"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>

      {isSearchMode ? (
        // Search Results
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <p className="text-gray-600 mb-4">Found {searchResults.length} medications matching "{searchTerm}"</p>
          
          <div className="space-y-4">
            {searchResults.length > 0 ? (
              searchResults.map((drug, index) => (
                <DrugItem key={drug.id} drug={drug} index={index} />
              ))
            ) : (
              <div className="text-center py-8 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-500">No results found. Try a different search term.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // Alphabetical Browse
        <Tabs value={activeLetter} onValueChange={handleLetterChange}>
          <TabsList className="overflow-x-auto flex w-full max-w-full pb-1 mb-6">
            {'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => (
              <TabsTrigger 
                key={letter}
                value={letter}
                className="px-3 capitalize"
              >
                {letter}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {'abcdefghijklmnopqrstuvwxyz'.split('').map(letter => (
            <TabsContent key={letter} value={letter} className="mt-0">
              <div className="mb-4">
                <h2 className="text-2xl font-bold capitalize mb-2">{letter}</h2>
                <p className="text-gray-600">
                  {isCurrentLetterLoading ? (
                    "Loading data..."
                  ) : (
                    `Showing ${Math.min(visibleItems, currentLetterData.length)} of ${currentLetterData.length} drugs`
                  )}
                </p>
              </div>
              
              {isCurrentLetterLoading ? (
                <LetterLoadingIndicator letter={letter} />
              ) : (
                <>
                  <div className="space-y-4">
                    {paginatedData.map((drug, index) => (
                      <DrugItem key={drug.id} drug={drug} index={index} />
                    ))}
                  </div>
                  
                  {hasMoreData && (
                    <>
                      <LoadMoreTrigger onLoadMore={loadMoreData} />
                      <div className="mt-6 text-center">
                        <Button 
                          variant="outline" 
                          onClick={loadMoreData}
                          className="px-6"
                        >
                          Load More
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default DatabasePage;
