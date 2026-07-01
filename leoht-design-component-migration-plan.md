# Leoht Design Component Migration Plan

Source project: `/Users/leiwang/Documents/Project/LeohtDesign/leoht-design`

Target project: `/Users/leiwang/Documents/Project/VisionDesignSystem`

## Current Done

- Token migration is variable-perfect: old `377`, current `377`, missing `0`, extra `0`, value diff `0`.
- Element Plus CSS variable mapping is complete: `568 / 568`, missing `0`.
- Source token audit is clean: missing used token `0`.
- Legacy source residue audit is clean: `Leo`, `leo-`, `--leo-`, `ds-icon` residue `0`.
- Build passes with `npm run build`.

## Direct Migration Components

These components should not use Element Plus as the visual/behavior base because Element Plus has no close equivalent or the old DOM is the visual contract.

| Component | Status | Target | Notes |
| --- | --- | --- | --- |
| icons | Done | `VisIcon` / `Icon` | Full generated registry migrated. Produces a large icon chunk; keep for full compatibility. |
| featured-icon | Done | `VisFeaturedIcon` | Direct self-rendered migration. API keeps `size/color/type/icon`. |
| code-block | Done | `VisCodeBlock` | Direct migration; uses `VisButton` and `VisScrollShadow`. |
| scroll-shadow | Done | `VisScrollShadow` | Direct migration; keeps edge fade behavior. |
| markdown | Pending | `VisMarkdown` | Direct migration; requires adding `marked` and `dompurify` dependencies first. |
| rich-text-editor | Pending | `VisRichTextEditor` | Direct migration; must first port internal tooltip/dropdown/divider behavior or replace with internal controls. |

## Full Component Checklist

| Old component | Migration mode | Priority | Status | Implementation note |
| --- | --- | --- | --- | --- |
| button | Self-rendered from correct source | P0 | Done | Rebuilt from correct `LeoButton`; no Element Plus wrapper in current pass to preserve visual parity. |
| input | Self-rendered from correct source | P0 | Done | Rebuilt from correct `LeoInput`; keeps addon/readView/icon/count behavior. |
| modal | Self-rendered from correct source | P0 | Done | Rebuilt `VisModal` and `VisModalConfirm`; menu item dependency is internalized. |
| icons | Direct self-rendered | P0 | Done | Full generated icon components copied and renamed to Vision classes. |
| featured-icon | Direct self-rendered | P0 | Done | Uses correct old token semantics. |
| code-block | Direct self-rendered | P1 | Done | Copy/toggle/scroll behavior migrated. |
| scroll-shadow | Direct self-rendered | P1 | Done | Vertical/horizontal fade behavior migrated. |
| config-provider | Infrastructure | P0 | Existing | Keep as Vision infrastructure around theme/namespace/z-index. |
| markdown | Direct self-rendered | P1 | Pending | Add `marked` and `dompurify`; then migrate renderer, streaming placeholders, and syntax styles. |
| rich-text-editor | Direct self-rendered | P1 | Pending | Migrate editor plus tooltip; remove dependency on old dropdown/divider or migrate those first. |
| alert | Element Plus adapter | P1 | Pending | Wrap `ElAlert`; preserve old variant/title/description/action API. |
| avatar | Element Plus adapter | P1 | Pending | Wrap `ElAvatar`; migrate image/text/group sizing. |
| badge | Element Plus adapter | P1 | Pending | Wrap `ElBadge`; preserve dot/count/status visuals. |
| breadcrumb | Element Plus adapter | P1 | Pending | Wrap `ElBreadcrumb`; map separator/icon item API. |
| checkbox | Element Plus adapter | P1 | Pending | Wrap `ElCheckbox`; keep checked/indeterminate/disabled states. |
| date-picker | Element Plus adapter | P1 | Pending | Wrap `ElDatePicker`; keep old date/range API aliases. |
| drawer | Element Plus adapter | P1 | Pending | Wrap `ElDrawer`; map header/footer/placement. |
| dropdown | Element Plus adapter | P1 | Pending | Wrap `ElDropdown`; preserve item API for rich editor/menu dependencies. |
| input-number | Element Plus adapter | P1 | Pending | Wrap `ElInputNumber`; map size/state controls. |
| input-textarea | Element Plus adapter | P1 | Pending | Wrap `ElInput` textarea mode or share `VisInput` foundation. |
| menu | Element Plus adapter or hybrid | P1 | Pending | Needed by future modal/menu surfaces; compare against `ElMenu`. |
| message | Element Plus service adapter | P1 | Pending | Wrap `ElMessage`; expose Vision semantic API. |
| notification | Element Plus service adapter | P1 | Pending | Wrap `ElNotification`; preserve old placements and icon tones. |
| pagination | Element Plus adapter | P1 | Pending | Wrap `ElPagination`; map page/current/size semantics. |
| popover | Element Plus adapter | P1 | Pending | Wrap `ElPopover`; preserve trigger/content/slot API. |
| progress-bar | Element Plus adapter | P1 | Pending | Wrap `ElProgress`; map bar/token styles. |
| progress-circle | Element Plus adapter | P1 | Pending | Wrap `ElProgress` circle mode. |
| radio | Element Plus adapter | P1 | Pending | Wrap `ElRadio` / group; preserve checked/disabled states. |
| rate | Element Plus adapter | P1 | Pending | Wrap `ElRate`; migrate icon/color semantics. |
| segmented | Element Plus adapter | P1 | Pending | Wrap `ElSegmented`; keep old option API. |
| select | Element Plus adapter | P1 | Pending | Wrap `ElSelect`; map option and multiple behavior. |
| slider | Element Plus adapter | P1 | Pending | Wrap `ElSlider`; map marks/range/value API. |
| steps | Element Plus adapter | P1 | Pending | Wrap `ElSteps`; preserve status/icon API. |
| tabs | Element Plus adapter | P1 | Pending | Wrap `ElTabs`; preserve item/pane semantics. |
| tag | Element Plus adapter | P1 | Pending | Wrap `ElTag`; map color/closable states. |
| time-picker | Element Plus adapter | P1 | Pending | Wrap `ElTimePicker`; map time/range API. |
| toggle | Element Plus adapter | P1 | Pending | Wrap `ElSwitch`; preserve old toggle visuals. |
| tooltip | Element Plus adapter | P1 | Pending | Wrap `ElTooltip`; preserve placement/content/trigger. |
| tree-view | Element Plus adapter | P1 | Pending | Wrap `ElTree`; map node/selection/expand API. |
| upload | Element Plus adapter | P1 | Pending | Wrap `ElUpload`; preserve file/list/dropzone API. |
| accordion | Element Plus adapter | P2 | Pending | Wrap `ElCollapse`; map item API. |
| divider | Self-rendered or Element Plus adapter | P2 | Pending | Simple enough to self-render; migrate before rich editor if needed. |
| input-search-box | Hybrid composite | P2 | Pending | Compose `VisInput` plus search affordances; Element Plus is not the main base. |
| loading | Hybrid/self-rendered | P2 | Pending | Element Plus has loading service, but old visual spinner may need direct migration. |
| page-header | Element Plus adapter or hybrid | P2 | Pending | Compare old layout against `ElPageHeader`; likely hybrid. |
| toggle-button | Hybrid/self-rendered | P2 | Pending | No exact Element Plus equivalent; compose button/toggle semantics. |

## Next Batch Recommendation

1. Migrate adapter primitives used by many components: `tooltip`, `dropdown`, `divider`, `menu`.
2. Migrate form controls: `checkbox`, `radio`, `toggle`, `select`, `input-number`, `input-textarea`, `date-picker`, `time-picker`.
3. Migrate feedback/overlay services: `message`, `notification`, `alert`, `popover`, `drawer`.
4. Migrate data/navigation components: `tabs`, `breadcrumb`, `pagination`, `steps`, `tree-view`.
5. Migrate remaining direct/special components: `markdown`, `rich-text-editor`, `input-search-box`, `toggle-button`, `loading`.
