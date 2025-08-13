import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEO/SEOHead';
import logo from '../assets/sharebite logo.png';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="homepage">
      <SEOHead 
        title="ShareBite - Reducing Food Waste Together"
        description="Join ShareBite to connect food donors, receivers, and volunteers. Reduce food waste and help your community by sharing surplus food with those in need."
        keywords="food waste, food donation, community sharing, surplus food, food rescue, volunteer, sustainability, ShareBite"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "ShareBite",
          "description": "Community-driven platform to reduce food waste by connecting donors, receivers, and volunteers",
          "url": window.location.origin,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        }}
      />
      {/* Hero Section */}
      <motion.section 
        className="hero"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="hero-container">
          <motion.div className="hero-content" variants={itemVariants}>
            <div className="hero-title-section">
              <motion.div 
                className="hero-logo"
                variants={floatingVariants}
                animate="animate"
              >
                <img src={logo} alt="ShareBite" className="hero-logo-image" />
              </motion.div>
              
              <motion.h1 className="hero-title" variants={itemVariants}>
                Welcome to <span className="brand-gradient">ShareBite</span>
              </motion.h1>
            </div>
            
            <motion.p className="hero-subtitle" variants={itemVariants}>
              Reducing food waste by connecting donors, receivers, and volunteers
            </motion.p>
            
            <motion.p className="hero-description" variants={itemVariants}>
              Join our community-driven platform to make a positive impact on food sustainability. 
              Whether you want to donate surplus food, receive donations, or volunteer for deliveries, 
              ShareBite makes it easy to contribute to a better world.
            </motion.p>
            
            <motion.div className="hero-actions" variants={itemVariants}>
              {!isAuthenticated() ? (
                <>
                  <Link to="/signup" className="btn btn-primary btn-large">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-outline btn-large">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                      <polyline points="10,17 15,12 10,7"></polyline>
                      <line x1="15" y1="12" x2="3" y2="12"></line>
                    </svg>
                    Sign In
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  Go to Dashboard
                </Link>
              )}
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="hero-visual"
            variants={itemVariants}
          >
            <motion.div 
              className="hero-circle"
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1]
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <div className="circle-content">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="features-container">
          <motion.h2 className="features-title" variants={itemVariants}>
            How ShareBite Works
          </motion.h2>
          
          <div className="features-grid">
            <motion.div className="feature-card" variants={itemVariants}>
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6"></path>
                  <path d="M2 7h20l-2 5H4l-2-5z"></path>
                  <path d="M12 22V7"></path>
                  <path d="M12 7H8.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                  <path d="M12 7h3.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                </svg>
              </div>
              <h3 className="feature-title">Donate Food</h3>
              <p className="feature-description">
                Restaurants, cafes, and individuals can easily donate surplus food 
                that would otherwise go to waste.
              </p>
            </motion.div>
            
            <motion.div className="feature-card" variants={itemVariants}>
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 className="feature-title">Receive Donations</h3>
              <p className="feature-description">
                Food banks, shelters, and individuals in need can find and reserve 
                available food donations in their area.
              </p>
            </motion.div>
            
            <motion.div className="feature-card" variants={itemVariants}>
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16,8 20,8 23,11 23,16 16,16 16,8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <h3 className="feature-title">Volunteer Delivery</h3>
              <p className="feature-description">
                Volunteers can help bridge the gap by assisting with food pickup 
                and delivery to those who need it most.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="stats"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="stats-container">
          <motion.h2 className="stats-title" variants={itemVariants}>
            Our Impact
          </motion.h2>
          
          <div className="stats-grid">
            <motion.div className="stat-item" variants={itemVariants}>
              <motion.div 
                className="stat-number"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                1,000+
              </motion.div>
              <div className="stat-label">Meals Saved</div>
            </motion.div>
            
            <motion.div className="stat-item" variants={itemVariants}>
              <motion.div 
                className="stat-number"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                500+
              </motion.div>
              <div className="stat-label">Active Users</div>
            </motion.div>
            
            <motion.div className="stat-item" variants={itemVariants}>
              <motion.div 
                className="stat-number"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                50+
              </motion.div>
              <div className="stat-label">Partner Organizations</div>
            </motion.div>
            
            <motion.div className="stat-item" variants={itemVariants}>
              <motion.div 
                className="stat-number"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                95%
              </motion.div>
              <div className="stat-label">Waste Reduction</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="cta"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <div className="cta-container">
          <motion.h2 className="cta-title" variants={itemVariants}>
            Ready to Make a Difference?
          </motion.h2>
          <motion.p className="cta-description" variants={itemVariants}>
            Join thousands of users who are already making an impact in their communities.
          </motion.p>
          
          {!isAuthenticated() && (
            <motion.div className="cta-actions" variants={itemVariants}>
              <Link to="/signup" className="btn btn-primary btn-large">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                Join ShareBite Today
              </Link>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;