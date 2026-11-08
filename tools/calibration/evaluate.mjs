import { readFileSync } from 'node:fs'
import { computeSignature, similarity } from '../../client/src/lib/signature.js'
const dir = process.argv[2] || '.'
const meta = JSON.parse(readFileSync(`${dir}/meta.json`))
const sigs = meta.map((m) => ({ ...m, sig: computeSignature(readFileSync(`${dir}/imgs/${m.file}.rgba`)) }))
const same = [], diff = []
for (let i = 0; i < sigs.length; i++) for (let j = i + 1; j < sigs.length; j++) (sigs[i].obj === sigs[j].obj ? same : diff).push(similarity(sigs[i].sig, sigs[j].sig))
const out = []
for (let t = 0.6; t <= 0.86; t += 0.02) out.push(`${t.toFixed(2)}: ${(same.filter((x) => x >= t).length / same.length * 100).toFixed(0)}% / ${(diff.filter((x) => x >= t).length / diff.length * 100).toFixed(1)}%`)
console.log(dir.split('/').pop(), 'max diff', Math.max(...diff).toFixed(3), '\n ' + out.join('\n '))
