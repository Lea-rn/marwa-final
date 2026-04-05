import React, { useState } from "react";

const DATA = {
  "1- Renforcement de la résilience au changement climatique": {
    "1.1- Amélioration de l'accès en eau et de l'habitat": [
      "1.1.1- Étude et contrôle de travaux d'alimentation en eau potable (AEP)",
      "1.1.2- Travaux d'alimentation en eau potable (AEP) / Projet système",
      "1.1.3- Travaux d'aménagement de petits PI",
      "1.1.4- Captage de sources d'eau",
      "1.1.5- Aménagement puits de surface existant",
      "1.1.6- Équipement en énergie solaire des puits de surface",
      "1.1.7- Construction de citernes pluviales (50 m³)",
      "1.1.8- Équipement hydraulique/photovoltaïque des citernes",
      "1.1.9- Amélioration de l'habitat",
      "1.1.10- Renforcement des capacités des usagers de l'eau et de leur organisation",
      "1.1.11- Assistance technique CH.C et environnement",
      "1.1.12- Entretien des aménagements hydrauliques",
    ],
    "1.2- Conservation des eaux et des sols": [
      "1.2.1- Étude technique douce de CES",
      "1.2.2- Technique douce de CES",
      "1.2.3- Seuils en gabion",
      "1.2.4- Végétalisation des ravins",
      "1.2.5- Remembrement des terres agricoles",
      "1.2.6- Pistes d'accès et voies intérieures du périmètre de remembrement",
      "1.2.7- Mise en œuvre du PGES",
      "1.2.8- Renforcement des capacités des bénéficiaires des travaux de CES",
      "1.2.9- Entretien des aménagements CES",
    ],
    "1.3- Promotion de l'agroforesterie et élevage": [
      "1.3.1- Études de faisabilité des activités agro-forestières",
      "1.3.2- Plantation agro-forestière (plants et transport)",
      "1.3.3- Plantation agro-forestière (plants, transport et clôture)",
      "1.3.4- Production de cultures fourragères dans l'assolement",
      "1.3.5- Plantation sylvo-pastorale",
      "1.3.6- Prairie permanente",
      "1.3.7- Recherche et développement",
      "1.3.8- Parcelles de démonstration",
      "1.3.9- Renforcement des capacités (formation, information, visites d'échange, appui conseil et vulgarisation)",
      "1.3.10- Entretien des aménagements agroforestiers",
    ],
  },
  "2- Inclusion économique et sociale": {
    "2.1- Autonomisation socio-économique des ménages": [
      "2.1.1- Préparation et mise à jour des PDCs",
      "2.1.2- Assistance technique en genre et inclusion sociale",
      "2.1.3- Assistance technique en inclusion financière et finance rurale",
      "2.1.4- Appui à l'inclusion financière et à l'accès financier",
      "2.1.5- Éducation financière, économique et numérique, alphabétisation",
      "2.1.6- Opération pilote de système d'épargne collectif",
      "2.1.7- Formation et coaching en renforcement des capacités",
      "2.1.8- Autonomisation des membres des ménages",
      "2.1.9- Création réseau autonomisation des femmes",
      "2.1.10- Plan d'affaire AGR et coaching",
      "2.1.11- Appui à la participation aux foires et visites d'échange",
      "2.1.12- Unité mobile de formation",
      "2.1.13- Financement des AGRs",
      "2.1.14- Microentreprise pour les jeunes",
    ],
    "2.2- Appui aux organisations de producteurs et valorisation": [
      "2.2.1- Études technico-économiques et préparation des plans d'affaires",
      "2.2.2- Renforcement des capacités des producteurs (SMSA, GDA, OP…)",
      "2.2.3- Financement de bâtiment ou autres travaux",
      "2.2.4- Financement d'équipement",
      "2.2.5- Mise en réseau des OP et facilitation des liens au marché",
      "2.2.6- Partenariats (ODNO, AVFA, OEP…)",
      "2.2.7- Technologie de l'information (TIC)",
    ],
    "2.3- Pistes d'accès": [
      "2.3.1- Étude et supervision des pistes et infrastructures collectives",
      "2.3.2- Désenclavement douars et petites productions",
      "2.3.3- Aménagement pistes d'accès",
      "2.3.4- Revêtement des pistes d'accès existantes",
      "2.3.5- Entretien des pistes et infrastructures collectives",
    ],
  },
  "3- Gestion de projet": {
    "3.1- Activités d'investissements": [
      "3.1.1- Administration",
      "3.1.2- Assistance",
      "3.1.3- Achat véhicule TT",
      "3.1.4- Achat véhicule léger",
      "3.1.5- Ouvrages spécialisés et installation photovoltaïque",
      "3.1.6- Mobilier de bureau et matériel de topographie",
      "3.1.7- Matériel informatique",
      "3.1.8- Étude de la station de référence",
      "3.1.9- Évaluation à mi-parcours",
      "3.1.10- Rapport d'achèvement",
      "3.1.11- Conception/installation système de SIE",
      "3.1.12- Équipement informatique et SIG",
      "3.1.13- Enquêtes statistiques",
      "3.1.14- Supervision interne et organisation d'ateliers",
      "3.1.15- Gestion des œuvres et communication",
      "3.1.16- Animation/coordination atelier gestion des connaissances",
      "3.1.17- Assistance technique gestion des risques",
      "3.1.18- Audit interne",
    ],
    "3.2- Achat logiciel comptable": [
      "3.2.1- Renforcement des capacités (formation du personnel)",
      "3.2.2- Audit financier à l'intérieur et à l'extérieur du projet",
      "3.2.3- Dialogues de politiques",
    ],
    "3.3- Coûts récurrents": [
      "3.3.1- Fonctionnement logistique et bureautique",
    ],
  },
};

export default function HierarchicalSelect({ onChange }) {
  const [composante, setComposante] = useState("");
  const [sousComposante, setSousComposante] = useState("");
  const [activite, setActivite] = useState("");

  const handleComposante = (val) => {
    setComposante(val);
    setSousComposante("");
    setActivite("");
    onChange &&
      onChange({ composante: val, sous_composante: "", activite: "" });
  };

  const handleSous = (val) => {
    setSousComposante(val);
    setActivite("");
    onChange && onChange({ composante, sous_composante: val, activite: "" });
  };

  const handleActivite = (val) => {
    setActivite(val);
    onChange &&
      onChange({ composante, sous_composante: sousComposante, activite: val });
  };

  const sousOptions = composante ? Object.keys(DATA[composante]) : [];
  const actOptions =
    composante && sousComposante ? DATA[composante][sousComposante] : [];

  return (
    <div className="filters-grid">
      <div className="filter-group">
        <label>Composante</label>
        <select
          value={composante}
          onChange={(e) => handleComposante(e.target.value)}
        >
          <option value="">Tous</option>
          {Object.keys(DATA).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Sous-composante</label>
        <select
          value={sousComposante}
          onChange={(e) => handleSous(e.target.value)}
          disabled={!composante}
        >
          <option value="">Tous</option>
          {sousOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Activité</label>
        <select
          value={activite}
          onChange={(e) => handleActivite(e.target.value)}
          disabled={!sousComposante}
        >
          <option value="">Tous</option>
          {actOptions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
