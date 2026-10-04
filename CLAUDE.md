# Workspace instructions

Read README.md for architecture and deployment. The root Git repository is public landing source. Never commit fe/admin, be/management-be, infra, environment secrets, user data or generated deployment artifacts here. Those folders have independent private remotes; fe/design-system is a separate public tagged package. Preserve user-owned output/ and prompt.md files.

Landing: fe/landing, package @pcl/landing. All public text belongs in bilingual content/translation JSON. New routes must update SEO content, navigation when relevant and IndexNow SLUGS in .github/workflows/deploy.yml. Build prerenders the routes. Keep admin/auth imports out of the landing. Public content is a CDN snapshot with local fallback.

Both apps use @pcl/design-system pinned to a published Git tag. Publish a new version before changing consumers; do not add private app imports to the shared package. Maintain accessible labels, reduced motion, responsive full-row service cards and active-language flag icons.

Production AWS profile is PACIFIC-PROD; use reusable scripts, YAML templates and environments/prod.env. No database: use S3 repositories with conditional writes. Never overwrite seed drafts or publish organization records. SES jcampos.dev identity already exists. Admin invitations are explicit operations.
