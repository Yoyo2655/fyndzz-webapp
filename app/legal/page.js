'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function LegalPage() {
  const [tab, setTab] = useState('mentions')

  const sectionTitle = {
    fontSize: '1rem', fontWeight: '700',
    color: '#fff', marginBottom: '0.8rem',
    marginTop: '2rem', borderLeft: '3px solid #00FF66',
    paddingLeft: '0.8rem'
  }

  const para = {
    fontSize: '0.88rem', color: 'rgba(255,255,255,0.65)',
    lineHeight: '1.8', marginBottom: '1rem'
  }

  const subTitle = {
    fontSize: '0.9rem', fontWeight: '600',
    color: 'rgba(255,255,255,0.85)', marginBottom: '0.5rem', marginTop: '1.2rem'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #3D2CD5 0%, #160C6B 100%)', fontFamily: 'sans-serif', color: '#fff' }}>

      {/* HEADER */}
      <div style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Image src="/Logo-et-Titre-paysage-RBG_Fyndzz.png" alt="Fyndzz" width={110} height={32} style={{ objectFit: 'contain', display: 'block' }} />
        </Link>
        <div style={{ flex: 1 }} />
        <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: '0.85rem' }}>← Retour</Link>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
          Documents légaux
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          Dernière mise à jour : 1er janvier 2025
        </p>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
          {[{ id: 'mentions', label: 'Mentions légales' }, { id: 'cgu', label: 'CGU' }, { id: 'privacy', label: 'Confidentialité' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '0.5rem 1.1rem', borderRadius: '100px', border: 'none', cursor: 'pointer',
              background: tab === t.id ? '#00FF66' : 'rgba(255,255,255,0.08)',
              color: tab === t.id ? '#0A0040' : 'rgba(255,255,255,0.6)',
              fontWeight: tab === t.id ? '700' : '400', fontSize: '0.85rem'
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── MENTIONS LÉGALES ── */}
        {tab === 'mentions' && (
          <div>
            <div style={sectionTitle}>1. Éditeur du site</div>
            <p style={para}>
              Le service Fyndzz est édité par la société Fyndzz SAS, société par actions simplifiée au capital de 1 000 euros, en cours d'immatriculation au Registre du Commerce et des Sociétés de Paris.
            </p>
            <p style={para}><strong style={{ color: '#fff' }}>Siège social :</strong> Paris, France</p>
            <p style={para}><strong style={{ color: '#fff' }}>Email de contact :</strong> hello@fyndzz.io</p>
            <p style={para}><strong style={{ color: '#fff' }}>Directeur de la publication :</strong> Le représentant légal de Fyndzz SAS</p>

            <div style={sectionTitle}>2. Hébergement</div>
            <p style={para}>
              Le site Fyndzz est hébergé par la société Vercel Inc., dont le siège social est situé au 340 Pine Street, Suite 701, San Francisco, California 94104, États-Unis. Le site est déployé via la plateforme Vercel Edge Network, distribuée mondialement.
            </p>
            <p style={para}>
              La base de données est hébergée par Supabase Inc., dont le siège social est situé à San Francisco, Californie, États-Unis. Les données des utilisateurs européens sont stockées dans des data centers situés en Europe (région eu-west).
            </p>

            <div style={sectionTitle}>3. Propriété intellectuelle</div>
            <p style={para}>
              L'ensemble des éléments constitutifs du service Fyndzz — notamment le code source, les interfaces graphiques, les logos, les marques, les textes, les icônes et les algorithmes — sont la propriété exclusive de Fyndzz SAS et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle.
            </p>
            <p style={para}>
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du service, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de Fyndzz SAS.
            </p>
            <p style={para}>
              Les données cartographiques utilisées proviennent d'OpenStreetMap, sous licence ODbL (Open Database License). Le routage est fourni par OSRM, projet open source. Le géocodage est réalisé via Nominatim.
            </p>

            <div style={sectionTitle}>4. Responsabilité</div>
            <p style={para}>
              Fyndzz SAS s'efforce de fournir des informations exactes et à jour, notamment concernant la disponibilité des places de stationnement. Cependant, les données affichées provenant de capteurs IoT tiers, Fyndzz SAS ne peut garantir l'exactitude en temps réel des informations de disponibilité.
            </p>
            <p style={para}>
              Fyndzz SAS ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation du service, notamment en cas d'indisponibilité temporaire, d'inexactitude des données de stationnement, ou de tout préjudice lié à l'utilisation de la navigation GPS.
            </p>
            <p style={para}>
              L'utilisateur reconnaît utiliser le service sous sa seule responsabilité et respecter le Code de la route en vigueur, indépendamment des indications fournies par l'application.
            </p>

            <div style={sectionTitle}>5. Cookies</div>
            <p style={para}>
              Le service Fyndzz utilise des cookies techniques strictement nécessaires au fonctionnement de l'authentification (sessions Supabase). Ces cookies ne sont pas utilisés à des fins publicitaires ou de traçage commercial. Aucun cookie tiers n'est déposé sans le consentement explicite de l'utilisateur.
            </p>

            <div style={sectionTitle}>6. Droit applicable</div>
            <p style={para}>
              Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents. Pour toute réclamation, vous pouvez contacter Fyndzz SAS à l'adresse hello@fyndzz.io avant toute action judiciaire.
            </p>
          </div>
        )}

        {/* ── CGU ── */}
        {tab === 'cgu' && (
          <div>
            <p style={{ ...para, background: 'rgba(0,255,102,0.08)', border: '1px solid rgba(0,255,102,0.2)', borderRadius: '10px', padding: '1rem' }}>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du service Fyndzz. En créant un compte ou en utilisant le service, vous acceptez sans réserve l'intégralité des présentes conditions.
            </p>

            <div style={sectionTitle}>1. Description du service</div>
            <p style={para}>
              Fyndzz est une plateforme numérique de guidage vers des places de stationnement disponibles, utilisant un réseau de capteurs IoT déployés sur la voie publique. Le service comprend :
            </p>
            <ul style={{ ...para, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.4rem' }}>La visualisation en temps réel des places de stationnement disponibles sur une carte interactive</li>
              <li style={{ marginBottom: '0.4rem' }}>Le calcul d'itinéraires optimisés vers la place la plus proche de la destination souhaitée</li>
              <li style={{ marginBottom: '0.4rem' }}>La navigation guidée turn-by-turn avec instructions vocales</li>
              <li style={{ marginBottom: '0.4rem' }}>Le paiement en ligne du stationnement via la plateforme Stripe</li>
              <li style={{ marginBottom: '0.4rem' }}>La gestion d'un profil utilisateur incluant les informations sur les véhicules enregistrés</li>
            </ul>

            <div style={sectionTitle}>2. Accès au service et création de compte</div>
            <div style={subTitle}>2.1 Conditions d'accès</div>
            <p style={para}>
              L'accès au service Fyndzz est réservé aux personnes physiques majeures (18 ans ou plus) titulaires d'un permis de conduire en cours de validité. En créant un compte, vous déclarez remplir ces conditions.
            </p>
            <div style={subTitle}>2.2 Création du compte</div>
            <p style={para}>
              La création d'un compte nécessite la fourniture d'informations exactes, complètes et à jour, notamment : nom, prénom, adresse email, numéro de téléphone, adresse postale et informations relatives au(x) véhicule(s) utilisé(s). Vous vous engagez à maintenir ces informations à jour.
            </p>
            <div style={subTitle}>2.3 Sécurité du compte</div>
            <p style={para}>
              Vous êtes seul responsable de la confidentialité de vos identifiants de connexion. Toute utilisation du service réalisée depuis votre compte est réputée être effectuée par vous. En cas de suspicion d'utilisation frauduleuse, vous devez immédiatement contacter Fyndzz SAS à l'adresse hello@fyndzz.io.
            </p>

            <div style={sectionTitle}>3. Utilisation du service</div>
            <div style={subTitle}>3.1 Usage personnel</div>
            <p style={para}>
              Le service Fyndzz est mis à disposition à titre personnel et non commercial. Vous vous engagez à ne pas utiliser le service à des fins professionnelles, commerciales ou de revente sans autorisation préalable écrite de Fyndzz SAS.
            </p>
            <div style={subTitle}>3.2 Comportements interdits</div>
            <p style={para}>Il est strictement interdit de :</p>
            <ul style={{ ...para, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.4rem' }}>Utiliser le service d'une manière qui pourrait endommager, désactiver ou surcharger les infrastructures de Fyndzz</li>
              <li style={{ marginBottom: '0.4rem' }}>Tenter d'accéder de manière non autorisée aux systèmes, données ou réseaux de Fyndzz</li>
              <li style={{ marginBottom: '0.4rem' }}>Utiliser des robots, scrapers ou autres outils automatisés pour collecter des données du service</li>
              <li style={{ marginBottom: '0.4rem' }}>Introduire des virus, chevaux de Troie ou tout autre code malveillant</li>
              <li style={{ marginBottom: '0.4rem' }}>Contourner les mesures de sécurité ou d'authentification du service</li>
              <li style={{ marginBottom: '0.4rem' }}>Usurper l'identité d'un autre utilisateur ou d'un représentant de Fyndzz</li>
              <li style={{ marginBottom: '0.4rem' }}>Utiliser le service en violation des lois et réglementations applicables, notamment le Code de la route</li>
            </ul>
            <div style={subTitle}>3.3 Navigation et sécurité routière</div>
            <p style={para}>
              L'utilisation du guidage GPS fourni par Fyndzz ne dispense pas l'utilisateur du respect de l'ensemble des règles du Code de la route. Il est formellement interdit d'utiliser l'interface de l'application pendant la conduite. Fyndzz SAS décline toute responsabilité en cas d'accident ou d'infraction commis pendant l'utilisation du service.
            </p>

            <div style={sectionTitle}>4. Paiement et tarification</div>
            <div style={subTitle}>4.1 Modalités de paiement</div>
            <p style={para}>
              Les paiements effectués via Fyndzz sont traités par la plateforme Stripe, Inc. Fyndzz SAS ne stocke aucune donnée bancaire sur ses serveurs. En effectuant un paiement, vous acceptez également les conditions générales de Stripe disponibles sur stripe.com.
            </p>
            <div style={subTitle}>4.2 Tarification</div>
            <p style={para}>
              Les tarifs applicables sont affichés au moment du paiement. Fyndzz SAS se réserve le droit de modifier ses tarifs à tout moment, sous réserve d'en informer les utilisateurs au moins 30 jours à l'avance. Les tarifs actuels sont les suivants :
            </p>
            <ul style={{ ...para, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.4rem' }}>Forfait 30 minutes : 1,20 €</li>
              <li style={{ marginBottom: '0.4rem' }}>Forfait 1 heure : 2,00 €</li>
              <li style={{ marginBottom: '0.4rem' }}>Forfait 2 heures : 3,50 €</li>
              <li style={{ marginBottom: '0.4rem' }}>Forfait 4 heures : 6,00 €</li>
              <li style={{ marginBottom: '0.4rem' }}>Tarif à la minute : 0,04 € / minute</li>
            </ul>
            <div style={subTitle}>4.3 Remboursements</div>
            <p style={para}>
              Toute demande de remboursement doit être adressée à hello@fyndzz.io dans un délai de 48 heures suivant le paiement. Fyndzz SAS examine chaque demande au cas par cas. Aucun remboursement n'est accordé pour les sessions de stationnement déjà entamées, sauf en cas de dysfonctionnement avéré du service imputable à Fyndzz SAS.
            </p>

            <div style={sectionTitle}>5. Disponibilité du service</div>
            <p style={para}>
              Fyndzz SAS s'engage à maintenir le service accessible 24h/24 et 7j/7, sous réserve des opérations de maintenance programmées ou des interruptions liées à des cas de force majeure. La disponibilité des données de stationnement dépend du bon fonctionnement des capteurs IoT tiers, ce qui peut ponctuellement affecter la précision des informations affichées.
            </p>
            <p style={para}>
              Fyndzz SAS se réserve le droit de suspendre temporairement l'accès au service pour des raisons de maintenance, de sécurité ou d'amélioration du service, sans obligation d'indemnisation des utilisateurs.
            </p>

            <div style={sectionTitle}>6. Suspension et résiliation</div>
            <div style={subTitle}>6.1 Résiliation par l'utilisateur</div>
            <p style={para}>
              Vous pouvez à tout moment supprimer votre compte depuis la section "Sécurité" de votre profil. La suppression du compte entraîne la suppression définitive de vos données personnelles dans un délai de 30 jours, à l'exception des données conservées pour des raisons légales (notamment les données de facturation, conservées 10 ans conformément aux obligations comptables).
            </p>
            <div style={subTitle}>6.2 Résiliation par Fyndzz SAS</div>
            <p style={para}>
              Fyndzz SAS se réserve le droit de suspendre ou de résilier l'accès d'un utilisateur au service, sans préavis ni indemnité, en cas de violation des présentes CGU, d'utilisation frauduleuse du service, de non-paiement ou de comportement préjudiciable à Fyndzz SAS ou à d'autres utilisateurs.
            </p>

            <div style={sectionTitle}>7. Modifications des CGU</div>
            <p style={para}>
              Fyndzz SAS se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification substantielle par email ou par notification dans l'application au moins 15 jours avant l'entrée en vigueur des nouvelles conditions. La poursuite de l'utilisation du service après ce délai vaut acceptation des nouvelles conditions.
            </p>

            <div style={sectionTitle}>8. Droit applicable et litiges</div>
            <p style={para}>
              Les présentes CGU sont soumises au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire. À défaut d'accord amiable dans un délai de 30 jours, le litige sera soumis aux tribunaux compétents de Paris. Conformément aux dispositions du Code de la consommation, les utilisateurs peuvent également recourir à un médiateur de la consommation.
            </p>
          </div>
        )}

        {/* ── CONFIDENTIALITÉ ── */}
        {tab === 'privacy' && (
          <div>
            <p style={{ ...para, background: 'rgba(0,255,102,0.08)', border: '1px solid rgba(0,255,102,0.2)', borderRadius: '10px', padding: '1rem' }}>
              Fyndzz SAS s'engage à protéger la vie privée de ses utilisateurs conformément au Règlement Général sur la Protection des Données (RGPD - UE 2016/679) et à la loi française Informatique et Libertés du 6 janvier 1978 modifiée.
            </p>

            <div style={sectionTitle}>1. Responsable du traitement</div>
            <p style={para}>
              Le responsable du traitement des données personnelles est Fyndzz SAS. Pour toute question relative à la protection de vos données, vous pouvez nous contacter à : hello@fyndzz.io
            </p>

            <div style={sectionTitle}>2. Données collectées</div>
            <div style={subTitle}>2.1 Données d'identification</div>
            <p style={para}>Prénom, nom, adresse email, numéro de téléphone, adresse postale (rue, code postal, ville, pays).</p>
            <div style={subTitle}>2.2 Données relatives aux véhicules</div>
            <p style={para}>Plaque d'immatriculation, marque, modèle, année, couleur et type d'énergie du ou des véhicules enregistrés (jusqu'à 4 véhicules par compte).</p>
            <div style={subTitle}>2.3 Données de géolocalisation</div>
            <p style={para}>
              Avec votre consentement explicite, nous collectons votre position GPS en temps réel lors de l'utilisation de la fonctionnalité de navigation. Ces données ne sont pas stockées de manière permanente et sont uniquement utilisées pour calculer l'itinéraire en cours.
            </p>
            <div style={subTitle}>2.4 Données de paiement</div>
            <p style={para}>
              Les données bancaires sont traitées exclusivement par Stripe Inc. et ne sont jamais stockées sur les serveurs de Fyndzz SAS. Nous conservons uniquement le montant, la date, la durée et le statut de chaque transaction.
            </p>
            <div style={subTitle}>2.5 Données d'utilisation</div>
            <p style={para}>Historique des recherches de places, trajets effectués, statistiques d'utilisation anonymisées.</p>

            <div style={sectionTitle}>3. Finalités du traitement</div>
            <p style={para}>Vos données sont collectées et traitées pour les finalités suivantes :</p>
            <ul style={{ ...para, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.4rem' }}><strong style={{ color: '#fff' }}>Exécution du contrat :</strong> création et gestion de votre compte, fourniture du service de guidage, traitement des paiements</li>
              <li style={{ marginBottom: '0.4rem' }}><strong style={{ color: '#fff' }}>Intérêt légitime :</strong> amélioration du service, détection des fraudes, sécurité informatique</li>
              <li style={{ marginBottom: '0.4rem' }}><strong style={{ color: '#fff' }}>Obligation légale :</strong> conservation des données de facturation, réponse aux demandes des autorités</li>
              <li style={{ marginBottom: '0.4rem' }}><strong style={{ color: '#fff' }}>Consentement :</strong> géolocalisation en temps réel, communications marketing (si vous y avez consenti)</li>
            </ul>

            <div style={sectionTitle}>4. Durée de conservation</div>
            <ul style={{ ...para, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.4rem' }}>Données de compte : durée de vie du compte + 30 jours après suppression</li>
              <li style={{ marginBottom: '0.4rem' }}>Données de facturation : 10 ans (obligation légale)</li>
              <li style={{ marginBottom: '0.4rem' }}>Données de géolocalisation : non conservées au-delà de la session de navigation</li>
              <li style={{ marginBottom: '0.4rem' }}>Données d'utilisation anonymisées : 3 ans</li>
            </ul>

            <div style={sectionTitle}>5. Partage des données</div>
            <p style={para}>Fyndzz SAS ne vend jamais vos données personnelles à des tiers. Vos données peuvent être partagées uniquement avec :</p>
            <ul style={{ ...para, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.4rem' }}><strong style={{ color: '#fff' }}>Stripe Inc. :</strong> traitement sécurisé des paiements</li>
              <li style={{ marginBottom: '0.4rem' }}><strong style={{ color: '#fff' }}>Supabase Inc. :</strong> hébergement de la base de données</li>
              <li style={{ marginBottom: '0.4rem' }}><strong style={{ color: '#fff' }}>Vercel Inc. :</strong> hébergement de l'application</li>
              <li style={{ marginBottom: '0.4rem' }}><strong style={{ color: '#fff' }}>Autorités compétentes :</strong> uniquement sur demande légale formelle</li>
            </ul>

            <div style={sectionTitle}>6. Vos droits</div>
            <p style={para}>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul style={{ ...para, paddingLeft: '1.5rem' }}>
              <li style={{ marginBottom: '0.4rem' }}><strong style={{ color: '#fff' }}>Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
              <li style={{ marginBottom: '0.4rem' }}><strong style={{ color: '#fff' }}>Droit de rectification :</strong> corriger des données inexactes</li>
              <li style={{ marginBottom: '0.4rem' }}><strong style={{ color: '#fff' }}>Droit à l'effacement :</strong> demander la suppression de vos données</li>
              <li style={{ marginBottom: '0.4rem' }}><strong style={{ color: '#fff' }}>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
              <li style={{ marginBottom: '0.4rem' }}><strong style={{ color: '#fff' }}>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              <li style={{ marginBottom: '0.4rem' }}><strong style={{ color: '#fff' }}>Droit à la limitation :</strong> limiter le traitement dans certains cas</li>
              <li style={{ marginBottom: '0.4rem' }}><strong style={{ color: '#fff' }}>Droit de retrait du consentement :</strong> retirer votre consentement à tout moment</li>
            </ul>
            <p style={para}>
              Pour exercer vos droits, contactez-nous à hello@fyndzz.io. Nous répondrons dans un délai maximum d'un mois. Vous pouvez également introduire une réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) sur cnil.fr.
            </p>

            <div style={sectionTitle}>7. Sécurité des données</div>
            <p style={para}>
              Fyndzz SAS met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte, destruction ou altération. Ces mesures incluent le chiffrement des communications (HTTPS/TLS), la gestion sécurisée des authentifications via Supabase Auth, et les contrôles d'accès aux données en base via Row Level Security (RLS).
            </p>

            <div style={sectionTitle}>8. Transferts hors UE</div>
            <p style={para}>
              Certains de nos prestataires (Stripe, Supabase, Vercel) étant basés aux États-Unis, vos données peuvent faire l'objet de transferts hors de l'Union Européenne. Ces transferts sont encadrés par des garanties appropriées : clauses contractuelles types de la Commission européenne et, le cas échéant, le cadre EU-US Data Privacy Framework.
            </p>
          </div>
        )}

        {/* Footer légal */}
        <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', textAlign: 'center', marginBottom: 0 }}>
            Pour toute question : <a href="mailto:hello@fyndzz.io" style={{ color: '#00FF66', textDecoration: 'none' }}>hello@fyndzz.io</a>
            {' · '}
            <Link href="/" style={{ color: '#00FF66', textDecoration: 'none' }}>Retour à l'accueil</Link>
          </p>
        </div>
      </div>
    </div>
  )
}