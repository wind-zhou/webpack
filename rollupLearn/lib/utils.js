

const hasOwnProperty = (obj, opt) => {
   return Object.prototype.hasOwnProperty.call(obj, opt)
}

module.exports = {
    hasOwnProperty
}