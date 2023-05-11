// const arr = [1, 12, 1234, 3, 1314, 1234567812345, 12];


// function sortByWaterfall(arr) {
//     const place = (lines, result, cur) => {
//         // 查找当前是否存在1xn 并且还没有满的数组
//         const targetArr = result.find(item => item.type === `1x${lines}` && item.current.length < lines);
//         // 如果有，则塞进去
//         if (targetArr) {
//             targetArr.current.push(cur);
//         } else {
//             // 否则就重新创建一个新的
//             const newArr = [cur]
//             result.push({
//                 type: `1x${lines}`,
//                 current: newArr
//             })
//         }
//         return result;
//     }
//     return arr.reduce((result, cur) => {
//         const len = String(cur).length;
//         switch (true) {
//             case (len >= 1 && len <= 2):
//                 return place(3, result, cur)
//             case (len >= 3 && len <= 4):
//                 return place(2, result, cur)
//             default:
//                 return place(1, result, cur)
//         }
//     }, []).map(item => item.current)
// }

// console.log('zz-res', sortByWaterfall(arr));


const strs = ["aflower", "aflw", "afloight"];



var longestCommonPrefix = function (stars) {
    let res = ''
    const minLen = Math.min(...strs.map(str => str.split('').length));
    for (let i = 0; i < minLen; i++) {
        const currntPrefixArr = stars.map(item => item.slice(0, i + 1));
        // 验证当前数组所有元素是否都相等
        const isAllEqual = currntPrefixArr.join() === new Array(stars.length).fill(currntPrefixArr[0]).join();
        if (isAllEqual) {
            res = currntPrefixArr[0];
            continue
        } else {
            return res
        }
    }
}

console.log(longestCommonPrefix(strs))