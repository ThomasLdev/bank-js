# Règles métier

Chaque règle doit être couverte par **au moins un test** dont le nom cite l'identifiant, par exemple `it('RG-LED-04 — refuse un débit au-delà du découvert')`.

Les plafonds chiffrés sont des valeurs v1, à placer en configuration.

## Accounts

| ID | Règle |
|---|---|
| RG-ACC-01 | Un titulaire a un nom et un email valides. L'email est unique dans la banque. |
| RG-ACC-02 | Un compte appartient à un et un seul titulaire. Un titulaire peut avoir plusieurs comptes. |
| RG-ACC-03 | La devise d'un compte est fixée à l'ouverture et immuable. La banque n'ouvre des comptes que dans une devise acceptée (v1 : `EUR` uniquement). |
| RG-ACC-04 | Un compte reçoit à l'ouverture un numéro de compte unique et le statut `ACTIVE`. |
| RG-ACC-05 | Le découvert autorisé est compris entre 0 et 2 000 €. Valeur par défaut : 0. Seul un conseiller peut le modifier. |
| RG-ACC-06 | On ne peut pas baisser le découvert sous le niveau du solde négatif actuel. Exemple : solde −300 €, nouveau découvert 200 € → refusé. |
| RG-ACC-07 | Seul un compte `ACTIVE` peut être gelé, et seul un compte `FROZEN` peut être dégelé. |
| RG-ACC-08 | Un compte `CLOSED` ne peut plus changer d'état (état terminal). |
| RG-ACC-09 | Un compte ne peut être clôturé que si son solde est exactement nul. |

## Ledger

| ID | Règle |
|---|---|
| RG-LED-01 | Une écriture comporte au moins 2 lignes, et la somme de ses lignes vaut exactement 0. |
| RG-LED-02 | Toutes les lignes d'une écriture sont dans la même devise. Aucune ligne n'a un montant nul. |
| RG-LED-03 | Les écritures et les lignes sont immuables : jamais modifiées, jamais supprimées. |
| RG-LED-04 | Un débit est refusé si le solde après opération est inférieur à −(découvert autorisé). |
| RG-LED-05 | Un débit est refusé si le compte est gelé ou clôturé. |
| RG-LED-06 | Un crédit est refusé si le compte est clôturé. Un compte gelé **peut** être crédité. |
| RG-LED-07 | Les comptes techniques ne sont pas soumis au découvert. |
| RG-LED-08 | Une contre-passation reprend les lignes d'origine avec le signe inversé et référence l'écriture d'origine. Une écriture ne peut être contre-passée qu'une seule fois. |
| RG-LED-09 | Des écritures concurrentes sur un même compte ne provoquent jamais de perte de mise à jour : le solde final est égal à la somme de toutes les lignes acceptées. |
| RG-LED-10 | Pour tout compte, à tout instant : solde stocké = somme des lignes (contrôlé par le rapprochement). |

## Payments

| ID | Règle |
|---|---|
| RG-PAY-01 | Le montant d'une opération est strictement positif. |
| RG-PAY-02 | Les comptes source et destinataire d'un virement sont différents. |
| RG-PAY-03 | Les comptes source et destinataire ont la même devise. |
| RG-PAY-04 | Un client ne peut émettre un virement que depuis un compte dont il est titulaire. |
| RG-PAY-05 | Le compte destinataire doit exister et ne pas être clôturé. |
| RG-PAY-06 | Le compte source doit pouvoir être débité (RG-LED-04 et RG-LED-05). |
| RG-PAY-07 | Un virement refusé reste enregistré avec le statut `REJECTED` et un motif. Il ne produit aucune écriture. |
| RG-PAY-08 | Plafond par virement : 10 000 €. Libellé : 140 caractères maximum. |
| RG-PAY-09 | Toute opération créant un mouvement d'argent exige une clé d'idempotence (ADR 0009). |
| RG-PAY-10 | Seul un conseiller peut contre-passer un virement, uniquement s'il est `EXECUTED`. La contre-passation est soumise aux règles du Ledger (v1 : refusée si le destinataire n'a plus les fonds). |

## Motifs de rejet (`RejectionReason`)

`INSUFFICIENT_FUNDS` · `ACCOUNT_FROZEN` · `ACCOUNT_CLOSED` · `ACCOUNT_NOT_FOUND` · `SAME_ACCOUNT` · `CURRENCY_MISMATCH` · `AMOUNT_LIMIT_EXCEEDED` · `NOT_ACCOUNT_HOLDER`
