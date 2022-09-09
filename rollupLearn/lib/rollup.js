/**
 * @description rollup 入口函数
 * @time 2022.09.09 14:43
 * @author 周正
 */
const Bundle = require('./bundle')
function rollup(entry, output) {
    const bundle = new Bundle({ entry });
    bundle.build(output)
}
module.exports = rollup