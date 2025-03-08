import { execSync } from 'child_process';

export function getGitInfo() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
    const commit = execSync('git rev-parse --short HEAD').toString().trim();
    return { branch, commit };
  } catch (error) {
    console.error('Failed to get Git info:', error);
    return { branch: 'unknown', commit: 'unknown' };
  }
}
