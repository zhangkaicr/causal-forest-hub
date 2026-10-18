# 因果森林实操长文（DIGEST）

> 配套技能 `causal-forest-skill` 的人类可读精华版。想把因果森林（GRF 生态）真正用起来，读这一篇就够了；需要逐行代码与配图请回到 [因果森林中文知识库](https://zhangkaicr.github.io/causal-forest-hub/)。

## 一、你到底在解决什么问题

随机对照试验（RCT）只告诉你"平均而言处理有没有效"。但真实世界里，**处理对谁更有效**才是医生、运营、政策制定的真正决策点。这部分被称为异质性处理效应（HTE）或条件平均处理效应 CATE：τ(x) = E[Y(1)−Y(0) | X=x]。

因果森林（Generalized Random Forests, GRF）是估计 CATE 最成熟的工具之一，它把 Breiman 随机森林改造为对 τ(x) 一致的估计器——核心是**诚实树（honest splitting）**：把样本劈成两半，一半决定怎么分裂，一半估计叶子内的效应，从而消除"用同批数据既选特征又估计"带来的偏差。

## 二、五件事，一条流水线

把整个知识库压成一条可操作的主线：

1. **估计 CATE** — `causal_forest(X, Y, W)`。喂入协变量 `X`、结果 `Y`、二值处理 `W`，得到每片叶子的效应估计。`predict()` 给个体 CATE，`average_treatment_effect()` 给全局 ATE（**唯一能直接做推断的量**，带标准误）。
2. **评估 HTE 有没有用** — `rank_average_treatment_effect()`。把个体按 CATE 从高到低排，画 TOC/Qini 曲线，回答"如果只能处理一部分人，按模型排序能多有效"。`best/2` 与 `worst/2` 框定上下界。
3. **生存终点** — `causal_survival_forest(..., target="RMST", horizon=)`。结果右删失时直接估计受限平均生存时间的处理效应，避开 Cox 比例风险假设；删失用 IPC 加权校正。
4. **变成可执行的分配规则** — `policytree`。CATE 是黑箱分数，政策树先转双鲁棒评分（`double_robust_scores`），再在这些评分上训练一棵浅树，输出"什么协变量区间给谁处理"的业务规则。
5. **多臂 + 成本约束** — `multi_arm_causal_forest` + `maq`。多处理臂时估计各臂相对对照的效应；`maq` 在成本/预算约束下画多臂 Qini 曲线并直接给出最优分配矩阵。

## 三、黑箱也要解释得清

因果森林本身不可解释，但有三把钥匙：

- **部分依赖（PDP）**：看单变量如何边际地改变 τ。
- **Friedman 的 H 统计量**（`hstats`）：量化变量间交互强度，告诉你"效应是不是靠交互撑起来的"。
- **Kernel SHAP**（`kernelshap` + `shapviz`）：给单个预测的归因与全局重要性。

**符号约定的坑**：在知识库的 ERCP 胰腺炎案例中，`Y=1` 是"发生胰腺炎"（坏事），所以**负的 CATE = 处理有益**。读 SHAP 归因图时务必带着这个符号，否则结论会完全反掉。

## 四、一个常被忽略的前置：分类变量怎么编码

高基数分类变量（比如上百个城市的 one-hot）会直接淹没森林。正确做法是先编码成低维"充分表示"再喂进去：组均值（Means）、低秩（SVD 截断）、稀疏低秩（SPCA）、多项逻辑回归（MNL）。但有两个硬约束：(1) 低秩维度 `k` 必须交叉验证选出，过大重新引入噪声；(2) 如果两组的协变量均值完全相同，信息**不可恢复**，编码前就要检查可识别性。

## 五、边界：什么情况下别用这套

- **识别没论证完，别上森林**。GRF 假设未混杂（unconfoundedness）成立；如果 DAG/工具变量/实验设计还没说清楚，森林只会"拟合"而非"识别"因果。
- **只关心平均效应**，不需要个性化——那用 `average_treatment_effect` 足矣，不用折腾 CATE。
- **Python 用户**请转向 `econml` / `causalml`，本技能是 R/GRF 专属。
- **单个 CATE 没有 p 值**；要做推断用 ATE 或逐点置信区间/bootstrap，别拿单个 τ 当显著。

## 六、一句话带走

因果森林不是"跑个森林"那么简单：先确认识别，再用 `causal_forest` 估计、用 `rank_average_treatment_effect` 评估、用 `policytree`/`maq` 落地分配，最后用 PDP/SHAP 把黑箱讲给人听。这条线串起来，HTE 才真正从论文走到决策桌。

---
*本长文由 `causal-forest-skill`（cangjie-skill v2.5 蒸馏）生成，蒸馏自因果森林中文知识库 zhangkaicr 2026。*
