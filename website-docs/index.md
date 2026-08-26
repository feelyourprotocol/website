---
layout: home

hero:
  name: Feel Your Protocol
  text: Interactive Ethereum Protocol Explorations
  tagline: Explore, visualize and understand Ethereum protocol changes — hands on.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: Add an Exploration
      link: /contributing/adding-an-exploration
    - theme: alt
      text: View on GitHub
      link: https://github.com/feelyourprotocol/website

features:
  - title: Interactive Explorations
    details: Each exploration is a self-contained folder with an interactive widget that lets you explore a protocol change hands on — EIPs, ERCs, or promising research.
  - title: Powered by Real Libraries
    details: Widgets run actual Ethereum library code in the browser — no mocks, no simplifications. See how protocol changes behave with real inputs.
  - title: Reusable E-Components
    details: Common Ethereum patterns like precompile interfaces are packaged as reusable E-Components with stable APIs, so you can build new explorations fast.
  - title: Built for Agents
    details: Folder-per-exploration structure, typed configs, and compact docs are designed so LLMs and coding agents can scaffold, wire, and verify explorations with minimal hand-holding.
---

::: info Beta — structural base still evolving
This project is in **beta**. Reusable component APIs (E-Components, shared UI) may still change — see the [changelog](/changelog). These docs are the canonical guide for humans and agents extending the **explorations website**; sibling sites in the repo (roadmap, MCP docs, community token) document themselves in their own READMEs.
:::
