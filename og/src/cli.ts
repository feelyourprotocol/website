import { generateAllOgImages, generateExplorationOg, generateTopicOg } from './generate.ts'

function usage(): never {
  console.error(`Usage:
  npm run generate -- exploration <id>   e.g.  npm run generate -- exploration eip-7594
  npm run generate -- topic <id>         e.g.  npm run generate -- topic scaling
  npm run generate -- all`)
  process.exit(1)
}

async function main(): Promise<void> {
  const [command, id] = process.argv.slice(2)
  if (!command) usage()

  if (command === 'all') {
    await generateAllOgImages()
    return
  }

  if (!id) usage()

  if (command === 'exploration') {
    const outPath = await generateExplorationOg(id)
    console.log(`Wrote ${outPath}`)
    return
  }

  if (command === 'topic') {
    const outPath = await generateTopicOg(id)
    console.log(`Wrote ${outPath}`)
    return
  }

  usage()
}

main().catch((err) => {
  console.error(`\nOG image generation failed: ${err instanceof Error ? err.message : String(err)}`)
  process.exit(1)
})
