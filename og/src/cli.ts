import './bootstrap-playwright-env.ts'
import { assertChromiumReady } from './check-browsers.ts'
import { OG_HEIGHT, OG_WIDTH } from './config.ts'
import { generateRoadmapOg } from './generate-roadmap-og.ts'
import { generateAllOgImages, generateExplorationOg, generateTopicOg } from './generate.ts'

function usage(): never {
  console.error(`Usage:
  npm run generate -- exploration <id>   e.g.  npm run generate -- exploration eip-7594
  npm run generate -- topic <id>         e.g.  npm run generate -- topic scaling
  npm run generate -- roadmap            e.g.  npm run generate -- roadmap
  npm run generate -- all`)
  process.exit(1)
}

async function main(): Promise<void> {
  await assertChromiumReady()

  const [command, id] = process.argv.slice(2)
  if (!command) usage()

  if (command === 'all') {
    await generateAllOgImages()
    return
  }

  if (command === 'roadmap') {
    const outPath = await generateRoadmapOg()
    console.log(`Wrote ${outPath} (${OG_WIDTH}×${OG_HEIGHT})`)
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
