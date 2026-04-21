---
title: "MCP vs CLI for AI Agents: I Measured the Same Tool Both Ways"
description: "Same tool, two surfaces. I ran the numbers to see which is actually cheaper for a Claude agent, and the answer wasn't what I expected."
pubDate: 2026-04-20
draft: false
heroImage: "/writing/mcp-vs-cli-banner.svg"
---

![](./assets/mcp-vs-cli-banner.svg)

A few weeks back, there was a discussion at work about whether we should rewrite our CLI-based workflow tooling as MCP servers. A lot of smart people had strong opinions. Most of them, including a couple of leadership folks, believed MCP is straight-up better. Faster, cleaner, more structured, and therefore cheaper and more efficient for AI agents.

I wasn't sure. On paper MCP sounds better for a bunch of reasons, but "sounds better" isn't a benchmark. So I ran one.

## The Setup

I've been maintaining [graph-cli](https://github.com/afroze9/graph-cli), a .NET global tool for Microsoft Graph (email, calendar, Teams chat, SharePoint, that kind of thing). The useful part for this experiment is that graph-cli exposes the *same functionality* two ways:

1. As a command-line tool invoked from a shell (`graph-cli mail list --top 10`)
2. As a built-in MCP server that an agent can call directly (`mcp__graph-cli__mail_list`)

Same underlying Graph API calls. Same auth. Same data. The only thing that changes is how Claude talks to the tool.

So I wrote a Python script that runs the same seven read-only tasks through four configurations:

<div class="post-recs">
  <article class="rec">
    <div class="rec-head">
      <span class="rec-code">CFG-01 · CLI</span>
      <span class="rec-pip">◊</span>
    </div>
    <div class="rec-body">
      <h3>Shell, minimal prompt</h3>
      <p>Claude calls graph-cli through the Bash tool with just the instruction "use graph-cli via Bash". No priming.</p>
    </div>
  </article>
  <article class="rec">
    <div class="rec-head">
      <span class="rec-code">CFG-02 · CLI + hints</span>
      <span class="rec-pip">◊</span>
    </div>
    <div class="rec-body">
      <h3>Shell, with cookbook</h3>
      <p>Same as CFG-01, plus a small cookbook of the commands for the benchmarked tasks in the system prompt. This is what our real workflow docs do.</p>
    </div>
  </article>
  <article class="rec">
    <div class="rec-head">
      <span class="rec-code">CFG-03 · MCP</span>
      <span class="rec-pip">◊</span>
    </div>
    <div class="rec-body">
      <h3>MCP server, minimal prompt</h3>
      <p>Claude calls graph-cli's built-in MCP server directly. Tool schemas are auto-exposed, no extra priming.</p>
    </div>
  </article>
  <article class="rec">
    <div class="rec-head">
      <span class="rec-code">CFG-04 · MCP + hints</span>
      <span class="rec-pip">◊</span>
    </div>
    <div class="rec-body">
      <h3>MCP server, with cookbook</h3>
      <p>Same MCP surface as CFG-03, plus a matching cookbook of tool names per task.</p>
    </div>
  </article>
</div>

Three runs per task per configuration. Everything measured from Claude's usage envelope (`--output-format json` gives you input tokens, output tokens, cache reads, cost, duration, turn count).

<div class="post-stats">
  <div class="ps-head">
    <span class="ps-code">§ METHODOLOGY</span>
    <span class="ps-rule"></span>
    <span class="ps-scale">N = 3 per cell</span>
  </div>
  <div class="ps-grid ps-grid-4">
    <div class="ps-dim">
      <span class="ps-val">4</span>
      <span class="ps-line"></span>
      <span class="ps-lbl">Configs</span>
    </div>
    <div class="ps-dim">
      <span class="ps-val">7</span>
      <span class="ps-line"></span>
      <span class="ps-lbl">Tasks</span>
    </div>
    <div class="ps-dim">
      <span class="ps-val">3</span>
      <span class="ps-line"></span>
      <span class="ps-lbl">Runs / cell</span>
    </div>
    <div class="ps-dim">
      <span class="ps-val">84</span>
      <span class="ps-line"></span>
      <span class="ps-lbl">Total Runs</span>
    </div>
  </div>
</div>

## What I Found

Here's the totals picture:

<div class="chart-grid chart-grid-2x2" role="figure" aria-label="Aggregate totals across 7 tasks by configuration">
  <div class="stat-bars">
    <div class="sb-head">
      <span class="sb-code">§ TOTAL COST</span>
      <span class="sb-rule"></span>
      <span class="sb-scale">USD</span>
    </div>
    <div class="sb-row"><span class="sb-label">CLI</span><span class="sb-track"><span class="sb-fill sb-fill--cli" style="width: 83.3%"></span></span><span class="sb-value">$3.54</span></div>
    <div class="sb-row"><span class="sb-label">CLI + h</span><span class="sb-track"><span class="sb-fill sb-fill--cli-h" style="width: 57.6%"></span></span><span class="sb-value">$2.45</span></div>
    <div class="sb-row"><span class="sb-label">MCP</span><span class="sb-track"><span class="sb-fill sb-fill--mcp" style="width: 100%"></span></span><span class="sb-value">$4.25</span></div>
    <div class="sb-row"><span class="sb-label">MCP + h</span><span class="sb-track"><span class="sb-fill sb-fill--mcp-h" style="width: 92.9%"></span></span><span class="sb-value">$3.95</span></div>
  </div>
  <div class="stat-bars">
    <div class="sb-head">
      <span class="sb-code">§ TOTAL DURATION</span>
      <span class="sb-rule"></span>
      <span class="sb-scale">Seconds</span>
    </div>
    <div class="sb-row"><span class="sb-label">CLI</span><span class="sb-track"><span class="sb-fill sb-fill--cli" style="width: 100%"></span></span><span class="sb-value">665</span></div>
    <div class="sb-row"><span class="sb-label">CLI + h</span><span class="sb-track"><span class="sb-fill sb-fill--cli-h" style="width: 68.0%"></span></span><span class="sb-value">452</span></div>
    <div class="sb-row"><span class="sb-label">MCP</span><span class="sb-track"><span class="sb-fill sb-fill--mcp" style="width: 62.7%"></span></span><span class="sb-value">417</span></div>
    <div class="sb-row"><span class="sb-label">MCP + h</span><span class="sb-track"><span class="sb-fill sb-fill--mcp-h" style="width: 61.9%"></span></span><span class="sb-value">412</span></div>
  </div>
  <div class="stat-bars">
    <div class="sb-head">
      <span class="sb-code">§ TOTAL TURNS</span>
      <span class="sb-rule"></span>
      <span class="sb-scale">Count</span>
    </div>
    <div class="sb-row"><span class="sb-label">CLI</span><span class="sb-track"><span class="sb-fill sb-fill--cli" style="width: 100%"></span></span><span class="sb-value">104</span></div>
    <div class="sb-row"><span class="sb-label">CLI + h</span><span class="sb-track"><span class="sb-fill sb-fill--cli-h" style="width: 51.9%"></span></span><span class="sb-value">54</span></div>
    <div class="sb-row"><span class="sb-label">MCP</span><span class="sb-track"><span class="sb-fill sb-fill--mcp" style="width: 78.8%"></span></span><span class="sb-value">82</span></div>
    <div class="sb-row"><span class="sb-label">MCP + h</span><span class="sb-track"><span class="sb-fill sb-fill--mcp-h" style="width: 66.3%"></span></span><span class="sb-value">69</span></div>
  </div>
  <div class="stat-bars">
    <div class="sb-head">
      <span class="sb-code">§ OUTPUT TOKENS</span>
      <span class="sb-rule"></span>
      <span class="sb-scale">Total</span>
    </div>
    <div class="sb-row"><span class="sb-label">CLI</span><span class="sb-track"><span class="sb-fill sb-fill--cli" style="width: 100%"></span></span><span class="sb-value">16,644</span></div>
    <div class="sb-row"><span class="sb-label">CLI + h</span><span class="sb-track"><span class="sb-fill sb-fill--cli-h" style="width: 56.6%"></span></span><span class="sb-value">9,423</span></div>
    <div class="sb-row"><span class="sb-label">MCP</span><span class="sb-track"><span class="sb-fill sb-fill--mcp" style="width: 82.6%"></span></span><span class="sb-value">13,745</span></div>
    <div class="sb-row"><span class="sb-label">MCP + h</span><span class="sb-track"><span class="sb-fill sb-fill--mcp-h" style="width: 67.7%"></span></span><span class="sb-value">11,267</span></div>
  </div>
</div>

Four bars, four metrics. The most interesting thing isn't which configuration wins. It's that *no single configuration wins all four*.

- **CLI + hints is the cheapest** at $2.45, beating MCP + hints ($3.95) by about 38%
- **MCP + hints is the fastest** at 412 seconds, beating CLI + hints (452s) by about 40 seconds
- CLI + hints also had the fewest turns (54 vs 69 for MCP + hints)
- MCP modes emitted fewer total output tokens

If your question is "which is better for cost?", the answer is CLI + hints by a wide margin. If your question is "which is fastest?", it's MCP + hints, but only by a hair on a realistic workday.

## Why I Thought MCP Would Win

Before running this, I had two assumptions:

1. MCP's persistent stdio process avoids starting graph-cli fresh every time, so it should be way faster per call
2. MCP's structured tool schemas should save the model from exploration, so it should use fewer turns

Assumption one is true. Assumption two is true when there are no hints. But once you add hints to CLI, the turn count drops *below* MCP's. Here's what I saw:

- CLI (minimal): 104 turns, with a lot of "let me check --help" and retries
- CLI + hints: 54 turns, the lowest of all four
- MCP (minimal): 82 turns. Schemas help, just not as much as a cookbook
- MCP + hints: 69 turns. Schemas plus cookbook helps, but MCP already had partial priming from the schemas

Adding hints had very different effects on each surface:

- On CLI, hints cut cost by about 30%
- On MCP, hints cut cost by only about 7%

The reason is simple. MCP's schemas already do part of the job a cookbook does, so adding explicit guidance has less marginal benefit.

<div class="chart-grid chart-grid-tasks" role="figure" aria-label="Cost per task by configuration, median of 3 runs">
  <div class="cg-head">
    <span class="cg-code">§ COST PER TASK</span>
    <span class="cg-rule"></span>
    <span class="cg-scale">USD · median of 3 runs · bars scaled to $0.302 max</span>
  </div>
  <div class="cg-legend">
    <span class="cg-leg-item"><span class="cg-leg-swatch sb-fill--cli"></span>CLI</span>
    <span class="cg-leg-item"><span class="cg-leg-swatch sb-fill--cli-h"></span>CLI + hints</span>
    <span class="cg-leg-item"><span class="cg-leg-swatch sb-fill--mcp"></span>MCP</span>
    <span class="cg-leg-item"><span class="cg-leg-swatch sb-fill--mcp-h"></span>MCP + hints</span>
  </div>
  <div class="cg-panels">
    <div class="stat-bars">
      <div class="sb-head"><span class="sb-code">user_me</span><span class="sb-rule"></span></div>
      <div class="sb-row"><span class="sb-label">CLI</span><span class="sb-track"><span class="sb-fill sb-fill--cli" style="width: 33.8%"></span></span><span class="sb-value">$0.102</span></div>
      <div class="sb-row"><span class="sb-label">CLI + h</span><span class="sb-track"><span class="sb-fill sb-fill--cli-h" style="width: 28.1%"></span></span><span class="sb-value">$0.085</span></div>
      <div class="sb-row"><span class="sb-label">MCP</span><span class="sb-track"><span class="sb-fill sb-fill--mcp" style="width: 50.3%"></span></span><span class="sb-value">$0.152</span></div>
      <div class="sb-row"><span class="sb-label">MCP + h</span><span class="sb-track"><span class="sb-fill sb-fill--mcp-h" style="width: 52.3%"></span></span><span class="sb-value">$0.158</span></div>
    </div>
    <div class="stat-bars">
      <div class="sb-head"><span class="sb-code">calendar_today</span><span class="sb-rule"></span></div>
      <div class="sb-row"><span class="sb-label">CLI</span><span class="sb-track"><span class="sb-fill sb-fill--cli" style="width: 58.3%"></span></span><span class="sb-value">$0.176</span></div>
      <div class="sb-row"><span class="sb-label">CLI + h</span><span class="sb-track"><span class="sb-fill sb-fill--cli-h" style="width: 40.1%"></span></span><span class="sb-value">$0.121</span></div>
      <div class="sb-row"><span class="sb-label">MCP</span><span class="sb-track"><span class="sb-fill sb-fill--mcp" style="width: 62.9%"></span></span><span class="sb-value">$0.190</span></div>
      <div class="sb-row"><span class="sb-label">MCP + h</span><span class="sb-track"><span class="sb-fill sb-fill--mcp-h" style="width: 64.9%"></span></span><span class="sb-value">$0.196</span></div>
    </div>
    <div class="stat-bars">
      <div class="sb-head"><span class="sb-code">mail_recent</span><span class="sb-rule"></span></div>
      <div class="sb-row"><span class="sb-label">CLI</span><span class="sb-track"><span class="sb-fill sb-fill--cli" style="width: 31.1%"></span></span><span class="sb-value">$0.094</span></div>
      <div class="sb-row"><span class="sb-label">CLI + h</span><span class="sb-track"><span class="sb-fill sb-fill--cli-h" style="width: 31.8%"></span></span><span class="sb-value">$0.096</span></div>
      <div class="sb-row"><span class="sb-label">MCP</span><span class="sb-track"><span class="sb-fill sb-fill--mcp" style="width: 54.3%"></span></span><span class="sb-value">$0.164</span></div>
      <div class="sb-row"><span class="sb-label">MCP + h</span><span class="sb-track"><span class="sb-fill sb-fill--mcp-h" style="width: 57.6%"></span></span><span class="sb-value">$0.174</span></div>
    </div>
    <div class="stat-bars">
      <div class="sb-head"><span class="sb-code">mail_search</span><span class="sb-rule"></span></div>
      <div class="sb-row"><span class="sb-label">CLI</span><span class="sb-track"><span class="sb-fill sb-fill--cli" style="width: 53.3%"></span></span><span class="sb-value">$0.161</span></div>
      <div class="sb-row"><span class="sb-label">CLI + h</span><span class="sb-track"><span class="sb-fill sb-fill--cli-h" style="width: 41.7%"></span></span><span class="sb-value">$0.126</span></div>
      <div class="sb-row"><span class="sb-label">MCP</span><span class="sb-track"><span class="sb-fill sb-fill--mcp" style="width: 57.6%"></span></span><span class="sb-value">$0.174</span></div>
      <div class="sb-row"><span class="sb-label">MCP + h</span><span class="sb-track"><span class="sb-fill sb-fill--mcp-h" style="width: 59.9%"></span></span><span class="sb-value">$0.181</span></div>
    </div>
    <div class="stat-bars">
      <div class="sb-head"><span class="sb-code">calendar_free_slot</span><span class="sb-rule"></span></div>
      <div class="sb-row"><span class="sb-label">CLI</span><span class="sb-track"><span class="sb-fill sb-fill--cli" style="width: 42.7%"></span></span><span class="sb-value">$0.129</span></div>
      <div class="sb-row"><span class="sb-label">CLI + h</span><span class="sb-track"><span class="sb-fill sb-fill--cli-h" style="width: 29.5%"></span></span><span class="sb-value">$0.089</span></div>
      <div class="sb-row"><span class="sb-label">MCP</span><span class="sb-track"><span class="sb-fill sb-fill--mcp" style="width: 71.9%"></span></span><span class="sb-value">$0.217</span></div>
      <div class="sb-row"><span class="sb-label">MCP + h</span><span class="sb-track"><span class="sb-fill sb-fill--mcp-h" style="width: 54.3%"></span></span><span class="sb-value">$0.164</span></div>
    </div>
    <div class="stat-bars">
      <div class="sb-head"><span class="sb-code">chat_search_read</span><span class="sb-rule"></span></div>
      <div class="sb-row"><span class="sb-label">CLI</span><span class="sb-track"><span class="sb-fill sb-fill--cli" style="width: 56.0%"></span></span><span class="sb-value">$0.169</span></div>
      <div class="sb-row"><span class="sb-label">CLI + h</span><span class="sb-track"><span class="sb-fill sb-fill--cli-h" style="width: 37.1%"></span></span><span class="sb-value">$0.112</span></div>
      <div class="sb-row"><span class="sb-label">MCP</span><span class="sb-track"><span class="sb-fill sb-fill--mcp" style="width: 77.8%"></span></span><span class="sb-value">$0.235</span></div>
      <div class="sb-row"><span class="sb-label">MCP + h</span><span class="sb-track"><span class="sb-fill sb-fill--mcp-h" style="width: 60.6%"></span></span><span class="sb-value">$0.183</span></div>
    </div>
    <div class="stat-bars cg-panel-wide">
      <div class="sb-head"><span class="sb-code">daily_briefing</span><span class="sb-rule"></span><span class="sb-scale">highest cost task</span></div>
      <div class="sb-row"><span class="sb-label">CLI</span><span class="sb-track"><span class="sb-fill sb-fill--cli" style="width: 100%"></span></span><span class="sb-value">$0.302</span></div>
      <div class="sb-row"><span class="sb-label">CLI + h</span><span class="sb-track"><span class="sb-fill sb-fill--cli-h" style="width: 60.6%"></span></span><span class="sb-value">$0.183</span></div>
      <div class="sb-row"><span class="sb-label">MCP</span><span class="sb-track"><span class="sb-fill sb-fill--mcp" style="width: 85.8%"></span></span><span class="sb-value">$0.259</span></div>
      <div class="sb-row"><span class="sb-label">MCP + h</span><span class="sb-track"><span class="sb-fill sb-fill--mcp-h" style="width: 81.1%"></span></span><span class="sb-value">$0.245</span></div>
    </div>
  </div>
</div>

## The Per-Turn Numbers Were the Eye-Opener

Divide total cost by total turns and you get a cost-per-turn figure that isolates per-turn overhead:

<div class="stat-bars">
  <div class="sb-head">
    <span class="sb-code">§ COST PER TURN</span>
    <span class="sb-rule"></span>
    <span class="sb-scale">USD, bar relative to max</span>
  </div>
  <div class="sb-row">
    <span class="sb-label">CLI</span>
    <span class="sb-track"><span class="sb-fill sb-fill--cli" style="width: 59.6%"></span></span>
    <span class="sb-value">$0.034</span>
  </div>
  <div class="sb-row">
    <span class="sb-label">CLI + hints</span>
    <span class="sb-track"><span class="sb-fill sb-fill--cli-h" style="width: 78.9%"></span></span>
    <span class="sb-value">$0.045</span>
  </div>
  <div class="sb-row">
    <span class="sb-label">MCP</span>
    <span class="sb-track"><span class="sb-fill sb-fill--mcp" style="width: 91.2%"></span></span>
    <span class="sb-value">$0.052</span>
  </div>
  <div class="sb-row">
    <span class="sb-label">MCP + hints</span>
    <span class="sb-track"><span class="sb-fill sb-fill--mcp-h" style="width: 100%"></span></span>
    <span class="sb-value">$0.057</span>
  </div>
</div>

MCP's per-turn cost is higher. Always. Even when it had fewer turns total, each turn was more expensive.

This one surprised me. I dug through the token composition and figured out why: MCP ships the entire tool schema catalog as part of every single turn's input. Yes, it's cached after the first turn, but cached input tokens still cost something (~10% of standard input). graph-cli exposes around 50 tools, and that schema block is not small. Compare that to Bash, which has one fixed tool definition.

So MCP wins on raw per-call latency (no process spawn, connection reuse, warm auth) but loses on per-turn cost (the schema catalog is always in the input).

## The Thing MCP Just Can't Do

Here's what I keep coming back to. On my benchmark, MCP looks fine. $3.95 vs $2.45 isn't nothing, but it's not catastrophic.

But the benchmark tasks were all "fetch and return" operations. List ten emails. Check today's calendar. Find this chat. The model consumes the full response as-is.

Real work often involves filtering, projecting, or aggregating. "Find the three invoices from last week." "Count how many meetings I had with external attendees this month." "Give me the subject of the last message in each of my twenty most active chats."

With a shell I can do things like this:

```bash
graph-cli mail list --top 50 --folder Inbox \
  | jq '[.[] | select(.bodyPreview|test("invoice";"i")) | {from, subject}]'
```

One tool call. jq filters fifty emails down to the matches. Only about three records reach Claude. The rest never touch the model's context.

MCP has no equivalent. It has to ship all fifty records into context, and then the model filters in its head, re-reading every record it sees. If the filter needs a field that isn't in the list response (like the full body), the MCP path degrades further. One tool call to list, then N tool calls to fetch each full message, then in-model filtering.

None of my benchmark tasks use piping. So the numbers in the table actually *understate* CLI's advantage on realistic workloads.

## What I'd Actually Use

I'm sticking with CLI plus hints. My personal workflow automation is organized as a repo with one folder per task type (email, calendar, chat, Jira, notes, and so on), and each folder has its own CLAUDE.md that lists the relevant commands and any conventions for that task. When Claude works in a folder, that file auto-loads into context. It's effectively the "CLI + hints" configuration from the benchmark, scoped per task type rather than applied globally, and it's the condition under which CLI comes out both cheapest *and* competitive on latency.

The nice side effect of this setup is that the priming is human-writable markdown. I can read it, edit it, add a new command, or document an edge case. It evolves with the workflow. MCP's schemas are machine-generated from the tool's source and are fine for capability discovery, but they're not the right place to encode the kind of "when you're doing X, prefer Y because of Z" knowledge that makes an agent actually useful.

<div class="decision-matrix">
  <article class="dm-col">
    <div class="dm-head">
      <span class="dm-code">§ MCP WINS WHEN</span>
      <span class="dm-pip">◊</span>
    </div>
    <ul class="dm-list">
      <li>Latency matters more than cost (synchronous user-facing flows)</li>
      <li>The workload is lookup-heavy and doesn't need filter or transform</li>
      <li>You don't have good workflow priming, or you want the tool to just work without per-project tuning</li>
    </ul>
  </article>
  <article class="dm-col">
    <div class="dm-head">
      <span class="dm-code">§ CLI WINS WHEN</span>
      <span class="dm-pip">◊</span>
    </div>
    <ul class="dm-list">
      <li>You're doing a lot of filter or aggregate operations over list responses</li>
      <li>You've already got decent workflow docs that teach the CLI</li>
      <li>Cost is a primary concern</li>
    </ul>
  </article>
</div>

## Closing Thought

The takeaway I'd give anyone building agent tooling: "better tool surface" is a workload-dependent question, not an absolute one. A persistent stdio MCP server is genuinely a better architecture for some things. A shell-invoked CLI with access to pipes is genuinely better for others.

Also, benchmark your own stuff. I almost accepted the "MCP is just better" framing until I ran the numbers. Turns out the thing I'd already spent time building and priming into our workflows was already the cheaper option.

The full methodology, scripts, and data are on GitHub: [afroze9/token-benchmarks](https://github.com/afroze9/token-benchmarks).

---

*N = 3 per cell, so take the exact numbers with a grain of salt. The directional effects are stable across runs, but absolute cost can shift by 10-15% day to day based on Claude API load and the volume of data in the test mailbox.*
