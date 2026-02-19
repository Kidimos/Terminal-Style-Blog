#!/bin/bash

# 获取脚本所在目录的上级目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# 定义模板文件和目标目录
TEMPLATE="$PROJECT_ROOT/scaffolds/post.md"
POSTS_DIR="$PROJECT_ROOT/post"

# 如果模板不存在，则创建一个默认模板
if [ ! -f "$TEMPLATE" ]; then
  mkdir -p "$PROJECT_ROOT/scaffolds"
  cat > "$TEMPLATE" << 'EOF'
---
title: "{{title}}"
date: {{date}}
category: Other
section: General
summary: "在此输入文章摘要"
tags: []
---

# {{title}}

开始写作...
EOF
  echo "已创建默认模板: $TEMPLATE"
fi

# 确保文章目录存在
mkdir -p "$POSTS_DIR"

# 处理命令行参数
if [ $# -ge 1 ]; then
  # 使用第一个参数作为标题（可以包含空格，需用引号包围）
  title="$1"
else
  # 交互式输入
  read -p "请输入文章标题: " title
fi

if [ -z "$title" ]; then
  echo "标题不能为空，操作取消。"
  exit 1
fi

# 清理标题中的非法字符，使其适合作为文件名
# 替换 / 为 -，去除首尾空格
clean_title=$(echo "$title" | sed 's/\//-/g' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
filename="${clean_title}.md"
filepath="$POSTS_DIR/$filename"

# 检查文件是否已存在
if [ -f "$filepath" ]; then
  echo "错误：文件 $filename 已存在。"
  exit 1
fi

# 获取当前日期（YYYY-MM-DD）
date=$(date +%Y-%m-%d)

# 读取模板并替换占位符
content=$(cat "$TEMPLATE")
content="${content//"{{title}}"/$title}"      # frontmatter 中的 title 保留原始标题
content="${content//"{{date}}"/$date}"

# 写入文件
echo "$content" > "$filepath"

echo "✅ 文章已创建：$filepath"
