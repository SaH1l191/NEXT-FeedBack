 
import Footer from "@/components/LandingPage/Footer";
import LandingPage from "@/components/LandingPage/LandingPage";
import Image from "next/image"; 
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24"> 
      <LandingPage/>
      <Footer/>
    </main>
  );
}
