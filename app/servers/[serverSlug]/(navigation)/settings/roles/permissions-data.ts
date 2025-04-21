/**
 * Type définissant la structure d'une permission
 */
export type Permission = {
  id: string;
  name: string;
  description?: string;
};

/**
 * Type définissant la structure d'une catégorie de permissions
 */
export type PermissionCategory = {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
};

/**
 * Descriptions des permissions pour aider les utilisateurs
 */
export const permissionDescriptions: Record<string, string> = {
  // Général
  VIEW_SERVER: "Permet aux membres de voir le serveur par défaut (à l'exception des salons privés).",
  MANAGE_SERVER: "Permet aux membres de créer, modifier ou supprimer des salons.",
  MANAGE_ROLES: "Permet aux membres de créer de nouveaux rôles et de modifier ou de supprimer des rôles inférieurs à leur rôle le plus élevé.",
  MANAGE_CHANNELS: "Permet aux membres de changer les permissions des salons individuels auxquels ils ont accès.",
  
  // Messages
  SEND_MESSAGES: "Permet aux membres d'envoyer des messages dans les salons textuels.",
  READ_MESSAGES: "Permet aux membres de lire les messages dans les salons textuels.",
  MANAGE_MESSAGES: "Permet aux membres de supprimer des messages d'autres membres.",
  EMBED_LINKS: "Permet aux membres d'intégrer des liens dans leurs messages.",
  ATTACH_FILES: "Permet aux membres de joindre des fichiers à leurs messages.",
  MENTION_EVERYONE: "Permet aux membres de mentionner @everyone et @here.",
  
  // Voix
  CONNECT: "Permet aux membres de se connecter aux salons vocaux.",
  SPEAK: "Permet aux membres de parler dans les salons vocaux.",
  VIDEO: "Permet aux membres d'activer leur caméra dans les salons vocaux.",
  MUTE_MEMBERS: "Permet aux membres de rendre muet d'autres membres dans les salons vocaux.",
  DEAFEN_MEMBERS: "Permet aux membres de rendre sourd d'autres membres dans les salons vocaux.",
  MOVE_MEMBERS: "Permet aux membres de déplacer d'autres membres entre les salons vocaux.",
  
  // Citizens
  CREATE_CITIZEN: "Permet aux membres de créer des profils de citoyens.",
  READ_CITIZEN: "Permet aux membres de voir les profils des citoyens.",
  EDIT_CITIZEN: "Permet aux membres de modifier les informations des citoyens existants.",
  DELETE_CITIZEN: "Permet aux membres de supprimer des citoyens.",
  
  // EMS
  CREATE_EMS: "Permet aux membres de créer des dossiers médicaux.",
  READ_EMS: "Permet aux membres de voir les dossiers médicaux.",
  EDIT_EMS: "Permet aux membres de modifier les dossiers médicaux.",
  DELETE_EMS: "Permet aux membres de supprimer des dossiers médicaux.",
  
  // Avancé
  ADMINISTRATOR: "Les membres avec cette permission ont tous les droits et ignorent les permissions spécifiques à chaque salon.",
  VIEW_AUDIT_LOG: "Permet aux membres de voir un récapitulatif des personnes ayant effectué différentes actions sur le serveur.",
  MANAGE_WEBHOOKS: "Permet aux membres de créer, modifier et supprimer des webhooks.",
  MANAGE_EMOJIS: "Permet aux membres d'ajouter, de modifier ou de supprimer des émojis, autocollants et sons personnalisés.",
};

/**
 * Obtenir la description d'une permission
 * @param permissionId ID de la permission
 * @returns Description de la permission ou message par défaut
 */
export function getPermissionDescription(permissionId: string): string {
  return permissionDescriptions[permissionId] || 
    "Permet aux membres d'utiliser cette fonctionnalité sur le serveur.";
}

/**
 * Catégories de permissions.
 * Définit les groupes de permissions et leurs options
 */
export const permissionCategories: PermissionCategory[] = [
  {
    id: "general",
    name: "Général",
    permissions: [
      { id: "VIEW_DASHBOARD", name: "Voir le tableau de bord" },
      { id: "MANAGE_SERVER", name: "Gérer le serveur" },
      { id: "MANAGE_ROLES", name: "Gérer les rôles" },
      { id: "VIEW_AUDIT_LOG", name: "Voir les logs d'audit" },
    ],
  },
  {
    id: "members",
    name: "Membres",
    permissions: [
      { id: "VIEW_MEMBERS", name: "Voir les membres" },
      { id: "MANAGE_MEMBERS", name: "Gérer les membres" },
      { id: "KICK_MEMBERS", name: "Expulser des membres" },
      { id: "BAN_MEMBERS", name: "Bannir des membres" },
    ],
  },
  {
    id: "leo",
    name: "LEO",
    permissions: [
      { id: "VIEW_LEO", name: "Voir les officiers" },
      { id: "MANAGE_LEO", name: "Gérer les officiers" },
      { id: "CREATE_ARREST_REPORTS", name: "Créer des rapports d'arrestation" },
      { id: "CREATE_BOLOS", name: "Créer des avis de recherche" },
      { id: "NAME_SEARCH", name: "Rechercher des noms" },
      { id: "PLATE_SEARCH", name: "Rechercher des plaques" },
      { id: "WEAPON_SEARCH", name: "Rechercher des armes" },
      { id: "MANAGE_WARRANTS", name: "Gérer les mandats" },
    ],
  },
  {
    id: "ems",
    name: "EMS",
    description: "Permissions pour le système médical",
    permissions: [
      {
        id: "READ_EMS",
        name: "Rechercher patient",
        description: "Permet de rechercher un patient dans le système EMS",
      },
      {
        id: "CREATE_EMS",
        name: "Créer fiche médicale",
        description: "Permet de créer une nouvelle fiche médicale",
      },
      {
        id: "EDIT_EMS",
        name: "Modifier ses propres fiches",
        description: "Permet de modifier ses propres fiches médicales",
      },
      {
        id: "UPDATE_OTHERS_RECORDS",
        name: "Modifier fiches des autres",
        description: "Permet de modifier les fiches médicales créées par d'autres membres",
      },
      {
        id: "DELETE_RECORD",
        name: "Supprimer fiche médicale",
        description: "Permet de supprimer une fiche médicale",
      },
      {
        id: "DECLARE_DEATH",
        name: "Déclarer un décès RP",
        description: "Permet de déclarer un décès dans le système",
      },
      {
        id: "MARK_CONFIDENTIAL",
        name: "Marquer confidentiel",
        description: "Permet de marquer une fiche comme confidentielle",
      },
      {
        id: "VIEW_CONFIDENTIAL",
        name: "Voir fiches confidentielles",
        description: "Permet de voir les fiches marquées comme confidentielles",
      },
      {
        id: "RESTRICT_ACCESS",
        name: "Restreindre l'accès",
        description: "Permet de restreindre l'accès à certaines fiches médicales",
      },
      {
        id: "AUTHORIZE_POLICE",
        name: "Autoriser visibilité police",
        description: "Permet d'autoriser la visibilité d'une fiche à la police",
      },
      {
        id: "VIEW_RESTRICTED",
        name: "Voir fiches restreintes",
        description: "Permet de voir les fiches à accès restreint",
      },
      {
        id: "VIEW_LOGS",
        name: "Accès logs dossier médical",
        description: "Permet d'accéder aux logs des dossiers médicaux",
      },
      {
        id: "MANAGE_ACCESS",
        name: "Gérer accès EMS / rôles",
        description: "Permet de gérer les accès et les rôles EMS",
      },
    ],
  },
  {
    id: "dispatch",
    name: "Dispatch",
    permissions: [
      { id: "VIEW_DISPATCH", name: "Voir la répartition" },
      { id: "MANAGE_DISPATCH", name: "Gérer la répartition" },
      { id: "MANAGE_CALLS", name: "Gérer les appels" },
      { id: "UPDATE_AOP", name: "Mettre à jour l'AOP" },
      { id: "USE_SIGNAL100", name: "Utiliser Signal 100" },
    ],
  },
  {
    id: "citizen",
    name: "Citoyen",
    permissions: [
      { id: "CREATE_CITIZEN", name: "Créer des citoyens" },
      { id: "READ_CITIZEN", name: "Voir les citoyens" },
      { id: "EDIT_CITIZEN", name: "Modifier des citoyens" },
      { id: "DELETE_CITIZEN", name: "Supprimer des citoyens" },
    ],
  },
];

/**
 * Données des permissions disponibles par catégorie
 */
export const availablePermissionCategories: PermissionCategory[] = [
  {
    id: "general",
    name: "General",
    permissions: [
      { id: "VIEW_SERVER", name: "View Server" },
      { id: "MANAGE_SERVER", name: "Manage Server" },
      { id: "MANAGE_ROLES", name: "Manage Roles" },
      { id: "MANAGE_CHANNELS", name: "Manage Channels" }
    ]
  },
  {
    id: "messaging",
    name: "Messaging",
    permissions: [
      { id: "SEND_MESSAGES", name: "Send Messages" },
      { id: "READ_MESSAGES", name: "Read Messages" },
      { id: "MANAGE_MESSAGES", name: "Manage Messages" },
      { id: "EMBED_LINKS", name: "Embed Links" },
      { id: "ATTACH_FILES", name: "Attach Files" },
      { id: "MENTION_EVERYONE", name: "Mention Everyone" }
    ]
  },
  {
    id: "voice",
    name: "Voice",
    permissions: [
      { id: "CONNECT", name: "Connect" },
      { id: "SPEAK", name: "Speak" },
      { id: "VIDEO", name: "Video" },
      { id: "MUTE_MEMBERS", name: "Mute Members" },
      { id: "DEAFEN_MEMBERS", name: "Deafen Members" },
      { id: "MOVE_MEMBERS", name: "Move Members" }
    ]
  },
  {
    id: "advanced",
    name: "Advanced",
    permissions: [
      { id: "ADMINISTRATOR", name: "Administrator" },
      { id: "VIEW_AUDIT_LOG", name: "View Audit Log" },
      { id: "MANAGE_WEBHOOKS", name: "Manage Webhooks" },
      { id: "MANAGE_EMOJIS", name: "Manage Emojis" }
    ]
  }
];

export const PERMISSIONS_GROUPS = [
  {
    name: "Citizens",
    permissions: [
      { id: "CREATE_CITIZEN", name: "Créer des citoyens" },
      { id: "READ_CITIZEN", name: "Voir les citoyens" },
      { id: "EDIT_CITIZEN", name: "Modifier des citoyens" },
      { id: "DELETE_CITIZEN", name: "Supprimer des citoyens" },
    ],
  },
  {
    name: "EMS",
    permissions: [
      { id: "CREATE_EMS", name: "Créer des dossiers médicaux" },
      { id: "READ_EMS", name: "Voir les dossiers médicaux" },
      { id: "EDIT_EMS", name: "Modifier les dossiers médicaux" },
      { id: "DELETE_EMS", name: "Supprimer des dossiers médicaux" },
    ],
  },
]; 