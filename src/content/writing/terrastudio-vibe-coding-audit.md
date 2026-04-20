---
title: "The 32.5% Fix Tax: Auditing 348 Commits of Vibe-Coded TerraStudio"
description: "I let AI build a full desktop app for two months, then read the git history. The fix rate isn't flat, and where it spikes says a lot about what AI is good at."
pubDate: 2026-04-20
draft: false
---

<div class="post-carousel" data-carousel>
  <div class="pc-head">
    <span class="pc-code">FIG-A · CANVAS EVOLUTION</span>
    <span class="pc-rule"></span>
    <span class="pc-counter"><span class="pc-current">1</span> / 5</span>
  </div>
  <div class="pc-stage">
    <div class="pc-viewport">
      <img class="pc-slide is-active" src="/writing/terrastudio-v0.0.1.png" alt="TerraStudio v0.0.1 — empty canvas on day one" loading="eager" />
      <img class="pc-slide" src="/writing/terrastudio-v0.5.0.png" alt="TerraStudio v0.5.0 — cost estimation panel in the sidebar" loading="lazy" />
      <img class="pc-slide" src="/writing/terrastudio-v0.14.0.png" alt="TerraStudio v0.14.0 — module system with reusable templates" loading="lazy" />
      <img class="pc-slide" src="/writing/terrastudio-v0.21.0.png" alt="TerraStudio v0.21.0 — AWS plugin enables multi-cloud diagrams" loading="lazy" />
      <img class="pc-slide" src="/writing/terrastudio-v0.39.0.png" alt="TerraStudio v0.39.0 — mature canvas, 60+ resources" loading="lazy" />
    </div>
    <button class="pc-nav pc-prev" type="button" aria-label="Previous screenshot">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </button>
    <button class="pc-nav pc-next" type="button" aria-label="Next screenshot">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </button>
  </div>
  <div class="pc-meta">
    <span class="pc-version">v0.0.1</span>
    <span class="pc-dot">·</span>
    <span class="pc-caption">Origin. Scaffolded app shell, empty canvas, day one.</span>
  </div>
  <div class="pc-thumbs">
    <button class="pc-thumb is-active" type="button" data-idx="0" data-version="v0.0.1" data-caption="Origin. Scaffolded app shell, empty canvas, day one.">
      <span class="pc-thumb-code">01</span>
      <span class="pc-thumb-label">v0.0.1</span>
    </button>
    <button class="pc-thumb" type="button" data-idx="1" data-version="v0.5.0" data-caption="Cost estimation. Live monthly cost rollup by resource and module.">
      <span class="pc-thumb-code">02</span>
      <span class="pc-thumb-label">v0.5.0</span>
    </button>
    <button class="pc-thumb" type="button" data-idx="2" data-version="v0.14.0" data-caption="Module system. Reusable infrastructure templates as first-class citizens.">
      <span class="pc-thumb-code">03</span>
      <span class="pc-thumb-label">v0.14.0</span>
    </button>
    <button class="pc-thumb" type="button" data-idx="3" data-version="v0.21.0" data-caption="AWS support. Second cloud provider, no core changes needed.">
      <span class="pc-thumb-code">04</span>
      <span class="pc-thumb-label">v0.21.0</span>
    </button>
    <button class="pc-thumb" type="button" data-idx="4" data-version="v0.39.0" data-caption="Mature canvas. 60+ resources, naming conventions, multi-subscription output.">
      <span class="pc-thumb-code">05</span>
      <span class="pc-thumb-label">v0.39.0</span>
    </button>
  </div>
</div>

Between Feb 19 and Apr 20 this year, I built [TerraStudio](https://github.com/afroze9/terrastudio), a desktop visual editor for Terraform, mostly by pair-programming with Claude. 348 commits. 51 minor versions. One developer plus AI.

At the end of it I had a working desktop app where you could drag Azure and AWS resources onto a canvas, wire them together, and export production-ready Terraform code. Plus a module system, a companion command-line tool, built-in git support with visual diffs of the diagram itself, and an automated test suite covering 72+ cloud resources. That is more product than I'd expect to ship in two months by hand.

I also had a commit history that is one of the cleanest records I've ever seen of what AI-assisted development looks like. Conventional commit prefixes, meaningful messages, feature/fix/chore ratios, the whole thing machine-parseable. So I parsed it.

This post is what the numbers said.

## The Headline Numbers

<div class="post-stats">
  <div class="ps-head">
    <span class="ps-code">§ AS-BUILT</span>
    <span class="ps-rule"></span>
    <span class="ps-scale">Feb 19 to Apr 20, 2026</span>
  </div>
  <div class="ps-grid">
    <div class="ps-dim">
      <span class="ps-val">348</span>
      <span class="ps-line"></span>
      <span class="ps-lbl">Commits</span>
    </div>
    <div class="ps-dim">
      <span class="ps-val">61</span>
      <span class="ps-line"></span>
      <span class="ps-lbl">Calendar Days</span>
    </div>
    <div class="ps-dim">
      <span class="ps-val">28</span>
      <span class="ps-line"></span>
      <span class="ps-lbl">Active Days</span>
    </div>
    <div class="ps-dim">
      <span class="ps-val">51</span>
      <span class="ps-line"></span>
      <span class="ps-lbl">Versions</span>
    </div>
    <div class="ps-dim">
      <span class="ps-val">32.5%</span>
      <span class="ps-line"></span>
      <span class="ps-lbl">Fix Rate</span>
    </div>
    <div class="ps-dim">
      <span class="ps-val">48</span>
      <span class="ps-line"></span>
      <span class="ps-lbl">Peak Day</span>
    </div>
  </div>
</div>

By commit type: 133 features, 113 fixes, 16 docs, 53 chores and releases, and a handful of refactors, tests, and CI. 86% of all commits landed in the first 22 days.

The first number that jumps out is the fix rate. Roughly a third of all commits exist to correct something the previous commits broke. That isn't random. It tracks a specific, repeated pattern I'll get to in a bit.

The second is the shape of the timeline. 86% of commits in the first third of the calendar window. Then a dramatic collapse. More on that later too.

## What Went Right

The things that worked, worked hard.

**Adding new cloud resources was mechanical.** Every resource the app supported was described by a single data file. Once the pipeline around that file existed, adding a new resource meant writing one more file and dropping in an icon. This is why 60+ Azure resources and 14+ AWS resources were added in days rather than weeks. The clearest proof came at the very end. The last release added 8 production-grade resources in a single commit with **zero follow-up fixes**, and every one of them passed the full test suite.

**The plugin system held up across cloud providers.** AWS support dropped in as a new plugin without any changes to the core app. Same for the Azure AI plugin that came later. The decision on day 1 to make the core code provider-agnostic paid off every time I extended it.

**Feature velocity in the sprint window was high.** A non-exhaustive list of things that landed in one or two commits:

- Translation into 6 languages
- Full accessibility (keyboard navigation, screen reader support, scalable fonts)
- A programmatic way for other AI tools to drive the app
- Multi-window support
- A module system with reusable templates
- A companion command-line tool with full Terraform output, all in a day
- Built-in git support with a visual diff view that shows changes to the diagram itself, not just the underlying files. One commit, 3,700 lines.

The kind of features that would be a sprint each in a normal team's planning.

## What Went Wrong (And There's a Pattern)

The fix rate tells you that things broke. The commit message chains tell you how.

### The ship-then-fix cadence

Nearly every major feature in the first 33 days landed in this shape:

1. Big feature commit
2. Two to five fix commits in rapid succession
3. Move on

I counted at least 16 instances of a feature commit followed by two or more fixes. A few of the worst offenders:

**Drag-and-drop took four fixes before it worked.** The framework I built on embeds a web view to render the UI, but with subtle differences from an actual browser that only reveal themselves when you hit them. The AI wrote the standard browser-style version, and then we spent four commits discovering the ways the embedded view disagreed.

**The way resources nested inside each other had to be redesigned.** First attempt: each parent declared what children it would accept. That broke as soon as I had containers inside containers, because a parent doesn't know ahead of time what its possible children are. The correct shape was to flip it: let each child declare who its valid parent is. A simple inversion, but every resource schema had to be rewritten.

**Undo/redo had to be thrown out and rebuilt.** The first attempt tried to copy the app's live state for every undo step. The UI framework I used makes that kind of copy quietly fail. The app seemed to work, but undos produced subtly corrupted state. Three commits to rebuild it properly and to make typing into a field not fill the undo history with one step per character.

### The really bad chains

Two chains stand out because they weren't bugs. They were design mistakes that each took seven or more commits to unwind.

**The auto-naming system collapsed (7 fixes).** I wanted each resource to auto-generate a consistent name based on its environment, its region, and a short slug inherited from its parent group. The first design had each of those three pieces compute itself from the other two. Change the environment, and the slug couldn't figure out what to do. Change the slug, and the display name disagreed with it. Every fix broke a different direction of the cycle. It took seven attempts plus a proper redesign, where the naming rules live in the schema and flow one direction, to stabilize.

**Publishing the CLI to a public package registry was two days of pure pain.** I don't even want to relitigate it. The release tool, the auth mechanism, the naming convention for the package, and the build infrastructure all disagreed with each other in different ways, and fixing one kept breaking another. I burned two days and seven patch versions with zero feature changes before I had a pipeline that produced an installable package. A month later I was still cleaning up the changelog bloat from that window.

### The resource audit (7 fix commits, 0 features)

On Mar 22, I sat down and manually reviewed every cloud resource the app supported. I turned up around 30 issues across 64+ resources: wrong defaults, missing required properties, validation rules that didn't match what the real cloud provider required. None were new bugs. They'd been silently wrong since the day those resources first shipped.

This is the one that convinced me "ship fast and fix later" accumulates a specific kind of debt: silent correctness debt that only surfaces when someone sits down to check. The AI's work looked plausible. Enough of it wasn't correct that hand-reviewing every piece was necessary.

## The Fix Rate Isn't Flat

Here's the thing I didn't expect. If you slice the timeline into three phases, the fix rate varies wildly.

<div class="fix-rate-table">
  <div class="frt-head">
    <span class="frt-code">§ FIX-RATE</span>
    <span class="frt-rule"></span>
    <span class="frt-scale">3 phases · 348 commits</span>
  </div>
  <div class="frt-row frt-row-header">
    <span class="frt-phase">Phase</span>
    <span class="frt-commits">Commits</span>
    <span class="frt-rate">Fix Rate</span>
  </div>
  <div class="frt-row">
    <span class="frt-phase">
      <span class="frt-phase-tag">Early</span>
      Feature work on a stabilizing design
    </span>
    <span class="frt-commits">238</span>
    <span class="frt-rate">28%</span>
  </div>
  <div class="frt-row">
    <span class="frt-phase">
      <span class="frt-phase-tag">Middle</span>
      Packaging, distribution, CI pipelines, auditing
    </span>
    <span class="frt-commits">101</span>
    <span class="frt-rate frt-rate-hot">46%</span>
  </div>
  <div class="frt-row">
    <span class="frt-phase">
      <span class="frt-phase-tag">Late</span>
      Additive features on top of a stable design
    </span>
    <span class="frt-commits">9</span>
    <span class="frt-rate frt-rate-cool">11%</span>
  </div>
</div>

The mid-period was the infrastructure work. Packaging, distribution, CI, cross-system integration, audit. That's where the fix rate nearly hit one in two.

The late-period, three features shipped across four weeks, had the lowest fix rate of any window. All three features landed with **zero follow-up fixes**:

<div class="post-releases">
  <article class="pr-row">
    <div class="pr-marker">
      <span class="pr-version">v0.49</span>
      <span class="pr-node"></span>
    </div>
    <div class="pr-card">
      <div class="pr-head">
        <span class="pr-code">REV-49 · CLEAN LANDING</span>
        <span class="pr-date">Mar 24</span>
      </div>
      <div class="pr-body">
        <p>Terraform validation errors now show up in a dedicated panel you can click to jump to the offending resource.</p>
      </div>
    </div>
  </article>
  <article class="pr-row">
    <div class="pr-marker">
      <span class="pr-version">v0.50</span>
      <span class="pr-node"></span>
    </div>
    <div class="pr-card">
      <div class="pr-head">
        <span class="pr-code">REV-50 · CLEAN LANDING</span>
        <span class="pr-date">Apr 8</span>
      </div>
      <div class="pr-body">
        <p>Built-in git support, including a visual diff engine that compares two versions of a diagram structurally. Repositioning a node doesn't show up as a change, but rewiring a connection does. One commit, 3,700 lines, touching both the desktop shell and the UI, landing clean.</p>
      </div>
    </div>
  </article>
  <article class="pr-row">
    <div class="pr-marker">
      <span class="pr-version">v0.51</span>
      <span class="pr-node"></span>
    </div>
    <div class="pr-card">
      <div class="pr-head">
        <span class="pr-code">REV-51 · CLEAN LANDING</span>
        <span class="pr-date">Apr 20</span>
      </div>
      <div class="pr-body">
        <p>8 production cloud resources with 1,437 automated tests.</p>
      </div>
    </div>
  </article>
</div>

Nine commits. One fix. That v0.50 commit should, by the pattern of the first 33 days, have triggered 5 to 10 follow-up fixes. It didn't.

Two things changed between the mid-period and the late period. The architecture stabilized. These three features were all additive, extending existing contracts rather than mutating them. And the cadence collapsed. Weeks between commits instead of hours, which meant manual verification caught bugs before they became commits.

I can't separate those two effects from the data. But the pattern is clear enough that I believe both are real.

## The Architectural Blind Spot

The biggest observation from all of this: AI gets code right much more reliably than it gets design right.

I counted **nine moments where the underlying design was wrong and had to be redone**, all in the first 33 days. A few examples:

- Resources that visually contained each other turned out to be different enough from resources that just referenced each other that I'd modeled one as the other twice and had to pull them apart.
- The way the app drew connections between security rules and the things they protected was originally a visible line on the canvas. It should have been a dropdown on the protected resource. The relationship is data, not a spatial thing.
- The auto-naming system (see above). The whole shape of how names flow from parents to children had to be redesigned.
- The desktop app and the command-line tool originally shared no code. When I wanted them to share logic, it turned out the desktop-specific pieces were tangled all through what should have been shared, and I had to separate them.
- Annotations (the ability to add sticky notes to the canvas) were originally a special-case feature baked into the app. They should have been a plugin like everything else. Took a rewrite to make them one.

None of these are bugs. They're design choices. In each case the AI picked the first plausible shape, I accepted it, and we only discovered it was wrong when the next feature tried to land on top of it. Each one required going back and rewriting whatever had been built on top.

No architectural rewrites happened after day 33. Whether that's because the architecture stabilized or because I stopped trying new architectural territory, I don't know. Probably both.

## The Quiet Month

The most interesting pattern in the updated dataset is the slowdown after Mar 23.

First 33 days: 339 commits.  
Next 28 days: 9 commits.

From roughly 13 commits per active day to 0.3 per calendar day. Three possible readings:

**Natural project tail.** Most of the features that mattered were already built. v0.51's resources were filling coverage gaps encountered in real Terraform projects, not wish-list items from the original roadmap. This is just how projects go when you're past the interesting part.

**Burnout or attention shift.** 33 days of 5 to 48 commits per day is punishing. A cooldown was inevitable. I was also back at my day job after the initial sprint, which I'd carved out weekend time for.

**Discipline maturation.** The v0.50 git integration landed as a single large commit with zero follow-up fixes, a shape I hadn't produced in the first 33 days. v0.51 shipped with a full test suite. v0.50 came with a spec document that I kept, the first one since I'd deleted 11 of them in a single day back on Mar 7.

All three readings are true to some degree. What the data shows is that the output quality improved as the cadence slowed, and the two moved together.

## What It Cost vs What It Would've Cost

Rough estimate. The actual costs were small:

- Claude subscription for ~2 months: ~$400
- Occasional API overflow: maybe $100 to $1,000
- My own time: ~330 hours across 28 active days
- Total out of pocket: ~$400 to $1,400

The counterfactual is harder to estimate precisely, but for an equivalent product (a desktop app, visual canvas editor, 72+ cloud resources across two clouds, Terraform generation, module system, translations, accessibility, a command-line tool, built-in git support, a test suite), I'd expect a small team working conventionally to burn something in the $130K to $400K range over 4 to 10 months. That's loaded salary for senior engineers doing frontend, DevOps, cloud architecture, and QA in parallel.

Even if those numbers are off by 2x, the multiplier is there.

<div class="post-multiplier">
  <span class="pm-lbl">vs. traditional team build</span>
  <div class="pm-grid">
    <div class="pm-dim">
      <span class="pm-val">3 to 8×</span>
      <span class="pm-line"></span>
      <span class="pm-sub">Cheaper</span>
    </div>
    <div class="pm-dim">
      <span class="pm-val">2 to 6×</span>
      <span class="pm-line"></span>
      <span class="pm-sub">Faster</span>
    </div>
  </div>
</div>

But the tradeoffs are real, and the numbers above tell you exactly where:

- 32.5% fix rate vs. around 10 to 15% in mature traditional teams
- Almost no tests written during the build; the test suite only appeared at the end
- A security vulnerability in the Terraform code generator shipped for 12 versions before anyone caught it
- Around 30 incorrect resource definitions silently accumulated before the audit

What you get faster is a working product with broad feature coverage. What you don't get for free is test-first discipline, security-by-design, maintainable architecture docs, and clean CI/CD. Those arrive when someone makes them arrive.

## What I'd Do Differently Next Time

A few things that would have moved the fix rate down without much cost to velocity:

<div class="post-recs">
  <article class="rec">
    <div class="rec-head">
      <span class="rec-code">REC-01</span>
      <span class="rec-pip">◊</span>
    </div>
    <div class="rec-body">
      <h3>Run checkers before every commit</h3>
      <p>A chunk of the fix chains exist because the AI never ran the tools that would have caught the problem the first time. The type checker, the Terraform validator, a basic lint pass. These checks are mechanical and cheap. There's no reason for a human to be the one running them.</p>
    </div>
  </article>
  <article class="rec">
    <div class="rec-head">
      <span class="rec-code">REC-02</span>
      <span class="rec-pip">◊</span>
    </div>
    <div class="rec-body">
      <h3>Build the test suite early, not late</h3>
      <p>The one I added near the end ran 1,437 checks across every resource in every plugin. If even a tenth of that had existed from the start, the manual audit on Mar 22 wouldn't have been necessary. An AI is perfectly happy to generate those checks alongside each feature. You just have to ask.</p>
    </div>
  </article>
  <article class="rec">
    <div class="rec-head">
      <span class="rec-code">REC-03</span>
      <span class="rec-pip">◊</span>
    </div>
    <div class="rec-body">
      <h3>Treat architecture moments as architecture moments</h3>
      <p>All nine redesigns happened because I accepted the first shape the AI proposed without thinking about the shape myself. The auto-naming mess is a clear example. Fifteen minutes with a piece of paper would have saved seven fix commits.</p>
    </div>
  </article>
  <article class="rec">
    <div class="rec-head">
      <span class="rec-code">REC-04</span>
      <span class="rec-pip">◊</span>
    </div>
    <div class="rec-body">
      <h3>Don't take on infrastructure work you don't need</h3>
      <p>The worst stretch of the project was publishing the CLI to a public package registry, and in retrospect I didn't need to do it. I could have shipped the CLI inside the desktop app's installer. The value wasn't worth the pain.</p>
    </div>
  </article>
</div>

## Closing Thought

The takeaway I'd give anyone considering a serious vibe-coded project:

**AI velocity is a loaded gun that fires in both directions.** It'll ship features faster than you've ever shipped features. It'll also ship the wrong abstraction faster than you've ever shipped the wrong abstraction, and the faster you move the more the wrong abstractions compound.

The 32.5% fix rate isn't a bug in the process. It's the cost of letting the AI drive. The variance (28% on features, 46% on infrastructure, 11% on additive work against a stable architecture) is the useful number. It tells you which parts of the work need the supervisor awake.

I'd do it again. I'd put in the test harness and the validators earlier, and I'd stop and think before accepting the first architectural shape. But I'd do it again.

---

*Dataset: 348 commits across 61 calendar days (Feb 19 to Apr 20, 2026). Commits analyzed by conventional-commit prefix. Dates are author dates, since committer dates are bunched because of a rebase on Mar 22. TerraStudio is open source on GitHub: [afroze9/terrastudio](https://github.com/afroze9/terrastudio).*
