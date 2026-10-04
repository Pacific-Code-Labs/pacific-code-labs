# Pacific Code Labs

Public bilingual landing at https://pacific-code-labs.jcampos.dev, with a separate invitation-only admin at https://admin.jcampos.dev. Sign-in, invitation password changes and password resets use Amplify Auth on the same admin origin. Media and published public JSON are served at https://cdn.pacific-code-labs.jcampos.dev.

## Independent applications

- `fe/landing`: this public repository, GitHub Pages. No admin code or Cognito configuration ships in its bundle.
- `fe/admin`: private `Pacific-Code-Labs/pacific-code-labs-admin`, S3/CloudFront hosting.
- `be/management-be`: private `Pacific-Code-Labs/pacific-code-labs-management-be`, FastAPI image Lambda and authenticated API Gateway.
- `infra`: private `Pacific-Code-Labs/pacific-code-labs-infrastructure`, YAML templates and styled Cognito emails.
- `fe/design-system`: public `Pacific-Code-Labs/pacific-code-labs-design-system`, pinned Git tag v0.1.1 used by both frontends.

Private folders are independent Git checkouts and ignored by this public repository. Clone them into the paths above to operate the full workspace.

## Run locally

Install Node and pnpm, then `pnpm install`. `bash reboot-server.sh` starts the landing on http://127.0.0.1:5183 and the admin on http://127.0.0.1:5185. Use `LOAD_ADMIN_SSM=1 bash reboot-server.sh` with the PACIFIC-PROD profile to load admin configuration. `bash stop-server.sh` stops only this workspace's processes; `bash view-logs.sh` reads their logs.

## Content and organization

The admin manages all public content and translations, logos/media, clients, projects and payment records. USD and CRC totals are kept separate and amounts use integer minor units. Draft saves use optimistic versions and S3 conditional writes; publish is explicit. A dedicated private data bucket stores organization records and drafts. Only allowlisted website content can enter the public snapshot, and the CDN exposes only media and published paths. The landing refreshes the snapshot in the background and uses bundled content as a fallback. The scheduled Pages build refreshes prerendered SEO content daily.

Products use the canonical Tsuru, Sóköl and Ujtö̀ domains. Sóköl is marked coming soon. Shared tokens, components and flag icons are versioned in the design system.

## Production deployment

`environments/prod.env` contains nonsecret coordinates and selects AWS profile PACIFIC-PROD. Run `bash deploy-env.sh prod --plan` to inspect stages, or `bash deploy-env.sh prod` to deploy certificates, platform, styled invitations, backend, initial missing content and admin assets. Docker and AWS SAM are required for the image backend. Existing content is never overwritten by the seed. Individual stages are reusable scripts under `scripts/`. Landing changes deploy through this repository's GitHub Pages workflow.

The verified jcampos.dev SES identity is reused. SES currently runs in sandbox mode: new recipients must be verified until production access is granted. Invite with `bash scripts/invite-admin.sh EMAIL es` (or en). Cognito generates and delivers the temporary password; scripts do not print it.

Admin deployment uses an environment-scoped GitHub OIDC publish role with read-only SSM configuration and access only to its hosting bucket and distribution. No AWS access keys are stored in frontend configuration. Run `bash deploy-env.sh prod publish-role` with an authenticated GitHub CLI to provision its environment-scoped role and configuration; the script resolves GitHub immutable repository subject IDs.

## Validation

`pnpm --filter @pcl/landing run typecheck` and `pnpm --filter @pcl/landing run build`. In the private workspace, `pnpm --filter @pcl/admin run build` and `PYTHONPATH=be/management-be python3 -m pytest be/management-be/tests infra/email/tests -q`. Run `pnpm --filter @pcl/landing run inventory` after content structure changes.
