import { useMemo, useState } from 'react';
import { ExpenseItem } from './ExpenseItem';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Calendar, Filter, Receipt } from 'lucide-react';
import { useCurrency } from './CurrencyProvider';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
}

export function ExpenseList({ expenses, onDeleteExpense }: ExpenseListProps) {
  const { formatAmount } = useCurrency();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(expenses.map(expense => expense.category)))];

  const filteredExpenses = useMemo(() => {
    if (selectedCategory === 'all') {
      return expenses;
    }
    return expenses.filter(expense => expense.category === selectedCategory);
  }, [expenses, selectedCategory]);

  const groupedExpenses = useMemo(() => {
    const groups: { [date: string]: Expense[] } = {};
    
    filteredExpenses.forEach(expense => {
      if (!groups[expense.date]) {
        groups[expense.date] = [];
      }
      groups[expense.date].push(expense);
    });

    // Sort dates in descending order (most recent first)
    const sortedDates = Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const sortedGroups: { [date: string]: Expense[] } = {};
    sortedDates.forEach(date => {
      sortedGroups[date] = groups[date].sort((a, b) => b.id.localeCompare(a.id));
    });

    return sortedGroups;
  }, [filteredExpenses]);

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const calculateDayTotal = (expenses: Expense[]) => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="mb-2">No expenses yet</h3>
          <p className="text-muted-foreground">
            Start tracking your daily expenses by adding your first expense above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Your Expenses
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.slice(1).map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {Object.entries(groupedExpenses).map(([date, dayExpenses]) => (
        <div key={date} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <h3>{formatDateHeader(date)}</h3>
            </div>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {formatAmount(calculateDayTotal(dayExpenses))}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {dayExpenses.map(expense => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                onDelete={onDeleteExpense}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}