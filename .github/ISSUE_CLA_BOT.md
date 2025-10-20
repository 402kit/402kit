# [BLOCKING] Enable CLA Bot

## Priority: CRITICAL

This issue blocks PR merging until resolved.

## Action Required

Install the **CLA Assistant** GitHub App for this repository.

## Steps

1. Go to https://github.com/apps/cla-assistant
2. Click "Configure"
3. Select the `402kit/402kit` repository
4. Grant permissions
5. The app will automatically use `.github/cla.yml` configuration

## Verification

- [ ] CLA Assistant app installed
- [ ] Test PR shows CLA check
- [ ] CLA check is marked as required in branch protection rules

## Branch Protection

After installing the app, update branch protection for `main`:

1. Go to Settings → Branches → Branch protection rules
2. Edit the `main` branch rule (or create one)
3. Under "Require status checks to pass before merging":
   - Check "Require status checks to pass before merging"
   - Add "cla/cla" to required checks
4. Save changes

## Related Files

- `.github/cla.yml` - CLA bot configuration
- `CLA.md` - Contributor License Agreement (v1.0)
- `CONTRIBUTING.md` - Contributor guide

## Why This Matters

All PRs must pass the CLA check. This protects:

- ✅ Contributors (from future legal issues)
- ✅ The project (IP ownership clarity)
- ✅ Commercial viability (relicense rights for monetization)
- ✅ Patent protection (explicit patent grants)

## Contact

Questions? Email legal@402kit.dev

---

**Do not merge any PRs until this is resolved.**
