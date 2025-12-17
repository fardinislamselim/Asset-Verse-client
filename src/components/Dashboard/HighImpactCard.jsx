import { motion } from "framer-motion";

const HighImpactCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "primary", // primary, secondary, accent, warning, error, info
  delay = 0,
}) => {

  const variants = {
    primary: "from-primary/10 to-primary/5 text-primary border-primary/20",
    secondary:
      "from-secondary/10 to-secondary/5 text-secondary border-secondary/20",
    accent: "from-accent/10 to-accent/5 text-accent border-accent/20",
    warning: "from-warning/10 to-warning/5 text-warning border-warning/20",
    error: "from-error/10 to-error/5 text-error border-error/20",
    info: "from-info/10 to-info/5 text-info border-info/20",
  };

  const colorClass = variants[variant] || variants.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br ${colorClass} p-6 shadow-sm hover:shadow-md transition-shadow duration-300`}
    >
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm ${variant === 'primary' ? 'text-primary' : variant === 'secondary' ? 'text-secondary' : variant === 'accent' ? 'text-accent' : variant === 'warning' ? 'text-warning' : 'text-current'}`}>
                {Icon && <Icon className="text-xl" />}
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider opacity-80">
              {title}
            </h3>
          </div>
          <div className="text-4xl font-extrabold tracking-tight mt-2">
            {value}
          </div>
        </div>
        
        {subtitle && (
            <div className="mt-4 text-xs font-medium opacity-70 bg-white/30 self-start px-3 py-1 rounded-full backdrop-blur-md">
                {subtitle}
            </div>
        )}
      </div>

      {Icon && (
        <div className="absolute -bottom-4 -right-4 text-9xl opacity-5 transform rotate-12 z-0 pointer-events-none">
          <Icon />
        </div>
      )}

       <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-white/20 blur-3xl rounded-full pointer-events-none"></div>
    </motion.div>
  );
};

export default HighImpactCard;
