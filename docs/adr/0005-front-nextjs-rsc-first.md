# 0005 — Next.js App Router, Server Components d'abord, TanStack Query au besoin

- Statut : Accepté
- Date : 2026-10-24

## Contexte
Avec l'App Router, la récupération des données se fait majoritairement côté serveur (React Server Components). TanStack Query gère l'état serveur *côté client* : cache, invalidation, polling, mises à jour optimistes. Les deux se recouvrent en partie.

## Décision
- Server Components par défaut pour l'affichage.
- Server Actions pour les mutations. Next sert de BFF : le navigateur ne parle jamais directement à l'API Nest.
- **TanStack Query n'est pas installé au départ.** On l'introduit au premier besoin réel côté client, par exemple :
  - polling du statut d'un virement ;
  - relevé en scroll infini ;
  - mise à jour optimiste.
- Tailwind CSS pour le style.

## Conséquences
- On apprend la frontière Server / Client, qui est le vrai sujet de Next.js moderne.
- On comprendra *pourquoi* TanStack Query existe en le mettant en place face à un problème concret.

## Alternatives écartées
- **TanStack Start** à la place de Next : moins répandu sur le marché.
- **SPA pure + TanStack Query partout** : on passerait à côté des RSC.
