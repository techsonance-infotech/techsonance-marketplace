import { Headphones, RotateCcw, Shield, Truck } from "lucide-react";

export function TrustStrip() {
  const badges = [
    { icon: Truck, label: "Free Delivery", sub: "On orders above ₹499" },
    { icon: RotateCcw, label: "Easy Returns", sub: "10-day return policy" },
    { icon: Shield, label: "Secure Payment", sub: "100% safe checkout" },
    { icon: Headphones, label: "24/7 Support", sub: "Dedicated help desk" },
  ];
  return (
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-16 xl:px-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-100">
          {badges.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-3 py-5 px-4 lg:px-6"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                <Icon size={18} className="text-gray-700" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-900 leading-tight">
                  {label}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

 