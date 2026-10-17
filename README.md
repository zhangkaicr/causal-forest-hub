# 因果森林知识库

**GRF Labs 官方工具的完整中文译本**——因果森林（grf）、策略树（policytree）与分类变量的充分表示（SURE / QRF）。

- **在线地址**：https://zhangkaicr.github.io/causal-forest-hub/
- **原文来源**：[grf-labs.github.io](https://grf-labs.github.io/)、[arXiv:1908.09874](https://arxiv.org/abs/1908.09874)

## 收录内容（3 个核心工具库）

| 库 | 说明 |
|---|---|
| **grf** 广义随机森林 | Athey、Wager 等人官方文档中译：因果森林、工具变量森林、IV/DR-learner、策略学习、生存森林、Qini 曲线 |
| **policytree** 策略树 | 从因果森林学到的最优策略树，连续处理与多行动设定 |
| **SURE / QRF** 充分表示 | 分类变量的充分表示与充分独立比率（arXiv:1908.09874 中译） |

合计 **15 个页面、116 个小节**。三者构成从「估计效应」到「据此决策」的完整链条。

> 想了解 R 生态中的其他 HTE 方法（tidyhte、Meta-Learner、evalITR、survlearners 等）与方法学专题（BOCF、HTE 公开课讲义、因果推断三件工具、时间序列缺失填补），请前往 **[share 教程库](https://zhangkaicr.github.io/share/)**。

## 检索

- **全局搜索**：首页搜索框或按 `/` 聚焦，检索全部 3 个库的文字内容（不含代码块，避免噪声）
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
