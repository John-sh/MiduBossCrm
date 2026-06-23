#!/bin/bash

# 本地打包脚本 - 用于生成可以在本地直接打开的版本

echo "开始构建本地版本..."

# 构建项目（使用相对路径）
VITE_BASE_URL='./' npm run build

# 检查构建是否成功
if [ -d "dist" ]; then
    echo ""
    echo "✅ 构建成功！"
    echo ""
    echo "📦 打包文件位置: dist/"
    echo ""
    echo "📋 使用方法："
    echo ""
    echo "方法1 - Python 服务器（推荐）:"
    echo "  cd dist"
    echo "  python -m http.server 8080"
    echo "  然后打开浏览器访问: http://localhost:8080"
    echo ""
    echo "方法2 - Node.js serve:"
    echo "  npm install -g serve"
    echo "  cd dist"
    echo "  serve -s . -l 8080"
    echo "  然后打开浏览器访问: http://localhost:8080"
    echo ""
    echo "方法3 - VS Code Live Server:"
    echo "  在 VS Code 中打开 dist 文件夹"
    echo "  右键 index.html -> Open with Live Server"
    echo ""
else
    echo "❌ 构建失败"
    exit 1
fi