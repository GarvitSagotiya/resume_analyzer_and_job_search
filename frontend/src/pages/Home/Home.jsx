import React from 'react';
import HeroSection from '../../components/HeroSection/HeroSection';
import FeaturesSection from '../../components/FeaturesSection/FeaturesSection';
import ResumeUpload from '../../components/ResumeUpload/ResumeUpload';
import ResumeScore from '../../components/ResumeScore/ResumeScore';

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ResumeUpload />
      <ResumeScore />
    </>
  );
};

export default Home;