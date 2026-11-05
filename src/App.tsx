import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Views
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { ProductDetailView } from './views/ProductDetailView';
import { SmartFinderView } from './views/SmartFinderView';
import { BudgetCalculatorView } from './views/BudgetCalculatorView';
import { ComparisonView } from './views/ComparisonView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { PaymentView } from './views/PaymentView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { MyOrdersView } from './views/MyOrdersView';
import { MyInvoicesView } from './views/MyInvoicesView';
import { ProfileView } from './views/ProfileView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { HardwareGalleryView } from './views/HardwareGalleryView';

const MainRouter: React.FC = () => {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'hardware-gallery':
        return <HardwareGalleryView />;
      case 'catalog':
        return <CatalogView />;
      case 'product-detail':
        return <ProductDetailView />;
      case 'smart-finder':
        return <SmartFinderView />;
      case 'budget-calc':
        return <BudgetCalculatorView />;
      case 'comparison':
        return <ComparisonView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'payment':
        return <PaymentView />;
      case 'order-confirmation':
        return <OrderConfirmationView />;
      case 'my-orders':
        return <MyOrdersView />;
      case 'my-invoices':
        return <MyInvoicesView />;
      case 'profile':
        return <ProfileView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'admin':
        return <AdminDashboardView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
