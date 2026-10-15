/**
 * Guards the one reason this fork exists.
 *
 * Upstream ships `disable-model-invocation: true` on 23 of its 38 skills, which
 * makes them user-invocable only: the skill never appears in an agent's skill
 * list and an agent cannot reach for it. This fork deletes that line and
 * changes nothing else, so the divergence stays one line per file and stays
 * auditable.
 *
 * A merge from upstream restores the line wherever upstream touched a skill's
 * frontmatter, and the failure is silent — the skill simply stops being
 * available and nothing says why. So this runs in CI and after every merge.
 *
 *   node checks/invocation-patch.mjs
 */
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const GATE = 'disable-model-invocation'

class SkillTree {
  constructor(root) {
    this.root = root
    this.skillsDir = join(root, 'skills')
  }

  /** Every SKILL.md under skills/<category>/<name>/, as absolute paths. */
  manifests() {
    const found = []
    for (const category of this.categories()) {
      const categoryDir = join(this.skillsDir, category)
      for (const skill of this.dirsIn(categoryDir)) {
        const manifest = join(categoryDir, skill, 'SKILL.md')
        if (this.exists(manifest)) found.push(manifest)
      }
    }
    return found.sort()
  }

  categories() {
    return this.dirsIn(this.skillsDir)
  }

  dirsIn(dir) {
    return readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort()
  }

  exists(file) {
    try {
      readFileSync(file)
      return true
    } catch {
      return false
    }
  }

  /** Manifests that carry the gate, as repo-relative paths. */
  gated() {
    return this.manifests()
      .filter((file) => readFileSync(file, 'utf8').includes(GATE))
      .map((file) => relative(this.root, file))
  }

  /** A skill directory with no SKILL.md loads as nothing at all. */
  headless() {
    const missing = []
    for (const category of this.categories()) {
      const categoryDir = join(this.skillsDir, category)
      for (const skill of this.dirsIn(categoryDir)) {
        if (!this.exists(join(categoryDir, skill, 'SKILL.md'))) {
          missing.push(`skills/${category}/${skill}`)
        }
      }
    }
    return missing
  }
}

const tree = new SkillTree(ROOT)
const failures = []

const gated = tree.gated()
if (gated.length) {
  failures.push(
    `${gated.length} skill(s) carry ${GATE}, so no agent can invoke them:\n        ${gated.join('\n        ')}\n` +
      `      Delete that line from each file. It comes back on a merge from upstream.`,
  )
}

const headless = tree.headless()
if (headless.length) {
  failures.push(`${headless.length} skill directory(ies) have no SKILL.md: ${headless.join(', ')}`)
}

if (failures.length) {
  for (const failure of failures) console.error(`FAIL  ${failure}`)
  process.exit(1)
}

console.log(`ok    ${tree.manifests().length} skills, none gated`)
