# 控制流

## 条件语句

### if表达式

```rust
fn main() {
    let number = 6;
    
    if number % 4 == 0 {
        println!("number能被4整除");
    } else if number % 3 == 0 {
        println!("number能被3整除");
    } else if number % 2 == 0 {
        println!("number能被2整除");
    } else {
        println!("number不能被4、3或2整除");
    }
    
    // if是表达式，可以返回值
    let condition = true;
    let number = if condition { 5 } else { 6 };
    println!("number的值是: {}", number);
}
```

### 比较运算符

```rust
fn main() {
    let a = 10;
    let b = 20;
    
    // 比较运算
    println!("{} == {}: {}", a, b, a == b);
    println!("{} != {}: {}", a, b, a != b);
    println!("{} < {}: {}", a, b, a < b);
    println!("{} > {}: {}", a, b, a > b);
    println!("{} <= {}: {}", a, b, a <= b);
    println!("{} >= {}: {}", a, b, a >= b);
    
    // 逻辑运算
    let x = true;
    let y = false;
    println!("{} && {}: {}", x, y, x && y);
    println!("{} || {}: {}", x, y, x || y);
    println!("!{}: {}", x, !x);
}
```

## 循环

### loop循环

```rust
fn main() {
    let mut counter = 0;
    
    let result = loop {
        counter += 1;
        
        if counter == 10 {
            break counter * 2; // 返回值
        }
    };
    
    println!("结果是: {}", result);
}
```

### while循环

```rust
fn main() {
    let mut number = 3;
    
    while number != 0 {
        println!("{}!", number);
        number -= 1;
    }
    
    println!("发射!");
    
    // 遍历数组
    let a = [10, 20, 30, 40, 50];
    let mut index = 0;
    
    while index < 5 {
        println!("a[{}] = {}", index, a[index]);
        index += 1;
    }
}
```

### for循环

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];
    
    // 遍历数组
    for element in a.iter() {
        println!("值是: {}", element);
    }
    
    // 使用范围
    for number in 1..4 {
        println!("{}!", number);
    }
    
    // 倒计时
    for number in (1..4).rev() {
        println!("{}!", number);
    }
    println!("发射!");
    
    // 遍历字符串
    let s = "Hello";
    for c in s.chars() {
        println!("字符: {}", c);
    }
}
```

## 练习1：条件判断

创建一个程序，根据分数判断等级：

```rust
fn main() {
    let scores = [85, 92, 78, 96, 88, 65, 72, 90];
    
    for score in scores.iter() {
        let grade = if *score >= 90 {
            "优秀"
        } else if *score >= 80 {
            "良好"
        } else if *score >= 70 {
            "中等"
        } else if *score >= 60 {
            "及格"
        } else {
            "不及格"
        };
        
        println!("分数: {} -> 等级: {}", score, grade);
    }
}
```

## 练习2：循环计算

计算1到100的和，以及阶乘：

```rust
fn main() {
    // 计算1到100的和
    let mut sum = 0;
    for i in 1..=100 {
        sum += i;
    }
    println!("1到100的和: {}", sum);
    
    // 计算阶乘
    let n = 5;
    let mut factorial = 1;
    for i in 1..=n {
        factorial *= i;
    }
    println!("{}! = {}", n, factorial);
    
    // 使用while循环计算斐波那契数列
    let mut a = 0;
    let mut b = 1;
    let mut count = 0;
    
    println!("斐波那契数列前10项:");
    while count < 10 {
        print!("{} ", a);
        let temp = a + b;
        a = b;
        b = temp;
        count += 1;
    }
    println!();
}
```

## 练习3：猜数字游戏

```rust
use std::io;
use std::cmp::Ordering;

fn main() {
    println!("猜数字游戏!");
    println!("请输入一个1到100之间的数字:");
    
    let secret_number = 42; // 实际应用中应该随机生成
    
    loop {
        let mut guess = String::new();
        
        io::stdin()
            .read_line(&mut guess)
            .expect("读取输入失败");
        
        let guess: u32 = match guess.trim().parse() {
            Ok(num) => num,
            Err(_) => {
                println!("请输入有效数字!");
                continue;
            }
        };
        
        match guess.cmp(&secret_number) {
            Ordering::Less => println!("太小了!"),
            Ordering::Greater => println!("太大了!"),
            Ordering::Equal => {
                println!("恭喜你猜对了!");
                break;
            }
        }
    }
}
```

## 练习4：九九乘法表

```rust
fn main() {
    println!("九九乘法表:");
    
    for i in 1..=9 {
        for j in 1..=i {
            print!("{}×{}={}\t", j, i, i * j);
        }
        println!();
    }
}
```

## 练习5：素数判断

```rust
fn main() {
    let numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    
    for num in numbers.iter() {
        if is_prime(*num) {
            println!("{} 是素数", num);
        } else {
            println!("{} 不是素数", num);
        }
    }
}

fn is_prime(n: u32) -> bool {
    if n < 2 {
        return false;
    }
    
    for i in 2..n {
        if n % i == 0 {
            return false;
        }
    }
    
    true
}
```

## 下一步

现在您已经掌握了Rust的控制流。接下来我们将学习函数的定义和使用。
