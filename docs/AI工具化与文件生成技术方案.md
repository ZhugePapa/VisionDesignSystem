# AI 工具化与文件生成技术方案

## 1. 目标与边界

将“小 VI 智能助理”定位为通用对话工具，并把“对话模型”和“可产生真实文件的工具”分离：

- 对话模型负责理解意图、补充参数、解释结果，不伪装成已经生成图片或文件。
- 图片、Markdown、Word 等能力由独立工具执行，并返回可下载、可追踪的真实产物。
- 工具调用采用统一任务协议，后续新增 PDF、表格、PPT 时不需要重写会话主链路。

当前 OpenCode Go 接口只提供兼容 OpenAI 的文本对话端点，适合 Kimi K3、DeepSeek V4 Flash、GLM-5.2 对话，不应承担图片二进制生成。图片生成需要接入独立图像服务。

## 2. 推荐架构

```text
会话 UI
  ├─ 普通问题 ───────────────> 对话编排层 ──> OpenCode Go
  └─ 生成图片/文件 ──> 工具任务 API ──> 任务执行器 ──> Provider Adapter
                                           ├─ 阿里云百炼图片生成
                                           ├─ Markdown 生成器
                                           └─ Word 生成器
                                                │
                                          产物存储 + 元数据
                                                │
                                      Attachment / Artifact UI
```

核心原则：模型可以建议调用工具，但最终由服务端校验工具名称和参数；模型不能直接拼接 URL、执行任意命令或声称不存在的产物已经生成。

## 3. 统一工具任务协议

### 3.1 工具注册表

第一阶段注册四类工具：

| 工具 ID | 输入 | 输出 |
| --- | --- | --- |
| `image.generate` | prompt、尺寸、数量、风格参数 | PNG/JPEG/WebP |
| `image.edit` | prompt、参考图片、尺寸 | PNG/JPEG/WebP |
| `document.markdown` | 标题、内容、文件名 | UTF-8 Markdown |
| `document.word` | 结构化文档 AST、文件名、主题 | DOCX |

每个工具声明 JSON Schema、权限、超时、大小限制和是否异步。服务端只接受注册表内的工具和字段。

### 3.2 API

```http
POST /api/ai/tool-jobs
GET  /api/ai/tool-jobs/:jobId
POST /api/ai/tool-jobs/:jobId/cancel
GET  /api/ai/artifacts/:artifactId
```

创建任务示例：

```json
{
  "tool": "image.generate",
  "conversationId": "...",
  "turnId": "...",
  "input": {
    "prompt": "一只在窗边读书的橘猫，扁平插画",
    "size": "1024x1024",
    "count": 1
  }
}
```

任务状态统一为 `queued | running | succeeded | failed | cancelled | expired`。会话消息只保存工具调用摘要与 artifact ID，不把大文件塞进消息 JSON。

### 3.3 数据模型

- `ai_tool_job`：用户、会话、消息、工具、输入、状态、provider task ID、错误码、时间戳。
- `ai_artifact`：所属用户、工具任务、文件名、MIME、大小、校验和、存储 key、过期时间。
- `ai_tool_event`（可选）：状态变更和 provider 原始错误，便于排查与计费审计。

## 4. 图片生成落地方案

### 4.1 Provider 选择

推荐把阿里云百炼作为首个适配器：

- `qwen-image-2.0-pro`：优先用于包含文字、排版、海报和参考图编辑的请求。
- `wan2.7-image-pro`：优先用于通用高质量文生图/图生图。

模型名放在服务端配置与 allowlist 中，前端只提交产品层参数，不直接提交任意 provider/model 字符串。

### 4.2 异步调用流程

1. 服务端创建本地 `ai_tool_job`，返回 job ID。
2. Worker 调用百炼异步图片生成 API，记录 provider task ID。
3. Worker 轮询任务，采用指数退避并设置总超时。
4. 成功后立即下载 provider 临时 URL，校验 MIME、文件头、大小和像素尺寸。
5. 将图片写入自有对象存储，创建 `ai_artifact`，再把任务标为 `succeeded`。
6. 前端通过 SSE 或轮询刷新状态，并用现有 Attachment 组件展示产物。

百炼异步任务与结果 URL 有有效期，不能把 provider URL 当成永久下载地址；必须及时转存。

需要的部署配置：

```dotenv
DASHSCOPE_API_KEY=由部署环境注入，不写入仓库
DASHSCOPE_REGION=cn-beijing
AI_IMAGE_PROVIDER=dashscope
AI_IMAGE_MODEL=qwen-image-2.0-pro
AI_ARTIFACT_STORAGE_DIR=/opt/vision-design-system/.data/artifacts
```

密钥只进入服务器 Secret/环境变量。开始实现真实图片工具时，需要用户提供 `DASHSCOPE_API_KEY`；现在的文本对话 Key 不能替代它。

## 5. Markdown 与 Word 生成

### Markdown

- 由对话模型返回结构化内容，服务端确定文件名并写入 UTF-8 `.md`。
- 规范化换行、过滤路径字符、限制文件大小，并生成 SHA-256。
- 首版不需要独立外部 Provider，可在任务执行器内确定性生成。

### Word

- 不建议把自由 Markdown 直接交给 shell 转换。
- 让对话模型输出受限的文档 AST：`heading`、`paragraph`、`list`、`table`、`image`、`pageBreak`。
- 服务端用 Node `docx` 库生成 `.docx`；主题、字号、页边距和页眉页脚由模板控制。
- 后续如需复杂版式，再增加受沙箱约束的 Pandoc/LibreOffice 转换服务，不在主 API 进程执行任意命令。

## 6. 会话交互

- 明确请求“生成图片/文件”时，展示工具参数确认或直接创建任务；不要先输出“已生成”文本。
- 任务进行中展示进度、取消和失败重试。
- 成功时将 artifact 作为助手消息附件展示，支持预览、下载和再次编辑。
- 工具不可用、额度不足或安全校验失败时，给出明确错误，不回退成虚假的文本产物。
- 普通聊天仍走现有流式 SSE；工具任务有独立状态，不占用对话请求的超时计时器。

## 7. 安全与运维

- 每次读写 job/artifact 都校验用户所有权。
- 上传和下载同时校验扩展名、MIME 与 magic bytes；图片解码后再存储。
- 禁止 provider 返回 URL 触发任意内网访问，仅允许受信域名并阻断私网地址。
- 对用户、工具、日/分钟维度设配额；记录生成耗时、失败率和成本。
- 下载使用短期签名 URL 或鉴权代理；敏感附件默认不公开。
- Worker 与 Web API 分进程运行，单个生成任务不能拖垮会话服务。

## 8. 分阶段实施

1. **基础层**：工具注册表、job/artifact 表、任务 API、附件结果 UI。
2. **图片 MVP**：接入百炼一个图片模型、异步轮询、转存、重试与取消。
3. **文档工具**：Markdown 与 DOCX 生成、模板和下载。
4. **编排增强**：支持对话模型发起结构化 tool call，但仍由服务端策略层审批。
5. **生产化**：对象存储、队列、配额、指标、告警、生命周期清理。

## 9. 官方参考

- [OpenCode Go API 端点](https://opencode.ai/docs/zh-cn/go/)
- [OpenCode 自定义工具与 MCP](https://opencode.ai/docs/zh-cn/tools/)
- [阿里云百炼图像模型列表](https://help.aliyun.com/zh/model-studio/image-model)
- [阿里云百炼文生图说明](https://help.aliyun.com/zh/model-studio/text-to-image)
- [阿里云百炼图片与视频 API 首次调用](https://help.aliyun.com/en/model-studio/first-call-to-image-and-video-api)
- [万相图片生成 API 参考](https://help.aliyun.com/en/model-studio/text-to-image-v2-api-reference)
