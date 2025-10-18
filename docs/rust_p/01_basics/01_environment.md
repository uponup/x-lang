# 环境搭建和Hello World

## 安装Rust

### 1. 安装Rust工具链

```bash
# 下载并安装rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 重新加载shell配置
source ~/.cargo/env

# 验证安装
rustc --version
cargo --version
```

### 2. 配置开发环境

推荐使用VS Code + Rust扩展，或者CLion等IDE。

## 第一个Rust程序

### 使用Cargo创建项目

```bash
# 创建新项目
cargo new hello_world
cd hello_world

# 查看项目结构
tree
```

项目结构：
```
hello_world/
├── Cargo.toml    # 项目配置文件
└── src/
    └── main.rs   # 主程序文件
```

### Hello World程序

```rust
// src/main.rs
fn main() {
    println!("Hello, world!");
}
```

### 运行程序

```bash
# 编译并运行
cargo run

# 或者分步执行
cargo build
./target/debug/hello_world
```

## Cargo.toml 配置文件

```toml
[package]
name = "hello_world"
version = "0.1.0"
edition = "2021"

[dependencies]
# 在这里添加依赖
```

## 练习1：修改Hello World

1. 修改程序输出您的姓名
2. 添加多行输出
3. 使用不同的println!宏

### 答案

```rust
fn main() {
    println!("Hello, 我是Rust学习者!");
    println!("今天开始学习Rust语言");
    println!("Rust是一门系统编程语言");
    
    // 使用不同的格式化
    let name = "张三";
    let age = 25;
    println!("我叫{}，今年{}岁", name, age);
}
```

## 练习2：创建多个函数

```rust
fn main() {
    greet();
    calculate();
    show_info();
}

fn greet() {
    println!("欢迎来到Rust世界!");
}

fn calculate() {
    let a = 10;
    let b = 20;
    let sum = a + b;
    println!("{} + {} = {}", a, b, sum);
}

fn show_info() {
    println!("Rust特点：");
    println!("- 内存安全");
    println!("- 零成本抽象");
    println!("- 并发安全");
}
```

## 下一步

现在您已经成功搭建了Rust开发环境并运行了第一个程序。接下来我们将学习Rust的变量和数据类型。
