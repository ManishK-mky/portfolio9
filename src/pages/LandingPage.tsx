import Hero from "../components/Hero";
import SlidingPuzzle from "../components/Skills";
import MyWorks from "../components/MyWorks";

function LandingPage() {
  return (
    <div data-scroll-container>
      <Hero />
      <section className="relative py-16 bg-gradient-to-b from-[#1e1e1e] to-[#121212]">
        <div className="text-center">
          <h2 className="text-white text-4xl font-bold tracking-wide uppercase">
            My Skills
          </h2>
          <p className="text-gray-300 text-lg mt-2">
            From beginner to advanced—level up your skills!
          </p>
        </div>

        <div className="flex justify-center mt-5">
          <div
            className="bg-[#222] w-[500px] h-[600px] p-2 rounded-lg shadow-lg border border-gray-600 
        max-w-4xl w-full flex flex-col items-center"
          >
            <h3 className="text-xl text-white font-semibold">
              Skill Progression: Beginner ➝ Advanced
            </h3>
            <SlidingPuzzle />
          </div>
        </div>
      </section>
      <section>
        <MyWorks />
      </section>
    </div>
  );
}

export default LandingPage;
