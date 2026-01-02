"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";


import HomeHero from "@/components/home";
import AboutUs from "@/components/about";
import Gallery from "@/components/gallery";
import Struktur from "@/components/strukturkls";
import Member from "@/components/memberkls";
import Esport from "@/components/esportkls";
import Music from "@/components/music";
import Testi from "@/components/testi";
import Footer from "@/components/footer";


export default function Page() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800,
      easing: "ease-out-cubic",
    });
  }, []);

  return (
    <>
      <HomeHero />
      <AboutUs/>
      <Gallery/>
      <Struktur/>
      <Member/>
      <Esport/>
      <Music/>
      <Testi/>
      <Footer/>
    </>
  );
}
