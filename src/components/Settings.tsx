import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Settings as SettingsIcon, DollarSign, Target, Palette } from 'lucide-react';
import { useCurrency, currencies, Currency } from './CurrencyProvider';
import { useBudget } from './BudgetProvider';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from './ThemeProvider';

const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
];

export function Settings() {
  const { currency, setCurrency, formatAmount } = useCurrency();
  const { budget, updateMonthlyBudget, updateCategoryBudget } = useBudget();
  const { theme } = useTheme();
  
  const [monthlyBudget, setMonthlyBudget] = useState(budget.monthly.toString());
  const [categoryBudgets, setCategoryBudgets] = useState<{ [key: string]: string }>(
    Object.fromEntries(
      categories.map(cat => [cat, (budget.categories[cat] || 0).toString()])
    )
  );

  const handleSaveBudgets = () => {
    updateMonthlyBudget(parseFloat(monthlyBudget) || 0);
    
    categories.forEach(category => {
      const amount = parseFloat(categoryBudgets[category]) || 0;
      if (amount > 0) {
        updateCategoryBudget(category, amount);
      }
    });
  };

  const handleCurrencyChange = (currencyCode: string) => {
    const newCurrency = currencies.find(c => c.code === currencyCode);
    if (newCurrency) {
      setCurrency(newCurrency);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Theme Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <Label>Theme</Label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Choose your preferred theme</p>
                <p className="text-xs text-muted-foreground">
                  Current: {theme.charAt(0).toUpperCase() + theme.slice(1)}
                </p>
              </div>
              <ThemeToggle />
            </div>
          </div>

          <Separator />

          {/* Currency Settings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <Label>Currency</Label>
            </div>
            <div className="space-y-2">
              <Select value={currency.code} onValueChange={handleCurrencyChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.code} value={curr.code}>
                      <div className="flex items-center gap-2">
                        <span>{curr.symbol}</span>
                        <span>{curr.name} ({curr.code})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                All amounts will be displayed in {currency.name}. 
                Exchange rates are approximate and for display purposes only.
              </p>
            </div>
          </div>

          <Separator />

          {/* Budget Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <Label>Budget Settings</Label>
            </div>
            
            {/* Monthly Budget */}
            <div className="space-y-2">
              <Label htmlFor="monthly-budget">Monthly Budget</Label>
              <Input
                id="monthly-budget"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter monthly budget"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Set your total monthly spending limit
              </p>
            </div>

            {/* Category Budgets */}
            <div className="space-y-3">
              <Label>Category Budgets (Optional)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categories.map((category) => (
                  <div key={category} className="space-y-1">
                    <Label htmlFor={`budget-${category}`} className="text-sm">
                      {category}
                    </Label>
                    <Input
                      id={`budget-${category}`}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={categoryBudgets[category]}
                      onChange={(e) => setCategoryBudgets(prev => ({
                        ...prev,
                        [category]: e.target.value
                      }))}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Set individual category spending limits to track specific areas
              </p>
            </div>

            <Button onClick={handleSaveBudgets} className="w-full">
              Save Budget Settings
            </Button>
          </div>

          <Separator />

          {/* Current Budget Summary */}
          <div className="space-y-2">
            <Label>Current Budget Summary</Label>
            <div className="bg-muted p-3 rounded-lg space-y-1">
              <div className="flex justify-between">
                <span className="text-sm">Monthly Budget:</span>
                <span className="text-sm font-medium">{formatAmount(budget.monthly)}</span>
              </div>
              {Object.entries(budget.categories).filter(([_, amount]) => amount > 0).map(([category, amount]) => (
                <div key={category} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{category}:</span>
                  <span>{formatAmount(amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}