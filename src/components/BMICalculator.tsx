
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart } from 'recharts';
import { toast } from 'sonner';

type HeightUnit = 'cm' | 'inches';
type WeightUnit = 'kg' | 'lbs';

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>('');

  const calculateBMI = () => {
    let h = parseFloat(height);
    let w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      toast.error('Please enter valid height and weight values');
      return;
    }

    // Convert height to cm if in inches
    if (heightUnit === 'inches') {
      h *= 2.54; // 1 inch = 2.54 cm
    }

    // Convert weight to kg if in lbs
    if (weightUnit === 'lbs') {
      w *= 0.453592; // 1 lb = 0.453592 kg
    }

    const bmi = w / ((h / 100) * (h / 100));
    setBmiResult(parseFloat(bmi.toFixed(2)));
    
    // Determine BMI category
    if (bmi < 18.5) {
      setBmiCategory('Underweight');
    } else if (bmi < 25) {
      setBmiCategory('Normal');
    } else if (bmi < 30) {
      setBmiCategory('Overweight');
    } else {
      setBmiCategory('Obese');
    }
  };

  // Chart data for BMI categories
  const bmiData = [
    { name: 'Underweight', value: 18.5, fill: '#3b82f6' },
    { name: 'Normal', value: 24.9 - 18.5, fill: '#22c55e' },
    { name: 'Overweight', value: 29.9 - 24.9, fill: '#eab308' },
    { name: 'Obese', value: 40 - 29.9, fill: '#ef4444' },
  ];

  // Config for the chart
  const chartConfig = {
    underweight: { label: 'Underweight', theme: { light: '#3b82f6', dark: '#3b82f6' } },
    normal: { label: 'Normal', theme: { light: '#22c55e', dark: '#22c55e' } },
    overweight: { label: 'Overweight', theme: { light: '#eab308', dark: '#eab308' } },
    obese: { label: 'Obese', theme: { light: '#ef4444', dark: '#ef4444' } },
  };

  return (
    <Card className="w-full shadow-lg border-gray-200 transition-shadow duration-300 hover:shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <CardTitle className="text-2xl font-bold text-center">BMI Calculator</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="mb-2 font-medium">Height</div>
          <div className="flex items-center gap-4">
            <Tabs 
              value={heightUnit} 
              onValueChange={(value) => setHeightUnit(value as HeightUnit)}
              className="w-32"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cm">cm</TabsTrigger>
                <TabsTrigger value="inches">in</TabsTrigger>
              </TabsList>
            </Tabs>
            <Input
              type="number"
              placeholder={`Height (${heightUnit})`}
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="flex-1"
              min="0"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 font-medium">Weight</div>
          <div className="flex items-center gap-4">
            <Tabs 
              value={weightUnit} 
              onValueChange={(value) => setWeightUnit(value as WeightUnit)}
              className="w-32"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="kg">kg</TabsTrigger>
                <TabsTrigger value="lbs">lbs</TabsTrigger>
              </TabsList>
            </Tabs>
            <Input
              type="number"
              placeholder={`Weight (${weightUnit})`}
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="flex-1"
              min="0"
            />
          </div>
        </div>

        <Button 
          onClick={calculateBMI} 
          className="w-full mb-6 bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          Calculate BMI
        </Button>

        {bmiResult !== null && (
          <div className="mt-6 space-y-4 animate-fade-in">
            <div className="text-center">
              <div className="text-xl font-medium">Your BMI is: {bmiResult}</div>
              <div className={`text-lg font-semibold mt-1 ${
                bmiCategory === 'Underweight' ? 'text-blue-600' :
                bmiCategory === 'Normal' ? 'text-green-600' :
                bmiCategory === 'Overweight' ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {bmiCategory}
              </div>
            </div>

            <div className="h-64 mt-4">
              <ChartContainer
                config={chartConfig}
                className="h-full w-full"
              >
                <BarChart
                  data={bmiData}
                  barSize={40}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <ChartTooltip 
                    content={<ChartTooltipContent />} 
                  />
                </BarChart>
              </ChartContainer>
            </div>

            <div className="text-sm text-gray-500 mt-4">
              <div><span className="font-medium">Underweight:</span> BMI less than 18.5</div>
              <div><span className="font-medium">Normal weight:</span> BMI 18.5-24.9</div>
              <div><span className="font-medium">Overweight:</span> BMI 25-29.9</div>
              <div><span className="font-medium">Obese:</span> BMI 30 or greater</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BMICalculator;
