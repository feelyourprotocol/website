# AWS & Hosting

A high-level outline of where the two legs run. The headline: **keep the website cheap; put the paid, latency-sensitive API on dedicated compute.**

## Current state

Everything (the [website](https://feelyourprotocol.org), docs, community-token, this roadmap site) runs behind nginx on a single **Strato V-Server**. That's perfectly fine for static sites and a low-traffic MVP.

## Why the API needs to move

A V-Server uses shared (KVM) virtualization — fine for bursty web traffic, but a problem for **sustained, CPU-bound EVM simulations**. A "noisy neighbor" can spike CPU steal time, and an agent paying for a 100ms simulation will time out (and may blacklist the tool) if it randomly takes seconds. Paid agent traffic needs **deterministic latency**.

## Target architecture

- **Compute-optimized EC2, ARM/Graviton (`c7g`).** Node.js + EthereumJS run very well on ARM; Graviton gives the best price/performance for heavy CPU work.
- **Dedicated vCores mapped to the worker pool.** Pin the Node `worker_threads` pool size to the instance's vCores so each isolated simulation gets predictable compute (see [the API concept page](/concepts/api-mcp#tech-readiness-boundaries)).
- **Main thread = traffic controller.** It handles I/O, x402 verification, and MCP routing; confirmed work is handed to an idle worker that instantiates the VM, runs the bytecode, and returns the trace.

## The hybrid setup

```
feelyourprotocol.org (website, docs, …)  →  Strato V-Server (nginx, low cost)
Agent API + MCP server                   →  AWS EC2 c7g (dedicated compute)
```

This puts enterprise-grade reliability exactly where agents are paying for it, without over-engineering the educational pages. Migration is straightforward — the stack is modular and built to be portable, and the EC2 experience is already there.

## Scaling boundaries

Scale **horizontally** for more concurrent isolated simulations (more workers / instances). What we explicitly do **not** scale into is stateful, sequential multi-block historical processing — that's archive-node territory and outside our scope (see [boundaries](/concepts/api-mcp#tech-readiness-boundaries)). Cost drivers feed directly into the [cost model](/monetization/pricing#cost-model).

## Open questions _(later)_

_Region, managed vs. self-hosted services, IaC tooling, autoscaling policy — to be decided when the API moves off the MVP._
