import { motion } from 'framer-motion';

/**
 * Family Tree Section
 * Displays wedding party, parents, and couple in a tree structure
 */
export default function FamilyTreeSection() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  // Family data structure
  const couple = {
    bride: {
      name: 'Jordyn Porada',
      image: '/images/family/496093297_9839735762736111_2592755804783153377_n.jpg',
    },
    groom: {
      name: 'Austin Porada',
      image: '/images/family/495660452_23961794676737340_6440789571967380360_n.jpg',
    },
  };

  const parents = {
    brideParents: [
      { name: 'Heather', image: '/images/family/heather.webp' },
      { name: 'Jerame', image: '/images/family/jerame.webp' },
    ],
    groomParents: [
      { name: 'Christine', image: '/images/family/christine.webp' },
      { name: 'Melony', image: '/images/family/melony.webp' },
    ],
  };

  const weddingParty = {
    bridesmaids: [
      { name: 'Caitie Helsel', image: '/images/family/caitie-helsel.webp' },
      { name: 'Emily Aurandt', image: '/images/family/emily-aurandt.webp' },
      { name: 'Hannah Porada', image: '/images/family/hannah-porada.webp' },
      { name: 'Lexi Ferg', image: '/images/family/lexi-ferg.webp' },
      { name: 'Maria McCray', image: '/images/family/maria-mccray.webp' },
      { name: 'Brinnah Porada', image: '/images/family/brinnah-porada.webp' },
      { name: 'MIC', image: '/images/family/mic.webp' },
    ],
    groomsmen: [
      { name: 'Alex Molnar', image: '/images/family/alex-molnar.webp' },
      { name: 'Brosonan McCray', image: '/images/family/brosonan-mccray.webp' },
      { name: 'Ean Pringle', image: '/images/family/ean-pringle.webp' },
      { name: 'Eddie Migut', image: '/images/family/eddie-migut.webp' },
      { name: 'Ian Porada', image: '/images/family/ian-porada.webp' },
      { name: 'Nate Berkebile', image: '/images/family/nate-berkebile.webp' },
      { name: 'Tyler Sharpe', image: '/images/family/tyler-sharpe.webp' },
    ],
  };

  const PersonCard = ({ person, size = 'medium' }) => {
    const sizeClasses = {
      large: 'w-32 h-32 md:w-40 md:h-40',
      medium: 'w-24 h-24 md:w-28 md:h-28',
      small: 'w-20 h-20 md:w-24 md:h-24',
    };

    return (
      <motion.div variants={itemVariants} className="flex flex-col items-center gap-3">
        <div
          className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-gold/30 shadow-lg`}
        >
          <img
            src={person.image}
            alt={person.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/images/placeholder-person.jpg';
            }}
          />
        </div>
        <p className="text-center font-serif text-sage-900 dark:text-sage-100">{person.name}</p>
      </motion.div>
    );
  };

  return (
    <section
      id="family-tree"
      className="relative py-20 bg-gradient-to-b from-white to-blush/10 dark:from-gray-900 dark:to-blush-900/10"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-sage/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-2 mb-4">Our Family Tree</h2>
          <p className="text-sage-700 dark:text-sage-300 max-w-2xl mx-auto">
            The special people who made our day unforgettable
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16"
        >
          {/* Couple - Top Level */}
          <div className="flex justify-center gap-8 md:gap-16">
            <PersonCard person={couple.bride} size="large" />
            <div className="flex items-center">
              <span className="text-4xl text-gold animate-pulse">❤️</span>
            </div>
            <PersonCard person={couple.groom} size="large" />
          </div>

          {/* Decorative line */}
          <div className="flex justify-center">
            <div className="h-16 w-px bg-gradient-to-b from-gold/50 to-transparent" />
          </div>

          {/* Parents - Middle Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Bride's Parents */}
            <div className="space-y-6">
              <h3 className="text-xl font-serif text-center text-sage-900 dark:text-sage-100 mb-4">
                Bride's Parents
              </h3>
              <div className="flex justify-center gap-6">
                {parents.brideParents.map((parent, idx) => (
                  <PersonCard key={idx} person={parent} size="medium" />
                ))}
              </div>
            </div>

            {/* Groom's Parents */}
            <div className="space-y-6">
              <h3 className="text-xl font-serif text-center text-sage-900 dark:text-sage-100 mb-4">
                Groom's Parents
              </h3>
              <div className="flex justify-center gap-6">
                {parents.groomParents.map((parent, idx) => (
                  <PersonCard key={idx} person={parent} size="medium" />
                ))}
              </div>
            </div>
          </div>

          {/* Decorative line */}
          <div className="flex justify-center">
            <div className="h-16 w-px bg-gradient-to-b from-gold/50 to-transparent" />
          </div>

          {/* Wedding Party - Bottom Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Bridesmaids */}
            <div className="space-y-6">
              <h3 className="text-xl font-serif text-center text-sage-900 dark:text-sage-100 mb-4">
                Bridesmaids
              </h3>
              <div className="flex justify-center gap-4 flex-wrap">
                {weddingParty.bridesmaids.map((person, idx) => (
                  <PersonCard key={idx} person={person} size="small" />
                ))}
              </div>
            </div>

            {/* Groomsmen */}
            <div className="space-y-6">
              <h3 className="text-xl font-serif text-center text-sage-900 dark:text-sage-100 mb-4">
                Groomsmen
              </h3>
              <div className="flex justify-center gap-4 flex-wrap">
                {weddingParty.groomsmen.map((person, idx) => (
                  <PersonCard key={idx} person={person} size="small" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
