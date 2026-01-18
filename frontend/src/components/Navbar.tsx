'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';
import RotatingLogo from './RotatingLogo/RotatingLogo';
import { cn } from '@/lib/utils/cn';
import { easeIn, easeOut } from "framer-motion";
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP ScrollToPlugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

export type NavItem = {
  title: string;
  href?: string;
  target?: string;
  children?: NavItem[];
  description?: string;
  sectionId?: string; // Add sectionId for scroll navigation
};

interface UserData {
  userID: string;
  username: string;
  permission: string;
}

interface NavbarProps {
  userData?: UserData | null;
}

const NAV_ITEMS: NavItem[] = [
  {
    title: 'الإضافة',
    children: [
      {
        title: 'هيأة الانتاج',
        sectionId: 'section-3', // Link to Section 3 (Production/التكرير)
        description: 'اضافة بيانات هيأة الانتاج',
      },
      {
        title: 'هيأة الصيانة',
        sectionId: 'section-1', // Link to Section 1 (Maintenance/الصيانة)
        description: 'اضافة بيانات هيأة الصيانة',
      },
    ],
  },
  {
    title: 'البحث',
    children: [
      {
        title: 'بحث',
        sectionId: 'section-4',
        description: 'خيارات البحث مع فلاتر متعددة وتعديل معلومات',
      },
    ],
  },
  {
    title: 'التقارير',
    children: [
      {
        title: 'تقرير هيأة الانتاج',
        sectionId: 'section-3',
        description: 'تقرير انجازية الانتاج',
      },
      {
        title: 'تقرير هيأة الصيانة',
        sectionId: 'section-1',
        description: 'تقرير تقرير انجازية هيأة الصيانة',
      },
    ],
  },
];

export function Navbar({ userData }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: easeOut },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2, ease: easeIn },
    },
  };

  const submenuVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: easeOut },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2, ease: easeIn },
    },
  };

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to section handler
  const handleScrollToSection = (sectionId: string) => {
    if (typeof window !== 'undefined') {
      gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: `#${sectionId}`,
          offsetY: 120, // Offset for navbar + news scroller height
        },
        ease: 'power2.inOut',
      });
    }
    setIsOpen(false); // Close mobile menu
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-[60px] z-40 w-full border-b shadow-sm transition-all duration-200',
        isScrolled ? 'bg-[#99a1af]' : 'bg-gray-400'
      )}
      dir="rtl"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-10 items-center justify-between">
        {/* Mobile Navigation Trigger */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-sky-100/50 transition-colors duration-300"
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
                <span className="sr-only">تبديل القائمة</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="text-right bg-background/95">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Make changes to your profile here
              </SheetDescription>
              <motion.div
                className="flex flex-col space-y-4 pt-6"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={menuVariants}
              >
                {NAV_ITEMS.map((item) => (
                  <div key={item.title} className="flex flex-col">
                    {item.children ? (
                      <>
                        <motion.button
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                          onClick={() =>
                            setActiveSubmenu(activeSubmenu === item.title ? null : item.title)
                          }
                          className={cn(
                            'flex items-center justify-between font-medium font-arabic py-2 text-base',
                            'hover:text-sky-600 hover:bg-sky-50 rounded-md px-3 transition-all duration-300'
                          )}
                        >
                          {item.title}
                          <motion.span
                            animate={{ rotate: activeSubmenu === item.title ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            ↓
                          </motion.span>
                        </motion.button>
                        <AnimatePresence>
                          {activeSubmenu === item.title && (
                            <motion.div
                              className="flex flex-col pr-4 space-y-2 mt-2"
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              variants={submenuVariants}
                            >
                              {item.children.map((child) => (
                                <button
                                  key={child.title}
                                  onClick={() =>
                                    child.sectionId && handleScrollToSection(child.sectionId)
                                  }
                                  className={cn(
                                    'text-sm py-1.5 block font-arabic text-right',
                                    'hover:text-sky-600 hover:bg-sky-50 rounded-md px-3 transition-all duration-300'
                                  )}
                                >
                                  <motion.div
                                    className="flex flex-col items-end"
                                    whileHover={{ x: 3 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <span>{child.title}</span>
                                    {child.description && (
                                      <span className="text-xs text-muted-foreground mt-1">
                                        {child.description}
                                      </span>
                                    )}
                                  </motion.div>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <button
                        onClick={() => item.sectionId && handleScrollToSection(item.sectionId)}
                        className={cn(
                          'font-medium font-arabic py-2 text-base text-right',
                          'hover:text-sky-600 hover:bg-sky-50 rounded-md px-3 transition-all duration-300'
                        )}
                      >
                        <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                          {item.title}
                        </motion.div>
                      </button>
                    )}
                  </div>
                ))}
              </motion.div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo and Company Name */}
        <Link
          href="/"
          className="md:flex gap-1.5 items-center mx-4 font-sans focus:outline-none focus:ring-0"
        >
          <div className="hidden sm:block">
            <RotatingLogo />
          </div>

          <motion.span
            className={cn(
              'inline-block sm:text-lg text-sm bg-clip-text text-black animate-pulse',
              isScrolled ? 'font-extrabold text-white' : 'font-extrabold'
            )}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            شركة مصافي الوسط - مصفى الدورة
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-2">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.title}
              className="relative group"
              onMouseEnter={() => setActiveSubmenu(item.title)}
              onMouseLeave={() => setActiveSubmenu(null)}
            >
              {item.children ? (
                <>
                  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'font-arabic text-base font-semibold px-4 py-2',
                        'hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-300'
                      )}
                    >
                      {item.title}
                      <motion.span
                        animate={{ rotate: activeSubmenu === item.title ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="mr-1"
                      >
                        ↑
                      </motion.span>
                    </Button>
                  </motion.div>
                  <AnimatePresence>
                    {activeSubmenu === item.title && (
                      <motion.div
                        className={cn(
                          'absolute right-0 mt-0.5 w-64 rounded-xl bg-popover shadow-xl border border-sky-100/50',
                          'backdrop-blur-sm'
                        )}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={submenuVariants}
                      >
                        <div className="py-2">
                          {item.children.map((child) => (
                            <button
                              key={child.title}
                              onClick={() =>
                                child.sectionId && handleScrollToSection(child.sectionId)
                              }
                              className={cn(
                                'text-sm block px-4 py-2 font-arabic text-right w-full',
                                'hover:text-sky-600 hover:bg-sky-50 rounded-md transition-all duration-300'
                              )}
                            >
                              <motion.div
                                className="flex flex-col"
                                whileHover={{ x: 3 }}
                                transition={{ duration: 0.2 }}
                              >
                                <span className="font-extrabold">{child.title}</span>
                                {child.description && (
                                  <span className="text-xs font-bold text-muted-foreground mt-1">
                                    {child.description}
                                  </span>
                                )}
                              </motion.div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <button
                  onClick={() => item.sectionId && handleScrollToSection(item.sectionId)}
                  className={cn(
                    'font-arabic text-base font-semibold px-4 py-2',
                    'hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-all duration-300'
                  )}
                >
                  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                    {item.title}
                  </motion.div>
                </button>
              )}
            </div>
          ))}
        </nav>

        {/* System Name */}
        <Link href="/" className="hidden md:flex items-center mx-4 font-arabic">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <span
              className={cn(
                'inline-block text-lg bg-clip-text text-black animate-pulse',
                isScrolled ? 'font-extrabold text-white' : 'font-bold'
              )}
            >
              نظام انجازية الشركة
            </span>
          </motion.div>
        </Link>
      </div>
    </header>
  );
}