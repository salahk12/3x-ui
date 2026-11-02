[English](/README.md) | [فارسی](/README.fa_IR.md)

# 3X-UI · Classic v2 UI

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./media/v2ui/overview-dark.png">
    <img alt="3X-UI with the classic v2 interface" src="./media/v2ui/overview-light.png">
  </picture>
</p>

<p align="center">
  <a href="https://github.com/salahk12/3x-ui/releases"><img src="https://img.shields.io/github/v/release/salahk12/3x-ui" alt="Release"></a>
  <a href="https://github.com/salahk12/3x-ui/actions/workflows/release.yml"><img src="https://img.shields.io/github/actions/workflow/status/salahk12/3x-ui/release.yml?branch=v2-ui" alt="Build"></a>
  <a href="https://www.gnu.org/licenses/gpl-3.0.en.html"><img src="https://img.shields.io/badge/license-GPL%20V3-blue.svg" alt="License"></a>
  <a href="https://github.com/MHSanaei/3x-ui"><img src="https://img.shields.io/badge/based%20on-MHSanaei%2F3x--ui%20v3.11-008771" alt="Based on 3x-ui v3.11"></a>
</p>

A fork of [MHSanaei/3x-ui](https://github.com/MHSanaei/3x-ui) that keeps the **v3.11 backend and features**
but brings back the look and feel of the **v2.9.4 interface**.

The v3 release rewrote the panel UI in React. This fork keeps that code and all of v3's capabilities,
and restyles it to match the familiar v2 panel: colours, layout, hover effects, modals and the subscription page.

## Quick install

Run this on your server as root:

```bash
bash <(curl -Ls https://raw.githubusercontent.com/salahk12/3x-ui/v2-ui/install.sh)
```

More options are in the [Install](#install) section below.

> [!IMPORTANT]
> This project is intended for personal use only. Do not use it for illegal purposes.

## What is different from upstream 3x-ui

The backend is upstream v3.11 with no changes to protocols, the database or the API. Inbounds, clients, nodes,
the API and the bots behave exactly as in upstream. The changes are:

**Interface (v2.9.4 look)**

- The v2 teal palette, rounded cards and the Vazirmatn font, in light, dark and ultra-dark themes.
- The classic dashboard: CPU/RAM/swap/disk gauges and the Xray, Manage, Uptime, System Load, Usage, Speed, Data, IP and Connections cards.
- The v2 sidebar: 200 px wide and collapsible, with the theme switcher at the top.
- The v2 login page with its animated waves, and a settings popover for theme and language.
- The inbound table: v2 columns, a single "⋮" action menu, client counters and no sortable headers.
- Settings and Xray pages: tabs at the top, collapsible sections, and the **Restart Xray** button next to Save.
- The v2 subscription page: QR codes in a rotating frame, usage details, links and Android/iOS app menus.
- v2 modals, toasts, dropdowns, select options, focus rings, multi-select chips, number spinners and tags.
- v2 hover transitions and animated tab switching.

**Speed**

- Modals such as *Add Inbound* and *Add Client* open immediately. Their code loads in the background,
  and the hidden tabs render after the modal is shown.

**Updates come from this fork**

- `install.sh`, `update.sh`, the `x-ui` menu and the panel's **Update Panel** button install releases
  from this repository. Updating does not replace the panel with upstream 3x-ui.

## Screenshots

<details>
<summary>Click to expand</summary>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./media/v2ui/inbounds-dark.png">
  <img alt="Inbounds" src="./media/v2ui/inbounds-light.png">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./media/v2ui/add-inbound-dark.png">
  <img alt="Add inbound" src="./media/v2ui/add-inbound-light.png">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./media/v2ui/xray-dark.png">
  <img alt="Xray configs" src="./media/v2ui/xray-light.png">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./media/v2ui/settings-dark.png">
  <img alt="Panel settings" src="./media/v2ui/settings-light.png">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./media/v2ui/login-dark.png">
  <img alt="Login" src="./media/v2ui/login-light.png">
</picture>

</details>

## Install

```bash
bash <(curl -Ls https://raw.githubusercontent.com/salahk12/3x-ui/v2-ui/install.sh)
```

The installer generates a random username, password and access path. When it finishes, run `x-ui`
to open the management menu, where you can start or stop the service, view or reset the login,
manage SSL certificates and more.

To install a specific release, add its tag:

```bash
bash <(curl -Ls https://raw.githubusercontent.com/salahk12/3x-ui/v2-ui/install.sh) v3.11.0
```

To install the rolling development build (built from every commit on `v2-ui`, not a stable release):

```bash
bash <(curl -Ls https://raw.githubusercontent.com/salahk12/3x-ui/v2-ui/install.sh) dev-latest
```

Each release archive is published with a `.sha256` file. The installer and the updater check
the archive against it and stop if the checksum does not match.

### Switch an existing 3x-ui v3 server to this fork

Your inbounds, clients and settings stay in `/etc/x-ui`. Only the panel binary and scripts are replaced.
Back up the database first:

```bash
cp -a /etc/x-ui /etc/x-ui.backup
bash <(curl -Ls https://raw.githubusercontent.com/salahk12/3x-ui/v2-ui/update.sh)
```

To go back to upstream, run upstream's `update.sh`. The database format is the same.

### Unattended install

Set `XUI_NONINTERACTIVE=1`, or run the installer without a terminal, and it installs with no prompts.
The generated credentials are written to `/etc/x-ui/install-result.env`. See [`deploy/`](deploy/)
for a cloud-init example.

### Install from another repository or branch

The scripts read `XUI_REPO` (default `salahk12/3x-ui`) and `XUI_BRANCH` (default `v2-ui`),
so you can point them at a mirror or your own fork:

```bash
XUI_REPO=you/3x-ui XUI_BRANCH=v2-ui bash <(curl -Ls https://raw.githubusercontent.com/you/3x-ui/v2-ui/install.sh)
```

## Supported platforms

**Operating systems:** Ubuntu, Debian, Armbian, Fedora, CentOS, RHEL, AlmaLinux, Rocky Linux,
Oracle Linux, Amazon Linux, Virtuozzo, Arch, Manjaro, Parch, openSUSE, Alpine and Windows.

**Architectures:** `amd64` · `386` · `arm64` · `armv7` · `armv6` · `armv5` · `s390x`.

## Database

The installer asks which backend to use:

- **SQLite** (default): a single file at `/etc/x-ui/x-ui.db`.
- **PostgreSQL**: better for many clients or multi-node setups. The installer can set it up locally or use an existing server.

The backend is selected with environment variables in `/etc/default/x-ui`:

```
XUI_DB_TYPE=postgres
XUI_DB_DSN=postgres://xui:password@127.0.0.1:5432/xui?sslmode=disable
```

To move an existing SQLite install to PostgreSQL:

```bash
x-ui migrate-db --dsn "postgres://xui:password@127.0.0.1:5432/xui?sslmode=disable"
systemctl restart x-ui
```

## Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `XUI_REPO` | GitHub repository the scripts install from | `salahk12/3x-ui` |
| `XUI_BRANCH` | Branch the scripts and menu are fetched from | `v2-ui` |
| `XUI_DB_TYPE` | Database backend: `sqlite` or `postgres` | `sqlite` |
| `XUI_DB_DSN` | PostgreSQL connection string | — |
| `XUI_DB_FOLDER` | Directory of the SQLite database | `/etc/x-ui` |
| `XUI_INIT_WEB_BASE_PATH` | Initial URL path of the panel | `/` |
| `XUI_ENABLE_FAIL2BAN` | Enforce per-client IP limits with Fail2ban | `true` |
| `XUI_LOG_LEVEL` | `debug`, `info`, `warning` or `error` | `info` |

Every other setting works as in upstream; see the
[upstream environment variable reference](https://docs.sanaei.dev/docs/reference/env-vars).

## Build from source

You need Node.js 26 or newer and Go 1.27 or newer.

```bash
git clone -b v2-ui https://github.com/salahk12/3x-ui.git
cd 3x-ui/frontend && npm ci && npm run build   # writes the UI into internal/web/dist
cd .. && go build -ldflags "-w -s" -o x-ui .
```

The UI lives in `frontend/`. The v2 styling is in `frontend/src/styles/v2-classic.css` and
`frontend/src/hooks/useTheme.tsx`. Run `npm test` in `frontend/` before sending changes.

## Releases

Pushing a `vX.Y.Z` tag builds every architecture with GitHub Actions and publishes a release.
Each push to `v2-ui` refreshes the `dev-latest` pre-release. Fork versions start from the upstream
version they are based on. Fork-only fixes bump the last number.

## Credits

- [MHSanaei/3x-ui](https://github.com/MHSanaei/3x-ui) and its contributors, for the panel this fork is built on.
- [alireza0](https://github.com/alireza0/), for the original X-UI work.
- [Iran v2ray rules](https://github.com/chocolate4u/Iran-v2ray-rules) and [Russia v2ray rules](https://github.com/runetfreedom/russia-v2ray-rules-dat), the bundled routing data.

## License

[GPL-3.0](LICENSE), the same license as upstream 3x-ui.
