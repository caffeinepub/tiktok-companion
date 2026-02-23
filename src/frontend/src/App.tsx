import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Hashtags from './pages/Hashtags';
import Landing from './pages/Landing';
import Settings from './pages/Settings';
import AuthGuard from './components/AuthGuard';
import { Toaster } from '@/components/ui/sonner';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  ),
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calendar',
  component: () => (
    <AuthGuard>
      <Calendar />
    </AuthGuard>
  ),
});

const hashtagsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hashtags',
  component: () => (
    <AuthGuard>
      <Hashtags />
    </AuthGuard>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <AuthGuard>
      <Settings />
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  dashboardRoute,
  calendarRoute,
  hashtagsRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
