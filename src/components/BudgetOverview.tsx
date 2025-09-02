import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Target, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useBudget } from './BudgetProvider';
import { useCurrency } from './CurrencyProvider';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface BudgetOverviewProps {
  expenses: Expense[];
}

export function BudgetOverview({ expenses }: BudgetOverviewProps) {
  const { budget, getBudgetStatus, getBudgetPercentage } = useBudget();
  const { formatAmount } = useCurrency();

  const budgetData = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });

    const totalSpent = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Category spending
    const categorySpending: { [category: string]: number } = {};
    currentMonthExpenses.forEach(expense => {
      categorySpending[expense.category] = (categorySpending[expense.category] || 0) + expense.amount;
    });

    // Overall budget status
    const monthlyStatus = getBudgetStatus(totalSpent, budget.monthly);
    const monthlyPercentage = getBudgetPercentage(totalSpent, budget.monthly);

    // Category budget statuses
    const categoryStatuses = Object.entries(budget.categories).map(([category, budgetAmount]) => {
      const spent = categorySpending[category] || 0;
      return {
        category,
        budgetAmount,
        spent,
        status: getBudgetStatus(spent, budgetAmount),
        percentage: getBudgetPercentage(spent, budgetAmount),
        remaining: Math.max(budgetAmount - spent, 0)
      };
    });

    return {
      totalSpent,
      monthlyStatus,
      monthlyPercentage,
      categoryStatuses,
      remaining: Math.max(budget.monthly - totalSpent, 0)
    };
  }, [expenses, budget, getBudgetStatus, getBudgetPercentage]);

  const getStatusIcon = (status: 'safe' | 'warning' | 'exceeded') => {
    switch (status) {
      case 'safe':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'exceeded':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'safe' | 'warning' | 'exceeded') => {
    switch (status) {
      case 'safe':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'exceeded':
        return 'bg-red-500';
    }
  };

  const getStatusBadge = (status: 'safe' | 'warning' | 'exceeded') => {
    switch (status) {
      case 'safe':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">On Track</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
      case 'exceeded':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Exceeded</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {budgetData.monthlyStatus === 'warning' && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You've spent {budgetData.monthlyPercentage.toFixed(1)}% of your monthly budget. Consider reducing expenses to stay within budget.
          </AlertDescription>
        </Alert>
      )}
      
      {budgetData.monthlyStatus === 'exceeded' && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            You've exceeded your monthly budget by {formatAmount(budgetData.totalSpent - budget.monthly)}. 
            Consider reviewing your spending habits.
          </AlertDescription>
        </Alert>
      )}

      {/* Monthly Budget Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Monthly Budget
            </div>
            {getStatusBadge(budgetData.monthlyStatus)}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Spent: {formatAmount(budgetData.totalSpent)}</span>
            <span>Budget: {formatAmount(budget.monthly)}</span>
          </div>
          
          <div className="space-y-2">
            <div 
              className="h-3 rounded-full transition-all duration-300 overflow-hidden bg-muted"
            >
              <div 
                className={`h-full transition-all duration-300 ${getStatusColor(budgetData.monthlyStatus)}`}
                style={{ width: `${budgetData.monthlyPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{budgetData.monthlyPercentage.toFixed(1)}% used</span>
            <span>{formatAmount(budgetData.remaining)} remaining</span>
          </div>
        </CardContent>
      </Card>

      {/* Category Budgets */}
      {budgetData.categoryStatuses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Category Budgets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetData.categoryStatuses.map(({ category, budgetAmount, spent, status, percentage, remaining }) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <span>{category}</span>
                  </div>
                  <div className="text-right">
                    <div>{formatAmount(spent)} / {formatAmount(budgetAmount)}</div>
                    <div className="text-sm text-muted-foreground">{percentage.toFixed(1)}% used</div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="h-2 rounded-full transition-all duration-300 overflow-hidden bg-muted">
                    <div 
                      className={`h-full transition-all duration-300 ${getStatusColor(status)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground text-right">
                    {formatAmount(remaining)} remaining
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}