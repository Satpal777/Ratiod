import { HeroSection } from "../sections/HeroSection.jsx";
import { StatsSection } from "../sections/StatsSection.jsx";
import { ShowcaseSection } from "../sections/ShowcaseSection.jsx";
import { StorySection } from "../sections/StorySection.jsx";
import { WorkflowSection } from "../sections/WorkflowSection.jsx";
import { InsightSection } from "../sections/InsightSection.jsx";
import { CtaSection } from "../sections/CtaSection.jsx";

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ShowcaseSection />
      <StorySection />
      <WorkflowSection />
      <InsightSection />
      <CtaSection />
    </>
  );
}
