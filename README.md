# Terminal-Style-Blog

一个终端风格的博客系统，采用 React + TypeScript + Vite 构建，提供独特的命令行交互体验。
README由KIMI-K2.5自动生成

## 特性

- 终端仿真界面：模拟真实终端的操作体验
- 模块化命令系统：每个命令独立实现，易于扩展
- 多主题支持：4种预设主题（Matrix/Amber/Modern/Cyberpunk）
- Markdown支持：文章内容使用Markdown格式
- 响应式布局：适配桌面和移动设备

## 技术栈

- **框架**: React 19 + TypeScript 5
- **构建工具**: Vite 6
- **样式**: Tailwind CSS 4
- **Markdown**: react-markdown + remark-gfm
- **前置解析**: front-matter

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

## 项目结构

```
├── commands/          # 终端命令实现
├── components/        # React组件
├── constants/         # 常量定义
├── hooks/            # 自定义Hooks
├── post/             # Markdown文章
├── public/           # 静态资源
├── scaffolds/        # 文章模板
├── services/         # 数据服务
└── scripts/          # 脚本工具
```

## TODO List

### 高优先级

- [x] **前端HTML/CSS解耦** (必要)
  - 将组件HTML结构配置化，支持通过配置文件调整布局
  - 提取可复用的布局组件（如Grid、Flex容器）
  - 支持配置驱动的组件渲染顺序
  
- [x] **统一页面配置** (必要)
  - 将title、author、布局、组件显示/隐藏等配置集中到单个配置文件
  - 支持布局预设（如侧边栏位置、组件排列方式）
  - 支持通过配置启用/禁用特定功能模块

- [x] **文章搜索功能**
  - 实现`search [keyword]`命令
  - 支持标题、内容、标签搜索
  - 搜索结果高亮显示

- [x] **标签系统**
  - 扩展文章frontmatter支持tags字段
  - 新增`tags`命令显示所有标签
  - 支持按标签筛选文章

### 中优先级

- [ ] **命令自动补全**
  - Tab键补全命令名
  - 文件名/目录名自动补全
  - 提示建议列表

- [ ] **命令历史**
  - 上下箭头切换历史命令
  - 历史记录持久化
  - 支持历史搜索(Ctrl+R)

- [ ] **文章分页**
  - 当文章数量超过阈值时自动分页
  - `ls`命令支持分页显示
  - 分页导航命令

- [ ] **RSS订阅**
  - 生成RSS feed文件
  - 支持Atom格式
  - 自动更新feed

### 低优先级

- [ ] **音乐集成**
  - 进入时自动播放音乐
  - `music close` 和 `music open`控制音乐开关

- [ ] **评论系统集成**
  - 集成Giscus或类似服务
  - `comments [slug]`命令查看评论

- [ ] **访问统计**
  - 简单的PV/UV统计
  - 热门文章排行
  - 可视化图表

- [ ] **快捷键系统**
  - Ctrl+L清屏
  - Ctrl+T切换主题
  - 自定义快捷键绑定

- [ ] **终端音效**
  - 打字机声音效果
  - 命令执行音效
  - 可配置开关

- [ ] **多语言支持**
  - i18n国际化
  - 语言切换命令
  - 配置文件多语言

- [ ] **PWA支持**
  - Service Worker
  - 离线访问
  - 桌面快捷方式

- [ ] **文章导出**
  - 导出为PDF
  - 导出为Markdown
  - 批量导出

## 贡献指南

欢迎提交Issue和Pull Request。请确保：

1. 代码符合项目编码规范
2. 提交前运行测试
3. 更新相关文档

## 许可证

MIT License

---

**维护者**: KIDIMOS
**联系方式**: kidimosctl@gmail.com
