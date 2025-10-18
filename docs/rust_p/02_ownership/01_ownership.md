# 所有权系统

## 什么是所有权

所有权是Rust最独特的特性，它让Rust无需垃圾回收器就能保证内存安全。

### 所有权规则

1. Rust中的每个值都有一个所有者
2. 值在任一时刻有且只有一个所有者
3. 当所有者离开作用域，这个值将被丢弃

## 变量作用域

```rust
fn main() {
    {                      // s在这里无效，它尚未声明
        let s = "hello";   // 从这开始，s是有效的
        println!("{}", s); // 使用s
    }                      // 作用域结束，s不再有效
}
```

## 内存和分配

### 栈和堆

```rust
fn main() {
    // 栈上存储（固定大小）
    let x = 5;
    let y = x;  // 复制值
    println!("x = {}, y = {}", x, y);  // 两个都可以使用
    
    // 堆上存储（动态大小）
    let s1 = String::from("hello");
    let s2 = s1;  // 移动所有权
    // println!("{}", s1);  // 错误！s1不再有效
    println!("{}", s2);  // 正确
}
```

### String类型

```rust
fn main() {
    // 字符串字面量（不可变，栈上）
    let s1 = "hello";
    
    // String类型（可变，堆上）
    let mut s2 = String::from("hello");
    s2.push_str(", world!");
    println!("{}", s2);
    
    // 所有权转移
    let s3 = s2;  // s2的所有权转移给s3
    // println!("{}", s2);  // 错误！s2不再有效
    println!("{}", s3);  // 正确
}
```

## 所有权转移

### 移动（Move）

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;  // s1的所有权移动给s2
    
    // println!("{}", s1);  // 错误！s1不再有效
    println!("{}", s2);  // 正确
    
    // 函数调用中的所有权转移
    let s3 = String::from("world");
    takes_ownership(s3);  // s3的所有权转移给函数
    // println!("{}", s3);  // 错误！s3不再有效
}

fn takes_ownership(some_string: String) {
    println!("{}", some_string);
}  // some_string离开作用域，内存被释放
```

### 克隆（Clone）

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();  // 深拷贝
    
    println!("s1 = {}, s2 = {}", s1, s2);  // 两个都可以使用
    
    // 基本类型的复制
    let x = 5;
    let y = x;  // 复制（因为i32实现了Copy trait）
    println!("x = {}, y = {}", x, y);
}
```

## 函数和返回值

### 转移所有权

```rust
fn main() {
    let s1 = gives_ownership();  // 函数返回值转移给s1
    let s2 = String::from("hello");
    let s3 = takes_and_gives_back(s2);  // s2转移给函数，函数返回值转移给s3
    
    println!("s1 = {}", s1);
    println!("s3 = {}", s3);
}

fn gives_ownership() -> String {
    let some_string = String::from("hello");
    some_string  // 返回并转移所有权
}

fn takes_and_gives_back(a_string: String) -> String {
    a_string  // 返回并转移所有权
}
```

### 返回多个值

```rust
fn main() {
    let s1 = String::from("hello");
    let (s2, len) = calculate_length(s1);
    
    println!("字符串'{}'的长度是{}", s2, len);
}

fn calculate_length(s: String) -> (String, usize) {
    let length = s.len();
    (s, length)  // 返回字符串和长度
}
```

## 练习1：所有权基础

```rust
fn main() {
    // 1. 创建字符串并转移所有权
    let s1 = String::from("Rust");
    let s2 = s1;  // 所有权转移
    // println!("{}", s1);  // 这行会报错，取消注释试试
    
    // 2. 使用clone避免所有权转移
    let s3 = String::from("Programming");
    let s4 = s3.clone();
    println!("s3 = {}, s4 = {}", s3, s4);
    
    // 3. 基本类型的复制
    let x = 42;
    let y = x;
    println!("x = {}, y = {}", x, y);
}
```

## 练习2：函数所有权

```rust
fn main() {
    let s1 = String::from("Hello");
    let s2 = String::from("World");
    
    // 调用函数并处理所有权
    let result = concatenate_strings(s1, s2);
    println!("连接结果: {}", result);
    
    // 尝试使用s1和s2会报错
    // println!("{}", s1);  // 错误！
    // println!("{}", s2);  // 错误！
}

fn concatenate_strings(s1: String, s2: String) -> String {
    let mut result = s1;
    result.push_str(" ");
    result.push_str(&s2);
    result
}
```

## 练习3：所有权和循环

```rust
fn main() {
    let words = vec![
        String::from("Rust"),
        String::from("is"),
        String::from("awesome")
    ];
    
    // 转移所有权
    for word in words {
        println!("{}", word);
    }
    // words在这里不再可用
    
    // 如果不想转移所有权，可以使用引用（下一章学习）
}
```

## 练习4：字符串处理

```rust
fn main() {
    let text = String::from("Hello, Rust World!");
    
    // 处理字符串并返回结果
    let (processed, length) = process_string(text);
    println!("处理后的字符串: {}", processed);
    println!("长度: {}", length);
}

fn process_string(s: String) -> (String, usize) {
    let length = s.len();
    let processed = s.to_uppercase();
    (processed, length)
}
```

## 练习5：所有权和条件

```rust
fn main() {
    let s1 = String::from("short");
    let s2 = String::from("very long string");
    
    let result = choose_string(s1, s2);
    println!("选择的字符串: {}", result);
}

fn choose_string(s1: String, s2: String) -> String {
    if s1.len() > s2.len() {
        s1
    } else {
        s2
    }
}
```

## 常见错误和解决方案

### 错误1：使用已移动的值

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;
    // println!("{}", s1);  // 错误！
    
    // 解决方案：使用clone
    let s1 = String::from("hello");
    let s2 = s1.clone();
    println!("{}", s1);  // 正确
}
```

### 错误2：函数参数所有权

```rust
fn main() {
    let s = String::from("hello");
    print_string(s);
    // println!("{}", s);  // 错误！
    
    // 解决方案：函数返回所有权
    let s = String::from("hello");
    let s = print_and_return(s);
    println!("{}", s);  // 正确
}

fn print_string(s: String) {
    println!("{}", s);
}

fn print_and_return(s: String) -> String {
    println!("{}", s);
    s
}
```

## 下一步

现在您已经理解了所有权系统。接下来我们将学习借用和引用，这是避免所有权转移的重要机制。
