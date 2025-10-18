# Rust标准库学习指南

## 概述

掌握Rust标准库是成为熟练Rust开发者的关键。本指南将帮助您系统性地学习标准库的常用功能，通过实践项目快速掌握核心API。

## 学习策略

### 1. 按模块分类学习

#### 核心模块（必须掌握）

##### std::collections - 集合类型

```rust
use std::collections::*;

fn main() {
    // Vec - 动态数组
    let mut vec = Vec::new();
    vec.push(1);
    vec.push(2);
    vec.push(3);
    println!("Vec: {:?}", vec);
    
    // HashMap - 哈希映射
    let mut map = HashMap::new();
    map.insert("key1", "value1");
    map.insert("key2", "value2");
    println!("HashMap: {:?}", map);
    
    // HashSet - 哈希集合
    let mut set = HashSet::new();
    set.insert(1);
    set.insert(2);
    set.insert(1); // 重复值会被忽略
    println!("HashSet: {:?}", set);
    
    // BTreeMap - 有序映射
    let mut btree = BTreeMap::new();
    btree.insert(3, "three");
    btree.insert(1, "one");
    btree.insert(2, "two");
    println!("BTreeMap: {:?}", btree);
}
```

**常用方法**：
- `Vec`: `push()`, `pop()`, `len()`, `is_empty()`, `contains()`
- `HashMap`: `insert()`, `get()`, `remove()`, `contains_key()`
- `HashSet`: `insert()`, `remove()`, `contains()`, `union()`, `intersection()`

##### std::option 和 std::result - 错误处理

```rust
use std::option::Option;
use std::result::Result;

fn main() {
    // Option处理
    let some_value = Some(42);
    let none_value: Option<i32> = None;
    
    match some_value {
        Some(x) => println!("有值: {}", x),
        None => println!("无值"),
    }
    
    // 使用unwrap_or提供默认值
    let value = none_value.unwrap_or(0);
    println!("默认值: {}", value);
    
    // Result处理
    let success: Result<i32, String> = Ok(42);
    let error: Result<i32, String> = Err("出错了".to_string());
    
    match success {
        Ok(x) => println!("成功: {}", x),
        Err(e) => println!("错误: {}", e),
    }
    
    // 使用?操作符
    let result = divide(10, 2)?;
    println!("结果: {}", result);
}

fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err("除零错误".to_string())
    } else {
        Ok(a / b)
    }
}
```

**常用方法**：
- `Option`: `unwrap()`, `unwrap_or()`, `map()`, `and_then()`, `or_else()`
- `Result`: `unwrap()`, `unwrap_or()`, `map()`, `map_err()`, `and_then()`

##### std::string 和 std::str - 字符串处理

```rust
fn main() {
    // 字符串创建和操作
    let mut s = String::from("Hello");
    s.push_str(", World!");
    println!("{}", s);
    
    // 字符串切片
    let slice = &s[0..5];
    println!("切片: {}", slice);
    
    // 字符串分割
    let words: Vec<&str> = "apple,banana,orange".split(',').collect();
    println!("分割结果: {:?}", words);
    
    // 字符串替换
    let replaced = s.replace("World", "Rust");
    println!("替换后: {}", replaced);
    
    // 字符串查找
    if s.contains("Hello") {
        println!("包含Hello");
    }
    
    // 字符串转换
    let number_str = "42";
    let number: i32 = number_str.parse().unwrap();
    println!("解析的数字: {}", number);
}
```

**常用方法**：
- `String`: `push()`, `push_str()`, `pop()`, `len()`, `is_empty()`
- `str`: `split()`, `split_whitespace()`, `contains()`, `starts_with()`, `ends_with()`

##### std::fs - 文件系统操作

```rust
use std::fs;
use std::io::{self, Write};

fn main() -> io::Result<()> {
    // 读取文件
    let content = fs::read_to_string("example.txt")?;
    println!("文件内容: {}", content);
    
    // 写入文件
    fs::write("output.txt", "Hello, World!")?;
    
    // 创建目录
    fs::create_dir("new_dir")?;
    
    // 读取目录
    let entries = fs::read_dir(".")?;
    for entry in entries {
        let entry = entry?;
        println!("文件: {:?}", entry.path());
    }
    
    // 检查文件是否存在
    if fs::metadata("example.txt").is_ok() {
        println!("文件存在");
    }
    
    Ok(())
}
```

**常用方法**：
- `read_to_string()`, `write()`, `read_dir()`, `create_dir()`, `remove_file()`, `metadata()`

### 2. 按功能分类学习

#### 迭代器操作

```rust
fn main() {
    let numbers = vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    // map - 转换
    let doubled: Vec<i32> = numbers.iter().map(|x| x * 2).collect();
    println!("翻倍: {:?}", doubled);
    
    // filter - 过滤
    let evens: Vec<&i32> = numbers.iter().filter(|&&x| x % 2 == 0).collect();
    println!("偶数: {:?}", evens);
    
    // fold - 累积
    let sum: i32 = numbers.iter().fold(0, |acc, x| acc + x);
    println!("总和: {}", sum);
    
    // any/all - 条件检查
    let has_even = numbers.iter().any(|&x| x % 2 == 0);
    let all_positive = numbers.iter().all(|&x| x > 0);
    println!("有偶数: {}, 全为正数: {}", has_even, all_positive);
    
    // take/skip - 取元素
    let first_three: Vec<&i32> = numbers.iter().take(3).collect();
    let skip_two: Vec<&i32> = numbers.iter().skip(2).collect();
    println!("前三个: {:?}", first_three);
    println!("跳过两个: {:?}", skip_two);
}
```

**常用迭代器方法**：
- `map()`, `filter()`, `fold()`, `reduce()`, `collect()`
- `any()`, `all()`, `find()`, `position()`
- `take()`, `skip()`, `take_while()`, `skip_while()`
- `enumerate()`, `zip()`, `chain()`, `flatten()`

#### 错误处理模式

```rust
use std::fs::File;
use std::io::{self, Read};

fn main() {
    // 使用match处理错误
    match File::open("nonexistent.txt") {
        Ok(mut file) => {
            let mut contents = String::new();
            file.read_to_string(&mut contents).unwrap();
            println!("文件内容: {}", contents);
        }
        Err(error) => {
            println!("打开文件失败: {}", error);
        }
    }
    
    // 使用unwrap_or_else
    let content = File::open("example.txt")
        .and_then(|mut f| {
            let mut s = String::new();
            f.read_to_string(&mut s).map(|_| s)
        })
        .unwrap_or_else(|_| "默认内容".to_string());
    
    println!("内容: {}", content);
}
```

## 3. 实用学习技巧

### 技巧1：使用文档和示例

```rust
// 在代码中直接查看文档
// 在IDE中悬停函数名查看文档
// 或者使用 cargo doc --open 查看本地文档

fn main() {
    let mut vec = vec![1, 2, 3];
    
    // 悬停查看push的文档
    vec.push(4);
    
    // 悬停查看iter的文档
    let sum: i32 = vec.iter().sum();
    println!("总和: {}", sum);
}
```

### 技巧2：创建自己的工具函数

```rust
// 创建一个工具模块
mod utils {
    use std::collections::HashMap;
    
    pub fn count_words(text: &str) -> HashMap<&str, usize> {
        let mut counts = HashMap::new();
        for word in text.split_whitespace() {
            *counts.entry(word).or_insert(0) += 1;
        }
        counts
    }
    
    pub fn find_max<T: PartialOrd>(slice: &[T]) -> Option<&T> {
        slice.iter().max()
    }
    
    pub fn deduplicate<T: Eq + std::hash::Hash + Clone>(vec: Vec<T>) -> Vec<T> {
        let mut seen = std::collections::HashSet::new();
        vec.into_iter()
            .filter(|item| seen.insert(item.clone()))
            .collect()
    }
}

fn main() {
    let text = "hello world hello rust world";
    let word_counts = utils::count_words(text);
    println!("单词计数: {:?}", word_counts);
    
    let numbers = [1, 5, 3, 9, 2];
    if let Some(max) = utils::find_max(&numbers) {
        println!("最大值: {}", max);
    }
    
    let duplicates = vec![1, 2, 2, 3, 3, 3, 4];
    let unique = utils::deduplicate(duplicates);
    println!("去重后: {:?}", unique);
}
```

### 技巧3：练习项目驱动学习

```rust
// 创建一个简单的日志系统
use std::fs::OpenOptions;
use std::io::{self, Write};
use std::sync::Mutex;
use std::time::SystemTime;

struct Logger {
    file: Mutex<fs::File>,
}

impl Logger {
    fn new(filename: &str) -> io::Result<Self> {
        let file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(filename)?;
        
        Ok(Logger {
            file: Mutex::new(file),
        })
    }
    
    fn log(&self, message: &str) -> io::Result<()> {
        let timestamp = SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .unwrap()
            .as_secs();
        
        let log_entry = format!("[{}] {}\n", timestamp, message);
        
        let mut file = self.file.lock().unwrap();
        file.write_all(log_entry.as_bytes())?;
        file.flush()?;
        
        Ok(())
    }
}

fn main() -> io::Result<()> {
    let logger = Logger::new("app.log")?;
    
    logger.log("应用程序启动")?;
    logger.log("处理用户请求")?;
    logger.log("应用程序关闭")?;
    
    Ok(())
}
```

## 4. 常用模式总结

### 模式1：链式调用

```rust
fn main() {
    let result: Vec<String> = vec![1, 2, 3, 4, 5]
        .iter()
        .filter(|&&x| x % 2 == 0)
        .map(|x| x.to_string())
        .collect();
    
    println!("结果: {:?}", result);
}
```

### 模式2：错误传播

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_config() -> io::Result<String> {
    let mut file = File::open("config.txt")?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn main() -> io::Result<()> {
    let config = read_config()?;
    println!("配置: {}", config);
    Ok(())
}
```

### 模式3：Option链式操作

```rust
fn main() {
    let numbers = vec![Some(1), None, Some(3), Some(4)];
    
    let sum: Option<i32> = numbers
        .iter()
        .filter_map(|x| *x)
        .reduce(|acc, x| acc + x);
    
    println!("总和: {:?}", sum);
}
```

### 模式4：集合操作

```rust
use std::collections::HashSet;

fn main() {
    let set1: HashSet<i32> = [1, 2, 3, 4, 5].iter().cloned().collect();
    let set2: HashSet<i32> = [4, 5, 6, 7, 8].iter().cloned().collect();
    
    // 并集
    let union: HashSet<_> = set1.union(&set2).cloned().collect();
    println!("并集: {:?}", union);
    
    // 交集
    let intersection: HashSet<_> = set1.intersection(&set2).cloned().collect();
    println!("交集: {:?}", intersection);
    
    // 差集
    let difference: HashSet<_> = set1.difference(&set2).cloned().collect();
    println!("差集: {:?}", difference);
}
```

## 5. 学习资源推荐

### 在线资源
- [Rust官方文档](https://doc.rust-lang.org/std/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [标准库速查表](https://cheats.rs/)
- [Rustlings练习](https://github.com/rust-lang/rustlings)

### 实践建议
1. **每天写一个小程序** - 选择不同的标准库模块练习
2. **阅读优秀开源项目** - 学习标准库的实际应用
3. **参与Rust社区** - 获取帮助和最佳实践
4. **完成Rustlings练习** - 系统性的练习平台

## 6. 学习计划

### 第一周：基础模块
- [ ] std::collections (Vec, HashMap, HashSet)
- [ ] std::option 和 std::result
- [ ] std::string 和 std::str

### 第二周：文件和时间
- [ ] std::fs (文件操作)
- [ ] std::io (输入输出)
- [ ] std::time (时间处理)

### 第三周：并发和网络
- [ ] std::thread (线程)
- [ ] std::sync (同步原语)
- [ ] std::net (网络)

### 第四周：高级特性
- [ ] std::iter (迭代器)
- [ ] std::fmt (格式化)
- [ ] std::env (环境变量)

## 7. 练习项目建议

### 项目1：文件管理器
```rust
// 实现基本的文件操作功能
// 使用 std::fs, std::path, std::io
```

### 项目2：日志系统
```rust
// 实现多级别日志记录
// 使用 std::fs, std::io, std::sync
```

### 项目3：配置管理器
```rust
// 读取和解析配置文件
// 使用 std::fs, std::collections, std::env
```

### 项目4：数据处理器
```rust
// 处理CSV或JSON数据
// 使用 std::collections, std::iter, std::str
```

## 总结

掌握Rust标准库的关键是：

1. **按模块系统学习** - 不要试图一次性掌握所有内容
2. **通过实践项目学习** - 边学边用，加深理解
3. **善用文档和IDE** - 随时查阅，提高效率
4. **多写代码** - 熟能生巧，形成肌肉记忆
5. **参与社区** - 学习最佳实践，获取帮助

记住，学习标准库是一个持续的过程，不要急于求成，慢慢积累经验。通过系统性的学习和实践，您将很快掌握Rust标准库的核心功能！
