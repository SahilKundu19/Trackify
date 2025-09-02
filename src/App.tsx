import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { CurrencyProvider } from './components/CurrencyProvider';
import { BudgetProvider } from './components/BudgetProvider';
import { ExpenseForm } from './components/ExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { ExpenseStats } from './components/ExpenseStats';
import { ExpenseCharts } from './components/ExpenseCharts';
import { BudgetOverview } from './components/BudgetOverview';
import { Settings } from './components/Settings';
import { ThemeToggle } from './components/ThemeToggle';
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger
} from './components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Wallet, BarChart3, List, Plus, PieChart, Target, Settings as SettingsIcon } from 'lucide-react';
import { useCurrency } from './components/CurrencyProvider';

interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

function AppContent() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activeView, setActiveView] = useState('overview');
  const { formatAmount } = useCurrency();

  // Load expenses from localStorage on component mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save expenses to localStorage whenever expenses change
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'budget', label: 'Budget', icon: Target },
    { id: 'charts', label: 'Charts', icon: PieChart },
    { id: 'expenses', label: 'Expenses', icon: List },
    { id: 'add', label: 'Add Expense', icon: Plus },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <div className="space-y-6">
            <ExpenseStats expenses={expenses} />
            {expenses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Expenses</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {expenses.slice(0, 5).map(expense => (
                      <div key={expense.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-muted-foreground">{expense.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatAmount(expense.amount)}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      case 'budget':
        return <BudgetOverview expenses={expenses} />;
      case 'charts':
        return <ExpenseCharts expenses={expenses} />;
      case 'expenses':
        return <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} />;
      case 'add':
        return <ExpenseForm onAddExpense={addExpense} />;
      case 'settings':
        return <Settings />;
      default:
        return <div>Select a view from the sidebar</div>;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar collapsible="icon">
          {/* Sidebar Header */}
          <SidebarHeader className="h-[84px]"> 
            <div className="flex items-center gap-6 h-[84px]">
              <div className="p-3 bg-primary rounded-md text-primary-foreground flex-shrink-0">
                <Wallet className="h-6 w-6" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-3xl font-extrabold tracking-tight text-primary truncate" style={{fontSize: '40px', fontWeight: 500}}>Trackify</span>
                <span className="text-xs text-muted-foreground truncate" style={{fontSize: '0.9rem'}}>Your Smart Finance Tracker</span>
              </div>
            </div>
          </SidebarHeader>

          {/* Sidebar Navigation Content */}
          <SidebarContent>
            <SidebarGroup style={{height : '300px'}}>
              <SidebarGroupContent style={{height : '250px'}}>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <SidebarMenuItem key={item.id} style={{height : '57px'}}>
                        <SidebarMenuButton
                          isActive={activeView === item.id}
                          onClick={() => setActiveView(item.id)}
                          tooltip={item.label}
                        >
                          <IconComponent className="h-4 w-4" style={{height : '24px', width : '24px'}}/>
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* Sidebar Footer */}
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeView === 'settings'}
                  onClick={() => setActiveView('settings')}
                  tooltip="Settings"
                >
                  <SettingsIcon className="h-4 w-4" style={{height : '24px', width : '24px'}}/>
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          {/* Main Content Area */}
          <div className="flex flex-col h-full">
            {/* Header with sidebar trigger and total expenses */}
            <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b" style={{height : '96px'}}>
              <SidebarTrigger style={{height : '30px', width : '30px'}}/>
              <div className="flex items-center gap-2 flex-1">
                <h1 className="text-4xl font-semibold">
                  {navigationItems.find(item => item.id === activeView)?.label || 
                   (activeView === 'settings' ? 'Settings' : 'Expense Tracker')}
                </h1>
              </div>
              <div className="flex items-center justify-center p-4">
                <ThemeToggle />
              </div>
            </header>
              <Card className="flex-shrink-0" style={{width : '268px', margin: '20px'}}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Total Expenses</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xl font-bold">{formatAmount(totalExpenses)}</div>
                </CardContent>
              </Card>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-6">
              {renderContent()}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="expense-tracker-theme">
      <CurrencyProvider>
        <BudgetProvider>
          <AppContent />
        </BudgetProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}