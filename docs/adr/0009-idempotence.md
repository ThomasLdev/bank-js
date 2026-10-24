# 0009 — Idempotence des opérations financières

- Statut : Accepté
- Date : 2026-10-24

## Contexte
Un double clic, un retry réseau ou un timeout côté client peuvent rejouer une requête. En banque, un virement exécuté deux fois est un incident grave.

## Décision
- Toute commande qui crée un mouvement d'argent (virement, dépôt, retrait) exige un header `Idempotency-Key` (UUID généré par le client).
- La clé est stockée avec une **empreinte de la requête** et le **résultat** produit, sous une contrainte d'unicité `(clé, initiateur)`.
- Même clé et même requête : on renvoie le résultat d'origine, sans rien réexécuter.
- Même clé mais requête différente : `422` (réutilisation abusive de la clé).
- Requête en cours avec la même clé : `409`.
- La clé est enregistrée dans **la même transaction** que l'opération.

## Conséquences
- Le front génère la clé à l'affichage du formulaire, pas à la soumission. C'est ce qui protège du double clic.
- Implémentation : un interceptor ou décorateur Nest côté infrastructure HTTP. L'unicité est garantie par la base, pas par le code.
