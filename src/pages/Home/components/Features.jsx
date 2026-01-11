import {
    FaBuilding,
    FaChartLine,
    FaCloudUploadAlt,
    FaHeadset,
    FaShieldAlt,
    FaUsers,
} from "react-icons/fa";

const Features = () => {
  return (
    <section className="py-24 bg-base-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral mb-4">
            Platform Features
          </h2>
          <p className="text-gray-500">
            Everything you need to manage assets effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: FaChartLine,
              title: "Analytics Dashboard",
              desc: "Gain insights with visual charts and reports.",
            },
            {
              icon: FaCloudUploadAlt,
              title: "Cloud Backup",
              desc: "Your data is safe and accessible anywhere.",
            },
            {
              icon: FaShieldAlt,
              title: "Role-Based Security",
              desc: "Strict access controls for HR and Employees.",
            },
            {
              icon: FaHeadset,
              title: "Premium Support",
              desc: "Dedicated support team for enterprise plans.",
            },
            {
              icon: FaBuilding,
              title: "Multi-branch Support",
              desc: "Manage assets across different office locations.",
            },
            {
              icon: FaUsers,
              title: "Team Collaboration",
              desc: "Seamless communication for asset requests.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="flex gap-4 p-6 rounded-box hover:bg-base-200 transition-colors"
            >
              <div className="text-primary text-2xl mt-1">
                <feature.icon />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">{feature.title}</h4>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
