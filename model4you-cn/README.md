# model4you：个体化治疗效应估计的 R 包（中文译本）

[`index.html`](index.html) 是 *Journal of Open Research Software* 文章 **《model4you: An R Package for Personalised Treatment Effect Estimation》** 的中文译本。

| 项目 | 信息 |
|---|---|
| 原文作者 | Heidi Seibold、Achim Zeileis、Torsten Hothorn |
| 期刊 | Journal of Open Research Software, 2019, 7(1): 17 |
| DOI | [10.5334/jors.219](https://doi.org/10.5334/jors.219) |
| 原文地址 | https://openresearchsoftware.metajnl.com/articles/10.5334/jors.219 |
| 文章许可 | CC BY 4.0（软件 model4you 为 GPL-2\|GPL-3） |
| 软件 | CRAN `model4you` 0.9-3，依赖 `partykit` ≥ 1.2 |

## 它解决什么问题

常规模型估计治疗效应时，假定**截距和治疗效应对所有人相同**。model4you 让你直接拿熟悉的那个回归模型（`lm` / `glm` / `survreg` / `coxph`）当基础，然后给两条升级路径：

- **分层**：`pmtree()` —— 基于模型的递归分割，找出参数不稳定的变量，把人群分成若干亚组，每组一套参数
- **个体化**：`pmforest()` + `pmodel()` —— 用模型森林估计个体间相似度，再据此给每个人拟合专属模型

## 页面里的示例很值得看

奥地利因斯布鲁克大学的数学考试数据：两个考场（试题略有差异），**总体上第二组只低 2.33 个百分点、置信区间跨 0**，看起来"没有差别"。但模型树切出来后，在线测试正确率 > 92.3% 的那批学生，效应是 **−13.26 个百分点**。

这正是 HTE 教学最好的例子：一个"总体不显著"的结论，掩盖了某个真实存在的亚组效应。文中也给出了两处重要提醒：学生是自选进入考场的（可能自带混淆），树中置信区间**未校正切点选择**，只能当变异性度量、不能用于推断。

## 内容结构

摘要 → 概述（引言 / 数学考试示例 / 模型树 / 个体化模型）→ 实现与架构 → 质量控制 → 可用性（表格）→ 复用潜力 → 参考文献 → 附录（函数速查 + 术语英中对照）。

所有 R 代码与输出保持原文形式；原站把代码中的引号渲染成了弯引号，页面已还原为可执行的 ASCII 引号，可直接复制运行（种子 `set.seed(2017)`）。

## 文件说明

```
index.html            中文译本（单页，支持明暗主题切换）
assets/fig1-4.png     原文示例输出图
```

## 许可

原文依 CC BY 4.0 授权，本译文据此翻译并发布，已注明作者、出处与许可；软件本身为 GPL-2|GPL-3。
