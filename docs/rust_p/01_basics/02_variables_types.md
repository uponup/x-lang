# 变量和数据类型

## 变量声明

### 基本语法

```rust
fn main() {
    // 不可变变量（默认）
    let x = 5;
    println!("x的值是: {}", x);
    
    // 可变变量
    let mut y = 10;
    y = 20;
    println!("y的值是: {}", y);
    
    // 重新绑定（shadowing）
    let z = 5;
    let z = z + 1;  // 新的z变量
    let z = z * 2;
    println!("z的值是: {}", z);
}
```

### 变量命名规则

```rust
fn main() {
    // 使用下划线命名
    let user_name = "张三";
    let user_age = 25;
    
    // 常量（全大写）
    const MAX_POINTS: u32 = 100_000;
    
    // 类型注解
    let count: i32 = 42;
    let price: f64 = 99.99;
    let is_active: bool = true;
}
```

## 基本数据类型

### 1. 整数类型

```rust
fn main() {
    // 有符号整数
    let a: i8 = 127;      // 8位，-128到127
    let b: i16 = 32767;   // 16位
    let c: i32 = 2147483647; // 32位（默认）
    let d: i64 = 9223372036854775807; // 64位
    let e: i128 = 170141183460469231731687303715884105727; // 128位
    
    // 无符号整数
    let f: u8 = 255;      // 8位，0到255
    let g: u16 = 65535;   // 16位
    let h: u32 = 4294967295; // 32位
    let i: u64 = 18446744073709551615; // 64位
    let j: u128 = 340282366920938463463374607431768211455; // 128位
    
    // 根据系统架构
    let k: isize = 100;   // 32位或64位
    let l: usize = 100;   // 32位或64位
    
    println!("整数示例: {}", c);
}
```

### 2. 浮点数类型

```rust
fn main() {
    let x: f32 = 3.14;    // 32位浮点数
    let y: f64 = 3.14159265359; // 64位浮点数（默认）
    
    // 数学运算
    let sum = x + y;
    let diff = y - x;
    let product = x * y;
    let quotient = y / x;
    
    println!("浮点数运算: {} + {} = {}", x, y, sum);
    println!("除法: {} / {} = {}", y, x, quotient);
}
```

### 3. 布尔类型

```rust
fn main() {
    let t = true;
    let f: bool = false;
    
    // 布尔运算
    let and_result = t && f;
    let or_result = t || f;
    let not_result = !t;
    
    println!("布尔运算: {} && {} = {}", t, f, and_result);
    println!("逻辑非: !{} = {}", t, not_result);
}
```

### 4. 字符类型

```rust
fn main() {
    let c = 'z';
    let z = 'ℤ';
    let heart_eyed_cat = '😻';
    let chinese_char = '中';
    
    println!("字符示例: {}, {}, {}, {}", c, z, heart_eyed_cat, chinese_char);
}
```

## 复合类型

### 1. 元组（Tuple）

```rust
fn main() {
    // 创建元组
    let tup: (i32, f64, u8) = (500, 6.4, 1);
    
    // 解构元组
    let (x, y, z) = tup;
    println!("元组解构: x={}, y={}, z={}", x, y, z);
    
    // 通过索引访问
    println!("第一个元素: {}", tup.0);
    println!("第二个元素: {}", tup.1);
    println!("第三个元素: {}", tup.2);
    
    // 函数返回多个值
    let (sum, product) = calculate(10, 20);
    println!("和: {}, 积: {}", sum, product);
}

fn calculate(a: i32, b: i32) -> (i32, i32) {
    (a + b, a * b)
}
```

### 2. 数组（Array）

```rust
fn main() {
    // 创建数组
    let a = [1, 2, 3, 4, 5];
    let months = ["一月", "二月", "三月", "四月", "五月", "六月",
                  "七月", "八月", "九月", "十月", "十一月", "十二月"];
    
    // 指定类型和长度
    let b: [i32; 5] = [1, 2, 3, 4, 5];
    let c = [3; 5]; // 等同于 [3, 3, 3, 3, 3]
    
    // 访问数组元素
    let first = a[0];
    let second = a[1];
    let last = a[4];
    
    println!("数组元素: {}, {}, {}", first, second, last);
    println!("第一个月: {}", months[0]);
    
    // 数组长度
    println!("数组长度: {}", a.len());
}
```

## 练习1：变量和类型

创建一个程序，声明不同类型的变量并进行基本运算：

```rust
fn main() {
    // 在这里添加您的代码
    // 1. 声明整数、浮点数、布尔值、字符变量
    // 2. 进行数学运算
    // 3. 创建元组和数组
    // 4. 输出结果
}
```

### 答案

```rust
fn main() {
    // 1. 基本类型变量
    let age: u8 = 25;
    let height: f32 = 175.5;
    let is_student: bool = true;
    let grade: char = 'A';
    
    // 2. 数学运算
    let weight: f32 = 70.0;
    let bmi = weight / (height / 100.0).powi(2);
    
    // 3. 元组
    let person_info = (age, height, is_student, grade);
    let (person_age, person_height, student_status, person_grade) = person_info;
    
    // 4. 数组
    let scores = [85, 92, 78, 96, 88];
    let average = (scores[0] + scores[1] + scores[2] + scores[3] + scores[4]) as f32 / 5.0;
    
    // 输出结果
    println!("个人信息:");
    println!("年龄: {}", person_age);
    println!("身高: {}cm", person_height);
    println!("是否学生: {}", student_status);
    println!("等级: {}", person_grade);
    println!("BMI: {:.2}", bmi);
    println!("平均分: {:.1}", average);
}
```

## 练习2：类型转换

```rust
fn main() {
    // 实现以下转换
    let integer = 42;
    let float = 3.14;
    
    // 1. 整数转浮点数
    // 2. 浮点数转整数（截断）
    // 3. 字符转整数（ASCII值）
    // 4. 整数转字符
}
```

### 答案

```rust
fn main() {
    let integer = 42;
    let float = 3.14;
    
    // 1. 整数转浮点数
    let int_to_float = integer as f64;
    
    // 2. 浮点数转整数（截断）
    let float_to_int = float as i32;
    
    // 3. 字符转整数（ASCII值）
    let char_to_int = 'A' as u8;
    
    // 4. 整数转字符
    let int_to_char = 65 as char;
    
    println!("整数转浮点数: {} -> {}", integer, int_to_float);
    println!("浮点数转整数: {} -> {}", float, float_to_int);
    println!("字符转整数: 'A' -> {}", char_to_int);
    println!("整数转字符: 65 -> '{}'", int_to_char);
}
```

## 下一步

现在您已经掌握了Rust的基本数据类型。接下来我们将学习控制流，包括条件语句和循环。
