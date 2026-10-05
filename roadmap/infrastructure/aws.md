# Hosting & Infrastructure

Where the two legs run, and how that is meant to grow. The structure is **roles**, not machines: one box carries all of them today, and the same roles spread across several when load asks for it.

<Motto>Split the software first. Then hardware is a placement decision.</Motto>

## Two homes

| | Website, docs, roadmap, community token | The hosted MCP lab |
| --- | --- | --- |
| Host | A shared Strato V-Server | A dedicated AWS instance in Frankfurt |
| Work | Static files behind nginx | Sustained, CPU-bound EVM simulation |
| Why there | Cheap, boring, good enough | An agent waiting on a run cannot absorb a noisy neighbour |

Shared virtualization is fine for bursty page loads. It is the wrong place for simulation, where CPU steal time turns a 100 ms run into seconds and an agent times out — or drops the tool. That is the whole reason the lab sits on its own compute, and the reason we do not move the website off Strato.

## Roles, not servers

The MCP side is described as five roles. Every one of them is active on the single lab host.

| Role | What it is | Software |
| --- | --- | --- |
| **shared** | OS baseline — users, Node, firewall, fail2ban | Ubuntu, systemd |
| **edge** | Public front door, TLS, the only thing listening on 443 | nginx, Let's Encrypt |
| **gateway** | MCP over HTTP on loopback | [`mcp-gateway`](https://github.com/feelyourprotocol/mcp-gateway) |
| **engine** | The simulation itself | [`mcp-execution-engine`](https://github.com/feelyourprotocol/mcp-execution-engine) |
| **health** | Liveness and usage, no separate daemon | `/healthz`, a metrics unit |

<IconNote icon="server" title="One box, five roles">

Writing it as roles rather than as “the server” is what makes a split cheap later. Nothing in the code knows how many machines there are.

</IconNote>

## The gateway / engine split

This is the load-bearing boundary, and it exists in the source before it exists in hardware.

| | Gateway | Engine |
| --- | --- | --- |
| Job | MCP transport, tool schemas, routing, later x402 | Run bytecode, a transaction, a block; return the trace |
| Shape | A server with an HTTP port | A library. No HTTP, no MCP, no chain |
| Cost profile | I/O-bound, cheap, mostly waiting | CPU-bound, and the thing we actually pay for |
| Scales by | Connections | Cores |

Today they are **one process**: the gateway loads the engine in-process through a symlinked sibling tree, so a deploy of either one restarts a single unit. One box, one port, one restart.

The seam that matters is a small interface in the gateway — a task processor that takes a simulation request and returns a result. Right now the local implementation calls the engine function directly. A remote implementation puts the engine on different hardware without touching a single tool definition.

```
now     nginx :443 ──▶ gateway :3000 ──in-process──▶ engine
                            └──▶ metrics :3001

later   nginx + gateway ──remote task──▶ engine workers (1..N)
```

That is why the software split comes first. Because the engine is a pure function of its input — empty world, caller-supplied state, no session — moving it is a placement change, not a redesign. Our scaling unit is one more isolated run, which is the cheapest kind of unit to buy.

What we deliberately do **not** scale into is stateful, sequential multi-block historical processing. That is archive-node territory, and it is outside the service ([boundaries](/concepts/api-mcp#boundaries)). Compute is also the dominant line in the [cost model](/monetization/pricing#cost-model).

## What we can see

| Surface | What it answers |
| --- | --- |
| `GET /healthz` | Is the gateway up, which version, which tools |
| Usage dashboard | Append-only call events in SQLite, served on a private path behind auth |

That is the honest extent of observability: a liveness contract and an operator view of what has been called. No alerting, no external probe, no tracing backend yet.

## Automation today

Shipping code is automated. Building the box was not.

| | How it works now |
| --- | --- |
| **Deploys** | A merge on either repo runs GitHub Actions, rsyncs the built tree into its own jailed path, touches a stamp file, and a systemd path unit restarts the service. Engine and gateway ship independently. |
| **Provisioning** | Clicked in the EC2 console, following a written field guide. |
| **Box setup** | Ordered shell scripts, run once by hand over SSH. |
| **nginx, TLS, auth, secrets** | Copied and reloaded by hand when they change. |

<IconNote icon="boundary" title="Honest stance">

There is no machine-readable description of the server anywhere. Rebuilding it means a human re-reading docs. That is acceptable for one lab box and becomes the bottleneck the moment there is a second.

</IconNote>

## Where automation goes next

Short version: **describe the box, let an agent write that description, keep the human on apply.**

| Step | Why it is the right next one |
| --- | --- |
| **Declare the instance** | A small [OpenTofu](https://opentofu.org/) config for instance, address, firewall, and DNS turns a second host into a variable instead of another console session. |
| **Converge the box** | One idempotent playbook ([Ansible](https://docs.ansible.com/)) replacing the ordered scripts. Re-running is safe, and a worker is one inventory line. |
| **Validate in CI** | `tofu plan`, a lint pass, and a config syntax check on every change to the ops repo. The same gate that already guards application code. |
| **Watch for drift** | A scheduled plan that notices hand edits on the box before they become a mystery. |

The AI part is not an autonomous operator. It is that **config is text**, which is exactly what a coding agent is good at: it can write the declaration and the playbook from the shell scripts and docs that already exist, and it can read live state to explain a failure. The ecosystem now supports both sides of that — AWS ships a [managed MCP server](https://aws.amazon.com/blogs/aws/the-aws-mcp-server-is-now-generally-available/) that exposes AWS APIs under ordinary IAM, there are registry and IaC servers for authoring help, and the pattern around mutating operations is converging on explicit [human approval](https://aws.github.io/tools-for-devops-agent/mcp-servers/aws-eks-node-diagnostics-mcp/).

<IconNote icon="shield" title="The rule we keep">

An agent may read live state and write config. A human reviews the plan and applies it. Nothing gets a standing credential to change the running lab.

</IconNote>

## Open questions

Worker placement and size once the engine moves off the front box. Alerting beyond liveness. Whether the website ever needs to leave Strato. All of this waits for real traffic on the open server.

## Changelog

<Changelog
  title="Hosting Changelog"
  :entries="[
    { version: 'v0.4', date: '2026-10-05', summary: 'Rewritten around roles and the gateway/engine split, with observability and an honest automation stance. Instance-level detail dropped — that lives in the ops repo.' },
    { version: 'v0.3', date: '2026-10-01', summary: 'Dedicated compute is for the open hosted lab. x402 verification joins with the paid tier.' },
    { version: 'v0.2', date: '2026-09-02', summary: 'EC2 bootstrap in progress — not nothing has moved; public HTTP still pending launch week.' },
    { version: 'v0.1', date: '2026-06-30', summary: 'Initial hybrid Strato/AWS outline.' },
  ]"
/>
