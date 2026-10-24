# 0004 — Prisma comme ORM, confiné à l'infrastructure

- Statut : Accepté
- Date : 2026-10-24

## Contexte
Prisma est l'ORM TypeScript le plus demandé. Contrairement à Doctrine, il n'est pas un Data Mapper : pas d'Unit of Work, pas d'Identity Map, pas de verrouillage optimiste intégré. Ses types générés ont tendance à se répandre partout dans le code.

## Décision
- Prisma est utilisé **uniquement** dans `infrastructure/persistence`.
- Les mappers domaine ↔ Prisma sont écrits à la main.
- Pas de relation Prisma entre modèles de contextes différents : on ne garde que des IDs.
- Les migrations passent par `prisma migrate`.
- Les besoins non couverts (`SELECT ... FOR UPDATE`, requêtes de rapprochement) sont traités en SQL brut typé (`$queryRaw` / TypedSQL), toujours dans l'infrastructure.

## Conséquences
- Il faut gérer soi-même le verrouillage optimiste (colonne `version`) et la propagation des transactions (ADR 0008).
- Écrire les mappers coûte du temps, mais c'est voulu : c'est là qu'on apprend ce que Doctrine faisait à notre place.

## Alternatives écartées
- **MikroORM** : le plus proche de Doctrine (Unit of Work), mais beaucoup moins présent sur le marché.
- **Drizzle** : en forte progression, à garder en tête pour un éventuel second projet.
- **TypeORM** : vieillissant.
