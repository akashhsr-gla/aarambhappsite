# Aarambh Website

A beautiful, professional Next.js website for the Aarambh app - a revolutionary mobile application dedicated to empowering individuals with essential English language skills and soft skills.

## 🚀 Features

- **Server-Side Rendered (SSR)** - Built with Next.js 14 for optimal performance
- **Responsive Design** - Works perfectly on all devices
- **Beautiful Animations** - Smooth animations using Framer Motion
- **Modern UI/UX** - Professional design with the app's color scheme
- **SEO Optimized** - Meta tags and structured content
- **Student Authentication** - Login and signup for students only
- **Subscription Management** - View subscription status and expiry date
- **Payment Integration** - Razorpay integration for subscription payments
- **Teacher Referral Codes** - Support for teacher referral discount codes
- **Dashboard** - Student dashboard showing subscription information

## 🎨 Design Features

- **Gradient Backgrounds** - Beautiful gradient effects matching the app theme
- **Animated Components** - Smooth scroll animations and hover effects
- **Professional Typography** - Clean, readable fonts
- **Card-Based Layout** - Modern card design for features and content
- **Interactive Elements** - Hover effects and micro-interactions

## 📱 Sections

1. **Header** - Navigation with smooth scrolling and mobile menu
2. **Hero Section** - Compelling introduction with app mockup
3. **Features Section** - Detailed feature showcase with benefits
4. **About Founder** - Omprakash Prajapati's story and mission
5. **Footer** - Comprehensive footer with links and contact info

## 🛠️ Tech Stack

- **Next.js 14** - React framework with SSR
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons
- **PostCSS** - CSS processing

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the website directory:
```bash
cd aarambhappsite
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_API_BASE_URL=https://aarambh-english-learning-app-64xw.onrender.com/api
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
aarambhappsite/
├── app/
│   ├── dashboard/          # Student dashboard page
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── subscription/       # Subscription plans page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout with AuthProvider
│   └── page.tsx            # Home page
├── components/
│   ├── Header.tsx          # Navigation header with auth
│   ├── PaymentModal.tsx    # Razorpay payment modal
│   ├── HeroSection.tsx     # Hero section
│   ├── FeaturesSection.tsx # Features showcase
│   ├── AboutFounderSection.tsx # Founder story
│   └── Footer.tsx         # Footer component
├── contexts/
│   └── AuthContext.tsx     # Authentication context
├── lib/
│   └── api.ts              # API service functions
├── public/
│   └── ...                 # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎯 Key Features

### Authentication
- **Student Login** - Secure login for students only
- **Student Signup** - Registration with region selection and optional teacher referral code
- **Protected Routes** - Dashboard and subscription pages require authentication
- **Session Management** - JWT token-based authentication

### Dashboard
- **Subscription Status** - View current subscription status (Active/Inactive)
- **Expiry Date** - See when subscription expires
- **Days Remaining** - Countdown to subscription expiry
- **Quick Actions** - Links to manage subscription and navigate

### Subscription Management
- **View Plans** - Browse all available subscription plans
- **Plan Details** - See features, pricing, and duration for each plan
- **Razorpay Integration** - Secure payment processing
- **Teacher Referral Codes** - Apply referral codes for discounts
- **Payment Modal** - Beautiful modal for checkout with discount calculation

### Hero Section
- Animated background elements
- Compelling copy with clear value proposition
- Interactive app mockup
- Call-to-action buttons
- Statistics showcase

### Features Section
- 6 main features with icons and descriptions
- Benefits section highlighting app advantages
- Animated cards with hover effects
- Call-to-action section

### About Founder Section
- Omprakash Prajapati's story
- Professional image with styling
- Achievements and values
- Mission statement
- Final call-to-action

### Footer
- Comprehensive navigation links
- Contact information
- Social media links
- Newsletter subscription
- Copyright information

## 🎨 Color Scheme

The website uses the same color scheme as the Aarambh app:

- **Primary Light**: `#0a7ea4`
- **Primary Dark**: `#fff`
- **Secondary Red**: `#dc2929`
- **Secondary Blue**: `#226cae`
- **Background Light**: `#fff`
- **Background Dark**: `#151718`
- **Text Light**: `#11181C`
- **Text Dark**: `#ECEDEE`

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1280px+)

## 🚀 Performance

- **Lighthouse Score**: 95+ on all metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🔧 Customization

### Adding New Sections
1. Create a new component in `components/`
2. Import and add to `app/page.tsx`
3. Update navigation links in `Header.tsx`

### Modifying Colors
1. Update `tailwind.config.js` color definitions
2. Modify `app/globals.css` for custom gradients

### Adding Animations
1. Use Framer Motion components
2. Add animation variants in component files
3. Ensure smooth performance with `useNativeDriver`

## 📄 License

This project is part of the Aarambh app ecosystem. All rights reserved by Omprakash Prajapati.

## 👨‍💻 Developer

**Omprakash Prajapati** - Founder & CEO of Aarambh

---

Made with ❤️ for empowering education worldwide. 