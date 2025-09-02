import { createContext, useContext, useState, useEffect } from 'react';

export interface Budget {
  monthly: number;
  categories: { [category: string]: number };
}

type BudgetContextType = {
  budget: Budget;
  setBudget: (budget: Budget) => void;
  updateMonthlyBudget: (amount: number) => void;
  updateCategoryBudget: (category: string, amount: number) => void;
  getBudgetStatus: (spent: number, budgetAmount: number) => 'safe' | 'warning' | 'exceeded';
  getBudgetPercentage: (spent: number, budgetAmount: number) => number;
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [budget, setBudgetState] = useState<Budget>(() => {
    const saved = localStorage.getItem('expense-tracker-budget');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      monthly: 5000, // Default monthly budget
      categories: {}
    };
  });

  useEffect(() => {
    localStorage.setItem('expense-tracker-budget', JSON.stringify(budget));
  }, [budget]);

  const setBudget = (newBudget: Budget) => {
    setBudgetState(newBudget);
  };

  const updateMonthlyBudget = (amount: number) => {
    setBudgetState(prev => ({ ...prev, monthly: amount }));
  };

  const updateCategoryBudget = (category: string, amount: number) => {
    setBudgetState(prev => ({
      ...prev,
      categories: { ...prev.categories, [category]: amount }
    }));
  };

  const getBudgetStatus = (spent: number, budgetAmount: number): 'safe' | 'warning' | 'exceeded' => {
    const percentage = (spent / budgetAmount) * 100;
    if (percentage >= 100) return 'exceeded';
    if (percentage >= 80) return 'warning';
    return 'safe';
  };

  const getBudgetPercentage = (spent: number, budgetAmount: number): number => {
    return Math.min((spent / budgetAmount) * 100, 100);
  };

  return (
    <BudgetContext.Provider value={{
      budget,
      setBudget,
      updateMonthlyBudget,
      updateCategoryBudget,
      getBudgetStatus,
      getBudgetPercentage
    }}>
      {children}
    </BudgetContext.Provider>
  );
}

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};