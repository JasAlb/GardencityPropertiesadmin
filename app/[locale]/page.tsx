import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import CoreValues from "@/components/CoreValues";
import Services from "@/components/Services";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import Leadership from "@/components/Leadership";
import Consultants from "@/components/Consultants";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function LocaleHomePage() {
  return (
    <div className="flex min-h-screen flex-col gap-0 m-0 p-0">
      {/* Gapless container ensuring Navbar and Hero sit completely flush */}
      <div className="w-full m-0 p-0">
        <Navbar />
        <Hero />
      </div>
      <main className="flex-1 m-0 p-0">
        <About />
        <ProjectsShowcase />
        <Services />
        <CoreValues />
        <Leadership />
        <Consultants />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
