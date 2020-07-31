#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

git config user.name Merlin-Liu
git config user.email is_liuguangfu@163.com
git add .
git commit -m "update docs"
git push origin docs

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git config user.name Merlin-Liu
git config user.email is_liuguangfu@163.com
git add .
git commit -m 'deploy'

git push -f git@github.com:Merlin-Liu/Merlin-Liu.github.io.git master

cd -