import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import Leadership from "@/components/Leadership";
import Consultants from "@/components/Consultants";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <ProjectsShowcase />
        <Services />
        <Leadership />
        <Consultants />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
