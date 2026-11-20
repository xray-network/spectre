# Commands

Describe the work in your own words, or use a command. Both reach the same operations and rules:
start a request with `Spectre`, and your agent resolves it, reports what it will do, and asks only
when intent, ownership or a decision is unclear. Open any command to see what it does, how to ask for
it, and what you get.

## Changes

Create the work and carry it out: the everyday loop.

<div class="spectre-fields spectre-fields--commands">
<div class="spectre-fields__head"><span>Command</span><span>Syntax</span></div>
<details class="spectre-fields__row" id="plan">
<summary><span class="spectre-fields__name">Plan</span><code>Spectre plan &lt;target&gt;: &lt;objective&gt;</code></summary>
<div class="spectre-command">
<p>Writes one bounded plan for a change: its inputs, required changes, checks and completion criteria. The first plan for a target registers it, and a plan that relies on outside evidence captures it first. No product code changes.</p>
<p class="spectre-command__label">Examples</p>
<pre><code>Spectre plan api: add a health endpoint
Spectre, plan rate limiting for the API service</code></pre>
<p class="spectre-command__label">You get</p>
<p>An instruction file, <code>NNNN-IMPL-INSTR.md</code>, and a <code>PLANNED</code> row in <code>SPECTRE.md</code>.</p>
</div>
</details>
<details class="spectre-fields__row" id="implement">
<summary><span class="spectre-fields__name">Implement</span><code>Spectre implement &lt;record&gt;</code></summary>
<div class="spectre-command">
<p>Carries out a <code>PLANNED</code> plan: changes source and tests, runs the required checks and records the outcome. A batch finishes each record before starting the next. Blocked work stays <code>PLANNED</code> with an honest partial result.</p>
<p class="spectre-command__label">Examples</p>
<pre><code>Spectre implement api/0004
Spectre implement --batch api/0004..0006
Spectre, implement the plans just listed</code></pre>
<p class="spectre-command__label">You get</p>
<p>The product changes, a result file, <code>NNNN-IMPL-RESULT.md</code>, with the checks that actually ran, and the row moved to <code>REVIEW</code>.</p>
</div>
</details>
<details class="spectre-fields__row" id="revise">
<summary><span class="spectre-fields__name">Revise</span><code>Spectre revise &lt;record&gt;: &lt;changes&gt;</code></summary>
<div class="spectre-command">
<p>Refines a <code>PLANNED</code> plan without touching code, or changes a <code>REVIEW</code> implementation within its objective and reruns the affected checks. A change that grows the scope or moves ownership needs a new plan.</p>
<p class="spectre-command__label">Examples</p>
<pre><code>Spectre revise api/0004: also cover the 429 response</code></pre>
<p class="spectre-command__label">You get</p>
<p>The updated instruction, and for <code>REVIEW</code> work the updated code and result. The state does not change.</p>
</div>
</details>
</div>

## Decisions

Only you run these. Each one closes a record or records your verdict on it.

<div class="spectre-fields spectre-fields--commands">
<div class="spectre-fields__head"><span>Command</span><span>Syntax</span></div>
<details class="spectre-fields__row" id="accept">
<summary><span class="spectre-fields__name">Accept, reject</span><code>Spectre accept &lt;records&gt;: &lt;proof&gt;</code></summary>
<div class="spectre-command">
<p>Records your decision on <code>REVIEW</code> work. Only you can decide: passing tests, merges and "looks good" never do. Add the digest of the result you reviewed to make the decision apply only to those exact bytes.</p>
<p class="spectre-command__label">Examples</p>
<pre><code>Spectre accept api/0004: tested the limiter under load
Spectre accept api/0004@3f9a1c0b7d2e: reviewed the result and checks
Spectre reject api/0005: the retry policy is wrong</code></pre>
<p class="spectre-command__label">You get</p>
<p>The row becomes <code>ACCEPTED</code> or <code>REJECTED</code>, with your words, the date and the reviewed result's digest (<a href="#decision-proof">decision proof</a>).</p>
</div>
</details>
<details class="spectre-fields__row" id="cancel">
<summary><span class="spectre-fields__name">Cancel</span><code>Spectre cancel &lt;records&gt;: &lt;reason&gt;</code></summary>
<div class="spectre-command">
<p>Abandons <code>PLANNED</code> or <code>REVIEW</code> work with your reason. Code changes and partial results stay: cancelling is not a rollback.</p>
<p class="spectre-command__label">Examples</p>
<pre><code>Spectre cancel api/0006: the gateway was dropped</code></pre>
<p class="spectre-command__label">You get</p>
<p>A <code>CANCELLED</code> row with your reason and the date.</p>
</div>
</details>
</div>

## Look up

Read-only: no file ever changes.

<div class="spectre-fields spectre-fields--commands">
<div class="spectre-fields__head"><span>Command</span><span>Syntax</span></div>
<details class="spectre-fields__row" id="status">
<summary><span class="spectre-fields__name">Status</span><code>Spectre status [scope] [state] [--archived]</code></summary>
<div class="spectre-command">
<p>Shows targets with their paths and counts, a target's records, a provider with the live consumers of each capture, or one record with its plan, result and decision. <code>--archived</code> lists archived records or, for a provider, its archived consumers by capture. Read-only.</p>
<p class="spectre-command__label">Examples</p>
<pre><code>Spectre status
Spectre status api REVIEW
Spectre status api/0004
Spectre status uplc
Spectre status uplc --archived
Spectre status the rate limiting change</code></pre>
<p class="spectre-command__label">You get</p>
<p>A summary in the conversation. No file changes.</p>
</div>
</details>
<details class="spectre-fields__row" id="recall">
<summary><span class="spectre-fields__name">Recall</span><code>Spectre recall [target]: &lt;question&gt;</code></summary>
<div class="spectre-command">
<p>Answers why something exists or what was decided, using the records as the only source: accepted decisions first, then pending, planned, superseded and rejected work.</p>
<p class="spectre-command__label">Examples</p>
<pre><code>Spectre recall api: why do we rate-limit by API key?</code></pre>
<p class="spectre-command__label">You get</p>
<p>An answer that cites each record's ID, decision and checks. No file changes.</p>
</div>
</details>
<details class="spectre-fields__row" id="help">
<summary><span class="spectre-fields__name">Help</span><code>Spectre help [operation]</code></summary>
<div class="spectre-command">
<p>Explains operations, queues, checkpoints and where each one stops.</p>
<p class="spectre-command__label">Examples</p>
<pre><code>Spectre help
Spectre help archive</code></pre>
<p class="spectre-command__label">You get</p>
<p>An explanation in the conversation. No file changes.</p>
</div>
</details>
</div>

## Records and evidence

Keep tracking healthy, the live ledger short and captured sources current.

<div class="spectre-fields spectre-fields--commands">
<div class="spectre-fields__head"><span>Command</span><span>Syntax</span></div>
<details class="spectre-fields__row" id="sync">
<summary><span class="spectre-fields__name">Sync</span><code>Spectre sync [scope]</code></summary>
<div class="spectre-command">
<p>Checks tracking and repairs what it can. Safe bookkeeping (sorting, empty subsections, finishing an interrupted archive or capture) is fixed at once. Target fixes, such as a renamed project folder or a deleted one, are proposed for your answer. Anything that needs a decision is reported and left alone. Run it after you rename, move or delete a folder, or when something looks off. Ask for a report only to change nothing.</p>
<p class="spectre-command__label">Examples</p>
<pre><code>Spectre sync
Spectre sync api
Spectre sync, report only</code></pre>
<p class="spectre-command__label">You get</p>
<p>A report of what was checked and fixed, and a list of proposals such as "<code>js</code> moved to <code>./javascript/</code>: update its path?". Reply "apply them" or name the ones you want.</p>
</div>
</details>
<details class="spectre-fields__row" id="archive">
<summary><span class="spectre-fields__name">Archive</span><code>Spectre archive [scope]</code></summary>
<div class="spectre-command">
<p>Moves finished work out of <code>SPECTRE.md</code>. Finished records (<code>ACCEPTED</code>, <code>REJECTED</code>, <code>CANCELLED</code>) go to <code>implementations/__archive/&lt;timestamp&gt;/&lt;target&gt;/</code>; open work stays. <code>archive provider</code> moves a whole provider to <code>providers/__archive/&lt;timestamp&gt;/</code>, even while plans still use it. Before moving, it lists the plans and product files that use what is moving; afterwards <code>sync</code> keeps reporting them until you fix them, by hand or with a new plan.</p>
<p class="spectre-command__label">Examples</p>
<pre><code>Spectre archive api/0004, api/0005
Spectre archive api
Spectre archive
Spectre archive provider cardano-ledger</code></pre>
<p class="spectre-command__label">You get</p>
<p>A shorter <code>SPECTRE.md</code>, the moved files in a new timestamped <code>__archive</code> folder, and an <code>ARCHIVE.md</code> there holding the rows and decisions that left the ledger.</p>
</div>
</details>
<details class="spectre-fields__row" id="capture">
<summary><span class="spectre-fields__name">Capture</span><code>Spectre capture &lt;provider&gt;</code></summary>
<div class="spectre-command">
<p>Snapshots evidence from an outside source, such as an upstream repository, a specification or another project's interface, when it has changed. Plans pin these snapshots instead of a moving branch.</p>
<p>To capture a GitHub repository for the first time, name the provider and give its official URL in one request. Your agent writes the provider's guide (its source, what to track and what to leave out), then runs the first capture. Say what to follow, such as a tag or branch, and which parts matter; the agent asks when that is unclear. Upstream code is only read as evidence, never run.</p>
<p class="spectre-command__label">Examples</p>
<pre><code>Spectre, create the plutus provider from https://github.com/IntersectMBO/plutus, follow its release tags, and capture the UPLC spec and conformance tests
Spectre capture plutus
Spectre capture cardano-ledger</code></pre>
<p class="spectre-command__label">You get</p>
<p>For a new provider, its guide at <code>providers/&lt;provider&gt;/PROVIDER.md</code>. Each published capture has a numbered directory with its specification, summary and selected files, plus a row under its provider in <code>SPECTRE.md</code>. An unchanged capture produces no writes.</p>
</div>
</details>
</div>

## Installation

Change the setup itself. Each runs on its own, never inside a queue; commit first.

<div class="spectre-fields spectre-fields--commands">
<div class="spectre-fields__head"><span>Command</span><span>Syntax</span></div>
<details class="spectre-fields__row" id="upgrade">
<summary><span class="spectre-fields__name">Upgrade</span><code>Spectre upgrade</code></summary>
<div class="spectre-command">
<p>Brings the installation to the latest protocol and rewrites live records and provider files to its formats. Commit first: version control is the rollback. See <a href="./versioning#upgrading">versioning</a>.</p>
<p class="spectre-command__label">Examples</p>
<pre><code>Spectre upgrade</code></pre>
<p class="spectre-command__label">You get</p>
<p>New rule files, rewritten live records, a log row for every changed file and a proposed commit message.</p>
</div>
</details>
<details class="spectre-fields__row" id="absorb">
<summary><span class="spectre-fields__name">Absorb</span><code>Spectre absorb &lt;path&gt;</code></summary>
<div class="spectre-command">
<p>Merges the installation inside <code>&lt;path&gt;</code> into this one: its targets, records, providers and rows. Record numbers stay; a colliding target ID gets the folder as prefix. See <a href="./concepts#combine-and-split-installations">combine and split installations</a>.</p>
<p class="spectre-command__label">Examples</p>
<pre><code>Spectre absorb ./mobile/</code></pre>
<p class="spectre-command__label">You get</p>
<p>One installation, with the ID map (<code>app/0003</code> → <code>mobile-app/0003</code>) recorded in both ledgers and logs.</p>
</div>
</details>
<details class="spectre-fields__row" id="detach">
<summary><span class="spectre-fields__name">Detach</span><code>Spectre detach &lt;target&gt; to &lt;path&gt;</code></summary>
<div class="spectre-command">
<p>Moves one target, its records and the providers it pins into the installation at <code>&lt;path&gt;</code>, creating it when needed. It refuses while live work in another target depends on this one.</p>
<p class="spectre-command__label">Examples</p>
<pre><code>Spectre detach payments to ./services/payments/</code></pre>
<p class="spectre-command__label">You get</p>
<p>The target in its own installation, and a <code>RETIRED</code> row here naming where it went.</p>
</div>
</details>
<details class="spectre-fields__row" id="override">
<summary><span class="spectre-fields__name">Override</span><code>Spectre override &lt;scope&gt;: &lt;changes&gt; because &lt;reason&gt;</code></summary>
<div class="spectre-command">
<p>Makes an exceptional change that the normal rules forbid, such as renumbering a record or moving evidence, and updates everything that refers to it. It needs an exact scope and your reason.</p>
<p class="spectre-command__label">Examples</p>
<pre><code>Spectre override api/0007: renumber it to the next free ID because two branches allocated api/0007</code></pre>
<p class="spectre-command__label">You get</p>
<p>The change, every dependent reference updated, a log row per file and a proposed commit message.</p>
</div>
</details>
</div>

There is no command to delete records or force a state: open work ends with `cancel`, and anything
exceptional goes through `override`.

## Several operations in one request

One request can name several operations. Your agent reports the resolved queue before writing:

```text
Spectre, plan the API change, implement it, then archive it after my decision.
```

```text
plan API objective
→ implement the plan created by this request
→ REVIEW: wait for your decision
→ archive that exact record after a terminal decision
```

- Later steps bind the exact IDs that earlier steps produced; "them" never grows to a whole target.
- Each step finishes its own checks and records before the next starts.
- A blocker stops the queue and keeps finished work. `Spectre continue the queue` resumes the rest
  without rerunning what finished.
- `sync`, `upgrade`, `override`, `absorb` and `detach` always run on their own, never inside a queue.

## Checkpoints

When a queued step needs your decision, the agent stops and shows the exact IDs, results, checks and
result digests. Reply directly; you do not need to repeat "Spectre":

```text
Accept both and continue.
```

A reply needs a decision verb. "Yes", praise, passing tests and silence decide nothing. If the
results change before you reply, the agent shows them again. An unrelated task in between ends the
checkpoint; start again with a SPECTRE mention.

## Selecting records

- **One record:** a qualified ID (`api/0004`), a unique bare ID, or a description ("the rate limiting
  change").
- **Several:** comma-separated IDs, a range within one target (`api/0004..0006`), or a bounded
  description ("all PLANNED plans in api").
- **Latest:** the highest ID within one target.

The whole set is fixed before anything is written. A wrong or missing ID is reported, never
replaced with a similar one, and an ineligible record stops the command instead of being skipped.

## Decision proof

Every decision is recorded in one shape: your words quoted, the UTC date, and the digest of each
reviewed result:

```text
Human command "Spectre accept api/0004: tested the limiter under load" on 2026-11-11; reviewed api/0004@3f9a1c0b7d2e.
Human reply "Accept both and continue" on 2026-11-11; reviewed api/0004@3f9a1c0b7d2e, api/0005@81d7a2c4e9f0.
Human command "Spectre cancel api/0006 because the gateway was dropped" on 2026-11-11.
```

A digest is the first 12 hexadecimal characters of the result file's SHA-256. If an accepted result
changes later, `sync` reports it, and the change needs a new decision. Several records decided
together need one written proof or reason that covers all of them.

## Custom slash commands

XRAY/SPECTRE installs no slash command: natural language reaches it through the `AGENTS.md`
pointer. If you want one, create it in your agent's command format, with a body that only says to
read `.agents/spectre/ROUTER.md` and treat the text after the command as the request. Typing
`/spectre` or `$spectre` then counts as a SPECTRE mention. These files are yours; no operation reads,
writes or removes them.

[Continue to the example repository →](./example)
