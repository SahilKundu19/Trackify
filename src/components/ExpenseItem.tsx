import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Trash2, Calendar, Tag, FileText } from 'lucide-react';
import { useCurrency } from './CurrencyProvider';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
}

const categoryColors: { [key: string]: string } = {
  'Food & Dining': 'bg-orange-100 text-orange-800',
  'Transportation': 'bg-blue-100 text-blue-800',
  'Shopping': 'bg-purple-100 text-purple-800',
  'Entertainment': 'bg-pink-100 text-pink-800',
  'Bills & Utilities': 'bg-gray-100 text-gray-800',
  'Healthcare': 'bg-red-100 text-red-800',
  'Education': 'bg-green-100 text-green-800',
  'Travel': 'bg-indigo-100 text-indigo-800',
  'Other': 'bg-yellow-100 text-yellow-800'
};

export function ExpenseItem({ expense, onDelete }: ExpenseItemProps) {
  const { formatAmount } = useCurrency();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold text-primary">
                {formatAmount(expense.amount)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(expense.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{expense.description}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <Badge 
                  variant="secondary" 
                  className={categoryColors[expense.category] || 'bg-gray-100 text-gray-800'}
                >
                  {expense.category}
                </Badge>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(expense.date)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}