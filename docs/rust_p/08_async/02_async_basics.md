# 异步编程基础

## 什么是异步编程

**异步编程**允许程序在等待某个操作完成时，不阻塞地继续执行其他工作。

### 同步 vs 异步对比

#### 同步方式（阻塞）

```rust
use std::thread;
use std::time::Duration;

fn main() {
    println!("开始任务1");
    thread::sleep(Duration::from_secs(2));  // 阻塞 2 秒
    println!("任务1完成");
    
    println!("开始任务2");
    thread::sleep(Duration::from_secs(2));  // 阻塞 2 秒
    println!("任务2完成");
    
    // 总耗时: 4 秒
}
```

#### 异步方式（非阻塞）

```rust
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    let task1 = tokio::spawn(async {
        println!("开始任务1");
        sleep(Duration::from_secs(2)).await;  // 不阻塞！
        println!("任务1完成");
    });
    
    let task2 = tokio::spawn(async {
        println!("开始任务2");
        sleep(Duration::from_secs(2)).await;  // 不阻塞！
        println!("任务2完成");
    });
    
    // 并发执行
    task1.await.unwrap();
    task2.await.unwrap();
    
    // 总耗时: 约 2 秒（并发执行）
}
```

## async 和 await 关键字

### async 函数

`async` 关键字将函数转换为返回 `Future` 的函数。

```rust
// 普通函数
fn fetch_data() -> String {
    "数据".to_string()
}

// 异步函数
async fn fetch_data_async() -> String {
    "数据".to_string()
}

// async 函数实际上返回一个 Future
// 等价于:
fn fetch_data_async() -> impl Future<Output = String> {
    async {
        "数据".to_string()
    }
}
```

### await 关键字

`.await` 等待一个 `Future` 完成，**但不阻塞线程**。

```rust
#[tokio::main]
async fn main() {
    // 调用异步函数
    let result = fetch_data_async().await;
    println!("结果: {}", result);
}

async fn fetch_data_async() -> String {
    // 模拟异步操作
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    "数据".to_string()
}
```

### Future 是什么

```rust
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};

// Future 是一个 trait
pub trait Future {
    type Output;  // Future 完成后返回的类型
    
    // 尝试完成这个 Future
    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output>;
}

// Poll 有两种状态
pub enum Poll<T> {
    Ready(T),    // Future 已完成，返回结果
    Pending,     // Future 还未完成，稍后再检查
}
```

**简单理解**：
- `Future` 是一个**可能在未来完成**的值
- 调用 `.await` 会等待 `Future` 完成
- 在等待期间，线程可以执行其他任务

## async/await 语法详解

### 基础用法

```rust
#[tokio::main]
async fn main() {
    // 1. 直接 await
    let result = async_function().await;
    
    // 2. 链式 await
    let result = fetch_url("https://api.example.com")
        .await
        .unwrap()
        .parse()
        .await
        .unwrap();
    
    // 3. 在表达式中 await
    if check_status().await {
        println!("状态正常");
    }
    
    // 4. 循环中 await
    for i in 0..5 {
        process_item(i).await;
    }
}

async fn async_function() -> String {
    "结果".to_string()
}

async fn fetch_url(url: &str) -> Result<String, Box<dyn std::error::Error>> {
    Ok("响应".to_string())
}

async fn check_status() -> bool {
    true
}

async fn process_item(i: u32) {
    println!("处理项目 {}", i);
}
```

### async 块

```rust
#[tokio::main]
async fn main() {
    // 普通块
    let x = {
        let a = 1;
        let b = 2;
        a + b
    };
    
    // async 块
    let future = async {
        let a = fetch_a().await;
        let b = fetch_b().await;
        a + b
    };
    
    let result = future.await;
    println!("结果: {}", result);
}

async fn fetch_a() -> i32 { 1 }
async fn fetch_b() -> i32 { 2 }
```

### async 闭包（实验性）

```rust
// 目前需要 nightly 版本
#![feature(async_closure)]

#[tokio::main]
async fn main() {
    let async_closure = async || {
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        "完成"
    };
    
    let result = async_closure().await;
}
```

## 并发执行

### 顺序执行 vs 并发执行

```rust
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    // ❌ 顺序执行 - 慢
    sequential().await;
    
    // ✅ 并发执行 - 快
    concurrent().await;
}

async fn sequential() {
    println!("=== 顺序执行 ===");
    let start = std::time::Instant::now();
    
    task_a().await;  // 等待 1 秒
    task_b().await;  // 等待 1 秒
    task_c().await;  // 等待 1 秒
    
    println!("顺序执行耗时: {:?}", start.elapsed());
    // 输出: 约 3 秒
}

async fn concurrent() {
    println!("=== 并发执行 ===");
    let start = std::time::Instant::now();
    
    // 同时启动三个任务
    let handle_a = tokio::spawn(task_a());
    let handle_b = tokio::spawn(task_b());
    let handle_c = tokio::spawn(task_c());
    
    // 等待所有任务完成
    handle_a.await.unwrap();
    handle_b.await.unwrap();
    handle_c.await.unwrap();
    
    println!("并发执行耗时: {:?}", start.elapsed());
    // 输出: 约 1 秒
}

async fn task_a() {
    println!("任务A开始");
    sleep(Duration::from_secs(1)).await;
    println!("任务A完成");
}

async fn task_b() {
    println!("任务B开始");
    sleep(Duration::from_secs(1)).await;
    println!("任务B完成");
}

async fn task_c() {
    println!("任务C开始");
    sleep(Duration::from_secs(1)).await;
    println!("任务C完成");
}
```

### 使用 join! 宏

```rust
use tokio::join;

#[tokio::main]
async fn main() {
    // join! 同时等待多个 Future
    let (result_a, result_b, result_c) = join!(
        fetch_a(),
        fetch_b(),
        fetch_c()
    );
    
    println!("结果: {}, {}, {}", result_a, result_b, result_c);
}

async fn fetch_a() -> i32 {
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    1
}

async fn fetch_b() -> i32 {
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    2
}

async fn fetch_c() -> i32 {
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    3
}
```

### 使用 select! 宏

```rust
use tokio::select;
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    // select! 等待第一个完成的 Future
    select! {
        result = long_task() => {
            println!("长任务完成: {}", result);
        }
        result = short_task() => {
            println!("短任务完成: {}", result);
        }
        _ = sleep(Duration::from_secs(5)) => {
            println!("超时！");
        }
    }
}

async fn long_task() -> String {
    sleep(Duration::from_secs(10)).await;
    "长任务".to_string()
}

async fn short_task() -> String {
    sleep(Duration::from_secs(1)).await;
    "短任务".to_string()
}
```

## 错误处理

### 使用 ? 操作符

```rust
use std::error::Error;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let data = fetch_and_process().await?;
    println!("数据: {}", data);
    Ok(())
}

async fn fetch_and_process() -> Result<String, Box<dyn Error>> {
    let raw = fetch_data().await?;  // 遇到错误自动返回
    let processed = process_data(raw).await?;
    Ok(processed)
}

async fn fetch_data() -> Result<String, Box<dyn Error>> {
    // 模拟可能失败的操作
    Ok("原始数据".to_string())
}

async fn process_data(data: String) -> Result<String, Box<dyn Error>> {
    Ok(format!("处理后的{}", data))
}
```

### 并发错误处理

```rust
use tokio::try_join;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // try_join! 任何一个失败都会立即返回错误
    let (a, b, c) = try_join!(
        fetch_a(),
        fetch_b(),
        fetch_c()
    )?;
    
    println!("成功: {}, {}, {}", a, b, c);
    Ok(())
}

async fn fetch_a() -> Result<i32, Box<dyn std::error::Error>> {
    Ok(1)
}

async fn fetch_b() -> Result<i32, Box<dyn std::error::Error>> {
    // Err("失败".into())  // 如果这里失败，整个 try_join! 会立即返回错误
    Ok(2)
}

async fn fetch_c() -> Result<i32, Box<dyn std::error::Error>> {
    Ok(3)
}
```

## 异步与生命周期

### 引用参数

```rust
#[tokio::main]
async fn main() {
    let data = String::from("数据");
    process(&data).await;
    println!("数据仍然可用: {}", data);
}

// async 函数可以接受引用
async fn process(data: &str) {
    println!("处理: {}", data);
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
}
```

### 生命周期标注

```rust
// 当需要明确生命周期时
async fn process_with_lifetime<'a>(data: &'a str) -> &'a str {
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    data
}

#[tokio::main]
async fn main() {
    let data = String::from("测试");
    let result = process_with_lifetime(&data).await;
    println!("结果: {}", result);
}
```

### 注意事项：引用和 spawn

```rust
#[tokio::main]
async fn main() {
    let data = String::from("数据");
    
    // ❌ 错误：引用无法跨任务边界
    // tokio::spawn(async {
    //     println!("{}", &data);  // 编译错误！
    // });
    
    // ✅ 正确：移动所有权或克隆
    let data_clone = data.clone();
    tokio::spawn(async move {
        println!("{}", data_clone);
    });
    
    println!("原始数据: {}", data);
}
```

## 异步 Trait（未来特性）

目前 Rust 还不完全支持 `async fn` 在 trait 中，但有解决方案：

### 使用 async-trait

```rust
use async_trait::async_trait;

#[async_trait]
trait DataFetcher {
    async fn fetch(&self, id: u64) -> Result<String, Box<dyn std::error::Error>>;
}

struct ApiClient;

#[async_trait]
impl DataFetcher for ApiClient {
    async fn fetch(&self, id: u64) -> Result<String, Box<dyn std::error::Error>> {
        // 异步实现
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        Ok(format!("数据 {}", id))
    }
}

#[tokio::main]
async fn main() {
    let client = ApiClient;
    let data = client.fetch(42).await.unwrap();
    println!("{}", data);
}
```

## 常见模式

### 1. 超时控制

```rust
use tokio::time::{timeout, Duration};

#[tokio::main]
async fn main() {
    match timeout(Duration::from_secs(2), long_operation()).await {
        Ok(result) => println!("操作完成: {:?}", result),
        Err(_) => println!("操作超时！"),
    }
}

async fn long_operation() -> String {
    tokio::time::sleep(Duration::from_secs(5)).await;
    "完成".to_string()
}
```

### 2. 重试机制

```rust
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    match retry_operation(3).await {
        Ok(result) => println!("成功: {}", result),
        Err(e) => println!("失败: {}", e),
    }
}

async fn retry_operation(max_retries: u32) -> Result<String, String> {
    for i in 0..max_retries {
        match attempt_operation().await {
            Ok(result) => return Ok(result),
            Err(e) => {
                println!("尝试 {} 失败: {}", i + 1, e);
                if i < max_retries - 1 {
                    sleep(Duration::from_secs(1)).await;
                }
            }
        }
    }
    Err("所有重试都失败".to_string())
}

async fn attempt_operation() -> Result<String, String> {
    // 模拟可能失败的操作
    if rand::random::<bool>() {
        Ok("成功".to_string())
    } else {
        Err("失败".to_string())
    }
}
```

### 3. 批量处理

```rust
use futures::future::join_all;

#[tokio::main]
async fn main() {
    let ids = vec![1, 2, 3, 4, 5];
    
    // 创建一组 Future
    let futures: Vec<_> = ids
        .into_iter()
        .map(|id| process_item(id))
        .collect();
    
    // 等待所有完成
    let results = join_all(futures).await;
    
    println!("结果: {:?}", results);
}

async fn process_item(id: u32) -> String {
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    format!("项目 {}", id)
}
```

## 性能对比

```rust
use std::time::Instant;
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    // 顺序执行
    let start = Instant::now();
    for i in 0..10 {
        sleep(Duration::from_millis(100)).await;
    }
    println!("顺序执行: {:?}", start.elapsed());
    // 输出: 约 1000ms
    
    // 并发执行
    let start = Instant::now();
    let mut handles = vec![];
    for i in 0..10 {
        handles.push(tokio::spawn(async move {
            sleep(Duration::from_millis(100)).await;
        }));
    }
    for handle in handles {
        handle.await.unwrap();
    }
    println!("并发执行: {:?}", start.elapsed());
    // 输出: 约 100ms
}
```

## 总结

**异步编程基础**：

1. **async/await**：
   - `async` 创建 Future
   - `.await` 等待 Future 完成

2. **并发**：
   - 使用 `tokio::spawn` 创建并发任务
   - 使用 `join!` 等待多个任务
   - 使用 `select!` 等待第一个完成的任务

3. **关键概念**：
   - Future 是惰性的，需要 `.await` 或 `spawn` 才会执行
   - `.await` 不阻塞线程
   - 异步函数可以并发执行

4. **最佳实践**：
   - 需要并发时使用异步
   - CPU 密集型用 `spawn_blocking`
   - 合理使用超时和重试

下一章我们将深入学习 Tokio 的任务管理！🚀

