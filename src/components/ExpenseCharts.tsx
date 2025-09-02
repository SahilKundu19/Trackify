import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PieChartIcon, BarChart3, TrendingUp } from 'lucide-react';
import { useCurrency } from './CurrencyProvider';
import { useTheme } from './ThemeProvider';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface ExpenseChartsProps {
  expenses: Expense[];
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const DARK_COLORS = [
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#ffffff',
];

export function ExpenseCharts({ expenses }: ExpenseChartsProps) {
  const { formatAmount } = useCurrency();
  const { theme } = useTheme();
  
  // Check if we're in dark mode (either explicitly dark or system dark)
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  // Chart text colors based on theme
  const chartTextColor = isDarkMode ? '#ffffff' : 'hsl(var(--foreground))';
  const chartMutedColor = isDarkMode ? '#ffffff' : 'hsl(var(--muted-foreground))';
  
  // Chart element colors based on theme
  const chartColors = isDarkMode ? DARK_COLORS : COLORS;
  const barColor = isDarkMode ? '#ffffff' : 'hsl(var(--chart-1))';
  const lineColor = isDarkMode ? '#ffffff' : 'hsl(var(--chart-2))';
  const lineStroke = isDarkMode ? '#ffffff' : 'hsl(var(--chart-2))';

  const chartData = useMemo(() => {
    // Category breakdown for pie chart
    const categoryTotals: { [category: string]: number } = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const pieData = Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: ((amount / expenses.reduce((sum, e) => sum + e.amount, 0)) * 100).toFixed(1)
    }));

    // Monthly totals for bar chart (last 6 months)
    const monthlyTotals: { [month: string]: number } = {};
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date.toISOString().substr(0, 7); // YYYY-MM format
    }).reverse();

    last6Months.forEach(month => {
      monthlyTotals[month] = 0;
    });

    expenses.forEach(expense => {
      const month = expense.date.substr(0, 7);
      if (monthlyTotals.hasOwnProperty(month)) {
        monthlyTotals[month] += expense.amount;
      }
    });

    const barData = Object.entries(monthlyTotals).map(([month, amount]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      amount,
      formattedAmount: formatAmount(amount)
    }));

    // Daily trend for line chart (last 30 days)
    const dailyTotals: { [date: string]: number } = {};
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    last30Days.forEach(date => {
      dailyTotals[date] = 0;
    });

    expenses.forEach(expense => {
      if (dailyTotals.hasOwnProperty(expense.date)) {
        dailyTotals[expense.date] += expense.amount;
      }
    });

    const lineData = Object.entries(dailyTotals).map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount,
      formattedAmount: formatAmount(amount)
    }));

    return { pieData, barData, lineData };
  }, [expenses, formatAmount]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <p className="font-medium" style={{ color: chartTextColor }}>{label}</p>
          <p className="font-semibold" style={{ color: isDarkMode ? '#ffffff' : 'hsl(var(--primary))' }}>
            {payload[0].payload.formattedAmount || formatAmount(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <p className="font-medium" style={{ color: chartTextColor }}>{data.name}</p>
          <p className="font-semibold" style={{ color: isDarkMode ? '#ffffff' : 'hsl(var(--primary))' }}>{formatAmount(data.value)}</p>
          <p style={{ color: chartMutedColor }}>{data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  if (expenses.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-8 text-center">
              <div style={{ color: chartMutedColor }}>
                No data available for charts
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Category Breakdown Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: chartTextColor }}>
            <PieChartIcon className="h-5 w-5" style={{ color: chartTextColor }} />
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData.pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {chartData.pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {chartData.pieData.slice(0, 5).map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full border border-border/50" 
                    style={{ backgroundColor: chartColors[index % chartColors.length] }}
                  />
                  <span style={{ color: chartTextColor }}>{entry.name}</span>
                </div>
                <span style={{ color: chartMutedColor }} className="font-medium">{entry.percentage}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Spending Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: chartTextColor }}>
            <BarChart3 className="h-5 w-5" style={{ color: chartTextColor }} />
            Monthly Spending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData.barData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={isDarkMode ? 0.3 : 0.5}
              />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12, fill: chartTextColor }}
                stroke={chartMutedColor}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: chartTextColor }}
                stroke={chartMutedColor}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                fill={barColor} 
                radius={[4, 4, 0, 0]}
                stroke={barColor}
                strokeWidth={0}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily Trend Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: chartTextColor }}>
            <TrendingUp className="h-5 w-5" style={{ color: chartTextColor }} />
            Daily Trend (30 days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData.lineData}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                opacity={isDarkMode ? 0.3 : 0.5}
              />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: chartTextColor }}
                stroke={chartMutedColor}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                interval={6}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: chartTextColor }}
                stroke={chartMutedColor}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke={lineStroke} 
                strokeWidth={3}
                dot={{ fill: lineColor, stroke: 'hsl(var(--card))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: lineColor, stroke: 'hsl(var(--card))', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}