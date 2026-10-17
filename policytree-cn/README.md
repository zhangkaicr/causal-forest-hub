# policytree 中文教程：从因果森林学到最优策略树

[`index.html`](index.html) 是 policytree 包官方 vignette **《policytree introduction》** 的中文译本（暗色主题）。

| 项目 | 信息 |
|---|---|
| 原文 | policytree introduction（policytree 1.2.5 官方 vignette） |
| 出处 | https://grf-labs.github.io/policytree/articles/policytree.html |
| 方法文献 | Zhou, Athey & Wager (2023)；Athey & Wager (2021) |
| 包作者 | Erik Sverdrup、Ayush Kanodia、Zhengyuan Zhou、Susan Athey、Stefan Wager |
| 依赖 | `policytree` + `grf` |

## 内容

- **示例 1**：二元处置 —— causal_forest → double_robust_scores → policy_tree → 留出集评估
- **示例 2**：三行动处置 —— multi_arm_causal_forest + CAIPWL 学习，并与真实最优区域对照
- **示例 3**：工具变量设定 —— instrumental_forest + double_robust_scores + 政策收益评估
- **运行时间**：复杂度 O(p^k·n^k·(log n + d) + pn log n) 的含义、`split.step` 与降基数的加速效果、实测基准表
- **混合搜索**：`hybrid_policy_tree` 的 `depth` vs `search.depth`，以及它与精确搜索的取舍
- **附录**：函数速查表 + 术语英中对照

## 这条流水线在做什么

```
数据 → grf 拟合森林 → double_robust_scores() 得到 Γ 矩阵
     → policy_tree(X, Γ, depth) 精确搜索 → 叶子给出行动 → predict() 部署到新样本
```

Γ[i, a] 是「第 i 个人若采取行动 a 的收益」估计，`policy_tree` 在此之上做<b>全局最优</b>的浅树（深度 2–3）搜索。所有 R 代码与输出保持原文形式，可直接复制运行。

## 文件说明

```
index.html            中文教程（单页，暗色主题）
assets/ptfig1-5.png   原文示例输出图
```

## 许可

原 vignette 版权归 policytree 包作者所有，本译文仅供学习交流，已注明原文出处与作者；译者补充的解释性说明与原作者无关。
