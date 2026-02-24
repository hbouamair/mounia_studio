"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Comment réserver un studio ?",
    answer: "Vous pouvez réserver un studio en cliquant sur 'Réserver' : vous serez redirigé vers notre plateforme de réservation Picktime pour choisir le studio, la date et l'heure. Vous recevrez une confirmation par email immédiatement."
  },
  {
    question: "Quels sont les horaires d'ouverture ?",
    answer: "RJ Studio est ouvert du lundi au dimanche de 8h00 à 22h00. Les réservations de studios sont disponibles pendant ces horaires. Les cours collectifs ont des horaires spécifiques consultables dans notre planning."
  },
  {
    question: "Dois-je payer pour essayer un cours ?",
    answer: "Le premier cours est GRATUIT pour tous les nouveaux membres ! C'est l'occasion parfaite de découvrir notre studio, rencontrer nos instructeurs et voir si notre ambiance vous correspond."
  },
  {
    question: "Quel équipement dois-je apporter ?",
    answer: "Pour les cours de danse, portez des vêtements confortables et des chaussures adaptées à votre style de danse. Nous fournissons les tapis pour le yoga. N'oubliez pas d'apporter une bouteille d'eau et une serviette."
  },
  {
    question: "Puis-je annuler ma réservation ?",
    answer: "Oui, vous pouvez annuler votre réservation jusqu'à 24 heures avant l'heure prévue pour un remboursement complet. Les annulations dans les 24 heures sont non remboursables mais peuvent être reportées selon disponibilité."
  },
  {
    question: "Y a-t-il un parking disponible ?",
    answer: "Oui, nous disposons d'un parking gratuit pour nos clients directement devant le studio. Des places de stationnement dans la rue sont également disponibles à proximité."
  },
  {
    question: "Proposez-vous des cours privés ?",
    answer: "Absolument ! Nos instructeurs offrent des cours privés personnalisés pour tous les niveaux. Contactez-nous pour planifier votre cours privé et discuter de vos objectifs spécifiques."
  },
  {
    question: "Quels styles de danse enseignez-vous ?",
    answer: "Nous offrons une grande variété de styles incluant Hip-Hop, Ballet, Jazz, Contemporary, Salsa, Zumba, et plus encore. Consultez notre page Classes pour voir la liste complète et les horaires."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-24 md:py-32 overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-br from-accent-500/10 to-tertiary-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 mb-6"
          >
            <HelpCircle className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-semibold font-nav text-charcoal">FAQ</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-charcoal">
            Questions{" "}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Fréquentes
            </span>
          </h2>

          <p className="text-lg md:text-xl text-soft-charcoal leading-relaxed">
            Trouvez rapidement les réponses à vos questions les plus courantes.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <motion.div
                className="skeu-card overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.01 }}
                onClick={() => toggleFAQ(index)}
              >
                {/* Question */}
                <div className="flex items-center justify-between p-6">
                  <h3 className="text-lg md:text-xl font-display font-semibold text-charcoal pr-8">
                    {faq.question}
                  </h3>
                  
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    {openIndex === index ? (
                      <Minus className="w-6 h-6 text-primary-500" />
                    ) : (
                      <Plus className="w-6 h-6 text-primary-500" />
                    )}
                  </motion.div>
                </div>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0">
                        <motion.div
                          initial={{ y: -10 }}
                          animate={{ y: 0 }}
                          className="pt-4 border-t border-charcoal/10"
                        >
                          <p className="text-soft-charcoal leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-soft-charcoal mb-4 text-lg">
            Vous avez d&apos;autres questions ?
          </p>
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold font-nav rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            Contactez-nous
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
