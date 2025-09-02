import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Calendar, 
  TrendingUp, 
  PieChart, 
  DollarSign,
  Target,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useCurrency } from './CurrencyProvider';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface ExpenseStatsProps {
  expenses: Expense[];
}

export function ExpenseStats({ expenses }: ExpenseStatsProps) {
  const { formatAmount } = useCurrency();
  
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === lastMonth.getMonth() && expenseDate.getFullYear() === lastMonth.getFullYear();
    });

    const totalCurrentMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalLastMonth = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const monthlyChange = totalLastMonth === 0 ? 0 : ((totalCurrentMonth - totalLastMonth) / totalLastMonth) * 100;

    // Category breakdown
    const categoryTotals: { [category: string]: number } = {};
    currentMonthExpenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });

    const topCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    // Average daily spending
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = new Date().getDate();
    const avgDaily = totalCurrentMonth / currentDay;

    const today = new Date().toISOString().split('T')[0];
    const todayExpenses = expenses.filter(expense => expense.date === today);
    const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      totalCurrentMonth,
      totalLastMonth,
      monthlyChange,
      topCategories,
      avgDaily,
      todayTotal,
      expenseCount: currentMonthExpenses.length
    };
  }, [expenses]);

  const monthName = new Date().toLocaleString('default', { month: 'long' });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Today's Spending</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{formatAmount(stats.todayTotal)}</div>
          <p className="text-xs text-muted-foreground">
            Current day expenses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">This Month</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{formatAmount(stats.totalCurrentMonth)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {stats.monthlyChange >= 0 ? (
              <ArrowUp className="h-3 w-3 text-red-500 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 text-green-500 mr-1" />
            )}
            <span className={stats.monthlyChange >= 0 ? 'text-red-500' : 'text-green-500'}>
              {Math.abs(stats.monthlyChange).toFixed(1)}%
            </span>
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Daily Average</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{formatAmount(stats.avgDaily)}</div>
          <p className="text-xs text-muted-foreground">
            Average per day this month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm">Total Expenses</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{stats.expenseCount}</div>
          <p className="text-xs text-muted-foreground">
            Expenses this month
          </p>
        </CardContent>
      </Card>

      {stats.topCategories.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Top Categories - {monthName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topCategories.map(([category, amount], index) => {
                const percentage = (amount / stats.totalCurrentMonth) * 100;
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-chart-1' : 
                        index === 1 ? 'bg-chart-2' : 'bg-chart-3'
                      }`} />
                      <span>{category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {percentage.toFixed(1)}%
                      </Badge>
                      <span>{formatAmount(amount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}