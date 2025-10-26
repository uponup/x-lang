# Tokio 入门：Rust 异步编程

## 什么是 Tokio

**Tokio** 是 Rust 生态系统中最流行的**异步运行时**（Async Runtime），用于编写高性能的异步应用程序。

```
Tokio = 异步运行时 + 异步 I/O + 任务调度 + 定时器 + 网络工具
```

### 核心概念

```rust
// 同步代码 - 阻塞等待
fn fetch_data() -> String {
    // 等待网络响应... 线程被阻塞
    std::thread::sleep(std::time::Duration::from_secs(1));
    "数据".to_string()
}

// 异步代码 - 不阻塞
async fn fetch_data_async() -> String {
    // 等待时可以做其他事... 线程不阻塞
    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
    "数据".to_string()
}
```

## 为什么需要 Tokio？

### 问题：传统同步 I/O 的限制

```rust
use std::net::TcpListener;
use std::io::{Read, Write};

fn main() {
    let listener = TcpListener::bind("127.0.0.1:8080").unwrap();
    
    // 每个连接都需要一个线程
    for stream in listener.incoming() {
        let mut stream = stream.unwrap();
        
        std::thread::spawn(move || {
            let mut buffer = [0; 1024];
            stream.read(&mut buffer).unwrap();  // 阻塞！
            stream.write(b"HTTP/1.1 200 OK\r\n\r\n").unwrap();
        });
    }
}
```

**问题**：
- ❌ 每个连接需要一个线程（10万连接 = 10万线程）
- ❌ 线程创建和切换有开销
- ❌ 内存消耗大（每个线程 ~2MB 栈空间）
- ❌ 大部分时间线程在等待 I/O

### 解决方案：Tokio 异步模型

```rust
use tokio::net::TcpListener;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

#[tokio::main]
async fn main() {
    let listener = TcpListener::bind("127.0.0.1:8080").await.unwrap();
    
    loop {
        let (mut socket, _) = listener.accept().await.unwrap();
        
        // 每个连接是一个轻量级任务，不是线程！
        tokio::spawn(async move {
            let mut buffer = [0; 1024];
            socket.read(&mut buffer).await.unwrap();  // 不阻塞！
            socket.write_all(b"HTTP/1.1 200 OK\r\n\r\n").await.unwrap();
        });
    }
}
```

**优势**：
- ✅ 一个线程可以处理成千上万的连接
- ✅ 任务切换开销极低
- ✅ 内存消耗小
- ✅ 高并发性能优秀

## Tokio 的核心组件

```
┌─────────────────────────────────────┐
│         Tokio Runtime               │
│  ┌──────────────────────────────┐   │
│  │    任务调度器 (Scheduler)    │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │   线程池 (Thread Pool)       │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │   I/O 驱动 (Reactor)         │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │   定时器 (Timer)             │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

### 1. Runtime（运行时）

```rust
// 方式1: 使用宏自动创建运行时
#[tokio::main]
async fn main() {
    println!("Hello from Tokio!");
}

// 方式2: 手动创建运行时
fn main() {
    let runtime = tokio::runtime::Runtime::new().unwrap();
    runtime.block_on(async {
        println!("Hello from Tokio!");
    });
}

// 方式3: 多线程运行时
#[tokio::main(flavor = "multi_thread", worker_threads = 4)]
async fn main() {
    // 使用 4 个工作线程
}
```

### 2. Task（任务）

```rust
use tokio::task;

#[tokio::main]
async fn main() {
    // 创建并发任务
    let task1 = task::spawn(async {
        println!("任务 1 开始");
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;
        println!("任务 1 完成");
        "结果1"
    });
    
    let task2 = task::spawn(async {
        println!("任务 2 开始");
        tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;
        println!("任务 2 完成");
        "结果2"
    });
    
    // 等待任务完成
    let result1 = task1.await.unwrap();
    let result2 = task2.await.unwrap();
    
    println!("结果: {}, {}", result1, result2);
}
```

### 3. async/await 语法

```rust
// async 函数返回 Future
async fn fetch_url(url: &str) -> Result<String, Box<dyn std::error::Error>> {
    let response = reqwest::get(url).await?;  // await 等待异步操作
    let body = response.text().await?;
    Ok(body)
}

#[tokio::main]
async fn main() {
    match fetch_url("https://api.github.com").await {
        Ok(body) => println!("响应: {}", body),
        Err(e) => eprintln!("错误: {}", e),
    }
}
```

## 安装和设置

### Cargo.toml 配置

```toml
[dependencies]
tokio = { version = "1.35", features = ["full"] }

# 或者只选择需要的功能
tokio = { version = "1.35", features = [
    "rt-multi-thread",  # 多线程运行时
    "macros",           # #[tokio::main] 宏
    "net",              # 网络 I/O
    "io-util",          # I/O 工具
    "time",             # 定时器
    "fs",               # 文件系统
    "sync",             # 同步原语
] }
```

### Hello Tokio

```rust
// main.rs
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    println!("开始");
    
    sleep(Duration::from_secs(1)).await;
    
    println!("1 秒后");
}
```

运行：
```bash
cargo run
# 输出:
# 开始
# (等待 1 秒)
# 1 秒后
```

## Tokio 特性对比

### 单线程 vs 多线程运行时

```rust
// 单线程 - 适合简单应用
#[tokio::main(flavor = "current_thread")]
async fn main() {
    // 所有任务在一个线程上运行
}

// 多线程 - 适合 CPU 密集型 + I/O 密集型
#[tokio::main(flavor = "multi_thread")]
async fn main() {
    // 任务可以在多个线程上并行运行
}
```

### 任务优先级

```rust
#[tokio::main]
async fn main() {
    // 普通任务
    tokio::spawn(async {
        println!("普通任务");
    });
    
    // 阻塞任务（CPU 密集型）- 在专门的线程池中运行
    tokio::task::spawn_blocking(|| {
        // CPU 密集型操作
        let sum: u64 = (0..1_000_000).sum();
        println!("计算结果: {}", sum);
    });
}
```

## Tokio vs 其他方案

| 方案 | 并发模型 | 性能 | 适用场景 |
|------|---------|------|---------|
| **线程** | 一个连接一个线程 | 差 | 少量连接 |
| **Tokio** | 多路复用 | 优秀 | 高并发 I/O |
| **Rayon** | 数据并行 | 优秀 | CPU 密集型 |
| **async-std** | 多路复用 | 良好 | 类似 Tokio |

### 性能对比

```rust
// 场景：处理 10,000 个并发请求

// 线程方案
// - 内存: ~20GB (10,000 线程 × 2MB)
// - 上下文切换: 高开销
// ❌ 不可行

// Tokio 方案
// - 内存: ~几十MB
// - 任务切换: 低开销
// ✅ 轻松应对
```

## 何时使用 Tokio

### ✅ 适合 Tokio 的场景

1. **Web 服务器**
```rust
// 处理大量并发 HTTP 请求
use axum::{Router, routing::get};

#[tokio::main]
async fn main() {
    let app = Router::new().route("/", get(|| async { "Hello!" }));
    // 可以处理上万并发连接
}
```

2. **数据库连接池**
```rust
// 管理多个数据库连接
use sqlx::PgPool;

let pool = PgPool::connect("postgres://...").await?;
// 多个请求共享连接池
```

3. **微服务通信**
```rust
// gRPC、消息队列等
use tonic::transport::Server;

Server::builder()
    .add_service(service)
    .serve(addr)
    .await?;
```

4. **实时应用**
```rust
// WebSocket、聊天服务器
use tokio_tungstenite::accept_async;

let ws_stream = accept_async(stream).await?;
// 处理实时消息
```

### ❌ 不适合 Tokio 的场景

1. **CPU 密集型计算**
```rust
// 不好的做法
async fn heavy_computation() {
    // 这会阻塞整个运行时！
    let result: u64 = (0..1_000_000_000).sum();
}

// 好的做法：使用 spawn_blocking
tokio::task::spawn_blocking(|| {
    let result: u64 = (0..1_000_000_000).sum();
    result
}).await
```

2. **简单的命令行工具**
```rust
// 简单的 CLI 不需要异步
fn main() {
    println!("Hello");  // 直接用同步代码即可
}
```

3. **数据并行处理**
```rust
// 使用 Rayon 更合适
use rayon::prelude::*;

let sum: u32 = vec![1, 2, 3, 4, 5]
    .par_iter()
    .map(|x| x * 2)
    .sum();
```

## Tokio 生态系统

### 核心库

```toml
[dependencies]
tokio = "1.35"              # 运行时
tokio-util = "0.7"          # 工具库
```

### Web 框架

```toml
axum = "0.7"                # 现代、快速
actix-web = "4.4"           # 成熟、功能丰富
warp = "0.3"                # 函数式风格
```

### HTTP 客户端

```toml
reqwest = "0.11"            # 高层 HTTP 客户端
hyper = "0.14"              # 底层 HTTP 库
```

### 数据库

```toml
sqlx = "0.7"                # 异步 SQL
tokio-postgres = "0.7"      # PostgreSQL
```

### 消息队列

```toml
lapin = "2.3"               # RabbitMQ
rdkafka = "0.34"            # Kafka
```

## 学习路径

```
1. 理解异步概念
   ↓
2. 掌握 async/await 语法
   ↓
3. 学习 Tokio runtime
   ↓
4. 实践任务管理
   ↓
5. 探索异步 I/O
   ↓
6. 构建真实项目
```

## 快速开始检查清单

- [ ] 安装 Tokio (`tokio = { version = "1", features = ["full"] }`)
- [ ] 理解 async/await 语法
- [ ] 学会使用 `#[tokio::main]`
- [ ] 掌握 `tokio::spawn` 创建任务
- [ ] 了解 `.await` 的作用
- [ ] 实践异步 I/O（网络、文件）
- [ ] 学习错误处理
- [ ] 探索 Tokio 工具（channels, mutex 等）

## 总结

**Tokio** 是 Rust 异步编程的基石：

1. **高性能**：一个线程处理数万并发
2. **易用**：async/await 语法简洁
3. **生态丰富**：大量异步库支持
4. **生产就绪**：被众多公司使用

**核心思想**：
- 不阻塞线程，让 I/O 操作在后台进行
- 使用任务（Task）而不是线程（Thread）
- 事件驱动，高效利用资源

接下来我们将深入学习 Tokio 的各个方面！🚀

## 下一步

- [异步基础概念](./02_async_basics.md)
- [Tokio 任务管理](./03_tokio_tasks.md)
- [异步 I/O 操作](./04_async_io.md)
- [实战项目](./05_projects.md)

