'use strict';
const { execSync } = require('child_process');
const root = process.env.PWD;
// 匹配以js和vue后缀结尾
const matchFileReg = new RegExp('(\\.js)(\\n?$|\\n)');
// const path = require('path');

// git 对所有冲突的地方都会生成下面这种格式的信息，所以写个检测冲突文件的正则
const isConflictRegular = '^<<<<<<<\\s|^=======$|^>>>>>>>\\s';

let results;
try {
    // git grep 命令会执行 perl 的正则匹配所有满足冲突条件的文件
    results = execSync(`git grep -n -P "${isConflictRegular}"`, { encoding: 'utf-8' });
    if (results) {
        console.error('发现冲突，请解决后再提交，冲突文件：');
        console.error(results.trim());
        process.exit(1);
    }
} catch (e) {
    console.log('没有发现冲突，等待 commit');
}

// eslint 语法检查
let pass = true;
try {
    const files = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf-8' });
    if (`${files}` === '' || !files.match(matchFileReg)) {
        console.error('没有文件需要eslint');
    } else if (files.match(matchFileReg)) {
        files.split('\n').forEach(file => {
            if (!file.match(matchFileReg)) {
                return;
            }
            try {
                // 取消自动修复 `eslint --fix ${root}/${file}`
                const result = execSync(`eslint ${root}/${file}`, { encoding: 'utf-8' });
                if (`${result}` === '') {
                    console.log('eslint检查成功');
                } else {
                    pass = false;
                    throw new Error();
                }
            } catch (e) {
                throw new Error(`eslint检查失败，请对${file}文件进行eslint检查`);
            }
        });

        if (!pass) {
            console.log('提交的文件没有满足提交标准，请检查提交文件');
            process.exit(1);
        } else {
            console.log('提交的文件符合eslint标准');
        }
    }

} catch (e) {
    throw e;
}

process.exit(0);
