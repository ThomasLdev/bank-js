# 0007 — Ledger en partie double, append-only

- Statut : Accepté
- Date : 2026-10-24

## Contexte
Une banque ne « modifie » jamais un solde : elle enregistre des mouvements. Il faut pouvoir prouver à tout moment d'où vient chaque centime.

## Décision
- Toute opération financière produit une **écriture** (`JournalEntry`) composée d'au moins deux **lignes** (`Posting`) dont la somme vaut **zéro**.
- Les écritures sont **immuables** : pas d'`UPDATE`, pas de `DELETE`. Une erreur se corrige par une **contre-passation**, c'est-à-dire une nouvelle écriture de sens opposé.
- Les opérations au guichet passent par des **comptes techniques** de la banque (ex. `CAISSE`).
- Le solde de référence est la somme des lignes. Un **snapshot de solde** (avec une colonne `version`) est maintenu sur `LedgerAccount` pour la performance et le contrôle des règles. Un job de rapprochement vérifie que snapshot = somme.
- **Convention de signe (simplification assumée)** : on raisonne du point de vue du titulaire. Une ligne positive augmente son solde (crédit), une ligne négative le diminue (débit). Ce n'est pas la convention actif / passif d'une vraie comptabilité bancaire.

## Conséquences
- Un dépôt de 100 € donne : client `+100`, `CAISSE` `-100`.
- Un virement de 50 € de A vers B donne : A `-50`, B `+50`.
- Le relevé de compte est une projection directe des lignes.

## Alternatives écartées
- **Colonne `balance` modifiée directement** : aucune traçabilité, et des bugs de concurrence invisibles.
- **Event sourcing complet** : intéressant (gardé en bonus), mais un ledger append-only en donne déjà l'essentiel.
