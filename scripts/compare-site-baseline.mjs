#!/usr/bin/env node
import { mkdir, readFile, realpath, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const IGNORED_ROOT_FIELDS = new Set(['generatedAt', 'siteDirectory', 'contentDirectory'])
const ROUTE_KEYED_ARRAYS = new Set(['$.routes', '$.pages'])

function addChange(changes, changePath, type, before, after) {
  changes.push({ path: changePath, type, before: before ?? null, after: after ?? null })
}

function compareRouteArrays(changePath, before, after, changes) {
  const byRoute = (items) => {
    const entries = new Map()
    for (const item of items) {
      if (
        !item ||
        typeof item !== 'object' ||
        typeof item.route !== 'string' ||
        entries.has(item.route)
      )
        return null
      entries.set(item.route, item)
    }
    return entries
  }
  const beforeByRoute = byRoute(before)
  const afterByRoute = byRoute(after)
  if (!beforeByRoute || !afterByRoute) return false

  const routes = [...new Set([...beforeByRoute.keys(), ...afterByRoute.keys()])].sort()
  for (const route of routes) {
    const itemPath = `${changePath}[${JSON.stringify(route)}]`
    if (!beforeByRoute.has(route))
      addChange(changes, itemPath, 'added', null, afterByRoute.get(route))
    else if (!afterByRoute.has(route))
      addChange(changes, itemPath, 'removed', beforeByRoute.get(route), null)
    else compareValue(itemPath, beforeByRoute.get(route), afterByRoute.get(route), changes)
  }
  return true
}

function compareValue(changePath, before, after, changes) {
  if (Object.is(before, after)) return

  if (Array.isArray(before) && Array.isArray(after)) {
    if (
      ROUTE_KEYED_ARRAYS.has(changePath) &&
      compareRouteArrays(changePath, before, after, changes)
    )
      return
    const length = Math.max(before.length, after.length)
    for (let index = 0; index < length; index += 1) {
      const itemPath = `${changePath}[${index}]`
      if (index >= before.length) addChange(changes, itemPath, 'added', null, after[index])
      else if (index >= after.length) addChange(changes, itemPath, 'removed', before[index], null)
      else compareValue(itemPath, before[index], after[index], changes)
    }
    return
  }

  if (
    before &&
    after &&
    typeof before === 'object' &&
    typeof after === 'object' &&
    !Array.isArray(before) &&
    !Array.isArray(after)
  ) {
    const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort()
    for (const key of keys) {
      if (changePath === '$' && IGNORED_ROOT_FIELDS.has(key)) continue
      const itemPath = `${changePath}.${key}`
      if (!Object.hasOwn(before, key)) addChange(changes, itemPath, 'added', null, after[key])
      else if (!Object.hasOwn(after, key))
        addChange(changes, itemPath, 'removed', before[key], null)
      else compareValue(itemPath, before[key], after[key], changes)
    }
    return
  }

  addChange(changes, changePath, 'changed', before, after)
}

export function compareBaselines(baseline, current) {
  const changes = []
  compareValue('$', baseline, current, changes)
  const counts = {
    added: changes.filter((change) => change.type === 'added').length,
    removed: changes.filter((change) => change.type === 'removed').length,
    changed: changes.filter((change) => change.type === 'changed').length,
  }
  return {
    equal: changes.length === 0,
    baselineGeneratedAt: baseline.generatedAt ?? null,
    currentGeneratedAt: current.generatedAt ?? null,
    counts,
    changes,
  }
}

function parseArguments(argv) {
  const values = {}
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (!arg.startsWith('--')) throw new Error(`Unexpected argument: ${arg}`)
    const key = arg.slice(2)
    if (key === 'help') return { help: true }
    values[key] = argv[++index]
    if (!values[key]) throw new Error(`Missing value for --${key}`)
  }
  return values
}

async function main() {
  const args = parseArguments(process.argv.slice(2))
  if (args.help) {
    console.log(
      'Usage: node scripts/compare-site-baseline.mjs --baseline baseline.json --current current.json [--output diff.json]'
    )
    return
  }
  if (!args.baseline || !args.current)
    throw new Error('Required options missing: --baseline and --current')
  const baseline = JSON.parse(await readFile(args.baseline, 'utf8'))
  const current = JSON.parse(await readFile(args.current, 'utf8'))
  const result = compareBaselines(baseline, current)

  if (args.output) {
    const output = path.resolve(args.output)
    await mkdir(path.dirname(output), { recursive: true })
    await writeFile(output, `${JSON.stringify(result, null, 2)}\n`)
    console.log(JSON.stringify({ output: pathToFileURL(output).href, ...result }, null, 2))
  } else {
    console.log(JSON.stringify(result, null, 2))
  }
  if (!result.equal) process.exitCode = 1
}

if (
  process.argv[1] &&
  (await realpath(process.argv[1])) === (await realpath(fileURLToPath(import.meta.url)))
) {
  main().catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
}
