# 安装与使用：causal-forest-skill

`causal-forest-skill` 是一个 WorkBuddy 技能（skill），把你本地/在线的「因果森林中文知识库」变成 agent 可被调用的实操能力。它自包含——技能内已内嵌可直接运行的 R 代码与在线教程链接，无需联网也能用（深入阅读链接到 GitHub Pages）。

## 方式一：从本仓库安装（推荐，保证相对路径与教程同源）

```bash
# 克隆或已拥有 causal-forest-hub 仓库
git clone https://github.com/zhangkaicr/causal-forest-hub.git
# 把技能目录软链到 WorkBuddy 的用户级技能目录（Windows 用 mklink /D）
ln -s "$(pwd)/causal-forest-hub/skills/causal-forest-skill" \
      "$HOME/.workbuddy/skills/causal-forest-skill"
```

> 用**软链**而非复制的好处：知识库更新后技能自动同步，且技能内指向 `../grf-cn/...` 的相对引用仍可解析。

## 方式二：复制目录安装

```bash
cp -r causal-forest-hub/skills/causal-forest-skill "$HOME/.workbuddy/skills/"
```

Windows（PowerShell）：

```powershell
Copy-Item -Recurse causal-forest-hub\skills\causal-forest-skill `
          $env:USERPROFILE\.workbuddy\skills\causal-forest-skill
```

## 验证安装

在 WorkBuddy 对话中直接说：

> "用因果森林估计异质性处理效应，给我一段 R 代码"

若 agent 正确加载本技能并给出 `causal_forest` 工作流，即安装成功。

## 技能包含

| 文件 | 作用 |
|---|---|
| `SKILL.md` | 主技能：7 个 RIA++ 能力卡（C01–C07），含真实 R 代码与在线教程链接 |
| `DIGEST.md` | 人类可读精华长文，概览整套 HTE 流水线 |
| `INSTALL.md` | 本文件 |

## 在线教程（技能内 `深入阅读` 指向）

- 知识库首页：https://zhangkaicr.github.io/causal-forest-hub/
- grf-cn（因果森林核心）：`grf-cn/grf.html`、`grf-cn/rate.html`、`grf-cn/survival.html`
- policytree-cn（政策树）：`policytree-cn/index.html`
- surefq（分类变量充分表示）：`surefq/surefq.html`
- maq（多臂 Qini）：`maq/maq.html`
- explain-cf（解释因果森林）：`explain-cf/explain_cf.html`

## 依赖（R 包）

`grf`、`policytree`、`maq`、`hstats`、`kernelshap`、`shapviz`、`ggplot2`、`patchwork`。均可通过 `install.packages()` 安装；`maq` 亦可 `devtools::install_github("grf-labs/maq", subdir = "r-package/maq")`。
