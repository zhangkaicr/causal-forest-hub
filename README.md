# 因果森林知识库

以 **GRF Labs** 的广义随机森林（generalized random forest）为核心，收录因果森林（causal forest）及其方法家族的中文文献与教程。

- **在线地址**：https://zhangkaicr.github.io/causal-forest-hub/
- **原文来源**：[grf-labs.github.io](https://grf-labs.github.io/)、[arXiv:1908.09874](https://arxiv.org/abs/1908.09874)

## 收录内容（13 个库）

| 分组 | 库 | 说明 |
|---|---|---|
| 核心工具 | **grf** 广义随机森林 | Athey、Wager 等人官方文档中译：因果森林、工具变量森林、IV/DR-learner、策略学习 |
| 核心工具 | **policytree** 策略树 | 从因果森林学到的最优策略树，连续处理与多行动设定 |
| 核心工具 | **SURE / QRF** 充分表示 | 分类变量的充分表示与充分独立比率（arXiv:1908.09874 中译） |
| R 方法库 | **tidyhte** | tidyverse 语法估计异质性处理效应 |
| R 方法库 | **Meta-Learner** | S/T/X/U/E 类元学习器系统综述 |
| R 方法库 | **model4you** | 个体化治疗反应效应估计 |
| R 方法库 | **evalITR** | 个体化治疗规则评估：Qini 曲线、AUUC、IPS |
| R 方法库 | **DeepLearningCausal** | 深度神经网络与集成学习估计处理效应 |
| R 方法库 | **survlearners** | 生存结局下的异质性处理效应 |
| 方法学专题 | **BOCF** | 基线观测结转：临床试验缺失数据处理 |
| 方法学专题 | **HTE 公开课讲义** | 《平均值的谎言：谁真正受益？》讲义 |
| 方法学专题 | **因果推断三件工具** | 贝叶斯网络、do-算符与反事实 |
| 方法学专题 | **imputeTS** | 时间序列缺失值填补 |

合计 **40 个页面、367 个小节**。

## 检索

- **全局搜索**：首页搜索框或按 `/` 聚焦，检索全部 13 个库的文字内容（不含代码块，避免噪声）
- **站内搜索**：每个库顶栏亦有独立搜索框，只检索本库内容
- 多关键词用空格分隔，按「同时包含」匹配；`↑` `↓` 选择、`Enter` 跳转、`Esc` 清空
- 搜索结果可精确定位到章节内的小节（锚点 327/327 全部匹配）
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
