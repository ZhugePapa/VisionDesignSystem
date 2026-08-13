#!/usr/bin/env python3
"""Generate bilingual teardown reports for CodeArts, Yunxiao, and Gitee Enterprise."""
from __future__ import annotations

import re
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SKILL = Path("/Users/leiwang/.codex/skills/product-teardown")
TEMPLATES = {
    "en": SKILL / "assets/product-teardown-template-en.html",
    "zh": SKILL / "assets/product-teardown-template-zh.html",
}
DATE = "2026-08-12"
YM = "202608"


PRODUCTS = {
    "codearts": {
        "name": "Huawei CodeArts",
        "zh_name": "华为 CodeArts",
        "category": {"en": "Enterprise DevSecOps and agentic development platform", "zh": "企业级 DevSecOps 与智能体研发平台"},
        "scale": {"en": "Huawei Cloud public service + Huawei Cloud Stack / private deployment", "zh": "华为云公有服务 + 华为云 Stack / 私有化部署"},
        "business": {"en": "Tiered suite seats, resource quotas, AI seats, and enterprise contracts", "zh": "套件席位、资源配额、AI 席位与企业合同"},
        "maturity": {"en": "Mature full-lifecycle suite; agentic layer scaling in 2026", "zh": "成熟全生命周期套件；2026 年智能体层进入规模化"},
        "one": {"en": "Huawei's software-production system turns institutional R&D practice into governed delivery — and is now adding multi-agent execution on top.", "zh": "把华为三十余年研发方法沉淀为可治理的软件生产系统，并在其上叠加多智能体执行层。"},
        "verdict": {"en": "The strongest domestic choice when process, sovereignty, and complex engineering matter more than developer fashion.", "zh": "当流程、主权与复杂工程比开发者潮流更重要时，它是最强的国产选项之一。"},
        "verdict_body": {"en": "CodeArts combines requirements, modeling, repositories, quality, CI/CD, testing, artifacts, deployment, metrics, and Huawei Cloud/Stack. Its moat is operationalized engineering knowledge; its tax is a service-heavy product map and a cloud-vendor-shaped experience.", "zh": "CodeArts 把需求、建模、代码、质量、CI/CD、测试、制品、部署和度量连接到华为云/Stack。护城河是可执行的工程知识；代价是服务众多、产品地图偏重，并带有明显云厂商视角。"},
        "known": {"en": "Known: the official suite lists requirements, UML/modeling, Git/MR, checks, pipelines, build, artifacts, deployment, testing and metrics. Huawei CodeArts Agent advertises Agent Team, CLI/TUI, Skills, MCP, codebase indexing, audit, sandboxing, and enterprise plans. Pricing visible on 2026-08-12 included AI Basic at CNY 39/seat/month and Professional at CNY 139/seat/month. [Inferred]: UX scores, moat, metrics, and strategy.", "zh": "已知：官方套件覆盖需求、UML/建模、Git/MR、检查、流水线、构建、制品、部署、测试与度量；华为云码道公布 Agent Team、CLI/TUI、Skills、MCP、代码库索引、审计、安全沙箱与企业套餐。2026-08-12 页面可见 AI 基础版 39 元/席位/月、专业版 139 元/席位/月。[推断]：体验评分、护城河、指标与战略。"},
        "sources": ["https://www.huaweicloud.com/devcloud/index.html", "https://codearts.huaweicloud.com"],
        "tldr": {
            "en": [("Practice is the product", "Huawei's internal R&D methods appear as workflow, quality, modeling, testing, and governance primitives."), ("Sovereignty is a feature", "Public cloud, Huawei Cloud Stack, controlled networks, local models, audit, and sandboxing fit regulated buyers."), ("Agents can activate the suite", "Agent Team and expert Skills could turn a broad catalog into an intent-driven execution layer — if they unify rather than add another module.")],
            "zh": [("方法论就是产品", "华为内部研发方法被做成流程、质量、建模、测试与治理原语。"), ("主权本身是功能", "公有云、华为云 Stack、受控网络、本地模型、审计与沙箱适配强监管买家。"), ("智能体能激活套件", "Agent Team 与专家 Skills 有机会把宽广目录变成意图驱动执行层——前提是统一，而不是再添一个模块。")],
        },
        "ttv": (45, "min", 62), "moat": (8.3, "Huawei R&D practice + Cloud/Stack + domestic trust"),
        "segments": {"en": [("Regulated large enterprises", "Finance, government, telecom, manufacturing, and critical infrastructure needing local control."), ("Huawei Cloud adopters", "Teams standardizing development and delivery around Huawei compute, container, and application services."), ("Complex engineering organizations", "Programs needing modeling, formal quality gates, multi-project governance, and test depth.")], "zh": [("强监管大型企业", "金融、政企、通信、制造与关键基础设施，需要本地控制。"), ("华为云客户", "围绕华为计算、容器与应用服务统一研发交付。"), ("复杂工程组织", "需要建模、正式质量门禁、多项目治理与深度测试。")]},
        "surfaces": {"en": [("Requirements & planning", "Scrum, custom workflows, backlog and portfolio intent."), ("Modeling", "UML and 4+1 views make architecture explicit."), ("Repo & review", "Git hosting, merge requests, permissions and review."), ("CI/CD & artifacts", "Pipelines, build, deploy, GitOps and software packages."), ("Quality & testing", "Static checks, test plans, cases and quality gates."), ("Agent Space", "IDE, CLI/TUI, Agent Team, Skills, codebase and enterprise control.")], "zh": [("需求与规划", "Scrum、自定义流程、待办与组合意图。"), ("软件建模", "UML 与 4+1 视图把架构显性化。"), ("代码与评审", "Git 托管、MR、权限和评审。"), ("CI/CD 与制品", "流水线、构建、部署、GitOps 与软件包。"), ("质量与测试", "静态检查、测试计划、用例与质量门禁。"), ("Agent Space", "IDE、CLI/TUI、Agent Team、Skills、代码库和企业管控。")]},
        "entities": {"en": ["Project", "Requirement / work item", "Repository / MR", "Pipeline / artifact", "Test / deployment"], "zh": ["项目", "需求 / 工作项", "仓库 / MR", "流水线 / 制品", "测试 / 部署"]},
        "ai": {"level": "autonomous", "en": "Level 2–3 transition. CodeArts Agent now presents multi-agent Agent Team, project-level code generation, Skills, MCP, CLI/TUI, unit-test generation, repair, codebase indexing, audit, model management and sandboxed execution. The agentic DevOps claim is directionally credible, but public evidence for reliable unattended production changes is still limited.", "zh": "处于 2→3 级过渡。华为云码道已展示多智能体 Agent Team、项目级代码生成、Skills、MCP、CLI/TUI、单测生成、自动修复、代码库索引、审计、模型管理与沙箱执行。Agentic DevOps 方向可信，但公开材料尚不足以证明稳定的无人生产变更。"},
        "pricing": {"en": "Suite tiers (Experience / Basic / Professional / Enterprise), resource add-ons, AI seats, and negotiated Cloud Stack/private contracts.", "zh": "体验/基础/专业/企业套件、资源扩展、AI 席位，以及议价的 Cloud Stack/私有化合同。"},
        "competitors": ["Alibaba Yunxiao", "GitLab", "Gitee Enterprise", "Tencent CODING"],
        "comp_rows": {"en": [("Huawei practice + governed engineering", "Cloud-native delivery + Alibaba ecosystem", "Global integrated DevSecOps", "Domestic code/community gravity", "Developer-friendly domestic cloud DevOps"), ("Strong process depth; heavy map", "Fast cloud delivery; modular UX", "Broad and auditable; complex", "Familiar SCM; thinner lifecycle", "Polished collaboration; smaller enterprise method moat"), ("Strongest regulated/complex fit", "Best Ali Cloud operating fit", "Best global/self-managed neutrality", "Best domestic repository migration", "Best Tencent ecosystem fit"), ("Multi-agent execution emerging", "Cross-scene embedded assistant", "Governed autonomous flows", "MCP-ready; limited native AI", "Coding assistant integration")], "zh": [("华为方法论 + 受治理工程", "云原生交付 + 阿里生态", "全球一体化 DevSecOps", "国产代码/社区引力", "开发者友好的国产云 DevOps"), ("流程深、地图重", "云交付快、模块化体验", "覆盖广可审计、复杂", "SCM 熟悉、生命周期较薄", "协作顺滑、企业方法论护城河较弱"), ("最适合强监管复杂工程", "最适合阿里云运行环境", "全球/自托管中立性最好", "国产仓库迁移最好", "腾讯生态最好"), ("多智能体执行成形", "跨场景嵌入式助手", "受治理自主流程", "MCP 可调用，原生 AI 有限", "代码助手集成")]},
        "frictions": {"en": [("Catalog before job", "Users meet many CodeArts services before they understand the shortest path to an outcome."), ("Enterprise setup tax", "Organizations, IAM, quotas, cloud resources and templates delay first value."), ("Cloud-shaped mental model", "The experience is strongest inside Huawei's estate; neutrality requires extra proof."), ("Agent trust gap", "Agentic claims need transparent success, intervention, cost, and rollback evidence.")], "zh": [("先看目录，再做工作", "用户先遇到大量 CodeArts 服务，才知道完成结果的最短路径。"), ("企业配置税", "组织、IAM、配额、云资源和模板拉长首次价值时间。"), ("云厂商心智模型", "在华为体系内最顺滑，跨云中立性需要更多证明。"), ("智能体信任缺口", "需要透明展示成功率、人工介入、成本和回滚证据。")]},
        "risks": {"en": [("Agent breadth outpaces reliability", "Product / AI", "High", "high", "Medium · 12m", "Gate autonomy by risk; expose outcome SLOs and replayable traces."), ("Suite complexity suppresses adoption", "Product", "High", "high", "High · now", "Create role/outcome workspaces and a single intent command layer."), ("Cloud lock-in narrows market", "Market", "Medium", "med", "Medium · 24m", "Prove multi-cloud deployment and open integration paths."), ("Best-of-breed tools win developers", "Competitive", "Medium", "med", "High · now", "Invest in IDE/CLI craft and third-party agent interoperability.")], "zh": [("智能体宽度快于可靠性", "产品 / AI", "高", "high", "中 · 12 个月", "按风险分级自主权，公开结果 SLO 与可回放轨迹。"), ("套件复杂度压制采用", "产品", "高", "high", "高 · 当前", "提供角色/结果工作区与统一意图入口。"), ("云锁定收窄市场", "市场", "中", "med", "中 · 24 个月", "证明多云交付与开放集成路径。"), ("最佳工具抢走开发者", "竞争", "中", "med", "高 · 当前", "提升 IDE/CLI 工艺并兼容第三方代理。")]},
        "opps": {"en": [("Executable engineering constitution", "Turn Huawei's practices into versioned, explainable policies and Skills that agents can execute and teams can fork."), ("Role-adaptive delivery cockpit", "One data graph; radically different developer, tester, architect, security, and executive views."), ("Agent outcome ledger", "Tie token and task cost to accepted changes, defects avoided, cycle time, and rollback.")], "zh": [("可执行研发宪法", "把华为实践变成可版本化、可解释、代理可执行、团队可分叉的策略与 Skills。"), ("角色自适应交付驾驶舱", "共用一张数据图，为开发、测试、架构、安全和高管呈现完全不同视图。"), ("智能体结果账本", "把 Token 与任务成本连接到被接受变更、避免缺陷、周期与回滚。")]},
        "strategy": {"en": ("Make practice executable, not merely configurable", "Use Agent Team as the front door to the whole suite: intent becomes a policy-bound plan that selects services, explains gates, and returns one proof chain."), "zh": ("让方法论可执行，而不只是可配置", "把 Agent Team 做成整个套件的入口：意图转成受策略约束的计划，自动选择服务、解释门禁并返回一条证明链。")},
        "moonshot": {"en": ("Sovereign autonomous R&D cloud", "An enterprise can encode its engineering constitution, models, tools, data boundaries, and approval policy, then let agent teams deliver inside a controlled environment."), "zh": ("主权自主研发云", "企业编码自己的研发宪法、模型、工具、数据边界与审批策略，让智能体团队在受控环境内交付。")},
        "shots": [
            "https://res-static.hc-cdn.cn/asset/cn/zh-cn/codearts_agent/03/pic_2_mb.png", "https://res-static.hc-cdn.cn/asset/cn/zh-cn/codearts_agent/03/pic_4_mb.png", "https://res-static.hc-cdn.cn/asset/cn/zh-cn/codearts_agent/03/pic_3_mb.png", "https://res-static.hc-cdn.cn/cloudbu-site/intl/zh-cn/codearts/04/02.png", "https://res-static.hc-cdn.cn/cloudbu-site/intl/zh-cn/codearts/04/03.png", "https://res-static.hc-cdn.cn/cloudbu-site/intl/zh-cn/codearts/04/01.png"],
    },
    "yunxiao": {
        "name": "Alibaba Cloud Yunxiao", "zh_name": "阿里云效",
        "category": {"en": "Cloud-native BizDevOps and application delivery platform", "zh": "云原生 BizDevOps 与应用交付平台"},
        "scale": {"en": "100K+ enterprises · 1M+ developers (official claim) · public/private cloud", "zh": "10 万+ 企业 · 100 万+ 开发者（官方口径）· 公有/专有云"},
        "business": {"en": "Free unlimited-seat base + paid Advanced + cloud usage", "zh": "不限席位基础版免费 + 高级版 + 云资源用量"},
        "maturity": {"en": "Mature modular suite; AI assistant expanded across lifecycle in 2026", "zh": "成熟模块化套件；2026 年 AI 助手扩展到全生命周期"},
        "one": {"en": "Yunxiao is Alibaba Cloud's application-delivery operating system: eight DevOps modules connected to cloud runtime and collaboration channels.", "zh": "云效是阿里云的应用交付操作系统：八个 DevOps 模块连接云运行环境与协作入口。"},
        "verdict": {"en": "The best domestic option for teams that want to move from code to Alibaba Cloud production with minimal glue.", "zh": "对于希望用最少胶水把代码送上阿里云生产环境的团队，云效是最顺手的国产选项之一。"},
        "verdict_body": {"en": "Projex, Codeup, Flow, Packages, Testhub, AppStack and Insight cover the lifecycle; DingTalk and Alibaba Cloud services strengthen the loop. The weakness is product-family fragmentation: the platform is most coherent when the destination is Alibaba Cloud.", "zh": "Projex、Codeup、Flow、Packages、Testhub、AppStack 与 Insight 覆盖生命周期，钉钉与阿里云服务增强循环。弱点是产品家族碎片化：当交付终点是阿里云时，它才最连贯。"},
        "known": {"en": "Known: official docs list Projex, Codeup, Flow, Packages, Testhub, AppStack and Insight, public/proprietary cloud deployment, a free unlimited-user base tier, and Advanced paid features. The 2026 AI assistant covers requirement decomposition, test generation, MR review, pipeline generation/repair, and scheduled reports; sensitive actions are not auto-executed. [Inferred]: scores, moat, metrics, and strategy.", "zh": "已知：官方文档列出 Projex、Codeup、Flow、Packages、Testhub、AppStack、Insight，支持公有/专有云；基础版不限人数免费，高级能力付费。2026 年 AI 助手覆盖需求拆解、测试生成、MR 评审、流水线生成/修复和定时报表，敏感操作不会自动执行。[推断]：评分、护城河、指标与战略。"},
        "sources": ["https://help.aliyun.com/zh/yunxiao/product-overview/what-is-cloud-effect", "https://help.aliyun.com/zh/yunxiao/getting-started/cloudeffect-ai-assistant-user-guide"],
        "tldr": {"en": [("Application is the center", "AppStack links code, pipelines, environments, runtime and rollback around an application."), ("Cloud adjacency compounds", "ACK, ECS, ARMS, MSE, DingTalk and Feishu make Yunxiao cheaper to adopt inside Alibaba's estate."), ("AI connects modules", "The assistant crosses requirements, tests, reviews, YAML repair and scheduled reporting, but remains approval-led.")], "zh": [("应用是中心", "AppStack 围绕应用连接代码、流水线、环境、运行态与回滚。"), ("云邻接产生复利", "ACK、ECS、ARMS、MSE、钉钉与飞书让阿里体系内的采用成本更低。"), ("AI 开始连接模块", "助手横跨需求、测试、评审、YAML 修复与定时报表，但仍以人工确认驱动。")]},
        "ttv": (20, "min", 78), "moat": (7.7, "Alibaba-scale delivery practice + cloud/runtime distribution"),
        "segments": {"en": [("Alibaba Cloud-native teams", "Build and deploy to ACK, ECS and adjacent services with integrated identity and billing."), ("Digital SMEs", "Unlimited-user base reduces seat friction; templates accelerate first delivery."), ("Large Chinese enterprises", "Private-cloud options, enterprise code controls and portfolio metrics support standardization.")], "zh": [("阿里云原生团队", "通过统一身份与账单把应用交付到 ACK、ECS 和周边服务。"), ("数字化中小企业", "不限人数基础版降低席位摩擦，模板加速首次交付。"), ("中国大型企业", "专有云、企业代码管控与组合度量支持标准化。")]},
        "surfaces": {"en": [("Projex", "Requirements, tasks, defects, iterations and cross-project coordination."), ("Codeup", "Hosting, review, scan, search, permissions and code security."), ("Flow", "CI, validation, release, manual gates and rollback."), ("Packages & Testhub", "Artifact dependencies plus test planning and execution."), ("AppStack", "Application, environment, orchestration, deployment and operations."), ("Insight & AI", "Flow efficiency, risk, reports and cross-scene assistance.")], "zh": [("Projex", "需求、任务、缺陷、迭代与跨项目协同。"), ("Codeup", "托管、评审、扫描、搜索、权限与代码安全。"), ("Flow", "CI、验证、发布、人工卡点与回滚。"), ("Packages 与 Testhub", "制品依赖以及测试规划执行。"), ("AppStack", "应用、环境、编排、部署与运维。"), ("Insight 与 AI", "流动效率、风险、报表与跨场景辅助。")]},
        "entities": {"en": ["Organization / project", "Work item", "Repository / MR", "Pipeline / artifact", "Application / environment"], "zh": ["组织 / 项目", "工作项", "仓库 / MR", "流水线 / 制品", "应用 / 环境"]},
        "ai": {"level": "embedded", "en": "Level 2 embedded assistant. It is globally accessible and scene-aware in work items, code review and pipeline editing. It can split requirements, create tests, review MRs, generate or repair YAML, and schedule reports. Official guidance says sensitive operations only receive advice, not automatic execution, so this is not yet autonomous delivery.", "zh": "2 级嵌入式助手。它有全局入口，也在工作项、代码评审和流水线编辑中获得场景上下文；能拆需求、生成测试、评审 MR、生成/修复 YAML、定时报表。官方明确敏感操作只给建议、不自动执行，因此尚非自主交付。"},
        "pricing": {"en": "Basic is free with unlimited users; Advanced requires purchase for active organization members, while build, code, artifact, and AI credits introduce usage economics.", "zh": "基础版不限用户免费；高级版按组织活跃成员采购，构建、代码、制品与 AI 积分形成用量经济。"},
        "competitors": ["Huawei CodeArts", "GitLab", "Gitee Enterprise", "Tencent CODING"],
        "comp_rows": {"en": [("Alibaba application delivery", "Governed engineering practice", "Global integrated DevSecOps", "Domestic repository-led DevOps", "Tencent collaboration/cloud"), ("Fast templates; module seams", "Deep process; heavier", "Strong evidence; complex", "Familiar and simple", "Developer-friendly collaboration"), ("Best Alibaba Cloud fit", "Best regulated complex fit", "Best neutral global fit", "Best code-community fit", "Best Tencent estate fit"), ("Embedded cross-scene AI", "Emerging multi-agent platform", "Governed autonomous flows", "MCP-ready, limited native AI", "Coding assistant adjacency")], "zh": [("阿里应用交付", "受治理工程方法", "全球一体化 DevSecOps", "国产仓库驱动 DevOps", "腾讯协作/云"), ("模板快、模块有接缝", "流程深、较重", "证据强、复杂", "熟悉简单", "协作开发者友好"), ("阿里云适配最好", "强监管复杂工程最好", "全球中立性最好", "代码社区适配最好", "腾讯体系最好"), ("跨场景嵌入式 AI", "多智能体平台成形", "受治理自主流程", "MCP 可调用、原生 AI 有限", "代码助手邻接")]},
        "frictions": {"en": [("Eight products, one promise", "Users still cross product names, URLs and mental models to complete one delivery."), ("Advanced-tier ambiguity", "Unlimited free seats are attractive, but organization-wide upgrading and quotas complicate total cost."), ("Alibaba gravity", "Multi-cloud is supported, yet the most compelling integrations and defaults point to Alibaba Cloud."), ("AI credit opacity", "AI_Credits show consumption, not whether a review or generated pipeline improved delivery.")], "zh": [("八个产品，一个承诺", "完成一次交付仍要跨产品名、URL 与心智模型。"), ("高级版边界复杂", "不限人数免费很诱人，但全组织升级与配额让总成本变复杂。"), ("阿里引力", "虽支持多云，最有力的集成与默认路径仍指向阿里云。"), ("AI 积分不等于价值", "AI_Credits 只显示消耗，不能证明评审或流水线生成改善了交付。")]},
        "risks": {"en": [("Module seams remain visible", "Product", "High", "high", "High · now", "Create one job-centric shell and shared object graph."), ("Cloud coupling limits neutrality", "Market", "Medium", "med", "Medium · 24m", "Invest in equal-quality non-Alibaba deployment connectors."), ("Free-to-paid conversion stalls", "Business", "Medium", "med", "Medium · 12m", "Monetize governance outcomes rather than broad seat gates."), ("AI stays a collection of buttons", "AI", "High", "high", "Medium · 18m", "Let the assistant plan across modules with explicit approvals and traceability.")], "zh": [("模块接缝持续可见", "产品", "高", "high", "高 · 当前", "建立以任务为中心的统一外壳与共享对象图。"), ("云耦合限制中立性", "市场", "中", "med", "中 · 24 个月", "投入同等质量的非阿里云部署连接器。"), ("免费到付费转化停滞", "商业", "中", "med", "中 · 12 个月", "按治理结果收费，而非宽泛席位门槛。"), ("AI 停留在按钮集合", "AI", "高", "high", "中 · 18 个月", "让助手跨模块规划，保留显式审批和追踪。")]},
        "opps": {"en": [("Application delivery graph", "Make application → requirement → code → build → artifact → environment → incident the canonical graph."), ("Approval-aware delivery agent", "AI proposes and executes low-risk steps, asks only at policy boundaries, and verifies production outcomes."), ("Cloud cost + delivery insight", "Combine engineering flow, deployment quality and runtime cost into one decision surface.")], "zh": [("应用交付图谱", "把应用→需求→代码→构建→制品→环境→事故做成标准图谱。"), ("审批感知交付代理", "AI 自动执行低风险步骤，只在策略边界询问，并验证生产结果。"), ("云成本 + 交付洞察", "把工程流、部署质量和运行成本放进同一决策界面。")]},
        "strategy": {"en": ("Own the application change, not the module", "Unify the suite around a change object and let AI traverse Projex, Codeup, Flow, Packages, Testhub, AppStack and Insight without exposing seams."), "zh": ("拥有应用变更，而不是模块", "围绕一条变更对象统一套件，让 AI 跨越 Projex、Codeup、Flow、Packages、Testhub、AppStack 与 Insight，而不暴露接缝。")},
        "moonshot": {"en": ("Self-driving cloud delivery", "A requirement becomes a tested production change; the system allocates cloud resources, predicts risk and cost, stages rollout, observes impact, and rolls back under policy."), "zh": ("自动驾驶云交付", "需求变成通过测试的生产变更；系统分配云资源、预测风险与成本、分批发布、观察影响并按策略回滚。")},
        "shots": ["https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/2998535271/p844249.png", "https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/7035301371/p870077.png", "https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/1828720371/p865673.png", "https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/4471059271/p860819.png", "https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/2254835661/p502371.png", "https://help-static-aliyun-doc.aliyuncs.com/assets/img/zh-CN/1319461261/p275908.png"],
    },
    "gitee-enterprise": {
        "name": "Gitee Enterprise", "zh_name": "Gitee 企业版",
        "category": {"en": "Domestic code-centric DevOps and R&D management platform", "zh": "国产代码中心型 DevOps 与研发管理平台"},
        "scale": {"en": "14M+ developers · 40M+ projects · 420K+ enterprise claim", "zh": "1400 万+ 开发者 · 4000 万+ 项目 · 42 万+ 企业口径"},
        "business": {"en": "Free + CNY 299/499 per user/year + private deployment", "zh": "免费版 + 299/499 元/人/年 + 私有化部署"},
        "maturity": {"en": "Mature domestic SCM; enterprise DevOps and private deployment expanding", "zh": "成熟国产 SCM；企业 DevOps 与私有化持续扩展"},
        "one": {"en": "Gitee Enterprise converts China's largest domestic code-hosting gravity into a practical, secure, locally deployable R&D workspace.", "zh": "Gitee 企业版把国内最大的代码托管引力，转化为实用、安全、可本地部署的研发工作台。"},
        "verdict": {"en": "The easiest domestic enterprise upgrade when code already lives on Gitee; less convincing as the deepest end-to-end delivery control plane.", "zh": "当代码已经在 Gitee 时，它是最自然的企业升级；但作为最深的端到端交付控制平面，仍不够有说服力。"},
        "verdict_body": {"en": "Its repository, pull request, project, knowledge, security, scan, pipeline and private-deployment capabilities cover the practical middle of DevOps. The moat is domestic developer distribution plus migration and sovereignty; the gap is native AI and lifecycle depth versus cloud-suite rivals.", "zh": "仓库、PR、项目、知识、安全、扫描、流水线与私有化覆盖 DevOps 的实用中段。护城河是国产开发者分发、迁移与主权；短板是原生 AI 和相对云套件对手的生命周期深度。"},
        "known": {"en": "Known: Gitee reports 14M+ developers and 40M+ projects; its current Enterprise pricing page lists Free, Standard at CNY 299/user/year, Premium at CNY 499/user/year, and private deployment. Paid features include testing, automation, search, metrics, GiteeScan and SonarQube; private deployment adds isolation, identity integration, multi-tenancy, HA, Xinchuang support and unlimited pipeline time. Gitee publishes an enterprise MCP server. [Inferred]: UX, moat, AI stage, metrics and strategy.", "zh": "已知：Gitee 官方称开发者 1400 万+、项目 4000 万+；当前企业版价格页列出免费、标准版 299 元/人/年、尊享版 499 元/人/年与私有部署。付费含测试、自动化、搜索、度量、GiteeScan、SonarQube；私有部署支持内网隔离、身份集成、多租户、高可用、信创与不限流水线时长。Gitee 已发布企业版 MCP Server。[推断]：体验、护城河、AI 阶段、指标与战略。"},
        "sources": ["https://gitee.com/enterprises/price", "https://gitee.cn/premium/devops"],
        "tldr": {"en": [("Repository gravity is the wedge", "Community familiarity, domestic reach and migration make code hosting the natural expansion point."), ("Sovereignty closes enterprise deals", "Private deployment, isolation, Xinchuang, local backup, HA and identity integration fit regulated organizations."), ("AI is an interface opportunity", "The MCP server makes repositories, issues and PRs callable by assistants, but Gitee still lacks a visible native agentic control layer.")], "zh": [("仓库引力是楔子", "社区熟悉度、国内触达与迁移，让代码托管成为自然扩张点。"), ("主权促成企业成交", "私有部署、隔离、信创、本地备份、高可用和身份集成适配强监管组织。"), ("AI 是界面机会", "MCP Server 让仓库、Issue 与 PR 可被助手调用，但 Gitee 尚缺显性的原生代理控制层。")]},
        "ttv": (12, "min", 84), "moat": (7.5, "Domestic developer/community distribution + sovereignty + migration"),
        "segments": {"en": [("Gitee-native SMEs", "Teams upgrading from organizations to enterprise project, repository and security controls."), ("Regulated private deployments", "Banks, government, manufacturing, education and critical industries needing local systems."), ("Domestic open-source adopters", "Organizations that value local developer familiarity, project discovery and repository migration.")], "zh": [("Gitee 原生中小团队", "从组织升级到企业项目、仓库与安全管控。"), ("强监管私有部署", "银行、政企、制造、教育与关键行业需要本地系统。"), ("国产开源采用者", "重视本地开发者熟悉度、项目发现与仓库迁移。")]},
        "surfaces": {"en": [("Enterprise & teams", "Members, external collaborators, permissions and organization structure."), ("Projects & work items", "Scrum, Kanban, waterfall, workflows, milestones and automation."), ("Repositories & PRs", "Code hosting, branch policy, review, backup and audit."), ("GiteeGo", "Visual pipelines and automated delivery."), ("Scan, test & insight", "Code quality, SonarQube, testing and efficiency metrics."), ("Knowledge & integrations", "Docs, wiki, APIs, webhooks and enterprise MCP.")], "zh": [("企业与团队", "成员、外包、权限与组织结构。"), ("项目与工作项", "Scrum、Kanban、瀑布、工作流、里程碑与自动化。"), ("仓库与 PR", "代码托管、分支策略、评审、备份与审计。"), ("GiteeGo", "可视化流水线与自动交付。"), ("Scan、测试与洞察", "代码质量、SonarQube、测试与效能度量。"), ("知识与集成", "文档、Wiki、API、Webhook 与企业 MCP。")]},
        "entities": {"en": ["Enterprise / team", "Project / work item", "Repository / PR", "Pipeline / scan", "Document / metric"], "zh": ["企业 / 团队", "项目 / 工作项", "仓库 / PR", "流水线 / 扫描", "文档 / 指标"]},
        "ai": {"level": "assistive", "en": "Level 1 with an emerging agent interface. Native Enterprise pages emphasize rule-based smart review, Scan and automation rather than a lifecycle copilot. The official enterprise MCP server lets external AI assistants manage repositories, issues and pull requests, which is strategically useful but shifts the intelligence layer outside the product.", "zh": "1 级辅助，并出现代理接口。企业版原生页面更强调规则型智能评审、Scan 与自动化，而不是生命周期 Copilot。官方企业 MCP Server 允许外部 AI 助手管理仓库、Issue 和 PR，战略上有价值，却把智能层放到了产品外部。"},
        "pricing": {"en": "Free up to five users; Standard CNY 299/user/year; Premium CNY 499/user/year; negotiated private deployment and service. Storage, pipeline minutes and repository concurrency vary by tier.", "zh": "免费版最多 5 人；标准版 299 元/人/年；尊享版 499 元/人/年；私有部署与服务议价。存储、流水线时长和仓库并发随版本变化。"},
        "competitors": ["Huawei CodeArts", "Alibaba Yunxiao", "GitLab", "Tencent CODING"],
        "comp_rows": {"en": [("Domestic repository-led DevOps", "Huawei governed engineering", "Alibaba app delivery", "Global integrated DevSecOps", "Tencent collaboration/cloud"), ("Fast familiar SCM; lifecycle thinner", "Deep process; heavy", "Fast delivery; modular", "Broad evidence; complex", "Polished collaboration"), ("Best domestic code/community fit", "Best regulated complex fit", "Best Alibaba Cloud fit", "Best global neutral fit", "Best Tencent fit"), ("External-agent MCP, limited native AI", "Multi-agent execution emerging", "Embedded cross-scene assistant", "Governed autonomous flows", "Coding assistant adjacency")], "zh": [("国产仓库驱动 DevOps", "华为受治理工程", "阿里应用交付", "全球一体化 DevSecOps", "腾讯协作/云"), ("SCM 熟悉快速，生命周期较薄", "流程深、较重", "交付快、模块化", "证据广、复杂", "协作精致"), ("国产代码/社区适配最好", "强监管复杂工程最好", "阿里云适配最好", "全球中立最好", "腾讯体系最好"), ("外部代理 MCP，原生 AI 有限", "多智能体执行成形", "跨场景嵌入式助手", "受治理自主流程", "代码助手邻接")]},
        "frictions": {"en": [("Two enterprise stories", "SaaS Enterprise and private Premium/Enterprise naming blur packaging and product identity."), ("Code-first ceiling", "Planning, delivery, test and analytics exist, but repository gravity still dominates the information architecture."), ("Quota-led pricing", "Storage, LFS, minutes and concurrency distract from the business value of secure delivery."), ("AI layer is external", "MCP enables assistants, but users lack one native place to plan, approve, observe and audit agent work.")], "zh": [("两套企业叙事", "SaaS 企业版与私有化专业/旗舰命名让包装和产品身份模糊。"), ("代码中心的上限", "虽有规划、交付、测试和分析，信息架构仍被仓库引力主导。"), ("配额型定价", "存储、LFS、分钟与并发分散了用户对安全交付价值的注意。"), ("AI 层在外部", "MCP 能让助手调用，但缺少原生的计划、审批、观察和审计代理工作中心。")]},
        "risks": {"en": [("Cloud suites outflank lifecycle depth", "Competitive", "High", "high", "High · now", "Own the code-to-production evidence graph, not feature parity."), ("AI assistants commoditize hosting", "AI", "High", "high", "Medium · 18m", "Make Gitee the governed domestic context and action layer for any agent."), ("Packaging confusion slows enterprise sale", "Business", "Medium", "med", "High · now", "Unify SaaS/private naming, entitlements and upgrade narrative."), ("Community does not guarantee enterprise pull", "Growth", "Medium", "med", "Medium · 24m", "Instrument community-to-team-to-enterprise conversion and migration loops.")], "zh": [("云套件从生命周期深度包抄", "竞争", "高", "high", "高 · 当前", "拥有代码到生产的证据图，而不是追求功能平价。"), ("AI 助手商品化托管", "AI", "高", "high", "中 · 18 个月", "成为任何代理的国产治理上下文与动作层。"), ("包装混乱拖慢企业销售", "商业", "中", "med", "高 · 当前", "统一 SaaS/私有化命名、权益与升级叙事。"), ("社区不必然拉动企业", "增长", "中", "med", "中 · 24 个月", "度量社区→团队→企业的转化与迁移循环。")]},
        "opps": {"en": [("Native Gitee Agent Center", "Turn MCP into a governed workspace for planning, permissions, approvals, traces and budgets."), ("Repository-to-value trace", "Make every requirement show linked code, review, scan, pipeline, deployment and business outcome."), ("Sovereign AI DevOps package", "Bundle private Gitee, local models, Scan, pipeline and audit for regulated buyers.")], "zh": [("原生 Gitee Agent Center", "把 MCP 升级为治理工作区，统一计划、权限、审批、轨迹与预算。"), ("仓库到价值追踪", "让每条需求展示关联代码、评审、扫描、流水线、部署与业务结果。"), ("主权 AI DevOps 套装", "为强监管买家组合私有 Gitee、本地模型、Scan、流水线与审计。")]},
        "strategy": {"en": ("Become China's neutral code-and-agent trust layer", "Use community distribution and private deployment to govern external coding agents across domestic models and clouds; do not try to outbuild every cloud runtime module."), "zh": ("成为中国中立的代码与代理信任层", "用社区分发和私有部署治理跨国产模型、跨云的外部编程代理；不要试图补齐每个云运行模块。")},
        "moonshot": {"en": ("National-scale software provenance graph", "A permissioned graph traces domestic open-source dependencies and enterprise changes from origin through scan, build and deployment, serving humans, auditors and agents."), "zh": ("国家级软件来源图谱", "一张权限化图谱追踪国产开源依赖与企业变更从来源到扫描、构建和部署，同时服务人、审计与代理。")},
        "shots": ["https://e-assets.gitee.com/gitee-community-web/_next/static/media/img1.5e3f16a8.png", "https://e-assets.gitee.com/gitee-community-web/_next/static/media/img2.b47ef2f8.png", "https://e-assets.gitee.com/gitee-community-web/_next/static/media/img3.733e07d3.png", "https://e-assets.gitee.com/gitee-community-web/_next/static/media/img4.bf741fad.png", "https://e-assets.gitee.com/gitee-community-web/_next/static/media/low-cost.3ff1e398.png", "https://e-assets.gitee.com/gitee-community-web/_next/static/media/img_top2.9722e598.png"],
    },
}


def tr(lang: str, en: str, zh: str) -> str:
    return en if lang == "en" else zh


def values_for(slug: str, d: dict, lang: str) -> dict[str, str]:
    p = d["name"] if lang == "en" else d["zh_name"]
    out_en = f"product-teardown-{slug}-en-{YM}.html"
    out_zh = f"product-teardown-{slug}-zh-{YM}.html"
    v: dict[str, str] = {
        "PRODUCT": p, "DATE_YYYY_MM_DD": DATE,
        "TIMESTAMP": f"{DATE} · " + tr(lang, "Principal PM teardown", "首席产品经理拆解"),
        "ONE_LINER_2_LINE_SUBTITLE": d["one"][lang], "CATEGORY": d["category"][lang],
        "USER_SCALE": d["scale"][lang], "BUSINESS_MODEL_SHORT": d["business"][lang], "STAGE_MATURITY": d["maturity"][lang],
        "ASSUMPTIONS_ONE_PARAGRAPH_LIST_WHAT_IS_INFERRED_VS_KNOWN": d["known"][lang] + " " + tr(lang, "Primary sources: ", "一手来源：") + " · ".join(f"<a href='{u}'>{u}</a>" for u in d["sources"]),
        "VERDICT_ONE_LINER": d["verdict"][lang], "VERDICT_BODY_2_3_LINES": d["verdict_body"][lang],
        "STAR_ROW_e_g_★★★★☆": "★★★★☆", "STAR_RATING_x": str(round(float(d["moat"][0]) / 2, 1)),
        "TTV_VALUE": str(d["ttv"][0]), "TTV_UNIT": d["ttv"][1], "TTV_BAR": str(d["ttv"][2]),
        "TTV_NOTE_WHAT_HAPPENS_AT_AHA": tr(lang, "A team imports or creates a repository, links one work item, and sees the first governed pipeline complete.", "团队导入或创建仓库、关联一条工作项，并看到第一条受治理流水线完成。"),
        "LOOP_FREQ": tr(lang, "Many × day", "每天多次"), "LOOP_FREQ_NOTE_TRIGGER_CONTEXT": tr(lang, "Every work-item change, push, review, pipeline and deployment re-enters the loop.", "每次工作项变化、推送、评审、流水线和部署都会重新进入循环。"),
        "MOAT_SCORE": str(d["moat"][0]), "MOAT_REASONING_ONE_LINE": d["moat"][1],
        "SNAPSHOT_ONE_TO_TWO_SENTENCE_DEFINITION": d["one"][lang], "USER_PROMISE": d["verdict"][lang],
        "CATEGORY_POSITIONING_PARAGRAPH": d["verdict_body"][lang],
        "ASSUMPTION_1": tr(lang, "The economic buyer is an engineering/platform leader; developers remain the adoption veto.", "经济买家是研发/平台负责人；开发者仍拥有采用否决权。"),
        "ASSUMPTION_2": tr(lang, "China enterprise deployment, compliance and ecosystem fit are weighted more heavily than global social coding reach.", "本报告对中国企业部署、合规和生态适配的权重高于全球公共代码社交影响力。"),
        "TRIGGER_MOMENT": tr(lang, "Toolchain consolidation, cloud migration, compliance, private deployment, or AI-agent adoption.", "工具链整合、上云迁移、合规、私有部署或 AI 代理采用。"),
        "FREQUENCY": tr(lang, "Developers use it continuously; managers review weekly; platform and security teams govern by event.", "开发者持续使用；管理者按周复盘；平台与安全团队按事件治理。"),
        "USAGE_CONTEXT": tr(lang, "Browser, IDE, terminal, APIs, runners, cloud resources and enterprise networks.", "浏览器、IDE、终端、API、Runner、云资源与企业内网。"),
        "JTBD_FUNCTIONAL": tr(lang, "Turn a requirement into a secure, traceable production change without stitching a fragile toolchain.", "无需拼接脆弱工具链，把需求变成安全、可追踪的生产变更。"),
        "JTBD_EMOTIONAL": tr(lang, "Ship faster without losing confidence or control.", "更快交付，同时不失去信心和控制。"),
        "JTBD_SOCIAL": tr(lang, "Give developers, managers, security and auditors one credible delivery story.", "让开发、管理、安全与审计看到同一个可信交付故事。"),
        "LOOP_TRIGGER_TITLE": tr(lang, "Intent or change", "意图或变更"), "LOOP_TRIGGER_DETAIL": tr(lang, "Requirement, defect, code push, failed build, risk signal or agent assignment.", "需求、缺陷、代码推送、构建失败、风险信号或代理任务。"),
        "LOOP_ACTION_TITLE": tr(lang, "Plan, code and verify", "规划、编码与验证"), "LOOP_ACTION_DETAIL": tr(lang, "Create work, change code, review, build, scan and test under organization policy.", "在组织策略下创建工作、修改代码、评审、构建、扫描和测试。"),
        "LOOP_REWARD_TITLE": tr(lang, "Trusted release", "可信发布"), "LOOP_REWARD_DETAIL": tr(lang, "A deployable artifact, passed gates, visible ownership and rollback evidence.", "得到可部署制品、通过门禁、明确责任和回滚证据。"),
        "LOOP_RETURN_TITLE": tr(lang, "Evidence improves the next cycle", "证据改善下一轮"), "LOOP_RETURN_DETAIL": tr(lang, "Delivery, quality and runtime signals improve templates, policy, planning and AI context.", "交付、质量和运行信号反哺模板、策略、规划与 AI 上下文。"),
        "LOOP_ONE_LINE_INSIGHT_WHAT_THE_LOOP_ACTUALLY_TEACHES_THE_USER": tr(lang, "Software delivery is one evidence-producing state transition, not a chain of tool handoffs.", "软件交付是一条持续产生证据的状态迁移，而不是工具间接力。"),
        "ACQUISITION_LOOP_DETAIL": tr(lang, "Free trial or repository migration → first pipeline → team standard → enterprise governance/private deployment → adjacent-team expansion.", "免费试用或仓库迁移 → 首条流水线 → 团队标准 → 企业治理/私有化 → 相邻团队扩张。"),
        "AHA_MOMENT_DETAIL": tr(lang, "One change links intent, code, review, checks, artifact and delivery status without manual reconciliation.", "一条变更无需人工对账，就连接意图、代码、评审、检查、制品和交付状态。"),
        "RETENTION_1": tr(lang, "Repository and review history become organizational memory.", "仓库与评审历史成为组织记忆。"),
        "RETENTION_2": tr(lang, "Pipelines, templates, permissions and integrations embed into daily operations.", "流水线、模板、权限与集成嵌入日常运营。"),
        "RETENTION_3": tr(lang, "Audit, quality and delivery evidence raise switching cost.", "审计、质量与交付证据提高切换成本。"),
        "VIRALITY_DETAIL_OR_NONE": tr(lang, "External virality varies, but internal expansion is strong: shared repositories, templates and policies pull in adjacent teams.", "外部传播各异，但内部扩张很强：共享仓库、模板和策略会拉入相邻团队。"),
        "IA_LOGIC_PARAGRAPH": tr(lang, "The model nests organization → project → work item/repository → pipeline → deployment. Product-module navigation exposes lifecycle breadth but can obscure the shortest job path.", "模型按组织→项目→工作项/仓库→流水线→部署嵌套。按产品模块导航展示了生命周期宽度，却可能遮住最短任务路径。"),
        "NAV_INTERACTION_PARAGRAPH": tr(lang, "Most work moves between global organization context and local project/repository details. Search, templates, deep links and contextual actions matter more than visual novelty.", "多数工作在全局组织上下文与局部项目/仓库详情间移动。搜索、模板、深链与情境操作比视觉新奇更重要。"),
        "CRAFT_PRINCIPLE": tr(lang, "Enterprise DevOps craft is the removal of ambiguity: one owner, one policy, one state, one proof chain.", "企业 DevOps 的工艺是消除歧义：一个责任人、一套策略、一个状态、一条证明链。"),
        "TTV_LABEL": tr(lang, "Good", "较好"), "COG_BAR": "72", "COG_LABEL": tr(lang, "High", "高"),
        "DELIGHT_BAR": "73", "DELIGHT_LABEL": tr(lang, "Good", "较好"), "TRUST_BAR": "84", "TRUST_LABEL": tr(lang, "High", "高"), "STRUGGLE_BAR": "66", "STRUGGLE_LABEL": tr(lang, "Medium-high", "中高"),
        "DELIGHT_1": tr(lang, "One change can accumulate planning, code, quality and delivery evidence.", "一条变更能沉淀规划、代码、质量与交付证据。"),
        "DELIGHT_2": tr(lang, "Templates compress difficult infrastructure and governance setup.", "模板压缩复杂基础设施与治理配置。"),
        "DELIGHT_3": tr(lang, "Domestic support and deployment choices increase enterprise confidence.", "国产服务与部署选择增强企业信心。"),
        "STRUGGLE_1": d["frictions"][lang][0][1], "STRUGGLE_2": d["frictions"][lang][1][1], "STRUGGLE_3": d["frictions"][lang][2][1],
        "REVENUE_MODEL_NAME": d["business"][lang], "REVENUE_MODEL_DETAIL": d["pricing"][lang],
        "FREE_PAID_BOUNDARY_NAME": tr(lang, "From team utility to enterprise assurance", "从团队实用到企业保证"),
        "FREE_PAID_DETAIL": tr(lang, "Free/basic proves code and workflow value; paid tiers monetize scale, security, governance, resources, support and deployment control.", "免费/基础能力验证代码与流程价值；付费版本对规模、安全、治理、资源、服务与部署控制收费。"),
        "MON_ENTRY_HEADLINE": tr(lang, "Governance and delivery risk fund the upgrade", "治理与交付风险为升级买单"),
        "MON_ENTRY_DETAIL": tr(lang, "The real trigger is not storage alone; it is less integration labor, fewer failures, faster audit and controlled production change.", "真正触发器不只是存储，而是更少集成劳动、更少失败、更快审计与受控生产变更。"),
        "UX_MON_HEADLINE": tr(lang, "Aligned value, quota-heavy packaging", "价值对齐，包装偏配额"),
        "UX_MON_DETAIL_ARE_THEY_ALIGNED_OR_IN_TENSION": tr(lang, "Security, scale and private control are valid paid boundaries; seats, minutes, storage, concurrency and AI credits can still obscure outcome value.", "安全、规模与私有控制是合理付费边界；席位、分钟、存储、并发与 AI 积分仍会遮蔽结果价值。"),
        "COMP_INTRO": tr(lang, "The three domestic suites compete on cloud adjacency, engineering method, code distribution, private deployment and AI execution — not on feature checklists alone.", "三类国产平台竞争的是云邻接、工程方法、代码分发、私有部署与 AI 执行，而不只是功能清单。"),
        "COMP_DIM_1": tr(lang, "Product philosophy", "产品哲学"), "COMP_DIM_2": tr(lang, "Speed & craft", "速度与工艺"), "COMP_DIM_3": tr(lang, "Best fit", "最适场景"), "COMP_DIM_4": tr(lang, "AI maturity", "AI 成熟度"),
        "COMP_WHERE_OWN_WINS": d["verdict"][lang],
        "COMP_WHERE_RIVALS_CATCH": tr(lang, "Rivals win where their cloud ecosystem, global standards, community gravity or interaction craft matters more than this product's core advantage.", "当云生态、全球标准、社区引力或交互工艺比本产品核心优势更重要时，对手会赢。"),
        "CHANNEL_1": tr(lang, "Free tier, developers and repository migration", "免费版、开发者与仓库迁移"), "CHANNEL_2": tr(lang, "Enterprise direct sales, compliance and private deployment", "企业直销、合规与私有部署"), "CHANNEL_3": tr(lang, "Cloud ecosystem, partners, training and customer success", "云生态、伙伴、培训与客户成功"),
        "GROWTH_LOOP_1_NAME": tr(lang, "Repository-to-platform loop", "仓库到平台循环"), "GROWTH_LOOP_1_DETAIL": tr(lang, "Code arrives → review and CI standardize → policies and metrics attach → adjacent teams adopt.", "代码进入→评审与 CI 标准化→策略与度量附着→相邻团队采用。"),
        "GROWTH_LOOP_2_NAME": tr(lang, "Evidence compounding loop", "证据复利循环"), "GROWTH_LOOP_2_DETAIL": tr(lang, "More delivery events create better templates, analytics and AI context, which increase consolidation.", "更多交付事件产生更好的模板、分析与 AI 上下文，进一步推动整合。"),
        "HORIZONTAL_1": tr(lang, "Portfolio and enterprise planning", "组合与企业规划"), "HORIZONTAL_2": tr(lang, "Knowledge, collaboration and executive insight", "知识、协作与高管洞察"),
        "VERTICAL_1": tr(lang, "Verified code-to-production automation", "可验证的代码到生产自动化"), "VERTICAL_2": tr(lang, "Security and quality remediation", "安全与质量修复"),
        "PLATFORM_1": tr(lang, "APIs, webhooks, plugins, templates and MCP", "API、Webhook、插件、模板与 MCP"), "PLATFORM_2": tr(lang, "Permission-aware lifecycle graph for internal and external agents", "供内外部代理使用的权限感知生命周期图"),
        "CURRENT_AI_USAGE_PARAGRAPH": d["ai"][lang],
        "AGENTIC_CANDIDATE_1": tr(lang, "Turn a requirement into a reviewed, tested merge request.", "把需求转成通过评审与测试的合并请求。"),
        "AGENTIC_CANDIDATE_2": tr(lang, "Diagnose and repair failed pipelines under budget and policy.", "在预算与策略内诊断并修复失败流水线。"),
        "AGENTIC_CANDIDATE_3": tr(lang, "Triage vulnerabilities, create patches and verify staged rollout.", "分诊漏洞、创建补丁并验证分批发布。"),
        "AI_OPPORTUNITY_1": d["opps"][lang][0][1], "AI_OPPORTUNITY_2": d["opps"][lang][1][1],
        "AI_DISRUPTION_RISK": tr(lang, "High. AI moves user intent toward IDEs and agents, makes migration easier, and increases the value of governed context. The product must own policy and evidence even when another agent owns the front end.", "高。AI 把用户意图移向 IDE 与代理、降低迁移成本，同时提高受治理上下文价值。即使前端由别的代理掌握，产品也必须拥有策略与证据。"),
        "METRICS_INTRO": tr(lang, "The stack below is inferred from the unit of value: a trusted production change completed through the platform.", "以下指标栈基于产品价值单位推断：通过平台完成的一次可信生产变更。"),
        "NORTH_STAR_METRIC": tr(lang, "Weekly trusted delivery loops per active organization", "每个活跃组织每周可信交付闭环数"),
        "NORTH_STAR_WHY": tr(lang, "It aligns planning, code, quality, policy and deployment around an outcome rather than counting activity.", "它围绕结果统一规划、代码、质量、策略与部署，而不是计算活动量。"),
        "INPUT_METRIC_1_NAME": tr(lang, "Work-item-to-production cycle time", "工作项到生产周期"), "INPUT_METRIC_1_WHY": tr(lang, "Measures total flow rather than local tool speed.", "衡量整体流动，而不是局部工具速度。"),
        "INPUT_METRIC_2_NAME": tr(lang, "First-pass pipeline success", "流水线首次通过率"), "INPUT_METRIC_2_WHY": tr(lang, "Captures feedback quality, template health and environment reliability.", "反映反馈质量、模板健康与环境可靠性。"),
        "INPUT_METRIC_3_NAME": tr(lang, "AI output accepted without rework", "AI 结果无返工接受率"), "INPUT_METRIC_3_WHY": tr(lang, "Separates generated activity from trusted delivery value.", "区分生成活动与可信交付价值。"),
        "GUARDRAIL_METRIC": tr(lang, "Escaped defects or policy violations per release", "每次发布逃逸缺陷或策略违规数"), "GUARDRAIL_WHY": tr(lang, "Speed and autonomy cannot erode enterprise trust.", "速度与自主性不能侵蚀企业信任。"),
        "METRIC_BLINDSPOT": tr(lang, "Daily developer friction hidden by enterprise renewal", "被企业续费遮蔽的日常开发摩擦"), "METRIC_BLINDSPOT_WHY": tr(lang, "Organizations can renew while developers route work through shadow tools and external agents.", "组织可能继续续费，开发者却把工作转到影子工具和外部代理。"),
        "RISK_INTRO": tr(lang, "These risks can break the move from tool suite to intelligent delivery system.", "这些风险可能打断从工具套件到智能交付系统的转型。"),
        "OPP_1_HEADLINE": d["opps"][lang][0][0], "OPP_1_DETAIL_WHAT_HOW_WHY": d["opps"][lang][0][1], "OPP_2_HEADLINE": d["opps"][lang][1][0], "OPP_2_DETAIL": d["opps"][lang][1][1], "OPP_3_HEADLINE": d["opps"][lang][2][0], "OPP_3_DETAIL": d["opps"][lang][2][1],
        "STRATEGIC_HEADLINE": d["strategy"][lang][0], "STRATEGIC_DETAIL_HIGH_IMPACT_BET": d["strategy"][lang][1],
        "MOONSHOT_HEADLINE": d["moonshot"][lang][0], "MOONSHOT_DETAIL_WHY_IT_COULD_RESHAPE_THE_CATEGORY": d["moonshot"][lang][1],
        "FINAL_WINS": d["verdict"][lang], "FINAL_BREAKS": " · ".join(x[0] for x in d["frictions"][lang]),
        "FINAL_MOAT_OR_LACK_THEREOF": tr(lang, "The moat is durable only if distribution and deployment advantages become a shared, permission-aware evidence graph that agents and humans use every day.", "只有把分发与部署优势变成代理和人每天使用的共享、权限感知证据图，护城河才耐久。"),
        "LANG_EN_HREF": out_en, "LANG_ZH_HREF": out_zh, "ACTIVE_IF_EN": "active" if lang == "en" else "", "ACTIVE_IF_ZH": "active" if lang == "zh" else "",
        "ACTIVE_IF_ASSISTIVE": "active" if d["ai"]["level"] == "assistive" else "", "ACTIVE_IF_EMBEDDED": "active" if d["ai"]["level"] == "embedded" else "", "ACTIVE_IF_AUTONOMOUS": "active" if d["ai"]["level"] == "autonomous" else "",
    }

    for i, (head, body) in enumerate(d["tldr"][lang], 1):
        v[f"TLDR_{i}_HEADLINE"], v[f"TLDR_{i}_BODY"] = head, body
    for i, (name, detail) in enumerate(d["segments"][lang], 1):
        v[f"SEGMENT_{i}_NAME"], v[f"SEGMENT_{i}_DETAIL"] = name, detail
    for i, (name, role) in enumerate(d["surfaces"][lang], 1):
        v[f"SURFACE_{i}_NAME"], v[f"SURFACE_{i}_ROLE"] = name, role
    for i, entity in enumerate(d["entities"][lang], 1): v[f"ENTITY_{i}"] = entity
    craft_names = tr(lang, ["Evidence-centered change", "Policy as code", "Templates as leverage", "Enterprise control", "Open integration"], ["证据中心变更", "策略即代码", "模板即杠杆", "企业级控制", "开放集成"])
    craft_details = tr(lang, ["A change object gathers intent, discussion, checks and release state.", "Rules and gates are reviewable, repeatable and auditable.", "Templates turn expert practice into a fast default path.", "Permissions, audit, deployment and data boundaries are first-class.", "APIs and connectors let the platform fit existing estates."], ["变更对象汇集意图、讨论、检查与发布状态。", "规则与门禁可评审、可重复、可审计。", "模板把专家实践变成快速默认路径。", "权限、审计、部署与数据边界是一等能力。", "API 与连接器让平台适配既有系统。"])
    for i in range(1, 6): v[f"CRAFT_{i}_NAME"], v[f"CRAFT_{i}_DETAIL"] = craft_names[i-1], craft_details[i-1]
    comp_names = [p] + d["competitors"]
    for i in range(1, 5): v[f"COMP_{i}_NAME"] = comp_names[i]
    rows = d["comp_rows"][lang]
    for row_i, row in enumerate(rows, 1):
        v[f"COMP_OWN_D{row_i}"] = row[0]
        for comp_i in range(1, 5): v[f"COMP_{comp_i}_D{row_i}"] = row[comp_i]
    for i, (title, body) in enumerate(d["frictions"][lang], 1):
        v[f"FRICTION_{i}_TITLE"] = title
        v["FRICTION_1_BODY_WHY_IT_MATTERS" if i == 1 else f"FRICTION_{i}_BODY"] = body
    for i, risk in enumerate(d["risks"][lang], 1):
        name, cat, sev, sev_class, lik, mit = risk
        v.update({f"RISK_{i}_NAME": name, f"RISK_{i}_CAT": cat, f"RISK_{i}_SEV": sev, f"RISK_{i}_SEV_CLASS": sev_class, f"RISK_{i}_LIK": lik, f"RISK_{i}_MIT": mit})
    captions = tr(lang, ["Product architecture / lifecycle overview", "Core workflow or repository experience", "Delivery or performance view", "Governance and enterprise control", "Adoption and transformation proposition", "Agent, integration or platform surface"], ["产品架构 / 生命周期总览", "核心流程或仓库体验", "交付或效能视图", "治理与企业控制", "采用与转型主张", "智能体、集成或平台界面"])
    for i, url in enumerate(d["shots"], 1): v[f"SHOT_{i}_URL"], v[f"SHOT_{i}_CAPTION"] = url, captions[i-1]
    return v


def render(slug: str, d: dict, lang: str) -> Path:
    template = TEMPLATES[lang]
    html = template.read_text(encoding="utf-8")
    values = values_for(slug, d, lang)
    placeholders = set(re.findall(r"\{\{([^}]+)\}\}", html)) - {"PLACEHOLDER"}
    missing = sorted(placeholders - set(values))
    if missing: raise RuntimeError(f"Missing {slug}/{lang}: {missing}")
    for key in sorted(values, key=len, reverse=True): html = html.replace("{{" + key + "}}", str(values[key]))
    html = html.replace("{{PLACEHOLDER}}", "PLACEHOLDER")
    remaining = sorted(set(re.findall(r"\{\{[^}]+\}\}", html)))
    if remaining: raise RuntimeError(f"Unresolved {slug}/{lang}: {remaining}")
    for marker in ("Dreameryanyan", "brand-mark", "yanliudreamer", "xiaohongshu"):
        if marker not in html: raise RuntimeError(f"Missing brand marker {marker}: {slug}/{lang}")
    if html.count('class="ai-stage active') != 1: raise RuntimeError(f"AI state invalid: {slug}/{lang}")
    out = ROOT / f"product-teardown-{slug}-{lang}-{YM}.html"
    out.write_text(html, encoding="utf-8")
    return out


if __name__ == "__main__":
    for slug, data in PRODUCTS.items():
        for language in ("en", "zh"):
            print(render(slug, data, language))
