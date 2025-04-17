"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, ChevronUp, Globe, Plus, Moon, Sun, Activity, RefreshCw, Clock, Server, AlertCircle, AlertTriangle } from 'lucide-react';
import { useWebsites } from '@/hooks/useWebsites';
import axios from 'axios';
import { API_BACKEND_URL } from '@/config';
import { useAuth, UserButton } from '@clerk/nextjs';
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

type UptimeStatus = "good" | "bad" | "unknown";

function StatusCircle({ status }: { status: UptimeStatus }) {
  return (
    <div className={`w-3 h-3 rounded-full ${status === 'good' ? 'bg-green-500' : status === 'bad' ? 'bg-red-500' : 'bg-gray-500'}`} />
  );
}

function UptimeTicks({ ticks }: { ticks: UptimeStatus[] }) {
  return (
    <div className="flex gap-1 mt-2">
      {ticks.map((tick, index) => (
        <div
          key={index}
          className={`w-8 h-2 rounded ${
            tick === 'good' ? 'bg-green-500' : tick === 'bad' ? 'bg-red-500' : 'bg-gray-500'
          }`}
        />
      ))}
    </div>
  );
}

function CreateWebsiteModal({ isOpen, onClose }: { isOpen: boolean; onClose: (url: string | null) => void }) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (!isOpen) return null;

  const handleSubmit = () => {
    // Basic URL validation
    if (!url) {
      setError("Please enter a URL");
      return;
    }
    
    // Check if URL has proper format
    try {
      new URL(url);
      setError(null);
      setIsLoading(true);
      onClose(url);
    } catch (e) {
      setError("Please enter a valid URL (e.g., https://example.com)");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-xl"
      >
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Add New Website</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            URL
          </label>
          <input
            type="url"
            className={`w-full px-3 py-2 border ${error ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all`}
            placeholder="https://example.com"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {error && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1" /> {error}
            </p>
          )}
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="ghost"
            onClick={() => onClose(null)}
            className="text-gray-700 dark:text-gray-300"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Website'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

interface ProcessedWebsite {
  id: string;
  url: string;
  status: UptimeStatus;
  uptimePercentage: number;
  lastChecked: string;
  uptimeTicks: UptimeStatus[];
}

function WebsiteCard({ website }: { website: ProcessedWebsite }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div
        className="p-5 cursor-pointer flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <StatusCircle status={website.status} />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{website.url}</h3>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`text-sm font-medium ${
            website.uptimePercentage > 99 ? 'text-green-600 dark:text-green-400' : 
            website.uptimePercentage > 95 ? 'text-yellow-600 dark:text-yellow-400' : 
            'text-red-600 dark:text-red-400'
          }`}>
            {website.uptimePercentage.toFixed(1)}% uptime
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700">
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Last 30 minutes status:</p>
            <UptimeTicks ticks={website.uptimeTicks} />
          </div>
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-3">
            <Clock className="w-3 h-3 mr-1" />
            <span>Last checked: {website.lastChecked}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

function DashboardStats({ websites }: { websites: ProcessedWebsite[] }) {
  const totalWebsites = websites.length;
  const healthyWebsites = websites.filter(w => w.status === 'good').length;
  const criticalWebsites = websites.filter(w => w.status === 'bad').length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <motion.div 
        whileHover={{ y: -4 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Monitored</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalWebsites}</h3>
          </div>
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        whileHover={{ y: -4 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Healthy</p>
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{healthyWebsites}</h3>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <Server className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        whileHover={{ y: -4 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Critical</p>
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{criticalWebsites}</h3>
          </div>
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function App() {
  const { theme, setTheme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {websites, refreshWebsites} = useWebsites();
  const { getToken } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isApiAlive, setIsApiAlive] = useState<boolean | null>(null);

  // Add smooth scrolling behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Check if the API is reachable
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        await axios.get(`${API_BACKEND_URL}/health`, { timeout: 3000 });
        setIsApiAlive(true);
      } catch (error) {
        console.error("API health check failed:", error);
        setIsApiAlive(false);
      }
    };
    
    checkApiStatus();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshWebsites();
      setApiError(null);
    } catch (error) {
      setApiError("Failed to refresh data. The backend service might be offline.");
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  const processedWebsites = useMemo(() => {
    return websites.map(website => {
      // Sort ticks by creation time
      const sortedTicks = [...website.ticks].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Get the most recent 30 minutes of ticks
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      const recentTicks = sortedTicks.filter(tick => 
        new Date(tick.createdAt) > thirtyMinutesAgo
      );

      // Aggregate ticks into 3-minute windows (10 windows total)
      const windows: UptimeStatus[] = [];

      for (let i = 0; i < 10; i++) {
        const windowStart = new Date(Date.now() - (i + 1) * 3 * 60 * 1000);
        const windowEnd = new Date(Date.now() - i * 3 * 60 * 1000);
        
        const windowTicks = recentTicks.filter(tick => {
          const tickTime = new Date(tick.createdAt);
          return tickTime >= windowStart && tickTime < windowEnd;
        });

        // Window is considered up if majority of ticks are up
        const upTicks = windowTicks.filter(tick => tick.status === 'Good').length;
        windows[9 - i] = windowTicks.length === 0 ? "unknown" : (upTicks / windowTicks.length) >= 0.5 ? "good" : "bad";
      }

      // Calculate overall status and uptime percentage
      const totalTicks = sortedTicks.length;
      const upTicks = sortedTicks.filter(tick => tick.status === 'Good').length;
      const uptimePercentage = totalTicks === 0 ? 100 : (upTicks / totalTicks) * 100;

      // Get the most recent status
      const currentStatus = windows[windows.length - 1] || "unknown";

      // Format the last checked time
      const lastChecked = sortedTicks[0]
        ? new Date(sortedTicks[0].createdAt).toLocaleTimeString()
        : 'Never';

      return {
        id: website.id,
        url: website.url,
        status: currentStatus,
        uptimePercentage,
        lastChecked,
        uptimeTicks: windows,
      };
    });
  }, [websites]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 text-black dark:text-white transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-[#0f1123] text-white border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            <span className="text-lg font-semibold">UPNode</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-full hover:bg-white/10 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
              aria-label="Refresh data"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-white/10 transition-all"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9",
                  userButtonTrigger: "focus:shadow-none focus:outline-none",
                },
              }}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4 md:px-6">
        {isApiAlive === false && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-lg border border-amber-200 dark:border-amber-800 flex items-start">
            <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium">Backend service is not running</h3>
              <p className="text-sm mt-1">The API at {API_BACKEND_URL} is not reachable. Please start the backend service with:</p>
              <pre className="mt-2 p-2 bg-black/10 dark:bg-black/20 rounded text-xs font-mono overflow-x-auto">cd apps/api && bun start</pre>
            </div>
          </div>
        )}
        
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p>{apiError}</p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Uptime Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Monitor your services in real-time</p>
          </div>
          
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isApiAlive === false}
          >
            <Plus className="w-4 h-4" />
            <span>Add Website</span>
          </Button>
        </div>
        
        {/* Dashboard Stats */}
        <DashboardStats websites={processedWebsites} />
        
        {/* Websites List */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Monitored Websites</h2>
        
        <div className="space-y-4">
          {processedWebsites.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
              <Globe className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No websites yet</h3>
              <p className="text-gray-500 dark:text-gray-400">Add your first website to start monitoring</p>
            </div>
          ) : (
            processedWebsites.map((website) => (
              <WebsiteCard key={website.id} website={website} />
            ))
          )}
        </div>
      </div>

      <CreateWebsiteModal
        isOpen={isModalOpen}
        onClose={async (url) => {
          if (url === null) {
            setIsModalOpen(false);
            return;
          }

          try {
            const token = await getToken();
            setIsModalOpen(false);
            
            await axios.post(`${API_BACKEND_URL}/api/v1/website`, {
              url,
            }, {
              headers: {
                Authorization: token,
              },
            });
            
            await refreshWebsites();
            setApiError(null);
          } catch (error) {
            console.error("Error adding website:", error);
            setApiError("Failed to add website. The backend service might be offline.");
          }
        }}
      />
    </div>
  );
}

export default App;