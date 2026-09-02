# AWS & Hosting

Where the two legs run — and where they're heading for [launch week](/roadmap/launch). The headline: **keep the website cheap; put the paid, latency-sensitive MCP on dedicated compute.**

## Current state

Everything public today (the [website](https://feelyourprotocol.org), docs, community-token, roadmap, mcp-docs) runs behind nginx on a single **Strato V-Server**. That's fine for static sites and the explorations frontend.

The MCP **engine and gateway** are developed and tested locally and on AWS EC2 in preparation for the public HTTP endpoint — see `server-config/aws/mcp/` for the bootstrap walkthrough. **Public HTTP at `mcp.feelyourprotocol.org` is not launched yet.**

## Why the MCP needs dedicated compute

A V-Server uses shared (KVM) virtualization — fine for bursty web traffic, but a problem for **sustained, CPU-bound EVM simulations**. A "noisy neighbor" can spike CPU steal time, and an agent paying for a 100ms simulation will time out (and may blacklist the tool) if it randomly takes seconds. Paid agent traffic needs **deterministic latency** — which is why we're on a separate compute tier.

## Target architecture _(in progress for launch)_

- **Compute-optimized EC2, ARM/Graviton (`c7g`).** Node.js + EthereumJS run very well on ARM; Graviton gives strong price/performance for heavy CPU work.
- **Dedicated vCores mapped to the worker pool.** Pin the Node `worker_threads` pool size to the instance's vCores so each isolated simulation gets predictable compute (see [the API concept page](/concepts/api-mcp#tech-readiness-boundaries)).
- **Main thread = traffic controller.** Handles I/O, x402 verification, and MCP routing; confirmed work goes to a worker that runs the bytecode and returns the trace.

## The hybrid setup

```
feelyourprotocol.org (website, docs, …)  →  Strato V-Server (nginx, low cost)
mcp.feelyourprotocol.org (hosted MCP)    →  AWS EC2 c7g (dedicated compute)  [launch week target]
```

Enterprise-grade reliability where agents pay for it, without over-engineering the educational pages.

## Scaling boundaries

Scale **horizontally** for more concurrent isolated simulations (more workers / instances). What we explicitly do **not** plan to scale into is stateful, sequential multi-block historical processing — archive-node territory and outside our scope (see [boundaries](/concepts/api-mcp#tech-readiness-boundaries)). Cost drivers feed directly into the [cost model](/monetization/pricing#cost-model).

## Open questions _(later)_

_Region finalization, autoscaling policy, observability stack — to be decided after launch week stabilizes._

## Changelog

<Changelog
  title="AWS Changelog"
  :entries="[
    { version: 'v0.2', date: '2026-09-02', summary: 'EC2 bootstrap in progress — not nothing has moved; public HTTP still pending launch week.' },
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial hybrid Strato/AWS outline.' },
  ]"
/>
