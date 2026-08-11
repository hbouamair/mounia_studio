"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import {
  BASE_PATH,
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  HOME_URL,
} from "@/lib/constants";

export default function PolitiqueConfidentialitePage() {
  return (
    <>
      <Navigation />

      <main className="relative pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 2xl:px-10 max-w-4xl">
          <Link
            href={HOME_URL}
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>

          <div className="flex items-center gap-3 mb-10">
            <div className="p-3 rounded-2xl bg-primary-500/10">
              <Shield className="w-8 h-8 text-primary-500" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-charcoal">
                Politique de confidentialité
              </h1>
              <p className="text-soft-charcoal mt-1">
                Dernière mise à jour : 10/08/2026
              </p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none text-soft-charcoal space-y-10">
            <section>
              <p className="leading-relaxed">
                RJ Studio attache une grande importance à la protection de vos données
                personnelles. Cette politique explique quelles informations nous collectons
                lorsque vous utilisez notre site pour réserver un studio, pourquoi nous les
                collectons, et quels sont vos droits.
              </p>
              <p className="leading-relaxed mt-3">
                Cette politique est établie conformément à la loi marocaine n° 09-08 relative
                à la protection des personnes physiques à l&apos;égard du traitement des données
                à caractère personnel, sous le contrôle de la Commission Nationale de contrôle
                de la protection des Données à caractère Personnel (CNDP).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-charcoal mb-3">
                1. Qui sommes-nous
              </h2>
              <p className="leading-relaxed">
                RJ Studio, dont le siège est situé à {CONTACT_ADDRESS}, Maroc, est
                responsable du traitement des données collectées via ce site.
              </p>
              <p className="leading-relaxed mt-3">
                Pour toute question relative à cette politique ou à vos données personnelles,
                vous pouvez nous contacter à :{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-primary-500 hover:text-primary-600"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-charcoal mb-3">
                2. Aucun compte n&apos;est requis
              </h2>
              <p className="leading-relaxed">
                RJ Studio ne nécessite pas la création d&apos;un compte utilisateur. Vous
                consultez les studios disponibles, choisissez un créneau, et effectuez votre
                réservation directement, sans inscription préalable ni mot de passe à créer.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-charcoal mb-3">
                3. Quelles données nous collectons
              </h2>
              <p className="leading-relaxed">
                Dans le cadre d&apos;une réservation, nous vous demandons uniquement :
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1 leading-relaxed">
                <li>Votre numéro de téléphone</li>
                <li>Votre adresse email</li>
              </ul>
              <p className="leading-relaxed mt-3">
                Nous ne collectons aucune autre donnée personnelle sur ce site (pas de date de
                naissance, pas d&apos;adresse postale, pas de pièce d&apos;identité).
              </p>
              <p className="leading-relaxed mt-3">
                Nous ne collectons ni ne conservons aucune information de paiement. Le
                règlement de votre réservation se fait par virement/lien envoyé par email ou
                en espèces directement sur place — RJ Studio n&apos;a à aucun moment accès à
                vos coordonnées bancaires, numéros de carte ou identifiants de paiement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-charcoal mb-3">
                4. Pourquoi nous collectons ces données
              </h2>
              <p className="leading-relaxed">
                Vos numéro de téléphone et email sont utilisés exclusivement pour :
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1 leading-relaxed">
                <li>Confirmer votre réservation de studio</li>
                <li>
                  Vous contacter en cas de besoin concernant votre créneau (question,
                  modification, disponibilité)
                </li>
                <li>Vous envoyer des rappels avant votre séance</li>
                <li>
                  Vous relancer en cas de réservation non finalisée ou de paiement en attente
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-charcoal mb-3">
                5. Base légale du traitement
              </h2>
              <p className="leading-relaxed">
                Le traitement de vos données repose sur l&apos;exécution de la réservation que
                vous effectuez avec nous : ces informations sont nécessaires pour vous fournir le
                service demandé (accès au studio réservé, confirmation, rappel).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-charcoal mb-3">
                6. Qui a accès à vos données
              </h2>
              <p className="leading-relaxed">
                Vos données sont traitées uniquement par l&apos;équipe RJ Studio, dans le cadre
                strict de la gestion des réservations et dans la stricte mesure nécessaire au
                fonctionnement du système de calendrier et de réservation.
              </p>
              <p className="leading-relaxed mt-3">
                Nous ne vendons, ne louons et ne partageons vos données avec aucun tiers à des
                fins commerciales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-charcoal mb-3">
                7. Durée de conservation
              </h2>
              <p className="leading-relaxed">
                Nous conservons votre numéro de téléphone et votre email pendant la durée
                nécessaire à la gestion de votre réservation, puis pendant une durée de 12 mois
                après votre dernière réservation, afin de pouvoir vous recontacter pour
                d&apos;éventuels créneaux futurs ou en cas de litige. Passé ce délai, vos
                données sont supprimées de nos systèmes actifs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-charcoal mb-3">
                8. Vos droits
              </h2>
              <p className="leading-relaxed">
                Conformément à la loi 09-08, vous disposez des droits suivants sur vos données
                personnelles :
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 leading-relaxed">
                <li>
                  <strong>Droit d&apos;accès</strong> : obtenir la confirmation que vos données
                  sont traitées, et en obtenir une copie.
                </li>
                <li>
                  <strong>Droit de rectification</strong> : corriger des données inexactes ou
                  incomplètes (par exemple si votre numéro de téléphone a changé).
                </li>
                <li>
                  <strong>Droit d&apos;opposition</strong> : vous opposer à l&apos;utilisation de
                  vos données pour vous envoyer des rappels ou relances.
                </li>
                <li>
                  <strong>Droit à l&apos;effacement</strong> : demander la suppression de vos
                  données lorsque leur conservation n&apos;est plus nécessaire.
                </li>
              </ul>
              <p className="leading-relaxed mt-3">
                Pour exercer l&apos;un de ces droits, contactez-nous à{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-primary-500 hover:text-primary-600"
                >
                  {CONTACT_EMAIL}
                </a>
                . Nous nous engageons à répondre à votre demande dans un délai raisonnable, et
                pourrons vous demander de justifier votre identité avant d&apos;y donner suite.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-charcoal mb-3">
                9. Modifications de cette politique
              </h2>
              <p className="leading-relaxed">
                Nous pouvons être amenés à modifier cette politique de confidentialité,
                notamment pour refléter une évolution de nos pratiques ou de la réglementation.
                La version en vigueur est toujours celle publiée sur cette page, avec sa date
                de dernière mise à jour.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-display font-semibold text-charcoal mb-3">
                10. Contact
              </h2>
              <p className="leading-relaxed">
                Pour toute question relative à cette politique ou à la gestion de vos données
                personnelles :
              </p>
              <p className="leading-relaxed mt-3">
                Email :{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="text-primary-500 hover:text-primary-600"
                >
                  {CONTACT_EMAIL}
                </a>
                <br />
                Téléphone : {CONTACT_PHONE_DISPLAY}
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-charcoal/10 flex flex-wrap gap-6">
            <Link
              href={`${BASE_PATH}/contact`}
              className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
