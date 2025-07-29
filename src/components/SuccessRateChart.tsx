import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SuccessRateData {
  ageGroup: string;
  clinic: number;
  national: number;
}

interface SuccessRateChartProps {
  successRates: {
    under35: { clinic: string; national: string };
    age35to37: { clinic: string; national: string };
    age38to40: { clinic: string; national: string };
    over40: { clinic: string; national: string };
  };
  clinicName: string;
}

export const SuccessRateChart = ({ successRates, clinicName }: SuccessRateChartProps) => {
  // Convert percentage strings to numbers for chart
  const parsePercentage = (value: string): number => {
    if (!value || value === 'N/A') return 0;
    return parseFloat(value.replace('%', ''));
  };

  const chartData: SuccessRateData[] = [
    {
      ageGroup: 'Under 35',
      clinic: parsePercentage(successRates.under35.clinic),
      national: parsePercentage(successRates.under35.national)
    },
    {
      ageGroup: '35-37',
      clinic: parsePercentage(successRates.age35to37.clinic),
      national: parsePercentage(successRates.age35to37.national)
    },
    {
      ageGroup: '38-40',
      clinic: parsePercentage(successRates.age38to40.clinic),
      national: parsePercentage(successRates.age38to40.national)
    },
    {
      ageGroup: 'Over 40',
      clinic: parsePercentage(successRates.over40.clinic),
      national: parsePercentage(successRates.over40.national)
    }
  ].filter(data => data.clinic > 0 || data.national > 0); // Only show age groups with data

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Success Rates by Age Group</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ageGroup" />
            <YAxis 
              label={{ value: 'Success Rate (%)', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, '']}
              labelFormatter={(label) => `Age Group: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="clinic" 
              fill="#3b82f6" 
              name={`${clinicName}`}
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="national" 
              fill="#94a3b8" 
              name="National Average"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}; 