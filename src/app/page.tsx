import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="image-container flex items-center justify-center mb-12">
        <header className="header-bg text-center">
          <h1 className="text-4xl font-bold mb-4 text-white">
            Welcome to AgriConnect
          </h1>
          <p className="text-lg text-gray-300">
            Connect with fellow farmers, experts, and sell your products online.
          </p>
        </header>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-8">
        <div className="p-6 bg-white rounded-lg shadow-lg py-10">
          <h2 className="text-4xl font-semibold mb-2 text-black">
            About AgriConnect
          </h2>
          <p className="text-gray-700 mb-4 text-2xl">
            AgriConnect is a platform that allows farmers to connect with each
            other, share knowledge with agricultural experts, and find a
            marketplace to sell their products directly to consumers.
          </p>
          <p className="text-gray-700 mb-4 text-2xl">
            Our mission is to empower the farming community by providing a
            simple, efficient, and accessible solution to network and thrive.
          </p>
          <Link href="/signup">
            <span className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300">
              Get Started
            </span>
          </Link>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-lg">
          <Image
            src="/images/farmer-working-field.jpeg" // Replace with actual path to image in your public folder
            alt="Farmers working in the field"
            width={500}
            height={300}
            className="rounded-md mx-auto"
          />
        </div>
      </section>

      <section className="mt-16 p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-black underline">
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-black">
              Connect with Experts
            </h3>
            <p className="text-gray-600">
              Gain insights and advice from agricultural experts to improve your
              farming practices.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-black">
              Sell Your Products
            </h3>
            <p className="text-gray-600">
              Access a marketplace to sell your crops and products directly to
              consumers.
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-2 text-black">
              Collaborate with Farmers
            </h3>
            <p className="text-gray-600">
              Build relationships with fellow farmers and collaborate on
              projects and ideas.
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-16 text-center">
        <p className="text-gray-600">
          Want to learn more?{" "}
          <Link href="/about">
            <span className="text-green-600 hover:underline">Click here</span>
          </Link>{" "}
          to discover what FarmerConnection has to offer.
        </p>
      </footer>
    </div>
  );
}
