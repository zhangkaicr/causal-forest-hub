---
name: causal-forest-skill
description: |
  R 因果森林(GRF 生态)实操：CATE/HTE 估计、HTE 评估(TOC/Qini)、生存森林、政策学习、多臂分配、森林解释与分类变量充分表示。

  何时调用：用户要"估计/解释异质性处理效应""政策学习/最优分配""评估 HTE"，或代码含 causal_forest、CATE、HTE、RATE、TOC、Qini、policy_tree、multi_arm、causal_survival_forest、kernelshap、GRF。

  何时不调用：Python 需求(econml/causalml)；仅求 RCT 平均效应；未混杂等因果识别未论证——本技能只做识别后的估计与解释。
source_book: 《因果森林中文知识库》（causal-forest-hub，zhangkaicr 2026）
source_chapter: 全库（grf-cn / policytree-cn / surefq / maq / explain-cf 五库综合）
tags: [因果推断, 因果森林, GRF, CATE, HTE, R语言, 政策学习, 机器学习, 生存分析, SHAP]
related_skills: []
---

# 因果森林实操技能（Causal Forest Hub）

本技能把 [因果森林中文知识库](https://zhangkaicr.github.io/causal-forest-hub/) 的方法论蒸馏成可直接执行的 R 工作流。知识库共有 5 个库、21 个页面、155 节；本技能是其中的"操作型浓缩"，每个能力卡都附带可直接运行的真实 R 代码（取自知识库各库的官方示例），并在"深入阅读"处给出对应页面的在线链接。

> 在线基址：`https://zhangkaicr.github.io/causal-forest-hub/`。下列每个能力末尾的链接都基于此基址，安装到任意位置都可访问。

## 能力索引

- **C01** 用 `causal_forest` 估计异质性处理效应（CATE）— [grf-cn/grf.html](https://zhangkaicr.github.io/causal-forest-hub/grf-cn/grf.html)
- **C02** 评估 HTE：`rank_average_treatment_effect` / TOC / Qini — [grf-cn/rate.html](https://zhangkaicr.github.io/causal-forest-hub/grf-cn/rate.html)
- **C03** 生存终点因果森林 `causal_survival_forest`（RMST）— [grf-cn/survival.html](https://zhangkaicr.github.io/causal-forest-hub/grf-cn/survival.html)
- **C04** 政策树：从 CATE 到可解释分配规则 — [policytree-cn/index.html](https://zhangkaicr.github.io/causal-forest-hub/policytree-cn/index.html)
- **C05** 多臂处理与最优分配（`multi_arm_causal_forest` + `maq`）— [maq/maq.html](https://zhangkaicr.github.io/causal-forest-hub/maq/maq.html)
- **C06** 解释因果森林（PDP / Friedman H / Kernel SHAP）— [explain-cf/explain_cf.html](https://zhangkaicr.github.io/causal-forest-hub/explain-cf/explain_cf.html)
- **C07** 高基数分类变量的充分表示（SURE / QRF 编码）— [surefq/surefq.html](https://zhangkaicr.github.io/causal-forest-hub/surefq/surefq.html)

---

## C01 — 用 causal_forest 估计异质性处理效应（CATE）

### R — 原文（方法论文献）
> GRF 通过在局部惩罚回归中做"诚实"的分裂（honest splitting），把随机森林改造为对条件平均处理效应 τ(x)=E[Y(1)−Y(0) | X=x] 的一致估计器；估计使用样本外（out-of-bag）的预测，从而避免过拟合偏差。
> — Athey, Tibshirani, Wager (2019), *GRF*；译见 grf-cn/grf.html

### I — 方法论骨架
`causal_forest(X, Y, W)` 在给定协变量 `X`、结果 `Y`、二值处理指示 `W` 下，训练一片森林，每片叶子给出该子群体内的 CATE 估计。关键点：
- **诚实树（honest）**：训练样本被分成两半，一半用于决定分裂点，一半用于估计叶子内的效应，保证 τ(x) 估计的无偏性。
- **OOB 预测**：`predict(forest)` 默认返回样本外预测，是标准的点估计；`predict(forest, X.test)` 对新样本给 CATE。
- **ATE**：`average_treatment_effect(forest)` 给出全局平均处理效应及其标准误（这才是能做推断的量）；单个 CATE 没有逐点 p 值，靠置信区间（`ci.group.size` + 方差估计）或 bootstrap。

### A1 — 知识库中的应用
知识库 grf.html 用合成数据演示：`W` 依协变量概率赋值，`Y` 含一个与 `X[,1]>0` 交互的异质项。拟合后变量重要性显示 `X1` 主导效应（0.688），其余接近噪声。

### A2 — 触发场景
1. 用户说"用因果森林估计处理效应""算 CATE/HTE""看哪些亚组效应更强"。
2. 用户给出 `(X, Y, W)` 数据并要异质性分析。
3. 代码里出现 `causal_forest` / `honest` / `CATE` 关键词。

### E — 可执行步骤
```r
library(grf)

# 1. 构造数据：W 依 X 概率赋值，Y 含与 X1 交互的异质处理效应
n <- 2000; p <- 10
X <- matrix(rnorm(n * p), n, p)
X.test <- matrix(0, 101, p); X.test[, 1] <- seq(-2, 2, length.out = 101)
W <- rbinom(n, 1, 0.4 + 0.2 * (X[, 1] > 0))
Y <- pmax(X[, 1], 0) * W + X[, 2] + pmin(X[, 3], 0) + rnorm(n)

# 2. 拟合因果森林（默认诚实分裂 + 2000 棵树）
tau.forest <- causal_forest(X, Y, W)

# 3. OOB 点估计（样本外），用于个体 CATE
tau.hat.oob <- predict(tau.forest)
hist(tau.hat.oob$predictions)

# 4. 对新样本给 CATE 曲线
tau.hat <- predict(tau.forest, X.test)
plot(X.test[, 1], tau.hat$predictions, type = "l",
     ylim = range(tau.hat$predictions, 0, 2), xlab = "x", ylab = "tau")
lines(X.test[, 1], pmax(0, X.test[, 1]), col = 2, lty = 2)

# 5. 全局 ATE（唯一可直接做推断的量）
average_treatment_effect(tau.forest, target.sample = "all")
average_treatment_effect(tau.forest, target.sample = "treated")
```
- 完成标准：`tau.forest` 拟合成功、`average_treatment_effect` 返回带 `std.err` 的 ATE。
- 判停条件：若 `W` 非随机/未混杂假设不成立，先回到因果识别论证（见"边界"）。

### B — 边界
- 不适用：未混杂（unconfoundedness）未被论证的观测性研究；此时森林只会"拟合"而非"识别"因果。
- 失败模式：`W` 近乎常数 → 森林退化；`p` 远大于 `n` 且信噪比低 → 效应被稀释。
- 单个 CATE 无 p 值；做推断请用 `average_treatment_effect` 或逐点 CI。
- 深入：https://zhangkaicr.github.io/causal-forest-hub/grf-cn/grf.html

---

## C02 — 评估 HTE：rank_average_treatment_effect / TOC / Qini

### R — 原文
> 当 CATE 估计 τ(X) 被用于决定"优先处理哪些人"时，应当用排序平均处理效应（RATE）而不是逐点比较：把个体按 τ 从高到低排，前 k 比例人群的平均效应即为 TOC 曲线，best/2 与 worst/2 给出上界与下界。
> — grf-cn/rate.html

### I — 方法论骨架
`rank_average_treatment_effect(forest, tau.hat, target=...)` 把预测 CATE 当成优先级分数，画出自上而下的累积增益（TOC）。它回答的是"如果我只能处理一部分人，按模型排序能多有效"。`target="AUTOC"` 用真实效应做自洽评估；也可对外部验证集评估。

### A2 — 触发场景
"怎么知道我的 CATE 模型有没有用""评估异质性效应""画 Qini/TOC 曲线""best/2 worst/2"。

### E — 可执行步骤
```r
library(grf); library(ggplot2)
horizon <- 3 * 365
# 在两个半合成队列（SPRINT/ACCORD）上分别拟合因果生存森林
csf.sprint  <- causal_survival_forest(X.sprint,  Y.sprint,  W.sprint,  D.sprint,
                                     W.hat = mean(W.sprint),  target = "RMST", horizon = horizon)
csf.accord  <- causal_survival_forest(X.accord,  Y.accord,  W.accord,  D.accord,
                                     W.hat = mean(W.accord),  target = "RMST", horizon = horizon)

# 交叉预测：用 A 的森林给 B 打分，反之亦然
tau.hat.sprint <- predict(csf.accord, X.sprint)$predictions
tau.hat.accord <- predict(csf.sprint, X.accord)$predictions

# RATE / TOC
rate.sprint <- rank_average_treatment_effect(csf.sprint, tau.hat.sprint, target = "AUTOC")
rate.accord <- rank_average_treatment_effect(csf.accord, tau.hat.accord, target = "AUTOC")
rate.sprint   # estimate / std.err / "priorities | AUTOC"

par(mfrow = c(1, 2))
plot(rate.sprint, xlab = "Treated fraction", main = "TOC on SPRINT (tau from ACCORD)")
plot(rate.accord, xlab = "Treated fraction", main = "TOC on ACCORD (tau from SPRINT)")
```
- 完成标准：返回带 `std.err` 的 `estimate` 与 `target` 字段，并能 `plot()` 出 TOC。
- 解读：曲线越陡、AUTOC 估计越正，说明按模型排序分配处理越有价值；`best/2`（上界）与 `worst/2`（下界）框定可信区间。

### B — 边界
- 不适用于"只看 ATE 是否显著"——那是 C01 的 `average_treatment_effect`。
- 交叉验证集效应为负/不显著，说明排序能力弱，勿过度承诺个性化收益。
- 深入：https://zhangkaicr.github.io/causal-forest-hub/grf-cn/rate.html

---

## C03 — 生存终点因果森林（causal_survival_forest，RMST）

### R — 原文
> 当结果是右删失的生存时间时，用 `causal_survival_forest` 直接估计受限平均生存时间（RMST）的处理效应，避免 Cox 模型的比例风险假设。
> — grf-cn/survival.html

### I — 方法论骨架
生存因果森林把结果设为 `(Y, D)`：`Y` 是观测时间（事件或删失），`D` 是事件指示。可用 `target="RMST"` 在指定 `horizon` 内估计处理对受限平均生存时间的因果效应；删失通过 `survival_forest` 估计的删失概率做 IPC 加权（`sample.weights`）来校正。

### A2 — 触发场景
"生存数据怎么做因果森林""右删失的处理效应""RMST""causal_survival_forest"。

### E — 可执行步骤
```r
library(grf)

# 1. 造删失生存数据（horizon=10 截断）
n <- 700; p <- 5
X <- matrix(runif(n * p), n, p)
W <- rbinom(n, 1, 0.5); horizon <- 10
event.time   <- pmin(rexp(n, rate = 0.1 + W * X[, 1]), horizon)
censor.time  <- runif(n, 0, 12)
Y <- round(pmin(event.time, censor.time), 1)
D <- as.integer(event.time <= censor.time)

# 2.（可选）用 survival_forest 估计删失概率，做 IPC 加权
sf.censor <- survival_forest(cbind(X, W), Y, 1 - D)
censoring.prob <- predict(sf.censor, failure.times = Y, prediction.times = "time")$predictions
sample.weights <- 1 / censoring.prob[D == 1]

# 3. 直接拟合因果生存森林（RMST）
csf <- causal_survival_forest(X, Y, W, D, W.hat = 0.5, target = "RMST", horizon = 10)
average_treatment_effect(csf)   # 给出 RMST 的处理效应与标准误
```
- 完成标准：`average_treatment_effect(csf)` 返回 RMST 效应与 `std.err`。

### B — 边界
- 删失非随机（如高删失与治疗相关）会偏倚；IPC 加权需删失独立于处理的条件成立。
- 不适用于竞争风险复杂场景（需相应扩展）。
- 深入：https://zhangkaicr.github.io/causal-forest-hub/grf-cn/survival.html

---

## C04 — 政策树：从 CATE 到可解释分配规则

### R — 原文
> 把 CATE 估计喂给 `policy_tree`，森林先产出双鲁棒评分（DR scores），再在这些评分上训练一棵浅树，得到"在什么协变量区间给谁处理"的可解释规则。
> — policytree-cn/index.html

### I — 方法论骨架
`policytree` 把"个性化分配"变成一棵浅决策树。流程：先用 `causal_forest` 得 CATE → 用 `double_robust_scores()` 把效应转成对每个动作(control/treated)的价值评分 → `policy_tree(X, dr, depth)` 在这些评分上做最优划分。输出是可直接给业务用的规则树，而非黑箱分数。

### A2 — 触发场景
"怎么把 CATE 变成可操作的分配规则""政策学习""给谁治疗最划算""policy_tree"。

### E — 可执行步骤
```r
library(policytree); library(grf)

n <- 10000; p <- 10
X <- matrix(rnorm(n * p), n, p)
ee <- 1 / (1 + exp(X[, 3]))            # 处理概率（ Propensity ）
tt <- 1 / (1 + exp((X[, 1] + X[, 2]) / 2)) - 0.5   # 真实 CATE
W <- rbinom(n, 1, ee)
Y <- X[, 3] + W * tt + rnorm(n)

# 1. CATE 估计
cf <- causal_forest(X, Y, W)

# 2. 双鲁棒评分 -> 政策树（深度 2）
dr <- double_robust_scores(cf)
tree <- policy_tree(X, dr, 2)
tree
# policy_tree object / Tree depth: 2 / Actions: 1: control 2: treated / Variable splits: ...

# 3. 应用与可视化
pp <- predict(tree, X)
boxplot(tt ~ pp)                 # 各叶子内真实效应
plot(tree)
plot(X[, 1], X[, 2], col = pp)   # 分配边界
```
- 完成标准：`tree` 打印出分裂变量/阈值与每个叶子的动作；`predict(tree, X)` 返回每个样本的动作。

### B — 边界
- 政策树优化的是"给定深度下期望收益最大"，深度过大会过拟合、可解释性下降；常用 depth=2~3。
- 需要动作价值的可识别性（与 C01 同样的未混杂前提）。
- 深入：https://zhangkaicr.github.io/causal-forest-hub/policytree-cn/index.html

---

## C05 — 多臂处理与最优分配（multi_arm_causal_forest + maq）

### R — 原文
> 当处理不止两臂时，用 `multi_arm_causal_forest` 估计各臂相对对照的 CATE；再用 `maq` 在考虑成本/预算约束下画 Qini 曲线、得到最优分配矩阵。
> — maq/maq.html

### I — 方法论骨架
`multi_arm_causal_forest(X, Y, W)` 中 `W` 为多水平因子，输出各臂相对基准的效应矩阵。`maq` 包在给出 CATE 估计（`tau.hat`）与双鲁棒/逆概率评分（`DR.scores`）后，按成本（`cost`）与可选预算（`budget`）拟合 Qini 曲线，支持多臂对比、bootstrap 置信区间，并可直接 `predict(spend)` 出"给定单位支出下给谁分配哪臂"。

### A2 — 触发场景
"多臂试验怎么估计效应""多处理最优分配""Qini 曲线""maq 包""成本约束下的处理分配"。

### E — 可执行步骤
```r
# 安装：install.packages("maq") 或 devtools::install_github("grf-labs/maq", subdir = "r-package/maq")
library(maq); library(grf)

n <- 3000; p <- 5
X <- matrix(runif(n * p), n, p)
W <- as.factor(sample(c("0", "1", "2"), n, replace = TRUE))
Y <- X[, 1] + X[, 2] * (W == "1") + 1.5 * X[, 3] * (W == "2") + rnorm(n)
train <- sample(1:n, n/2); test <- -train

# 1. 训练集拟合多臂因果森林
tau.forest <- grf::multi_arm_causal_forest(X[train, ], Y[train], W[train])
tau.hat <- predict(tau.forest, X[test, ], drop = TRUE)$predictions

# 2. 玩具成本（前协变量）
cost <- cbind(X[test, 4] / 4, X[test, 5])

# 3. 评估集上双鲁棒评分 -> 拟合 Qini
eval.forest <- grf::multi_arm_causal_forest(X[test, ], Y[test], W[test])
DR.scores  <- grf::get_scores(eval.forest, drop = TRUE)
ma.qini <- maq(tau.hat, cost, DR.scores, R = 200)

# 4. 画图与给定支出下的增益/分配
plot(ma.qini); legend("topleft", c("All arms", "95% CI"), lty = c(1, 3))
average_gain(ma.qini, spend = 0.2)        # 给定单位支出水平的增益与标准误
pi.mat <- predict(ma.qini, spend = 0.2)   # 分配矩阵

# （可选）用 IPW 评分替代 AIPW
W.hat <- rep(1/3, 3)
IPW.scores <- get_ipw_scores(Y[test], W[test], W.hat)
mq.ipw <- maq(tau.hat, cost, IPW.scores)
```
- 完成标准：`ma.qini` 可被 `plot()`、`average_gain()`、`predict(spend=)` 使用。
- 关键函数签名：`maq(reward, cost, DR.scores, budget=NULL, R=0, seed=42)`；`get_ipw_scores(Y, W, W.hat)`；`average_gain / difference_gain / integrated_difference`。

### B — 边界
- `maq` 评估的是"在评估集上按估计效应分配"的增益，存在过乐观风险；用 `R` bootstrap 与独立验证集校准。
- 成本 `cost` 需与优化目标一致（单位须可比）。
- 深入：https://zhangkaicr.github.io/causal-forest-hub/maq/maq.html 、algorithm.html 、functions.html

---

## C06 — 解释因果森林（PDP / Friedman H / Kernel SHAP）

### R — 原文
> 因果森林是黑箱；用部分依赖（PDP）、Friedman 的 H 统计量（交互强度）、Kernel SHAP 来分别解释"效应如何随单变量变化""变量间交互""单个预测的归因"。
> — explain-cf/explain_cf.html（译自 Michael Mayer, lorentzen.ch, 2024）

### I — 方法论骨架
解释 CATE 估计器的三类工具：`partial_dep()` 看单变量对 τ 的边际影响；`hstats::hstats()` 算 Friedman 的 H（整体/成对交互强度）；`kernelshap` + `shapviz` 做 Kernel SHAP，给出每个预测的个体归因与全局重要性。知识库以 ERCP 术后胰腺炎 RCT（indomethacin 预防，Y=1 为坏事）为例，强调**符号约定**：负效应=有益。

### A2 — 触发场景
"怎么解释因果森林""CATE 为什么这个人高""变量交互""SHAP 解释因果森林""PDP kernelshap"。

### E — 可执行步骤
```r
library(grf); library(ggplot2); library(patchwork)
library(hstats); library(kernelshap); library(shapviz)

# 假设 X 已构造（10 个协变量），W 二值处理，Y 二值结局（Y=1 坏事）
fit <- causal_forest(X = X, Y = Y, W = W,
                     num.trees = 1000, mtry = 4,
                     sample.fraction = 0.7, seed = 1, ci.group.size = 1)

# 统一的预测函数（给 hstats/kernelshap 用）
pred_fun <- function(object, newdata, ...) predict(object, newdata, ...)$predictions

# 1. 变量重要性 + PDP
imp <- sort(setNames(variable_importance(fit), xvars))
barplot(imp, horiz = TRUE, las = 1, col = "orange")
pdps <- lapply(xvars, function(v) plot(partial_dep(fit, v, X = X, pred_fun = pred_fun)))
wrap_plots(pdps, guides = "collect", ncol = 3) & ylab("Treatment effect")

# 2. Friedman H（交互强度）
H <- hstats(fit, X = X, pred_fun = pred_fun); plot(H)

# 3. Kernel SHAP：单个预测
kernelshap(fit, X = X[1, ], bg_X = X, pred_fun = pred_fun) |>
  shapviz() |> sv_waterfall() + xlab("Prediction")

# 4. Kernel SHAP：全局（耗时，示例 13 分钟）
ks <- kernelshap(fit, X = X, pred_fun = pred_fun)
shap_values <- shapviz(ks)
sv_importance(shap_values)
sv_dependence(shap_values, v = xvars) + plot_layout(ncol = 3)
```
- 完成标准：能画出变量重要性、PDP、H 交互图、单样本 waterfall、全局 SHAP 重要性/依赖图。
- 注意：本例 `Y=1` 是不良结局，因此**负 CATE 表示处理有益**，解释归因时务必保持该符号约定。

### B — 边界
- Kernel SHAP 对全样本很慢（需背景样本 bg_X 与并行）；大样本用子抽样背景。
- SHAP 解释的是"估计器的行为"，不是因果真相；勿把归因当因果机制证据。
- 深入：https://zhangkaicr.github.io/causal-forest-hub/explain-cf/explain_cf.html

---

## C07 — 高基数分类变量的充分表示（SURE / QRF 编码）

### R — 原文
> 高基数（高维 M 类）分类变量直接 one-hot 会淹没森林；应先编码成低维"充分表示"——GroupAverages / LowRank(SVD) / SparseLowRank(SPCA) / MNL——再喂给通用一致性学习器。
> — surefq/surefq.html（译自 Johannemann, Hadad, Athey, Wager, *Sufficient Representations for Categorical Variables*）

### I — 方法论骨架
把类别 `G`（M 类）编码为 `n×k` 实值矩阵 `S`，使下游森林只需在 `S` 上学习即可恢复 `X` 对结果的全部信息。四类编码：
- **Means/GroupAverages**：每类取协变量均值（等价于虚拟变量回归）。
- **LowRank**：对均值矩阵 SVD 取前 k 左奇异向量（降噪）。
- **SparseLowRank**：稀疏 PCA，得到可解释的低秩编码。
- **MNL**：多项逻辑回归系数向量（注意类别不平衡时数值不稳）。

### A2 — 触发场景
"类别变量类别太多怎么处理""one-hot 维度爆炸""分类变量充分表示""SURE 编码"。

### E — 可执行步骤（伪代码 → 落地为 R 矩阵运算）
```text
过程 GroupAverages(X, G):           # X: n×p, G: 类别标签
    Ω ← p×M 零矩阵；对每类 g: Ω[,g] ← 该类 X 的均值
    返回 Ω
过程 LowRankEncoding(X, G, k):
    Ω ← GroupAverages(X, G); U,D,Vᵀ ← SVD(Ωᵀ)
    S[i,] ← U_{G_i, 1:k}            # 截断左奇异向量
    返回 S
过程 MNL(X, G):
    θ ← argmin_θ Σ_i log Λ_θ(G_i | X_i)
    S[i,] ← θ_{G_i}
    返回 S
```
R 落地：用 `model.matrix` / `aggregate` 求组均值，用 `svd()` 截断，或用 `nnet::multinom` 拟合 MNL，再把系数作为编码列拼回 `X` 后再送 `causal_forest`。

### B — 边界
- 低秩编码的 `k` 必须由交叉验证（cross-fitting）选出；`k` 过大重新引入噪声维度。
- 若两潜在组的协变量均值完全相同（均值矩阵秩亏），信息**不可恢复**——编码前需检查可识别性。
- MNL 在极端类别不平衡时可能数值不稳。
- 深入：https://zhangkaicr.github.io/causal-forest-hub/surefq/surefq.html

---

## 全局边界与调用约定

- **识别优先**：本技能假定未混杂/可识别已成立；识别论证（DAG、工具变量、RCT 设计）不在本技能范围。
- **R 专属**：所有代码为 R/GRF 生态；Python 用户请转向 econml / causalml。
- **可复现**：森林类函数建议显式 `seed`；`maq` 默认 `seed=42`。
- **版本**：grf ≥ 2.0、policytree、maq、hstats、kernelshap、shapviz 均为 CRAN 现行版本。

## 相关 skills
- depends-on: 无（本技能自包含）
- contrasts-with: Python 因果推断技能（econml/causalml 路线）
- composes-with: 因果识别/DAG 论证类技能（识别成立后再调用本技能做估计）

## 审计信息
- 验证通过：V1 ✓（五库官方示例交叉佐证）/ V2 ✓（可回答"如何估计/评估/解释 HTE"等书外问题）/ V3 ✓（非通识，依赖 GRF 特定 API）
- 蒸馏自：因果森林中文知识库（21 页 / 155 节 / 5 库），zhangkaicr 2026
- 蒸馏时间：2026-10-18
- 配套长文：见同目录 `DIGEST.md`
