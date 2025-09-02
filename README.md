# Expense Tracker Website

A modern, responsive web application for tracking personal expenses, managing budgets, and visualizing financial data. Built with React, TypeScript, Vite, Supabase, and shadcn/ui.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Configuration](#configuration)
- [Styling](#styling)
- [Attributions](#attributions)
- [License](#license)

---

## Features

- **Expense Management**
  - Add, edit, and delete expenses
  - Categorize expenses
  - View recent expenses

- **Budget Overview**
  - Set and track monthly budgets
  - Visual summary of budget status

- **Charts & Analytics**
  - Interactive charts for expense breakdowns
  - Visualize spending trends

- **Settings**
  - Theme toggle (light/dark mode)
  - Currency selection

- **Responsive UI**
  - Sidebar navigation
  - Mobile-friendly layouts

---

## Tech Stack

- **Frontend**
  - React (TypeScript)
  - Vite (build tool)
  - Tailwind CSS (utility-first styling)
  - shadcn/ui (component library)
  - Lucide React (icons)
  - Recharts (data visualization)

- **Backend**
  - Supabase (database & authentication)

- **Other**
  - Radix UI (accessibility primitives)
  - Sonner (notifications)
  - Vaul (drawer UI)

---

## Project Structure

```
src
├── components      # Reusable components
├── features        # Redux features (slices)
├── hooks           # Custom React hooks
├── layouts         # App layout components
├── pages           # Page components
├── styles          # Global styles
├── utils           # Utility functions
└── App.tsx         # Main app component
```


- **src/components/**: UI and logic for expenses, budget, charts, settings, theme, etc.
- **src/styles/**: Global and theme CSS files.
- **src/supabase/**: Supabase functions and utilities.
- **src/utils/**: Utility functions for Supabase and other helpers.
- **src/guidelines/**: Project guidelines and documentation.
- **src/Favicon/**: App icons.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and add your Supabase URL and public anon key:

   ```env
   VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open your browser and navigate to `http://localhost:5173` to see the app in action.

---

## Usage

- Add Expense: Use the "Add Expense" form in  the sidebar.
- View Expenses: See recent and all expenses in the main dashboard.
- Budget: Set your monthly budget and track progress.
- Charts: Visualize your spending by category and over time.
- Settings: Change theme and currency preferences.

---

## Configuration

- **Supabase**: Configure your Supabase project credentials in src/utils/supabase/info.tsx.
- **Theme & Styling**: Customize colors and themes in src/styles/globals.css and src/index.css.
- **Icons**: Update favicon in src/Favicon/wallet.svg

---

## Styling

-Tailwind CSS: Utility classes for rapid UI development.
-Custom Properties: CSS variables for theme and color management.
-Responsive Design: Mobile-first layouts and adaptive components.

---

## Attributions

- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/en-US/)
- **Notifications**: [Sonner](https://sonner.dev/)
- **Drawer UI**: [Vaul](https://www.radix-ui.com/docs/primitives/components/drawer)

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

- Inspired by the need for personal finance management tools
- Designed with a focus on user experience and accessibility
