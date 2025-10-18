# 基础练习 (1-20)

## 练习1：变量和常量

**题目**：创建一个程序，声明不同类型的变量和常量，并进行基本运算。

**要求**：
- 声明整数、浮点数、布尔值、字符变量
- 声明一个常量
- 进行数学运算并输出结果

**测试用例**：
```rust
// 期望输出类似：
// 整数运算: 10 + 5 = 15
// 浮点数运算: 3.14 * 2.0 = 6.28
// 布尔运算: true && false = false
// 字符: A
// 常量: 100
```

**参考答案**：
```rust
fn main() {
    // 变量声明
    let x: i32 = 10;
    let y: i32 = 5;
    let pi: f64 = 3.14;
    let radius: f64 = 2.0;
    let is_rust_awesome: bool = true;
    let is_learning: bool = false;
    let grade: char = 'A';
    
    // 常量
    const MAX_SCORE: u32 = 100;
    
    // 数学运算
    let sum = x + y;
    let area = pi * radius * radius;
    let logical_and = is_rust_awesome && is_learning;
    
    // 输出结果
    println!("整数运算: {} + {} = {}", x, y, sum);
    println!("浮点数运算: {} * {} = {:.2}", pi, radius, area);
    println!("布尔运算: {} && {} = {}", is_rust_awesome, is_learning, logical_and);
    println!("字符: {}", grade);
    println!("常量: {}", MAX_SCORE);
}
```

## 练习2：控制流

**题目**：编写一个程序，根据分数判断等级，并统计不同等级的人数。

**要求**：
- 使用数组存储分数
- 使用循环遍历分数
- 使用条件语句判断等级
- 统计各等级人数

**测试用例**：
```rust
let scores = [85, 92, 78, 96, 88, 65, 72, 90];
// 期望输出：
// 分数: 85 -> 良好
// 分数: 92 -> 优秀
// ...
// 统计结果: 优秀(2), 良好(3), 中等(2), 及格(1), 不及格(0)
```

**参考答案**：
```rust
fn main() {
    let scores = [85, 92, 78, 96, 88, 65, 72, 90];
    let mut excellent = 0;
    let mut good = 0;
    let mut medium = 0;
    let mut pass = 0;
    let mut fail = 0;
    
    for &score in &scores {
        let grade = if score >= 90 {
            excellent += 1;
            "优秀"
        } else if score >= 80 {
            good += 1;
            "良好"
        } else if score >= 70 {
            medium += 1;
            "中等"
        } else if score >= 60 {
            pass += 1;
            "及格"
        } else {
            fail += 1;
            "不及格"
        };
        
        println!("分数: {} -> {}", score, grade);
    }
    
    println!("统计结果: 优秀({}), 良好({}), 中等({}), 及格({}), 不及格({})", 
             excellent, good, medium, pass, fail);
}
```

## 练习3：函数

**题目**：创建一个数学函数库，包含基本数学运算函数。

**要求**：
- 实现加法、减法、乘法、除法函数
- 实现幂运算函数
- 实现阶乘函数
- 实现最大公约数函数

**测试用例**：
```rust
assert_eq!(add(10, 5), 15);
assert_eq!(subtract(10, 5), 5);
assert_eq!(multiply(10, 5), 50);
assert_eq!(divide(10, 5), Some(2));
assert_eq!(divide(10, 0), None);
assert_eq!(power(2, 3), 8);
assert_eq!(factorial(5), 120);
assert_eq!(gcd(12, 8), 4);
```

**参考答案**：
```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}

fn subtract(a: i32, b: i32) -> i32 {
    a - b
}

fn multiply(a: i32, b: i32) -> i32 {
    a * b
}

fn divide(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None
    } else {
        Some(a / b)
    }
}

fn power(base: i32, exponent: u32) -> i32 {
    base.pow(exponent)
}

fn factorial(n: u32) -> u32 {
    if n <= 1 {
        1
    } else {
        n * factorial(n - 1)
    }
}

fn gcd(mut a: u32, mut b: u32) -> u32 {
    while b != 0 {
        let temp = b;
        b = a % b;
        a = temp;
    }
    a
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_add() {
        assert_eq!(add(10, 5), 15);
    }
    
    #[test]
    fn test_divide() {
        assert_eq!(divide(10, 5), Some(2));
        assert_eq!(divide(10, 0), None);
    }
    
    #[test]
    fn test_factorial() {
        assert_eq!(factorial(5), 120);
    }
    
    #[test]
    fn test_gcd() {
        assert_eq!(gcd(12, 8), 4);
    }
}
```

## 练习4：所有权

**题目**：创建一个字符串处理程序，演示所有权转移。

**要求**：
- 创建字符串并转移所有权
- 使用clone避免所有权转移
- 实现字符串连接函数
- 实现字符串反转函数

**测试用例**：
```rust
let s1 = String::from("Hello");
let s2 = String::from("World");
let result = concatenate_strings(s1, s2);
assert_eq!(result, "Hello World");

let s = String::from("Rust");
let reversed = reverse_string(s);
assert_eq!(reversed, "tsuR");
```

**参考答案**：
```rust
fn concatenate_strings(s1: String, s2: String) -> String {
    let mut result = s1;
    result.push(' ');
    result.push_str(&s2);
    result
}

fn reverse_string(s: String) -> String {
    s.chars().rev().collect()
}

fn main() {
    // 所有权转移
    let s1 = String::from("Hello");
    let s2 = String::from("World");
    let result = concatenate_strings(s1, s2);
    println!("连接结果: {}", result);
    // s1和s2在这里不再可用
    
    // 使用clone避免所有权转移
    let s3 = String::from("Rust");
    let s4 = s3.clone();
    println!("s3: {}, s4: {}", s3, s4);
    
    // 字符串反转
    let s5 = String::from("Programming");
    let reversed = reverse_string(s5);
    println!("反转结果: {}", reversed);
}
```

## 练习5：借用

**题目**：创建一个程序，演示借用和引用的使用。

**要求**：
- 实现计算字符串长度的函数（使用借用）
- 实现修改字符串内容的函数（使用可变借用）
- 实现比较两个字符串的函数
- 实现查找子字符串的函数

**测试用例**：
```rust
let s = String::from("Hello, World!");
assert_eq!(get_length(&s), 13);
assert_eq!(s, "Hello, World!"); // s仍然可用

let mut s = String::from("Hello");
append_text(&mut s, ", World!");
assert_eq!(s, "Hello, World!");

assert_eq!(compare_strings("abc", "def"), false);
assert_eq!(find_substring("Hello, World!", "World"), true);
```

**参考答案**：
```rust
fn get_length(s: &String) -> usize {
    s.len()
}

fn append_text(s: &mut String, text: &str) {
    s.push_str(text);
}

fn compare_strings(s1: &str, s2: &str) -> bool {
    s1 == s2
}

fn find_substring(s: &str, substring: &str) -> bool {
    s.contains(substring)
}

fn main() {
    let s = String::from("Hello, World!");
    println!("字符串长度: {}", get_length(&s));
    println!("原字符串: {}", s); // s仍然可用
    
    let mut s = String::from("Hello");
    append_text(&mut s, ", World!");
    println!("修改后: {}", s);
    
    let s1 = "abc";
    let s2 = "def";
    println!("字符串比较: {} == {} = {}", s1, s2, compare_strings(s1, s2));
    
    let text = "Hello, World!";
    let substring = "World";
    println!("查找子字符串: '{}' 在 '{}' 中 = {}", substring, text, find_substring(text, substring));
}
```

## 练习6：数组和切片

**题目**：创建一个数组处理程序，实现各种数组操作。

**要求**：
- 创建和初始化数组
- 实现数组求和函数
- 实现查找最大值和最小值函数
- 实现数组排序函数
- 实现数组反转函数

**测试用例**：
```rust
let numbers = [1, 5, 3, 9, 2, 8, 4];
assert_eq!(array_sum(&numbers), 32);
assert_eq!(find_max(&numbers), 9);
assert_eq!(find_min(&numbers), 1);
let mut sorted = numbers;
sort_array(&mut sorted);
assert_eq!(sorted, [1, 2, 3, 4, 5, 8, 9]);
```

**参考答案**：
```rust
fn array_sum(arr: &[i32]) -> i32 {
    let mut sum = 0;
    for &item in arr {
        sum += item;
    }
    sum
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

fn find_min(arr: &[i32]) -> i32 {
    let mut min = arr[0];
    for &item in arr {
        if item < min {
            min = item;
        }
    }
    min
}

fn sort_array(arr: &mut [i32]) {
    // 简单的冒泡排序
    let n = arr.len();
    for i in 0..n {
        for j in 0..n-i-1 {
            if arr[j] > arr[j+1] {
                arr.swap(j, j+1);
            }
        }
    }
}

fn reverse_array(arr: &mut [i32]) {
    let n = arr.len();
    for i in 0..n/2 {
        arr.swap(i, n-i-1);
    }
}

fn main() {
    let numbers = [1, 5, 3, 9, 2, 8, 4];
    println!("原数组: {:?}", numbers);
    
    println!("数组和: {}", array_sum(&numbers));
    println!("最大值: {}", find_max(&numbers));
    println!("最小值: {}", find_min(&numbers));
    
    let mut sorted = numbers;
    sort_array(&mut sorted);
    println!("排序后: {:?}", sorted);
    
    let mut reversed = numbers;
    reverse_array(&mut reversed);
    println!("反转后: {:?}", reversed);
}
```

## 练习7：元组

**题目**：创建一个程序，演示元组的使用。

**要求**：
- 创建包含不同类型数据的元组
- 实现元组解构
- 实现元组比较函数
- 实现元组交换函数

**测试用例**：
```rust
let point = (3, 4);
let distance = calculate_distance(point);
assert_eq!(distance, 5.0);

let (x, y) = point;
assert_eq!(x, 3);
assert_eq!(y, 4);

let tuple1 = (1, 2, 3);
let tuple2 = (1, 2, 3);
assert_eq!(compare_tuples(tuple1, tuple2), true);
```

**参考答案**：
```rust
fn calculate_distance(point: (i32, i32)) -> f64 {
    let (x, y) = point;
    ((x * x + y * y) as f64).sqrt()
}

fn compare_tuples(t1: (i32, i32, i32), t2: (i32, i32, i32)) -> bool {
    t1 == t2
}

fn swap_tuple(t: (i32, i32)) -> (i32, i32) {
    let (a, b) = t;
    (b, a)
}

fn main() {
    // 创建元组
    let point = (3, 4);
    let person = ("张三", 25, "北京");
    let coordinates = (10.5, 20.3, 5.0);
    
    // 访问元组元素
    println!("点的坐标: ({}, {})", point.0, point.1);
    println!("人员信息: 姓名={}, 年龄={}, 城市={}", person.0, person.1, person.2);
    
    // 元组解构
    let (x, y) = point;
    println!("解构后的坐标: x={}, y={}", x, y);
    
    // 计算距离
    let distance = calculate_distance(point);
    println!("到原点的距离: {:.2}", distance);
    
    // 元组比较
    let tuple1 = (1, 2, 3);
    let tuple2 = (1, 2, 3);
    println!("元组相等: {}", compare_tuples(tuple1, tuple2));
    
    // 元组交换
    let swapped = swap_tuple((10, 20));
    println!("交换后: {:?}", swapped);
}
```

## 练习8：字符串处理

**题目**：创建一个字符串处理工具，实现各种字符串操作。

**要求**：
- 实现字符串长度计算
- 实现字符串反转
- 实现字符串分割
- 实现字符串替换
- 实现字符串查找

**测试用例**：
```rust
let s = "Hello, World!";
assert_eq!(count_words(s), 2);
assert_eq!(reverse_string(s), "!dlroW ,olleH");
assert_eq!(replace_text(s, "World", "Rust"), "Hello, Rust!");
assert_eq!(find_word(s, "World"), true);
```

**参考答案**：
```rust
fn count_words(s: &str) -> usize {
    s.split_whitespace().count()
}

fn reverse_string(s: &str) -> String {
    s.chars().rev().collect()
}

fn replace_text(s: &str, from: &str, to: &str) -> String {
    s.replace(from, to)
}

fn find_word(s: &str, word: &str) -> bool {
    s.contains(word)
}

fn split_string(s: &str, delimiter: &str) -> Vec<&str> {
    s.split(delimiter).collect()
}

fn to_uppercase(s: &str) -> String {
    s.to_uppercase()
}

fn to_lowercase(s: &str) -> String {
    s.to_lowercase()
}

fn main() {
    let text = "Hello, World! This is Rust programming.";
    
    println!("原文本: {}", text);
    println!("单词数: {}", count_words(text));
    println!("反转: {}", reverse_string(text));
    println!("替换: {}", replace_text(text, "World", "Rust"));
    println!("查找'World': {}", find_word(text, "World"));
    
    let words = split_string(text, " ");
    println!("分割结果: {:?}", words);
    
    println!("大写: {}", to_uppercase(text));
    println!("小写: {}", to_lowercase(text));
}
```

## 练习9：循环和迭代

**题目**：创建一个程序，演示各种循环和迭代的使用。

**要求**：
- 使用for循环遍历数组
- 使用while循环实现计数器
- 使用loop循环实现猜数字游戏
- 使用迭代器处理数据

**测试用例**：
```rust
let numbers = [1, 2, 3, 4, 5];
let sum = sum_with_for(&numbers);
assert_eq!(sum, 15);

let factorial = calculate_factorial(5);
assert_eq!(factorial, 120);

let doubled = double_numbers(&numbers);
assert_eq!(doubled, vec![2, 4, 6, 8, 10]);
```

**参考答案**：
```rust
fn sum_with_for(arr: &[i32]) -> i32 {
    let mut sum = 0;
    for &item in arr {
        sum += item;
    }
    sum
}

fn calculate_factorial(n: u32) -> u32 {
    let mut result = 1;
    let mut i = 1;
    while i <= n {
        result *= i;
        i += 1;
    }
    result
}

fn double_numbers(arr: &[i32]) -> Vec<i32> {
    arr.iter().map(|&x| x * 2).collect()
}

fn find_even_numbers(arr: &[i32]) -> Vec<i32> {
    arr.iter().filter(|&&x| x % 2 == 0).cloned().collect()
}

fn sum_with_iterators(arr: &[i32]) -> i32 {
    arr.iter().sum()
}

fn main() {
    let numbers = [1, 2, 3, 4, 5];
    
    // for循环
    println!("使用for循环求和: {}", sum_with_for(&numbers));
    
    // while循环
    println!("5的阶乘: {}", calculate_factorial(5));
    
    // 迭代器
    let doubled = double_numbers(&numbers);
    println!("翻倍后: {:?}", doubled);
    
    let evens = find_even_numbers(&numbers);
    println!("偶数: {:?}", evens);
    
    let sum = sum_with_iterators(&numbers);
    println!("使用迭代器求和: {}", sum);
    
    // 猜数字游戏（简化版）
    let secret_number = 42;
    let mut guess = 0;
    let mut attempts = 0;
    
    loop {
        guess += 1;
        attempts += 1;
        
        if guess == secret_number {
            println!("猜对了！数字是{}，用了{}次尝试", secret_number, attempts);
            break;
        } else if guess > secret_number {
            println!("太大了！");
            break;
        }
    }
}
```

## 练习10：错误处理

**题目**：创建一个程序，演示Rust的错误处理机制。

**要求**：
- 使用Result类型处理可能失败的操作
- 使用Option类型处理可能为空的值
- 实现自定义错误类型
- 使用match和?操作符处理错误

**测试用例**：
```rust
assert_eq!(safe_divide(10, 2), Ok(5));
assert_eq!(safe_divide(10, 0), Err("除零错误"));

assert_eq!(safe_sqrt(4.0), Ok(2.0));
assert_eq!(safe_sqrt(-1.0), Err("负数开方"));

assert_eq!(find_element(&[1, 2, 3], 2), Some(1));
assert_eq!(find_element(&[1, 2, 3], 4), None);
```

**参考答案**：
```rust
use std::fmt;

#[derive(Debug)]
enum MathError {
    DivisionByZero,
    NegativeSquareRoot,
    Overflow,
}

impl fmt::Display for MathError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            MathError::DivisionByZero => write!(f, "除零错误"),
            MathError::NegativeSquareRoot => write!(f, "负数开方错误"),
            MathError::Overflow => write!(f, "溢出错误"),
        }
    }
}

fn safe_divide(a: i32, b: i32) -> Result<i32, MathError> {
    if b == 0 {
        Err(MathError::DivisionByZero)
    } else {
        Ok(a / b)
    }
}

fn safe_sqrt(x: f64) -> Result<f64, MathError> {
    if x < 0.0 {
        Err(MathError::NegativeSquareRoot)
    } else {
        Ok(x.sqrt())
    }
}

fn find_element(arr: &[i32], target: i32) -> Option<usize> {
    for (index, &item) in arr.iter().enumerate() {
        if item == target {
            return Some(index);
        }
    }
    None
}

fn process_math_operations() -> Result<(), MathError> {
    // 使用?操作符
    let result1 = safe_divide(10, 2)?;
    println!("10 / 2 = {}", result1);
    
    let result2 = safe_sqrt(16.0)?;
    println!("√16 = {}", result2);
    
    Ok(())
}

fn main() {
    // 处理Result
    match safe_divide(10, 2) {
        Ok(result) => println!("除法结果: {}", result),
        Err(e) => println!("错误: {}", e),
    }
    
    match safe_divide(10, 0) {
        Ok(result) => println!("除法结果: {}", result),
        Err(e) => println!("错误: {}", e),
    }
    
    // 处理Option
    let numbers = [1, 2, 3, 4, 5];
    match find_element(&numbers, 3) {
        Some(index) => println!("找到元素3，索引: {}", index),
        None => println!("未找到元素3"),
    }
    
    match find_element(&numbers, 6) {
        Some(index) => println!("找到元素6，索引: {}", index),
        None => println!("未找到元素6"),
    }
    
    // 使用?操作符
    if let Err(e) = process_math_operations() {
        println!("处理数学操作时出错: {}", e);
    }
}
```

继续完成剩余的练习...

