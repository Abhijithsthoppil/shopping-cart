import heroImage from '../../../public/portfolio.png';

const HeroSection = () => (
    <section className="relative bg-gradient-to-br from-white via-blue-50 to-blue-100 py-20">
    <div className="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:justify-between lg:gap-12">
      {/* Text Content */}
      <div className="lg:w-1/2 text-center lg:text-left space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
          Your One-Stop Shop for <span className="text-blue-600">Everything!</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-xl">
          Discover top-notch products at unbeatable prices. Shop with confidence and enjoy exclusive online deals tailored just for you!
        </p>
      </div>

      {/* Image */}
      <div className="mt-12 lg:mt-0 lg:w-1/2">
        <img
          src={heroImage}
          alt="Shopping illustration"
          className="w-full h-auto rounded-2xl shadow-xl"
        />
      </div>
    </div>
  </section>
);

export default HeroSection;
