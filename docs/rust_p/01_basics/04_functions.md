# 函数

## 函数定义

### 基本语法

```rust
fn main() {
    println!("Hello, world!");
    another_function();
}

fn another_function() {
    println!("另一个函数");
}
```

### 带参数的函数

```rust
fn main() {
    greet("张三", 25);
    greet("李四", 30);
    
    let sum = add(5, 3);
    println!("5 + 3 = {}", sum);
}

fn greet(name: &str, age: u32) {
    println!("你好，{}！你今年{}岁。", name, age);
}

fn add(a: i32, b: i32) -> i32 {
    a + b  // 没有分号，这是返回值
}
```

### 函数参数类型

```rust
fn main() {
    // 基本类型参数
    let x = 5;
    let y = 10;
    let result = calculate(x, y);
    println!("计算结果: {}", result);
    
    // 字符串参数
    let name = String::from("Rust");
    print_name(name);
    
    // 数组参数
    let numbers = [1, 2, 3, 4, 5];
    let sum = array_sum(&numbers);
    println!("数组和: {}", sum);
}

fn calculate(a: i32, b: i32) -> i32 {
    a * b + 10
}

fn print_name(name: String) {
    println!("语言名称: {}", name);
}

fn array_sum(arr: &[i32]) -> i32 {
    let mut sum = 0;
    for &item in arr {
        sum += item;
    }
    sum
}
```

## 返回值

### 显式返回

```rust
fn main() {
    let result1 = add_explicit(5, 3);
    let result2 = multiply(4, 6);
    let result3 = divide(10, 2);
    
    println!("加法: {}", result1);
    println!("乘法: {}", result2);
    println!("除法: {}", result3);
}

fn add_explicit(a: i32, b: i32) -> i32 {
    return a + b;  // 显式返回
}

fn multiply(a: i32, b: i32) -> i32 {
    a * b  // 隐式返回（推荐）
}

fn divide(a: i32, b: i32) -> i32 {
    if b != 0 {
        a / b
    } else {
        0  // 除零时返回0
    }
}
```

### 多个返回值

```rust
fn main() {
    let (sum, product) = calculate_both(10, 20);
    println!("和: {}, 积: {}", sum, product);
    
    let (min, max) = find_min_max(&[3, 1, 4, 1, 5, 9, 2, 6]);
    println!("最小值: {}, 最大值: {}", min, max);
}

fn calculate_both(a: i32, b: i32) -> (i32, i32) {
    (a + b, a * b)
}

fn find_min_max(numbers: &[i32]) -> (i32, i32) {
    let mut min = numbers[0];
    let mut max = numbers[0];
    
    for &num in numbers {
        if num < min {
            min = num;
        }
        if num > max {
            max = num;
        }
    }
    
    (min, max)
}
```

## 函数重载和默认参数

Rust不支持函数重载，但可以使用不同的函数名：

```rust
fn main() {
    greet();
    greet_with_name("张三");
    greet_with_age(25);
    greet_full("李四", 30);
}

fn greet() {
    println!("你好！");
}

fn greet_with_name(name: &str) {
    println!("你好，{}！", name);
}

fn greet_with_age(age: u32) {
    println!("你今年{}岁", age);
}

fn greet_full(name: &str, age: u32) {
    println!("你好，{}！你今年{}岁。", name, age);
}
```

## 练习1：数学函数

创建各种数学计算函数：

```rust
fn main() {
    let a = 10.0;
    let b = 3.0;
    
    println!("{} + {} = {}", a, b, add_f64(a, b));
    println!("{} - {} = {}", a, b, subtract(a, b));
    println!("{} * {} = {}", a, b, multiply_f64(a, b));
    println!("{} / {} = {}", a, b, divide_f64(a, b));
    println!("{} ^ {} = {}", a, b, power(a, b));
    println!("{} 的平方根 = {:.2}", a, square_root(a));
}

fn add_f64(a: f64, b: f64) -> f64 {
    a + b
}

fn subtract(a: f64, b: f64) -> f64 {
    a - b
}

fn multiply_f64(a: f64, b: f64) -> f64 {
    a * b
}

fn divide_f64(a: f64, b: f64) -> f64 {
    if b != 0.0 {
        a / b
    } else {
        0.0
    }
}

fn power(base: f64, exponent: f64) -> f64 {
    base.powf(exponent)
}

fn square_root(x: f64) -> f64 {
    x.sqrt()
}
```

## 练习2：字符串处理函数

```rust
fn main() {
    let text = "Hello, Rust World!";
    
    println!("原文本: {}", text);
    println!("长度: {}", string_length(text));
    println!("大写: {}", to_uppercase(text));
    println!("小写: {}", to_lowercase(text));
    println!("反转: {}", reverse_string(text));
    println!("单词数: {}", count_words(text));
}

fn string_length(s: &str) -> usize {
    s.len()
}

fn to_uppercase(s: &str) -> String {
    s.to_uppercase()
}

fn to_lowercase(s: &str) -> String {
    s.to_lowercase()
}

fn reverse_string(s: &str) -> String {
    s.chars().rev().collect()
}

fn count_words(s: &str) -> usize {
    s.split_whitespace().count()
}
```

## 练习3：数组处理函数

```rust
fn main() {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    println!("数组: {:?}", numbers);
    println!("和: {}", array_sum(&numbers));
    println!("平均值: {:.2}", array_average(&numbers));
    println!("最大值: {}", array_max(&numbers));
    println!("最小值: {}", array_min(&numbers));
    println!("偶数个数: {}", count_even(&numbers));
    
    let doubled = double_array(&numbers);
    println!("翻倍后: {:?}", doubled);
}

fn array_sum(arr: &[i32]) -> i32 {
    let mut sum = 0;
    for &item in arr {
        sum += item;
    }
    sum
}

fn array_average(arr: &[i32]) -> f64 {
    let sum = array_sum(arr);
    sum as f64 / arr.len() as f64
}

fn array_max(arr: &[i32]) -> i32 {
    let mut max = arr[0];
    for &item in arr {
        if item > max {
            max = item;
        }
    }
    max
}

fn array_min(arr: &[i32]) -> i32 {
    let mut min = arr[0];
    for &item in arr {
        if item < min {
            min = item;
        }
    }
    min
}

fn count_even(arr: &[i32]) -> usize {
    let mut count = 0;
    for &item in arr {
        if item % 2 == 0 {
            count += 1;
        }
    }
    count
}

fn double_array(arr: &[i32]) -> Vec<i32> {
    let mut result = Vec::new();
    for &item in arr {
        result.push(item * 2);
    }
    result
}
```

## 练习4：递归函数

```rust
fn main() {
    let n = 5;
    println!("{}! = {}", n, factorial(n));
    
    let fib_n = 10;
    println!("斐波那契数列第{}项: {}", fib_n, fibonacci(fib_n));
    
    let num = 12321;
    println!("{} 是回文数吗? {}", num, is_palindrome(num));
}

fn factorial(n: u32) -> u32 {
    if n <= 1 {
        1
    } else {
        n * factorial(n - 1)
    }
}

fn fibonacci(n: u32) -> u32 {
    if n <= 1 {
        n
    } else {
        fibonacci(n - 1) + fibonacci(n - 2)
    }
}

fn is_palindrome(mut num: u32) -> bool {
    let original = num;
    let mut reversed = 0;
    
    while num > 0 {
        reversed = reversed * 10 + num % 10;
        num /= 10;
    }
    
    original == reversed
}
```

## 练习5：温度转换器

```rust
fn main() {
    let celsius = 25.0;
    let fahrenheit = 77.0;
    
    println!("{}°C = {:.2}°F", celsius, celsius_to_fahrenheit(celsius));
    println!("{}°F = {:.2}°C", fahrenheit, fahrenheit_to_celsius(fahrenheit));
}

fn celsius_to_fahrenheit(celsius: f64) -> f64 {
    celsius * 9.0 / 5.0 + 32.0
}

fn fahrenheit_to_celsius(fahrenheit: f64) -> f64 {
    (fahrenheit - 32.0) * 5.0 / 9.0
}
```

## 下一步

现在您已经掌握了Rust的函数。接下来我们将学习Rust最重要的特性之一：所有权系统。
