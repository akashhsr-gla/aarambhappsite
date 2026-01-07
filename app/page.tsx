import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import DownloadSection from '@/components/DownloadSection'
import AboutFounderSection from '@/components/AboutFounderSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden w-full">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <DownloadSection />
      <AboutFounderSection />
      <Footer />
    </main>
  )
} 