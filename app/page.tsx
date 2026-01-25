import Hero from "@/components/Hero";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section (Sabse Upar) */}
      <Hero />

      {/* Yahan hum baad me 'Featured Categories' banayenge */}
      <section className="py-20 text-center bg-gray-50">
        <h2 className="text-3xl font-serif text-gray-800">Latest Collection Coming Soon...</h2>
      </section>

    </div>
  );
}