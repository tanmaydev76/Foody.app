import Image from 'next/image';
import { Users, Award, Truck, Heart } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { icon: Users, label: 'Happy Customers',     value: '2M+' },
    { icon: Award, label: 'Restaurant Partners', value: '500+' },
    { icon: Truck, label: 'Cities Served',       value: '50+' },
    { icon: Heart, label: 'Orders Delivered',    value: '10M+' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-base-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid md:grid-cols-2 gap-8 sm:gap-10 items-center">
          <div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
              Bringing great food <span className="text-primary">closer to you</span>
            </h1>
            <p className="text-muted mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed">
              Foody was founded with a simple mission — to connect people with the food they love,
              delivered fast, fresh and with a smile. From street-side favourites to fine dining,
              we partner with the best restaurants across India to bring every flavour to your doorstep.
            </p>
          </div>
          <div className="relative h-52 sm:h-72 md:h-96 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl bg-base-secondary">
            <Image src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&auto=format&q=80" alt="Our story" fill unoptimized className="object-cover" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-base rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
              <s.icon className="text-primary mx-auto mb-2 sm:mb-3" size={24} />
              <p className="text-xl sm:text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs sm:text-sm text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-20">
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { title: 'Our Mission', body: 'To make great food accessible to everyone, everywhere — quickly, affordably and reliably.' },
            { title: 'Our Vision',  body: "To become India's most loved food delivery platform, known for quality, speed and trust." },
            { title: 'Our Values', body: 'Customer-first thinking, supporting local restaurants, and delivering happiness one meal at a time.' },
          ].map(({ title, body }) => (
            <div key={title} className="bg-card border border-base rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="font-bold text-base sm:text-lg mb-2">{title}</h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
