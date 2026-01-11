import amazon from "../../../assets/amazon.png"
import casio from "../../../assets/casio.png"
import start_people from "../../../assets/start-people.png"
import start from "../../../assets/start.png"

const Testimonials = () => {
  return (
    <section className="py-24 bg-neutral text-neutral-content relative overflow-hidden">
      
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-gray-400 mb-8 text-lg">
              "AssetVerse has completely transformed how we handle our inventory.
              The accountability it brings to our organization is invaluable."
            </p>

            <div className="flex gap-4 items-center mb-12">
              <div className="avatar">
                <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                    alt="Sarah Jenkins"
                  />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-xl">Sarah Jenkins</h4>
                <p className="text-primary">HR Director, TechFlow Inc.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 border-t border-gray-700 pt-8">
              <div>
                <h3 className="text-3xl font-bold">100+</h3>
                <p className="text-sm text-gray-400">Companies</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold">5k+</h3>
                <p className="text-sm text-gray-400">Employees</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold">10k+</h3>
                <p className="text-sm text-gray-400">Assets Tracked</p>
              </div>
            </div>
          </div>

          {(() => {
            const logoUrls = [
              amazon,
              casio,
              start_people,
              start,
            ];
            return (
              <div className="grid grid-cols-2 gap-4 opacity-50">
                {logoUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 h-32 rounded-box flex items-center justify-center p-4"
                  >
                    <img src={url} alt={`Logo ${idx + 1}`} className="h-full object-contain" />
                  </div>
                ))}
              </div>
            );
          })()}

        </div>
      </div>
    </section>
  );
};

export default Testimonials;
