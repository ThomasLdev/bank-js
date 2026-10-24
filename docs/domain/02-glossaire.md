# Glossaire — langage ubiquitaire

Le terme du code (anglais) est **imposé**. Si un nouveau concept apparaît, on l'ajoute ici *avant* de le coder.

| Terme métier | Code | Contexte | Définition |
|---|---|---|---|
| Titulaire | `Customer` | Accounts | Personne physique cliente de la banque |
| Conseiller | `Advisor` | Accounts / IAM | Employé de la banque qui opère pour le compte des clients |
| Compte | `BankAccount` | Accounts | Compte courant d'un titulaire, avec son cycle de vie |
| Numéro de compte | `AccountNumber` | Accounts | Identifiant métier lisible d'un compte (format type IBAN simplifié), distinct de l'ID technique |
| Statut du compte | `AccountStatus` | Accounts | `ACTIVE`, `FROZEN` (débits interdits) ou `CLOSED` (tout interdit, état définitif) |
| Découvert autorisé | `OverdraftLimit` | Accounts → Ledger | Montant ≥ 0 jusqu'auquel le solde peut devenir négatif |
| Compte comptable | `LedgerAccount` | Ledger | Représentation d'un compte dans le grand livre : solde, version, règles de débit |
| Compte technique | `InternalAccount` | Ledger | Compte de la banque elle-même (ex. `CAISSE`), non soumis au découvert |
| Écriture | `JournalEntry` | Ledger | Enregistrement immuable d'une opération, composé de lignes dont la somme vaut zéro |
| Ligne d'écriture / mouvement | `Posting` | Ledger | Montant signé appliqué à un compte comptable au sein d'une écriture |
| Crédit | `credit` | Ledger | Ligne positive : augmente le solde du titulaire |
| Débit | `debit` | Ledger | Ligne négative : diminue le solde du titulaire |
| Solde | `balance` | Ledger | Somme de toutes les lignes d'un compte |
| Solde disponible | `availableBalance` | Ledger | Solde + découvert autorisé. C'est le maximum débitable |
| Contre-passation | `reversal` | Ledger / Payments | Écriture de sens opposé qui annule une écriture précédente sans la supprimer |
| Relevé | `Statement` | Ledger | Liste chronologique des mouvements d'un compte, avec solde progressif |
| Montant | `Money` | Shared | Montant en unités mineures (centimes) avec sa devise |
| Devise | `Currency` | Shared | Code ISO 4217 (v1 : `EUR` uniquement) |
| Virement | `Transfer` | Payments | Ordre de déplacer un montant d'un compte source vers un compte destinataire |
| Compte source / destinataire | `source` / `destination` | Payments | Compte débité / compte crédité par un virement |
| Libellé | `label` | Payments | Texte libre visible sur les relevés |
| Dépôt | `Deposit` | Payments | Remise d'espèces au guichet sur un compte |
| Retrait | `Withdrawal` | Payments | Retrait d'espèces au guichet depuis un compte |
| Motif de rejet | `RejectionReason` | Payments | Raison métier pour laquelle une opération a été refusée |
| Clé d'idempotence | `IdempotencyKey` | Payments | Identifiant fourni par le client qui garantit qu'une opération n'est exécutée qu'une fois |
| Rapprochement | `Reconciliation` | Ledger | Vérification que le solde stocké est égal à la somme des lignes |
