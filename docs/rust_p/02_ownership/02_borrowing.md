# 借用和引用

## 什么是借用

借用允许你使用值而不获取其所有权。通过引用（&）可以访问数据而不转移所有权。

### 基本语法

```rust
fn main() {
    let s1 = String::from("hello");
    let len = calculate_length(&s1);  // 借用s1
    println!("'{}'的长度是{}", s1, len);  // s1仍然有效
}

fn calculate_length(s: &String) -> usize {
    s.len()
}  // s离开作用域，但因为它不拥有数据，所以不会释放
```

## 可变引用

### 基本可变引用

```rust
fn main() {
    let mut s = String::from("hello");
    change(&mut s);
    println!("{}", s);
}

fn change(some_string: &mut String) {
    some_string.push_str(", world");
}
```

### 可变引用的限制

```rust
fn main() {
    let mut s = String::from("hello");
    
    // 可以有多个不可变引用
    let r1 = &s;
    let r2 = &s;
    println!("{} 和 {}", r1, r2);
    
    // 可变引用和不可变引用不能同时存在
    // let r3 = &mut s;  // 错误！
    // println!("{}", r1);  // 错误！
    
    // 在不可变引用使用完毕后，可以使用可变引用
    let r3 = &mut s;
    r3.push_str(", world");
    println!("{}", r3);
}
```

## 悬垂引用

Rust编译器会防止悬垂引用：

```rust
fn main() {
    let reference_to_nothing = dangle();
}

// 这个函数会编译失败
fn dangle() -> &String {
    let s = String::from("hello");
    &s  // 错误！返回s的引用，但s即将被释放
}

// 正确的做法：返回所有权
fn no_dangle() -> String {
    let s = String::from("hello");
    s  // 返回所有权
}
```

## 练习1：基本借用

```rust
fn main() {
    let s1 = String::from("Rust Programming");
    let s2 = String::from("Language");
    
    // 借用字符串计算长度
    let len1 = get_length(&s1);
    let len2 = get_length(&s2);
    
    println!("'{}'的长度是{}", s1, len1);
    println!("'{}'的长度是{}", s2, len2);
    
    // 借用字符串进行比较
    let longer = get_longer(&s1, &s2);
    println!("较长的字符串是: {}", longer);
}

fn get_length(s: &String) -> usize {
    s.len()
}

fn get_longer(s1: &String, s2: &String) -> &String {
    if s1.len() > s2.len() {
        s1
    } else {
        s2
    }
}
```

## 练习2：可变借用

```rust
fn main() {
    let mut text = String::from("Hello");
    
    // 添加内容
    append_text(&mut text, ", World!");
    println!("{}", text);
    
    // 转换为大写
    to_uppercase(&mut text);
    println!("{}", text);
    
    // 反转字符串
    reverse_string(&mut text);
    println!("{}", text);
}

fn append_text(s: &mut String, suffix: &str) {
    s.push_str(suffix);
}

fn to_uppercase(s: &mut String) {
    *s = s.to_uppercase();
}

fn reverse_string(s: &mut String) {
    *s = s.chars().rev().collect();
}
```

## 练习3：数组借用

```rust
fn main() {
    let mut numbers = [1, 2, 3, 4, 5];
    
    // 借用数组进行计算
    let sum = array_sum(&numbers);
    let average = sum as f64 / numbers.len() as f64;
    println!("数组: {:?}", numbers);
    println!("和: {}, 平均值: {:.2}", sum, average);
    
    // 可变借用修改数组
    double_array(&mut numbers);
    println!("翻倍后: {:?}", numbers);
    
    // 查找最大值
    let max = find_max(&numbers);
    println!("最大值: {}", max);
}

fn array_sum(arr: &[i32]) -> i32 {
    let mut sum = 0;
    for &item in arr {
        sum += item;
    }
    sum
}

fn double_array(arr: &mut [i32]) {
    for item in arr.iter_mut() {
        *item *= 2;
    }
}

fn find_max(arr: &[i32]) -> i32 {
    let mut max = arr[0];
    for &item in arr {
        if item > max {
            max = item;
        }
    }
    max
}
```

## 练习4：字符串处理

```rust
fn main() {
    let mut text = String::from("  Hello, Rust World!  ");
    
    // 借用进行只读操作
    let word_count = count_words(&text);
    let char_count = count_chars(&text);
    
    println!("原文本: '{}'", text);
    println!("单词数: {}, 字符数: {}", word_count, char_count);
    
    // 可变借用进行修改
    trim_whitespace(&mut text);
    println!("去除空格后: '{}'", text);
    
    replace_text(&mut text, "Rust", "Rust Programming");
    println!("替换后: '{}'", text);
}

fn count_words(s: &String) -> usize {
    s.split_whitespace().count()
}

fn count_chars(s: &String) -> usize {
    s.chars().count()
}

fn trim_whitespace(s: &mut String) {
    *s = s.trim().to_string();
}

fn replace_text(s: &mut String, from: &str, to: &str) {
    *s = s.replace(from, to);
}
```

## 练习5：结构体借用

```rust
#[derive(Debug)]
struct Person {
    name: String,
    age: u32,
    email: String,
}

fn main() {
    let mut person = Person {
        name: String::from("张三"),
        age: 25,
        email: String::from("zhangsan@example.com"),
    };
    
    // 借用结构体字段
    print_person_info(&person);
    
    // 修改年龄
    update_age(&mut person, 26);
    print_person_info(&person);
    
    // 更新邮箱
    update_email(&mut person, "zhangsan.new@example.com");
    print_person_info(&person);
}

fn print_person_info(person: &Person) {
    println!("姓名: {}", person.name);
    println!("年龄: {}", person.age);
    println!("邮箱: {}", person.email);
    println!("---");
}

fn update_age(person: &mut Person, new_age: u32) {
    person.age = new_age;
}

fn update_email(person: &mut Person, new_email: &str) {
    person.email = new_email.to_string();
}
```

## 练习6：借用和所有权结合

```rust
fn main() {
    let s1 = String::from("Hello");
    let s2 = String::from("World");
    
    // 借用进行连接，不转移所有权
    let result = concatenate_with_borrow(&s1, &s2);
    println!("结果: {}", result);
    println!("s1仍然可用: {}", s1);
    println!("s2仍然可用: {}", s2);
    
    // 使用所有权进行连接
    let result2 = concatenate_with_ownership(s1, s2);
    println!("结果2: {}", result2);
    // s1和s2在这里不再可用
}

fn concatenate_with_borrow(s1: &String, s2: &String) -> String {
    let mut result = s1.clone();
    result.push_str(" ");
    result.push_str(s2);
    result
}

fn concatenate_with_ownership(s1: String, s2: String) -> String {
    let mut result = s1;
    result.push_str(" ");
    result.push_str(&s2);
    result
}
```

## 借用规则总结

1. **任意数量的不可变引用**，或者
2. **只有一个可变引用**
3. **引用必须总是有效的**

## 常见错误和解决方案

### 错误1：同时使用可变和不可变引用

```rust
fn main() {
    let mut s = String::from("hello");
    let r1 = &s;        // 不可变引用
    let r2 = &s;        // 不可变引用
    // let r3 = &mut s; // 错误！不能同时有可变和不可变引用
    println!("{} 和 {}", r1, r2);
}
```

### 错误2：悬垂引用

```rust
fn main() {
    // let reference_to_nothing = dangle(); // 错误！
    let valid_string = no_dangle();
    println!("{}", valid_string);
}

// fn dangle() -> &String {  // 错误！
//     let s = String::from("hello");
//     &s
// }

fn no_dangle() -> String {
    let s = String::from("hello");
    s
}
```

## 下一步

现在您已经掌握了借用和引用。接下来我们将学习结构体和枚举，这是Rust中定义自定义数据类型的重要方式。
