import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls, MiniMap, MarkerType } from "reactflow";
import {
  Activity,
  BadgeCheck,
  BarChart3,
  Database,
  FileCheck2,
  Filter,
  GitBranch,
  Loader2,
  Map,
  MessageSquare,
  Play,
  Radar,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

const stages = [
  {
    id: "gtm:define-icp",
    label: "Define ICP",
    group: "Strategy",
    icon: Radar,
    copy: "Zurich appetite, buyer personas, and disqualifiers.",
  },
  {
    id: "gtm:source-candidates",
    label: "Source",
    group: "Discovery",
    icon: Database,
    copy: "Build candidate universe from public sources and seeds.",
  },
  {
    id: "gtm:triage-candidates",
    label: "Triage",
    group: "Qualification",
    icon: Filter,
    copy: "Select high-signal accounts and reject low-fit noise.",
  },
  {
    id: "gtm:company",
    label: "Deep research",
    group: "Evidence",
    icon: Search,
    copy: "Research company risk, why-now, and Zurich fit.",
  },
  {
    id: "gtm:quality",
    label: "Quality panel",
    group: "Controls",
    icon: ShieldCheck,
    copy: "Surface weak evidence, corrections, and risk flags.",
  },
  {
    id: "gtm:buyer-map",
    label: "Buyer map",
    group: "Activation",
    icon: Users,
    copy: "Map public buyers and business contact paths.",
  },
  {
    id: "gtm:person",
    label: "Person research",
    group: "Activation",
    icon: MessageSquare,
    copy: "Enrich outreach angle and warm-intro hypotheses.",
  },
  {
    id: "gtm:assemble-brief",
    label: "Pursuit brief",
    group: "Output",
    icon: FileCheck2,
    copy: "Generate broker-ready brief and structured JSON.",
  },
];

const tabs = [
  { id: "demo", label: "Demo", icon: Sparkles },
  { id: "live", label: "Workflow", icon: Activity },
  { id: "output", label: "Output", icon: BarChart3 },
  { id: "buyers", label: "Buyer Paths", icon: Users },
  { id: "proof", label: "Proof", icon: BadgeCheck },
];

function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

function statusForStage(stage, steps = []) {
  const matches = steps.filter((step) => step.id === stage.id || step.id?.startsWith(`${stage.id}:`));
  if (matches.some((step) => step.state === "running")) return "running";
  if (matches.some((step) => step.state === "waiting" || step.state === "waiting-approval")) return "waiting";
  if (matches.some((step) => step.state === "failed")) return "failed";
  if (matches.some((step) => step.state === "finished")) return "finished";
  return "pending";
}

function statusLabel(status) {
  return {
    running: "Running",
    waiting: "Waiting",
    failed: "Needs attention",
    finished: "Done",
    pending: "Pending",
  }[status];
}

function nodeColor(status) {
  return {
    running: "#003399",
    waiting: "#d9a300",
    failed: "#d92d20",
    finished: "#0b7a53",
    pending: "#d7deea",
  }[status];
}

function WorkflowNode({ data }) {
  const Icon = data.icon;
  return (
    <div className={cn("flow-node", `flow-node--${data.status}`)}>
      <div className="flow-node__top">
        <span className="flow-node__icon">
          <Icon size={20} strokeWidth={2.2} />
        </span>
        <span className="status-dot" style={{ backgroundColor: nodeColor(data.status) }} />
      </div>
      <div className="flow-node__label">{data.label}</div>
      <div className="flow-node__group">{data.group}</div>
      <p>{data.copy}</p>
      <div className="flow-node__status">{statusLabel(data.status)}</div>
    </div>
  );
}

const nodeTypes = { workflow: WorkflowNode };

function Metric({ label, value, tone = "blue" }) {
  return (
    <div className={cn("metric", `metric--${tone}`)}>
      <div className="metric__value">{value}</div>
      <div className="metric__label">{label}</div>
    </div>
  );
}

function TabButton({ tab, active, onClick }) {
  const Icon = tab.icon;
  return (
    <button className={cn("tab-button", active && "tab-button--active")} onClick={onClick}>
      <Icon size={17} />
      <span>{tab.label}</span>
    </button>
  );
}

function usePolling(activeRunId) {
  const [overview, setOverview] = useState(null);
  const [runState, setRunState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const [overviewResponse, runResponse] = await Promise.all([
        fetch(`${API_BASE}/api/overview`),
        activeRunId ? fetch(`${API_BASE}/api/runs/${activeRunId}`) : Promise.resolve(null),
      ]);
      const overviewJson = await overviewResponse.json();
      const runJson = runResponse ? await runResponse.json() : null;
      setOverview(overviewJson);
      setRunState(runJson);
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [activeRunId]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, activeRunId ? 2200 : 6000);
    return () => clearInterval(timer);
  }, [refresh, activeRunId]);

  return { overview, runState, loading, error, refresh };
}

export function App() {
  const [activeTab, setActiveTab] = useState("demo");
  const [activeRunId, setActiveRunId] = useState(() => localStorage.getItem("zurichScoutRunId") || "");
  const [selectedAccountName, setSelectedAccountName] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [startError, setStartError] = useState("");
  const { overview, runState, loading, error, refresh } = usePolling(activeRunId);

  const steps = runState?.inspect?.steps ?? [];
  const latestOutput = overview?.output;
  const activeRun = overview?.runs?.find((run) => run.id === activeRunId) ?? overview?.runs?.[0];

  useEffect(() => {
    if (!activeRunId && overview?.runs?.[0]?.id) {
      setActiveRunId(overview.runs[0].id);
      localStorage.setItem("zurichScoutRunId", overview.runs[0].id);
    }
  }, [activeRunId, overview?.runs]);

  useEffect(() => {
    if (!selectedAccountName && latestOutput?.topCompanies?.[0]?.name) {
      setSelectedAccountName(latestOutput.topCompanies[0].name);
    }
  }, [latestOutput?.topCompanies, selectedAccountName]);

  const nodes = useMemo(
    () =>
      stages.map((stage, index) => ({
        id: stage.id,
        type: "workflow",
        position: { x: (index % 4) * 275, y: Math.floor(index / 4) * 235 },
        data: { ...stage, status: statusForStage(stage, steps) },
      })),
    [steps],
  );

  const edges = useMemo(
    () =>
      stages.slice(0, -1).map((stage, index) => ({
        id: `${stage.id}-${stages[index + 1].id}`,
        source: stage.id,
        target: stages[index + 1].id,
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed, width: 14, height: 14 },
        style: { stroke: "#9fb3d9", strokeWidth: 2 },
      })),
    [],
  );

  const startWorkflow = async () => {
    setIsStarting(true);
    setStartError("");
    try {
      const response = await fetch(`${API_BASE}/api/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxCompanies: 1, maxPeoplePerCompany: 2 }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Failed to start workflow");
      setActiveRunId(payload.runId);
      localStorage.setItem("zurichScoutRunId", payload.runId);
      setActiveTab("live");
      await refresh();
    } catch (requestError) {
      setStartError(requestError.message);
    } finally {
      setIsStarting(false);
    }
  };

  const approveWorkflow = async () => {
    if (!activeRunId) return;
    setIsApproving(true);
    setStartError("");
    try {
      const response = await fetch(`${API_BASE}/api/runs/${activeRunId}/approve`, { method: "POST" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Failed to approve workflow");
      await refresh();
    } catch (requestError) {
      setStartError(requestError.message);
    } finally {
      setIsApproving(false);
    }
  };

  const events = runState?.events ?? [];
  const terminalState = runState?.inspect?.runState?.state ?? activeRun?.state ?? "idle";
  const activeRunStatus = String(activeRun?.status ?? terminalState).replace("-", " ");
  const canApprove = Boolean(activeRunId) && (activeRun?.status === "waiting-approval" || terminalState === "waiting-approval");
  const finishedStages = nodes.filter((node) => node.data.status === "finished").length;
  const waitingStages = nodes.filter((node) => node.data.status === "waiting").length;
  const focusStage =
    nodes.find((node) => node.data.status === "running" || node.data.status === "waiting") ??
    [...nodes].reverse().find((node) => node.data.status === "finished") ??
    nodes[0];
  const FocusIcon = focusStage?.data.icon ?? Activity;
  const demoRuns = [
    {
      id: "validated-pilot",
      workflow: "FDIC pilot validation",
      status: "validated",
      meta: "70 accounts, 304 buyer paths, 0 issues",
    },
    {
      id: "buyer-paths",
      workflow: "Buyer path enrichment",
      status: "complete",
      meta: "Public, business-safe routing hypotheses",
    },
    {
      id: "zurich-ready",
      workflow: "Zurich pursuit brief",
      status: "ready",
      meta: "Broker-first action queue",
    },
  ];
  const selectedAccount =
    latestOutput?.topCompanies?.find((company) => company.name === selectedAccountName) ?? latestOutput?.topCompanies?.[0];

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <img src={`${API_BASE}/api/brand/icon`} alt="" />
          <div>
            <div className="brand-name">Zurich Scout</div>
            <div className="brand-meta">Workflow control room</div>
          </div>
        </div>
        <nav className="tabs" aria-label="Views">
          {tabs.map((tab) => (
            <TabButton key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
          ))}
        </nav>
        <div className="topbar-actions">
          <button className="ghost-button" onClick={refresh}>
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          <button className="primary-button" onClick={startWorkflow} disabled={isStarting}>
            {isStarting ? <Loader2 className="spin" size={17} /> : <Play size={17} />}
            <span>{isStarting ? "Starting" : "Start run"}</span>
          </button>
        </div>
      </header>

      <section className="mission-strip">
        <div>
          <div className="eyebrow">
            <Sparkles size={15} />
            Challenge 3 Target Customer Scouting
          </div>
          <h1>Broker-safe scouting, visible step by step.</h1>
        </div>
        <p>
          Launch the real Smithers workflow, see each qualification stage, and inspect the pursuit output generated for
          Zurich.
        </p>
      </section>

      {startError ? <div className="error-strip">{startError}</div> : null}

      {activeTab !== "demo" ? (
      <section className="overview-grid">
        <Metric label="Candidates reviewed" value={latestOutput?.counts?.companies ?? "70"} />
        <Metric label="Buyer paths" value={latestOutput?.counts?.buyers ?? "304"} />
        <Metric
          label="Pursue / watch / reject"
          value={`${latestOutput?.counts?.pursue ?? 18}/${latestOutput?.counts?.watch ?? 50}/${latestOutput?.counts?.reject ?? 2}`}
        />
        <Metric label="Run state" value={activeRunStatus} tone={terminalState === "succeeded" ? "green" : "gold"} />
      </section>
      ) : null}

      {activeTab === "demo" ? (
        <section className="demo-board">
          <article className="demo-lead">
            <span className="section-kicker">Demo overview</span>
            <h2>From 70 public targets to 18 Zurich-ready pursuits.</h2>
            <p>
              Zurich Scout does not create more raw leads. It creates a reviewable action queue with evidence, buyer
              paths, and broker-safe next steps.
            </p>
            <div className="demo-metrics">
              <div>
                <strong>{latestOutput?.counts?.companies ?? 70}</strong>
                <span>Reviewed</span>
              </div>
              <div>
                <strong>{latestOutput?.counts?.pursue ?? 18}</strong>
                <span>Pursue</span>
              </div>
              <div>
                <strong>{latestOutput?.counts?.buyers ?? 304}</strong>
                <span>Buyer paths</span>
              </div>
              <div>
                <strong>0</strong>
                <span>Validation issues</span>
              </div>
            </div>
          </article>

          <article className="demo-card demo-card--primary">
            <span className="demo-step">01</span>
            <h3>Run the qualification agent</h3>
            <p>Smithers executes the gated qualification workflow instead of producing a one-shot AI answer.</p>
            <button className="demo-link" onClick={() => setActiveTab("live")}>Open workflow</button>
          </article>

          <article className="demo-card">
            <span className="demo-step">02</span>
            <h3>Inspect the action queue</h3>
            <p>Open the generated output and point to the pursue, watch, reject decisions and next Zurich action.</p>
            <button className="demo-link" onClick={() => setActiveTab("output")}>Open output</button>
          </article>

          <article className="demo-card">
            <span className="demo-step">03</span>
            <h3>Land the business value</h3>
            <p>Explain that Zurich wins when public signals are overlaid with CRM, broker, renewal, quote, and loss data.</p>
            <button className="demo-link" onClick={() => setActiveTab("proof")}>Open proof</button>
          </article>
        </section>
      ) : null}

      {activeTab !== "demo" ? (
      <section className="workspace">
        <aside className="side-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">Runs</span>
              <h2>Recent executions</h2>
            </div>
            <GitBranch size={18} />
          </div>
          <div className="run-list">
            {demoRuns.map((run) => (
              <button
                key={run.id}
                className={cn("run-row", run.id === "validated-pilot" && "run-row--active")}
                onClick={() => setActiveTab(run.id === "buyer-paths" ? "buyers" : run.id === "zurich-ready" ? "output" : "live")}
              >
                <span>{run.workflow}</span>
                <strong className={cn("status-pill", `status-pill--${run.status}`)}>{run.status}</strong>
                <small>{run.meta}</small>
              </button>
            ))}
          </div>
          <div className="run-summary">
            <span>Demo queue cleaned</span>
            <strong>Ready</strong>
          </div>
        </aside>

        <section className="main-panel">

          {loading ? (
            <div className="loading-state">
              <Loader2 className="spin" />
              Loading Smithers state
            </div>
          ) : error ? (
            <div className="error-strip">{error}</div>
          ) : null}

      {activeTab === "live" ? (
            <div className="command-layout">
              <section className="timeline-panel">
                <div className="panel-heading">
                  <div>
                    <span className="section-kicker">Live workflow</span>
                    <h2>Qualification path</h2>
                  </div>
                  {canApprove ? (
                    <button className="approval-button" onClick={approveWorkflow} disabled={isApproving}>
                      {isApproving ? <Loader2 className="spin" size={14} /> : null}
                      {isApproving ? "Approving" : "Approve run"}
                    </button>
                  ) : (
                    <span className={cn("status-pill", `status-pill--${activeRun?.status ?? terminalState}`)}>
                      {activeRunStatus}
                    </span>
                  )}
                </div>
                <div className="stage-rail">
                  {nodes.map((node, index) => {
                    const Icon = node.data.icon;
                    const isFocus = node.id === focusStage?.id;
                    return (
                      <div className={cn("rail-step", `rail-step--${node.data.status}`, isFocus && "rail-step--focus")} key={node.id}>
                        <div className="rail-step__marker">
                          <span>{index + 1}</span>
                        </div>
                        <div className="rail-step__body">
                          <div className="rail-step__title">
                            <Icon size={16} />
                            <strong>{node.data.label}</strong>
                          </div>
                          <p>{node.data.copy}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="focus-panel">
                <div className="focus-hero">
                  <span className="focus-icon">
                    <FocusIcon size={26} />
                  </span>
                  <div>
                    <span className="section-kicker">Current focus</span>
                    <h2>{focusStage?.data.label ?? "Workflow ready"}</h2>
                    <p>{focusStage?.data.copy ?? "Select or launch a Smithers run to inspect the current state."}</p>
                  </div>
                </div>

                <div className="decision-strip">
                  <div>
                    <strong>{latestOutput?.counts?.pursue ?? 18}</strong>
                    <span>Pursue</span>
                  </div>
                  <div>
                    <strong>{latestOutput?.counts?.watch ?? 50}</strong>
                    <span>Watch</span>
                  </div>
                  <div>
                    <strong>{latestOutput?.counts?.reject ?? 2}</strong>
                    <span>Reject</span>
                  </div>
                </div>

                <div className="evidence-card">
                  <div className="card-header">
                    <div>
                      <span className="section-kicker">Evidence</span>
                      <h2>Top pursuit accounts</h2>
                    </div>
                    <FileCheck2 size={19} />
                  </div>
                  <div className="account-list">
                    {(latestOutput?.topCompanies ?? []).slice(0, 5).map((company, index) => (
                      <div className="account-row" key={company.name}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{company.name}</strong>
                        <em>{company.priority}</em>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <aside className="status-rail">
                <div className="guard-card">
                  <span className="guard-card__icon">
                    <ShieldCheck size={22} />
                  </span>
                  <div>
                    <span className="section-kicker">Guarded outreach</span>
                    <h2>Broker-first</h2>
                    <p>No autonomous outreach. Zurich clearance before action.</p>
                  </div>
                </div>
                <div className="event-card compact">
                  <div className="panel-heading">
                    <div>
                      <span className="section-kicker">Smithers</span>
                      <h2>Latest events</h2>
                    </div>
                    <Activity size={18} />
                  </div>
                  <div className="event-list">
                    {events.length ? (
                      events.slice(-5).map((event, index) => (
                        <div key={`${event}-${index}`} className="event-row">
                          {event}
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">Start or select a run to see Smithers events.</div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          ) : null}

          {activeTab === "output" ? (
            <div className="output-layout">
              <article className="summary-card">
                <div className="card-header">
                  <div>
                    <span className="section-kicker">Generated Output</span>
                    <h2>Pursuit queue summary</h2>
                  </div>
                  <FileCheck2 size={20} />
                </div>
                <p>{latestOutput?.executiveSummary}</p>
              </article>
              <div className="output-detail-layout">
                <div className="company-table">
                  <div className="company-table__head">
                    <span>Account</span>
                    <span>Recommendation</span>
                    <span>Alignment</span>
                    <span>Buyers</span>
                    <span>Prime entry LOBs</span>
                  </div>
                  {(latestOutput?.topCompanies ?? []).map((company) => (
                    <button
                      key={company.name}
                      className={cn("company-table__row", selectedAccount?.name === company.name && "company-table__row--active")}
                      onClick={() => setSelectedAccountName(company.name)}
                    >
                      <strong>{company.name}</strong>
                      <span className={cn("recommendation", `recommendation--${company.recommendation}`)}>
                        {company.recommendation}
                      </span>
                      <span className="score-badge">{company.alignmentScore ?? company.priority}</span>
                      <span className="buyer-count">{company.buyers}</span>
                      <div className="lob-badges">
                        {(company.entryLobs ?? []).slice(0, 3).map((lob) => (
                          <span key={lob}>{lob}</span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
                <aside className="account-detail-panel">
                  <div className="card-header">
                    <div>
                      <span className="section-kicker">Buyer paths</span>
                      <h2>{selectedAccount?.name ?? "Select an account"}</h2>
                    </div>
                    <Users size={20} />
                  </div>
                  <p className="account-detail-panel__note">
                    Public business-safe routing hypotheses. Zurich should validate CRM owner, broker route, renewal
                    timing, and relationship context before outreach.
                  </p>
                  <div className="account-fit-box">
                    <div>
                      <span>Zurich appetite</span>
                      <strong>{selectedAccount?.appetite ?? "n/a"}</strong>
                    </div>
                    <div>
                      <span>Current broker</span>
                      <strong>{selectedAccount?.currentBroker ?? "Not public"}</strong>
                    </div>
                  </div>
                  <div className="lob-badges lob-badges--detail">
                    {(selectedAccount?.entryLobs ?? []).map((lob) => (
                      <span key={lob}>{lob}</span>
                    ))}
                  </div>
                  <div className="next-action-box">
                    <span>Next Zurich action</span>
                    <p>{selectedAccount?.nextAction}</p>
                  </div>
                  <div className="selected-buyer-list">
                    {(selectedAccount?.buyerPaths ?? []).map((buyer) => (
                      <section className="selected-buyer" key={`${selectedAccount.name}-${buyer.name}`}>
                        <div className="selected-buyer__header">
                          <div>
                            <strong>{buyer.name}</strong>
                            <span>{buyer.role}</span>
                          </div>
                          <em>{buyer.confidence ?? "unknown"}</em>
                        </div>
                        <ul>
                          {(buyer.contactPaths ?? []).slice(0, 2).map((path) => (
                            <li key={path}>{path}</li>
                          ))}
                        </ul>
                        {buyer.warmIntroHypotheses?.[0] ? (
                          <p>
                            <b>Warm intro:</b> {buyer.warmIntroHypotheses[0]}
                          </p>
                        ) : null}
                      </section>
                    ))}
                  </div>
                  {selectedAccount?.buyerPaths?.length ? null : (
                    <div className="empty-state">No buyer paths found for this account in the saved artifact.</div>
                  )}
                </aside>
              </div>
            </div>
          ) : null}

          {activeTab === "buyers" ? (
            <div className="buyer-path-layout">
              <article className="summary-card">
                <div className="card-header">
                  <div>
                    <span className="section-kicker">Saved artifact</span>
                    <h2>Public buyer and intro paths</h2>
                  </div>
                  <Users size={20} />
                </div>
                <p>
                  These are already-scraped, public business-safe routing hypotheses from the saved Smithers output.
                  Use them to show how Zurich Scout turns account research into broker-safe next actions.
                </p>
              </article>
              <div className="buyer-path-grid">
                {(latestOutput?.buyerPaths ?? []).map((company) => (
                  <article className="buyer-path-card" key={company.name}>
                    <div className="buyer-path-card__header">
                      <div>
                        <span className="recommendation recommendation--pursue">{company.recommendation}</span>
                        <h3>{company.name}</h3>
                      </div>
                      <strong>{company.priority}</strong>
                    </div>
                    <div className="buyer-mini-list">
                      {company.buyers.map((buyer) => (
                        <section className="buyer-mini" key={`${company.name}-${buyer.name}`}>
                          <div className="buyer-mini__title">
                            <strong>{buyer.name}</strong>
                            <span>{buyer.confidence}</span>
                          </div>
                          <p>{buyer.role}</p>
                          <ul>
                            {buyer.contactPaths.slice(0, 2).map((path) => (
                              <li key={path}>{path}</li>
                            ))}
                          </ul>
                        </section>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}

          {activeTab === "proof" ? (
            <div className="proof-layout">
              <article className="proof-card">
                <div className="card-header">
                  <div>
                    <span className="section-kicker">Business Proof</span>
                    <h2>Why this matters to Zurich</h2>
                  </div>
                  <Map size={20} />
                </div>
                <div className="proof-columns">
                  <div>
                    <h3>Qualification beats lead lists</h3>
                    <p>
                      The workflow turns a broad public universe into a guarded action queue, separating pursue, watch,
                      and reject decisions before broker time is spent.
                    </p>
                  </div>
                  <div>
                    <h3>Zurich data creates the moat</h3>
                    <p>
                      Public research becomes defensible when CRM, broker ownership, quote history, renewal timing, loss
                      history, and appetite data are overlaid before activation.
                    </p>
                  </div>
                  <div>
                    <h3>Broker-first activation</h3>
                    <p>
                      The system does not autonomously outreach. It creates structured, reviewable briefs and next-best
                      actions for Zurich teams.
                    </p>
                  </div>
                </div>
              </article>
              <pre className="markdown-preview">{latestOutput?.markdownPreview}</pre>
            </div>
          ) : null}
        </section>
      </section>
      ) : null}
    </main>
  );
}
