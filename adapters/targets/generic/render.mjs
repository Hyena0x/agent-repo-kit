export function renderGenericPolicyManifest(policy) {
  const manifest = {
    schemaVersion: policy.schemaVersion,
    id: policy.id,
    positioning: policy.positioning,
    releaseGuard: policy.releaseGuard,
    workspace: policy.workspace,
    permissions: policy.permissions,
    review: policy.review
  };

  return `${JSON.stringify(manifest, null, 2)}\n`;
}
