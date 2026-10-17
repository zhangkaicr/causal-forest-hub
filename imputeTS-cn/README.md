# imputeTS：R 语言中的时间序列缺失值填补（中文译本）

[`index.html`](index.html) 是 The R Journal 2017 年文章 **《imputeTS: Time Series Missing Value Imputation in R》** 的中文全文翻译。

| 项目 | 信息 |
|---|---|
| 原文作者 | Steffen Moritz、Thomas Bartz-Beielstein（科隆应用技术大学） |
| 出处 | The R Journal, 2017, 9(1): 207–218 |
| DOI | [10.32614/RJ-2017-009](https://doi.org/10.32614/RJ-2017-009) |
| 原文地址 | https://journal.r-project.org/articles/RJ-2017-009/ |
| 许可 | CC BY 4.0（正文与图片） |

## 译文内容

- 摘要、引言、包概览（4 张功能总览表）、使用示例（7 张原图）、结论、致谢、参考文献
- 所有 R 代码、函数名、数据集名、输出结果**保留英文原文形式**，可直接复制运行
- 表格与图注已译为中文并补充译注；原文图 4、图 5 的图注把 `plotNA` 误作 `printNA`，译文中已标注说明

## 为什么值得读

多数主流填补方法（多重填补、EM、最近邻、热卡）依赖**变量之间的相关性**，而单变量时间序列只有一个属性，这些算法无法直接使用，必须转而利用**时间维度上的依赖**。imputeTS 是目前 CRAN 上唯一专攻该任务、且同时提供多种算法的包。

包的设计走完了一整条流程：`statsNA` 与 `plotNA.*` 先看缺失值分布 → 选一种算法填补 → `plotNA.imputations` 目视检查填补质量。文末对算法选择的经验法则很实用：

- 强季节性序列：`na.kalman`、`na.seadec` / `na.seasplit` 通常最优
- 多数序列：`na.kalman`、`na.interpolation`、`na.seadec` 三者之一最好
- `na.random`、`na.mean`、`na.locf` 在多数序列上准确度垫底

内置三对基准数据集（带缺失版 + 完整真实版），可直接用 RMSE / MAPE 横向比较算法；文中也提醒了只看单一短序列容易被"运气成分"误导。

## 文件说明

```
index.html            中文译本（单页）
assets/fig1-7.png     原文 Figure 1–7
```

## 许可与版权

原文正文与图片采用 **CC BY 4.0** 授权，本译文据此翻译并发布，已注明原作者、出处与许可条款。原作者保留原文著作权，本译文不主张任何权利。
