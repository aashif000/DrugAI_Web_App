
import React, { useState } from 'react';
import Header from '@/components/Header';
import DrugSearchComponent from '@/components/DrugSearchComponent';
import BMICalculator from '@/components/BMICalculator';
import { DrugDataProvider } from '@/context/DrugDataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PillIcon, ActivityIcon, ClockIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Line 
} from 'recharts';

const Search: React.FC = () => {
  const [halfLife, setHalfLife] = useState<string>('');
  const [halfLifeUnit, setHalfLifeUnit] = useState<'hours' | 'days'>('hours');
  const [clearanceData, setClearanceData] = useState<{ percentage: number; time: string; name: string }[]>([]);

  // Half-Life Calculation
  const calculateClearance = () => {
    const halfLifeValue = parseFloat(halfLife);
    
    if (!isNaN(halfLifeValue) && halfLifeValue > 0) {
      const results = [];
      for (let i = 0; i <= 10; i++) {
        const time = i * halfLifeValue;
        const percentage = 100 * Math.pow(0.5, i);
        results.push({ 
          percentage, 
          time: `${time} ${halfLifeUnit}`,
          name: `${i}×`
        });
      }
      setClearanceData(results);
    } else {
      setClearanceData([]);
      alert('Please enter a valid half-life value');
    }
  };

  return (
    <DrugDataProvider>
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <div className="container mx-auto pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto mt-8 text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
              Drug Search & Health Tools
            </h1>
            <p className="text-gray-600">
              Search our comprehensive database of medications or use our health calculators
            </p>
          </div>
          
          <Tabs defaultValue="drugs" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="drugs" className="text-base py-3">
                <PillIcon className="mr-2 h-4 w-4" />
                Drug Search
              </TabsTrigger>
              <TabsTrigger value="bmi" className="text-base py-3">
                <ActivityIcon className="mr-2 h-4 w-4" />
                BMI Calculator
              </TabsTrigger>
              <TabsTrigger value="half-life" className="text-base py-3">
                <ClockIcon className="mr-2 h-4 w-4" />
                Half-Life Calculator
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="drugs" className="mt-0">
              <DrugSearchComponent />
            </TabsContent>
            
            <TabsContent value="bmi" className="mt-0">
              <div className="max-w-xl mx-auto">
                <BMICalculator />
              </div>
            </TabsContent>
            
            <TabsContent value="half-life" className="mt-0">
              <div className="max-w-xl mx-auto">
                <Card className="shadow-md">
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-bold mb-4">Drug Half-Life Calculator</h2>
                    <p className="text-gray-600 mb-6">
                      Calculate how long it takes for a drug to be cleared from the body based on its half-life.
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Half-Life Value</label>
                        <Input
                          type="number"
                          min="0"
                          step="0.1"
                          placeholder="Enter half-life value"
                          value={halfLife}
                          onChange={(e) => setHalfLife(e.target.value)}
                          className="text-lg"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Unit</label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant={halfLifeUnit === 'hours' ? 'default' : 'outline'}
                            onClick={() => setHalfLifeUnit('hours')}
                            className="flex-1"
                          >
                            Hours
                          </Button>
                          <Button
                            type="button"
                            variant={halfLifeUnit === 'days' ? 'default' : 'outline'}
                            onClick={() => setHalfLifeUnit('days')}
                            className="flex-1"
                          >
                            Days
                          </Button>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={calculateClearance} 
                        className="w-full py-6"
                      >
                        Calculate Clearance
                      </Button>
                    </div>
                    
                    {clearanceData.length > 0 && (
                      <div className="mt-8">
                        <h3 className="font-semibold text-lg mb-4">Clearance Results</h3>
                        
                        <div className="overflow-x-auto">
                          <LineChart
                            width={500}
                            height={300}
                            data={clearanceData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <defs>
                              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis label={{ value: 'Percentage Remaining (%)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const percentage = typeof payload[0].value === 'number' 
                                  ? payload[0].value.toFixed(2) 
                                  : payload[0].value;
                                return (
                                  <div className="bg-white p-2 border border-gray-300 rounded shadow-sm">
                                    <p className="text-sm">{`${payload[0].payload.time}: ${percentage}%`}</p>
                                  </div>
                                );
                              }
                              return null;
                            }} />
                            <Line 
                              type="monotone" 
                              dataKey="percentage" 
                              stroke="#8884d8" 
                              fillOpacity={1} 
                              fill="url(#colorUv)" 
                            />
                          </LineChart>
                        </div>
                        
                        <div className="mt-4 border border-gray-200 rounded-md divide-y max-h-60 overflow-y-auto">
                          <div className="grid grid-cols-2 bg-gray-100 font-medium p-2">
                            <div>Time</div>
                            <div>Remaining (%)</div>
                          </div>
                          {clearanceData.map((item, index) => (
                            <div key={index} className="grid grid-cols-2 p-2">
                              <div>{item.time}</div>
                              <div>{item.percentage.toFixed(2)}%</div>
                            </div>
                          ))}
                        </div>
                        
                        <p className="text-xs text-gray-500 mt-4">
                          This is an estimate of how long it will take for a drug to be removed from the body. 
                          The half-life is the time it takes for half of the drug to be eliminated.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DrugDataProvider>
  );
};

export default Search;
