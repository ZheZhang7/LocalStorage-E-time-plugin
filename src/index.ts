// expire 过期时间  parmanent永久不过期
import {StorageCls, Key, Expire, Data, Result} from './type/index'
import {Dictionaries} from './enum/index'
export class Storage implements StorageCls {
    public set <T>(key:Key, value:T, expire:Expire = Dictionaries.permanent) {
        // 定义格式化数据
        const data: Data<T> = {
            value,
            [Dictionaries.expire]: expire
        }
        localStorage.setItem(key, JSON.stringify(data))
    }

    public get <T>(key: Key): Result<T | null> {
        // 获取数据
        const value = localStorage.getItem(key)
        if (value) {
            // 解析数据
            const data: Data<T> = JSON.parse(value);
            // 获取当前时间
            let now = new Date().getTime();
            // 判断数据类型及是否过期
            if (typeof data[Dictionaries.expire] === 'number' && data[Dictionaries.expire] < now) {
                // 数据过期，删除数据
                this.remove(key);
                return {
                    message: `数据${key}数据过期`,
                    value: null
                }
            } else {
                return {
                    message: `数据${key}获取成功`,
                    value: data.value
                }
            }

        } else {
            return {
                message: '没有数据',
                value: null
            }
        }
    }

    public remove (key: Key) {
        localStorage.removeItem(key);
    }

    // 清空所有数据
    public clear () {
        localStorage.clear();
    }
}