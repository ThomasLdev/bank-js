# 0008 — Cohérence transactionnelle et concurrence

- Statut : **Proposé**, à challenger pendant la phase 2
- Date : 2026-10-24

## Contexte
- Une écriture en partie double modifie **plusieurs** `LedgerAccount` d'un coup (A et B pour un virement). Elle doit être atomique : soit toutes les lignes sont enregistrées, soit aucune.
- La règle DDD « un agrégat modifié par transaction » est donc incompatible avec cette exigence.
- Deux débits concurrents sur le même compte ne doivent jamais provoquer de *lost update* ni faire dépasser le découvert.
- Accounts (cycle de vie) et Ledger (soldes) sont deux contextes, mais certaines règles les relient, par exemple « on ne clôture qu'un compte à solde nul ».

## Décision (v1, monolithe, une seule base)
1. **On assume de briser « un agrégat par transaction » dans le Ledger** : l'enregistrement d'une écriture charge tous les `LedgerAccount` concernés, applique les règles, puis sauvegarde le tout dans **une seule transaction Postgres**.
2. **Verrouillage optimiste** : chaque `LedgerAccount` porte une colonne `version`. La sauvegarde fait `UPDATE ... WHERE id = ? AND version = ?`. Si aucune ligne n'est mise à jour, on lève une `ConcurrencyError` et le use case réessaie un nombre de fois borné.
   - Pour éviter les interblocages, les comptes sont toujours verrouillés **dans l'ordre de leurs IDs**.
   - Alternative à mesurer en phase 2 : verrouillage pessimiste avec `SELECT ... FOR UPDATE`.
3. **Transactions propagées via `AsyncLocalStorage`** derrière un port applicatif `TransactionManager.run(fn)`. Les repositories Prisma récupèrent le client transactionnel courant.
4. **Accounts → Ledger en v1 : appel synchrone, dans la même transaction**, via un port `LedgerGateway` défini dans Accounts et implémenté en infrastructure. Exemple : `CloseAccount` appelle `ledger.closeAccount(id)`, qui échoue si le solde n'est pas nul, et toute la transaction est annulée.

## Conséquences
- Simple et cohérent tant qu'on reste un monolithe avec une seule base.
- Couplage temporel entre Accounts et Ledger, connu et documenté.
- Quand viendront les virements externes (bonus), on passera aux **événements + outbox** et à une cohérence éventuelle sur ces flux.

## Question ouverte
Le découpage Accounts / Ledger vaut-il son coût en v1, ou faut-il fusionner les deux en un contexte « Comptes » ? On garde la séparation pour l'exercice, et on la réévalue à la fin de la phase 2.
