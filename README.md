# 因果森林知识库

**GRF Labs 官方工具的完整中文译本**——因果森林（grf）、策略树（policytree）、分类变量的充分表示（SURE / QRF）与多臂 Qini（maq）。

- **在线地址**：https://zhangkaicr.github.io/causal-forest-hub/
- **原文来源**：[grf-labs.github.io](https://grf-labs.github.io/)、[arXiv:1908.09874](https://arxiv.org/abs/1908.09874)、[arXiv:2306.11979](https://arxiv.org/abs/2306.11979)

## 收录内容（4 个核心工具库 + 1 个拓展教程）

| 库 | 分组 | 说明 |
|---|---|---|
| **grf** 广义随机森林 | 核心工具 | Athey、Wager 等人官方文档中译：因果森林、工具变量森林、IV/DR-learner、策略学习、生存森林、Qini 曲线 |
| **policytree** 策略树 | 核心工具 | 从因果森林学到的最优策略树，连续处理与多行动设定 |
| **SURE / QRF** 充分表示 | 核心工具 | 分类变量的充分表示与充分独立比率（arXiv:1908.09874 中译） |
| **maq** 多臂 Qini | 核心工具 | 预算约束下的多臂策略评估：最优分配路径与 Qini 曲线（官方文档中译） |
| **解释因果森林** | 拓展教程 | Michael Mayer 博文中译：因果森林 + 可解释性机器学习完整实践（变量重要性、PDP、Friedman H、SHAP） |

合计 **21 个页面、155 个小节**。核心工具四者构成从「估计效应」到「据此决策」再到「评估决策价值」的完整链条；拓展教程组收录因果森林生态中的高质量第三方实践文章。

## 📦 配套技能（WorkBuddy Skill）

本仓库同时提供一个可直接安装的 WorkBuddy 技能 **`causal-forest-skill`**，把上述方法论蒸馏成 agent 可调用的实操能力（7 张 RIA++ 能力卡，含可直接运行的真实 R 代码与在线教程链接）。

- 技能目录：`skills/causal-forest-skill/`（`SKILL.md` + `DIGEST.md` + `INSTALL.md`）
- 安装方式：见 [`skills/causal-forest-skill/INSTALL.md`](skills/causal-forest-skill/INSTALL.md)（软链或复制目录到 `~/.workbuddy/skills/`）
- 能力覆盖：C01 用 `causal_forest` 估 CATE/HTE · C02 `rank_average_treatment_effect` 评估 HTE · C03 `causal_survival_forest` 生存森林 · C04 `policytree` 政策学习 · C05 `multi_arm_causal_forest`+`maq` 多臂分配 · C06 PDP/Friedman H/Kernel SHAP 解释森林 · C07 高基数分类变量充分表示

## 检索

- **全局搜索**：首页搜索框或按 `/` 聚焦，检索全部 5 个库的文字内容（不含代码块，避免噪声）
- **站内搜索**：每个库顶栏亦有独立搜索框，只检索本库内容
- 多关键词用空格分隔，按「同时包含」匹配；`↑` `↓` 选择、`Enter` 跳转、`Esc` 清空
- 搜索结果可精确定位到章节内的小节
- 结果页链接可分享，如 `search.html?q=交叉验证`

## 目录结构

```
<lib>/            每个库一个目录
  index.html        库首页
  search.html       库内搜索结果页
  search.js         搜索脚本（根目录与各库共用同一份）
  search_index.json 该库的索引
  <内容页>.html      译文页面
  assets|figures/   图片资源
index.html        知识库首页
search.html       全局搜索结果页
search_index.json 全局索引（合并全部库）
_tools/           构建脚本（不部署）
```

## 构建

```bash
python _tools/build_hub.py       # 生成首页、全局搜索页与全局索引
python _tools/inject_nav.py      # 向各库页面注入统一导航
```

各库自身的索引由 `C:/WorkBuddy/share/_tools/add_search.py` 生成（该脚本同时负责注入各库搜索框与锚点）。

## 许可与声明

本库为**非官方中文译本**，仅供学习交流。原文版权归各作者与出版方所有；代码与公式保持原样，译文新增内容以「背景与解释（译者注）」框标出。
