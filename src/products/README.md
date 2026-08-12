# AI product boundaries

The repository contains two independently owned AI products:

- `embedded-assistant`: the assistant embedded in the application demo. It owns the docked, floating, and expanded display modes.
- `standalone-chat`: the full-page product served from `/chat/`. It owns its app shell and full-page conversation workspace.

Each product owns its workspace implementation, styles, API clients, local draft namespace, and API product identifier. They may share only platform-level dependencies such as Vision Design System components, authentication, brand assets, and the AI server runtime.

Existing conversations created before the split are migrated into `standalone-chat`; the embedded assistant starts with its own empty conversation space.

Do not import one product from the other. Cross-product behavior that is intentionally shared should first be promoted to a neutral platform module and covered by both products' tests.
