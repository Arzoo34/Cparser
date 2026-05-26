import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const FeatureCard = ({ feature, index }) => {
  const Icon = feature.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-white/20 via-indigo-500/30 to-violet-600/20 shadow-xl shadow-black/20"
    >
      <div className="relative h-full rounded-2xl bg-slate-900/90 backdrop-blur-sm p-6 flex flex-col border border-white/5 overflow-hidden">
        <div
          className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${feature.color} opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`}
        />

        <div
          className={`inline-flex w-12 h-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg mb-4`}
        >
          <Icon className="text-white text-xl" />
        </div>

        <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
        <ul className="space-y-2 mb-6 flex-1">
          {feature.points.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-slate-400">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              {point}
            </li>
          ))}
        </ul>

        <a
          href={feature.href}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${feature.color} hover:opacity-90 transition-all shadow-lg`}
        >
          {feature.cta}
          <FaArrowRight className="text-sm opacity-80" aria-hidden />
        </a>
      </div>
    </motion.article>
  );
};

export default FeatureCard;
