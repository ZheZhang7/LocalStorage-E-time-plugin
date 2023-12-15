// 字典 Dictionaries expire过期时间 permanent永久不过期
var Dictionaries;
(function (Dictionaries) {
    Dictionaries["permanent"] = "permanent";
    Dictionaries["expire"] = "__expire__";
})(Dictionaries || (Dictionaries = {}));

class Storage {
    set(key, value, expire = Dictionaries.permanent) {
        // 定义格式化数据
        const data = {
            value,
            [Dictionaries.expire]: expire
        };
        localStorage.setItem(key, JSON.stringify(data));
    }
    get(key) {
        // 获取数据
        const value = localStorage.getItem(key);
        if (value) {
            // 解析数据
            const data = JSON.parse(value);
            // 获取当前时间
            let now = new Date().getTime();
            // 判断数据类型及是否过期
            if (typeof data[Dictionaries.expire] === 'number' && data[Dictionaries.expire] < now) {
                // 数据过期，删除数据
                this.remove(key);
                return {
                    message: `数据${key}数据过期`,
                    value: null
                };
            }
            else {
                return {
                    message: `数据${key}获取成功`,
                    value: data.value
                };
            }
        }
        else {
            return {
                message: '没有数据',
                value: null
            };
        }
    }
    remove(key) {
        localStorage.removeItem(key);
    }
    // 清空所有数据
    clear() {
        localStorage.clear();
    }
}

export { Storage };
