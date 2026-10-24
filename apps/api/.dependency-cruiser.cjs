/**
 * Hexagonal architecture dependency rules.
 * See docs/02-architecture.md (dependency rules section).
 *
 * @type {import('dependency-cruiser').IConfiguration}
 */
module.exports = {
  forbidden: [
    {
      name: "domain-is-pure",
      comment:
        "The domain is plain TypeScript: no framework, no ORM, no application/infrastructure layer.",
      severity: "error",
      from: { path: "^src/(contexts/[^/]+|shared)/domain/" },
      to: {
        path: [
          "node_modules/(@nestjs|@prisma|prisma|pg)/",
          "^src/shared/infrastructure/",
          "^src/contexts/[^/]+/(application|infrastructure)/",
        ],
      },
    },
    {
      name: "application-without-infrastructure",
      comment:
        "The application layer knows nothing about Prisma or infrastructure. On the Nest side, only @nestjs/common (@Injectable, @Inject) and @nestjs/cqrs (handlers) are allowed.",
      severity: "error",
      from: { path: "^src/contexts/[^/]+/application/" },
      to: {
        path: [
          "node_modules/(@prisma|prisma|pg)/",
          "node_modules/@nestjs/(?!common/|cqrs/)",
          "^src/shared/infrastructure/",
          "^src/contexts/[^/]+/infrastructure/",
        ],
      },
    },
    {
      name: "no-cross-context-internals",
      comment:
        "A context never imports another context's internals: only its index.ts (public API).",
      severity: "error",
      from: { path: "^src/contexts/([^/]+)/" },
      to: {
        path: "^src/contexts/[^/]+/",
        pathNot: ["^src/contexts/$1/", "^src/contexts/[^/]+/index\\.ts$"],
      },
    },
    {
      name: "shared-kernel-is-independent",
      comment: "The shared kernel does not depend on any context.",
      severity: "error",
      from: { path: "^src/shared/" },
      to: { path: "^src/contexts/" },
    },
    {
      name: "no-circular",
      comment:
        "An import cycle breaks at startup under ESM, and reveals a design flaw.",
      severity: "error",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    exclude: { path: "^src/shared/infrastructure/prisma/generated/" },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: "tsconfig.json" },
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default", "types"],
      extensions: [".ts", ".js"],
    },
  },
};
