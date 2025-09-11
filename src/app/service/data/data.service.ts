import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  icones: any[] = [
    {
      rubrique: "Bâtiments / Projets / Domaines",
      les_icones: [
        { icone: "bi-building", description: "bâtiment" },
        { icone: "bi-house", description: "logement" },
        { icone: "bi-bricks", description: "en construction" },
        { icone: "bi-hammer", description: "chantier" },
        { icone: "bi-tools", description: "en travaux" },
        { icone: "bi-wrench", description: "maintenance" },
        { icone: "bi-gear", description: "bâtiment technique" },
        { icone: "bi-plug", description: "électrification" },
        { icone: "bi-water", description: "plomberie" },
        { icone: "bi-lightning", description: "courant" },
        { icone: "bi-pc-display", description: "salle informatique" },
        { icone: "bi-clipboard", description: "fiche bâtiment" },
        { icone: "bi-folder", description: "dossier de bâtiment" },
        { icone: "bi-layout-text-window", description: "vue plan bâtiment" },
        { icone: "bi-vector-pen", description: "architecte" },
        { icone: "bi-rulers", description: "dimensions" },
        { icone: "bi-aspect-ratio", description: "surface" },
        { icone: "bi-pin-map", description: "localisation" },
        { icone: "bi-globe", description: "position géographique" },
        { icone: "bi-map", description: "zone cartographique" }
      ]
    },
    {
      rubrique: "États / Suivi / Statuts",
      les_icones: [
        { icone: "bi-check-circle", description: "validé" },
        { icone: "bi-x-circle", description: "rejeté" },
        { icone: "bi-clock", description: "en attente" },
        { icone: "bi-hourglass", description: "en cours" },
        { icone: "bi-exclamation-triangle", description: "attention" },
        { icone: "bi-flag", description: "signalé" },
        { icone: "bi-bug", description: "anomalie" },
        { icone: "bi-shield-exclamation", description: "sécurité" },
        { icone: "bi-shield-check", description: "conformité" },
        { icone: "bi-lock", description: "verrouillé" },
        { icone: "bi-unlock", description: "ouvert" },
        { icone: "bi-slash-circle", description: "bloqué" },
        { icone: "bi-eye", description: "visible" },
        { icone: "bi-eye-slash", description: "masqué" },
        { icone: "bi-activity", description: "actif" },
        { icone: "bi-lightning-charge", description: "urgent" },
        { icone: "bi-calendar-check", description: "terminé" },
        { icone: "bi-calendar-x", description: "annulé" },
        { icone: "bi-clipboard-check", description: "approuvé" },
        { icone: "bi-clipboard-x", description: "rejeté" }
      ]
    },
    {
      rubrique: "Documents / Fichiers / Dossiers",
      les_icones: [
        { icone: "bi-file-earmark", description: "fichier" },
        { icone: "bi-file-earmark-text", description: "fichier texte" },
        { icone: "bi-file-earmark-pdf", description: "PDF" },
        { icone: "bi-file-earmark-excel", description: "Excel" },
        { icone: "bi-paperclip", description: "pièce jointe" },
        { icone: "bi-folder-fill", description: "dossier" },
        { icone: "bi-folder2-open", description: "dossier ouvert" },
        { icone: "bi-archive", description: "archive" },
        { icone: "bi-book", description: "documentation" },
        { icone: "bi-journal-text", description: "rapport" },
        { icone: "bi-download", description: "télécharger" },
        { icone: "bi-upload", description: "envoyer" },
        { icone: "bi-pencil", description: "modifier" },
        { icone: "bi-trash", description: "supprimer" },
        { icone: "bi-info-circle", description: "détails" },
        { icone: "bi-search", description: "rechercher" },
        { icone: "bi-filter", description: "filtrer" }
      ]
    },
    {
      rubrique: "Utilisateurs / Intervenants",
      les_icones: [
        { icone: "bi-person", description: "utilisateur" },
        { icone: "bi-person-badge", description: "chef d’annexe" },
        { icone: "bi-person-check", description: "validateur" },
        { icone: "bi-person-fill-gear", description: "administrateur" },
        { icone: "bi-person-lines-fill", description: "superviseur" },
        { icone: "bi-people", description: "groupe" },
        { icone: "bi-person-fill-lock", description: "accès restreint" },
        { icone: "bi-person-x", description: "désactivé" },
        { icone: "bi-person-circle", description: "profil" },
        { icone: "bi-person-vcard", description: "affectation" },
        { icone: "bi-person-walking", description: "en déplacement" },
        { icone: "bi-diagram-3", description: "hiérarchie" },
        { icone: "bi-chat", description: "message" },
        { icone: "bi-chat-left-text", description: "note" },
        { icone: "bi-telephone", description: "appel" },
        { icone: "bi-envelope", description: "email" },
        { icone: "bi-calendar-event", description: "rendez-vous" },
        { icone: "bi-clock-history", description: "historique" },
        { icone: "bi-graph-up", description: "performance" },
        { icone: "bi-pie-chart", description: "répartition" }
      ]
    },
    {
      rubrique: "Litiges / Alertes / Incidents",
      les_icones: [
        { icone: "bi-exclamation-circle", description: "litige" },
        { icone: "bi-megaphone", description: "alerte signalée" },
        { icone: "bi-ban", description: "refusé" },
        { icone: "bi-shield-lock", description: "litige fermé" },
        { icone: "bi-clipboard-data", description: "dossier litige" },
        { icone: "bi-question-circle", description: "en investigation" },
        { icone: "bi-journal-bookmark", description: "procès-verbal" },
        { icone: "bi-chat-square-dots", description: "rapport incident" },
        { icone: "bi-cloud-lightning-rain", description: "intempéries" },
        { icone: "bi-thermometer-high", description: "danger" },
        { icone: "bi-stop-circle", description: "suspendu" },
        { icone: "bi-bandaid", description: "résolu temporairement" },
        { icone: "bi-file-earmark-ruled", description: "constat" },
        { icone: "bi-bug-fill", description: "anomalie" },
        { icone: "bi-file-text", description: "PV final" },
        { icone: "bi-flag-fill", description: "incident déclaré" },
        { icone: "bi-building-x", description: "bâtiment litigieux" },
        { icone: "bi-question-square", description: "non clarifié" },
        { icone: "bi-compass", description: "enquête sur terrain" },
        { icone: "bi-clipboard-minus", description: "non-conformité" }
      ]
    }
  ]


  constructor() { }

}
