---
layout: home

hero:
  name: Feel Your Protocol
  text: MCP Server Documentation
  tagline: Concrete reference for the deterministic future-Ethereum-protocol MCP server — what exists, how to connect, and how we build and operate it.
  actions:
    - theme: brand
      text: Overview
      link: /guide/overview
    - theme: alt
      text: Roadmap vs MCP Docs
      link: /guide/roadmap-relationship
    - theme: alt
      text: Vision (Roadmap)
      link: https://roadmap.feelyourprotocol.org/concepts/api-mcp

features:
  - title: What we have
    details: Present-tense documentation of the MCP server, tools, and setup — for humans configuring agents and for agents reading structured reference material.
    link: /guide/overview
  - title: Tool reference
    details: Intent-driven MCP tools (bytecode simulation, access lists, and more as they ship) with schemas, examples, and guardrails. Sections appear as capabilities land.
    link: /guide/overview#status
  - title: Technical setup
    details: How the execution engine and gateway fit together, how to run locally, and how we deploy on AWS. Sensitive server configs live in the private server-config repo.
    link: /guide/overview#repositories
  - title: Roadmap context
    details: High-level vision and future plans stay on the roadmap site. This site documents shipped or in-progress reality and links back when concepts graduate.
    link: /guide/roadmap-relationship
---

::: info Work in progress
**Step 1 (July 2026):** this docs site is live; the MCP server repositories (`mcp-execution-engine`, `mcp-gateway`) and remote endpoint are **not shipped yet**. Pages will grow as each build step lands.
:::
