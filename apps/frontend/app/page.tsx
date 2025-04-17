"use client";
import React, { useEffect, useState, ReactNode } from 'react';
import { Activity, Bell, Clock, Server, ArrowRight, Check, Moon, Sun, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

function App() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  
  useEffect(() => {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white transition-colors duration-300">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0f1123] text-white border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-purple-500" />
            <span className="text-lg font-semibold">UPNode</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-white/80 hover:text-white transition-colors">Testimonials</a>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-white/10 transition"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm" className="text-white hover:text-white/80">
                    Sign In
                  </Button>
                </SignInButton>
                
                <SignUpButton mode="modal">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>
              
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9",
                      userButtonTrigger: "focus:shadow-none focus:outline-none",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Monitor Your Services with <span className="text-indigo-600 dark:text-indigo-400">Confidence</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
              Get instant alerts when your services go down. Monitor uptime, performance, and ensure your business never misses a beat.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <motion.button 
                onClick={() => router.push('/dashboard')} 
                className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition flex items-center justify-center shadow-lg hover:shadow-indigo-500/20"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Monitoring
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
              <motion.button 
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition dark:text-white flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Demo
              </motion.button>
            </div>
          </motion.div>
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                alt="Dashboard"
                className="w-full h-auto"
                width={800}
                height={500}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-transparent rounded-xl"></div>
            </div>
            <div className="absolute -z-10 top-0 right-0 h-72 w-72 bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-3xl"></div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <SectionWrapper>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10">
          <StatCard number="99.9%" label="Uptime Guarantee" />
          <StatCard number="150+" label="Countries Covered" />
          <StatCard number="5,000+" label="Active Users" />
          <StatCard number="1M+" label="Checks Per Day" />
        </div>
      </SectionWrapper>

      {/* Features */}
      <section id="features" className="bg-gray-50 dark:bg-gray-800/50 py-24">
        <div className="container mx-auto px-6">
          <SectionHeader
            title="Everything you need for reliable monitoring"
            subtitle="Comprehensive tools to keep your services running smoothly"
          />
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <FeatureCard
              icon={<Bell className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />}
              title="Instant Alerts"
              description="Get notified immediately when your services experience downtime through multiple channels."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />}
              title="24/7 Monitoring"
              description="Round-the-clock monitoring from multiple locations worldwide."
            />
            <FeatureCard
              icon={<Server className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />}
              title="Detailed Reports"
              description="Comprehensive reports and analytics to track your service performance."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works">
        <SectionWrapper>
          <SectionHeader
            title="How It Works"
            subtitle="Simple setup, powerful monitoring"
          />
          
          <div className="mt-16 grid md:grid-cols-3 gap-12">
            <ProcessStep
              number="01"
              title="Connect Your Services"
              description="Add your websites, APIs, and servers in just a few clicks."
            />
            <ProcessStep
              number="02"
              title="Configure Alerts"
              description="Set up notification channels and define alert conditions."
            />
            <ProcessStep
              number="03"
              title="Stay Informed"
              description="Get real-time alerts and detailed performance data."
            />
          </div>
        </SectionWrapper>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-6">
          <SectionHeader
            title="Simple, transparent pricing"
            subtitle="No hidden fees or long-term commitments"
          />
          
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <PricingCard
              title="Starter"
              price="29"
              features={[
                "10 monitors",
                "1-minute checks",
                "Email notifications",
                "5 team members",
                "24h data retention"
              ]}
            />
            <PricingCard
              title="Professional"
              price="79"
              featured={true}
              features={[
                "50 monitors",
                "30-second checks",
                "All notification channels",
                "Unlimited team members",
                "30-day data retention",
                "API access"
              ]}
            />
            <PricingCard
              title="Enterprise"
              price="199"
              features={[
                "Unlimited monitors",
                "15-second checks",
                "Priority support",
                "Custom solutions",
                "90-day data retention",
                "SLA guarantee"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials">
        <SectionWrapper>
          <SectionHeader
            title="Trusted by developers worldwide"
            subtitle="See what our customers are saying"
          />
          
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Testimonial
              quote="UPNode has been crucial for our business. We know immediately when our services are affected."
              author="Sarah Johnson"
              role="CTO, TechCorp"
            />
            <Testimonial
              quote="The detailed analytics have helped us identify and fix performance bottlenecks we didn't know existed."
              author="Michael Chen"
              role="DevOps Lead, StartupX"
            />
            <Testimonial
              quote="Setting up monitoring for our entire infrastructure took less than an hour. Impressive!"
              author="Elena Rodriguez"
              role="System Administrator, EnterpriseY"
            />
          </div>
        </SectionWrapper>
      </section>

      {/* CTA */}
      <div className="bg-indigo-600 dark:bg-indigo-700 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to start monitoring?</h2>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of companies that trust UPNode for their critical services.
          </p>
          <motion.button 
            onClick={() => router.push('/signup')} 
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition font-medium shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Free Trial
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-2">
                <Activity className="h-6 w-6 text-indigo-400" />
                <span className="text-xl font-bold">UPNode</span>
              </div>
              <p className="mt-4 text-gray-400 max-w-xs">
                Keeping your services online, always. Enterprise-grade monitoring for businesses of all sizes.
              </p>
              <div className="mt-6 flex space-x-4">
                <SocialIcon icon="twitter" />
                <SocialIcon icon="github" />
                <SocialIcon icon="linkedin" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <FooterLink href="#features">Features</FooterLink>
                <FooterLink href="#pricing">Pricing</FooterLink>
                <FooterLink href="#testimonials">Testimonials</FooterLink>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <FooterLink href="#">About</FooterLink>
                <FooterLink href="#">Blog</FooterLink>
                <FooterLink href="#">Careers</FooterLink>
                <FooterLink href="#">Contact</FooterLink>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <FooterLink href="#">Privacy</FooterLink>
                <FooterLink href="#">Terms</FooterLink>
                <FooterLink href="#">Security</FooterLink>
                <FooterLink href="#">GDPR</FooterLink>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 UPNode. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Reusable Section Wrapper with animations
function SectionWrapper({ children }: { children: ReactNode }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24">
      <motion.div 
        className="container mx-auto px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>
    </section>
  );
}

// Section Header component
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// Animated Feature Card
function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <motion.div 
      ref={ref}
      className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="mb-5 p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg inline-block">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
}

// Pricing Card with hover effects
function PricingCard({ title, price, features, featured = false }: { 
  title: string; 
  price: string; 
  features: string[]; 
  featured?: boolean 
}) {
  return (
    <motion.div 
      className={`p-8 rounded-xl shadow-xl ${
        featured
          ? 'bg-indigo-600 text-white ring-4 ring-indigo-300 dark:ring-indigo-500 relative z-10 scale-105 shadow-xl shadow-indigo-500/20'
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:shadow-2xl transition-shadow'
      }`}
      whileHover={!featured ? { scale: 1.03 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {featured && (
        <div className="absolute -top-4 left-0 right-0 text-center">
          <span className="bg-indigo-500 text-white text-sm font-medium px-4 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">${price}</span>
        <span className="text-sm">/month</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center space-x-3">
            <Check className={`h-5 w-5 ${featured ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <motion.button
        className={`w-full py-3 rounded-lg transition ${
          featured
            ? 'bg-white text-indigo-600 hover:bg-gray-100 dark:hover:bg-gray-200'
            : 'bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600'
        }`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        Get Started
      </motion.button>
    </motion.div>
  );
}

// Stat Card
function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center p-6">
      <div className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
        {number}
      </div>
      <div className="text-gray-600 dark:text-gray-300">{label}</div>
    </div>
  );
}

// Process Step
function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{number}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

// Testimonial Card
function Testimonial({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <div className="mb-4 text-indigo-600 dark:text-indigo-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4">{quote}</p>
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{author}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
      </div>
    </div>
  );
}

// Social Icon
function SocialIcon({ icon }: { icon: string }) {
  return (
    <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-indigo-600 flex items-center justify-center transition-colors">
      <span className="sr-only">{icon}</span>
      <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 0" />
      </svg>
    </a>
  );
}

// Footer Link
function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <a 
        href={href} 
        className="hover:text-indigo-400 transition-colors flex items-center group"
      >
        <span>{children}</span>
        <ChevronRight className="h-4 w-0 group-hover:w-4 overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100" />
      </a>
    </li>
  );
}

export default App;