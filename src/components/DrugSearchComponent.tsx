
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDrugData } from '@/context/DrugDataContext';
import { Loader2, Search, XCircle } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const DrugSearchComponent: React.FC = () => {
  const { searchDrugs, isLoading, searchSuggestions, setSearchTerm, searchTerm } = useDrugData();
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(searchTerm, 300);

  const performSearch = useCallback(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = searchDrugs(debouncedQuery);
      setResults(searchResults);
    } finally {
      setIsSearching(false);
    }
  }, [debouncedQuery, searchDrugs]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  // Update search suggestions as user types
  useEffect(() => {
    if (searchTerm.length >= 2) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      clearSearch();
    }
  };

  const handleSelectSuggestion = (selectedDrug: string) => {
    setSearchTerm(selectedDrug);
    setOpen(false);
    performSearch();
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative mb-6">
        <Popover open={open && searchSuggestions.length > 0} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for medications by name, manufacturer, or composition..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10 pr-10 py-6 text-lg rounded-full shadow-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
              <Button 
                onClick={performSearch}
                className="py-6 px-8 rounded-full"
                disabled={isSearching || isLoading}
              >
                {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
              </Button>
            </div>
          </PopoverTrigger>
          
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandList>
                <CommandGroup heading="Suggestions">
                  {searchSuggestions.map((drug) => (
                    <CommandItem 
                      key={drug.id} 
                      onSelect={() => handleSelectSuggestion(drug.name)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{drug.name}</span>
                        <span className="text-xs text-gray-500">{drug.manufacturer_name} • {drug.short_composition1}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandEmpty>No suggestions found</CommandEmpty>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {isSearching && (
        <div className="flex justify-center my-8">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      )}

      {!isSearching && searchTerm.length > 0 && results.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No medications found matching "{searchTerm}"</p>
        </div>
      )}

      <div className="space-y-4">
        {results.map((drug) => (
          <Card key={drug.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-lg text-slate-900">{drug.name}</h3>
                  <div className="text-slate-600 text-sm mt-1">{drug.short_composition1}</div>
                  {drug.short_composition2 && (
                    <div className="text-slate-600 text-sm">{drug.short_composition2}</div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {drug.manufacturer_name}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {drug.type}
                    </span>
                    {drug.Is_discontinued === "TRUE" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Discontinued
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 md:mt-0 text-right">
                  <div className="text-lg font-semibold">₹{drug.price}</div>
                  <div className="text-xs text-slate-500">{drug.pack_size_label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DrugSearchComponent;
