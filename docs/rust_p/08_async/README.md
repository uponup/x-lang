# Tokio 异步编程完整教程

## 欢迎来到 Tokio 异步编程世界！🚀

这是一套从零到精通的 Tokio 异步编程教程，涵盖了从基础概念到实战项目的完整内容。

## 📚 学习路径

### 🌱 第一步：理解 Tokio

**[01_tokio_intro.md](./01_tokio_intro.md)** - Tokio 入门

- 什么是 Tokio？
- 为什么需要异步编程？
- Tokio 的核心组件
- 安装和配置
- 何时使用 Tokio

**关键要点**：
- 异步 vs 同步的区别
- Tokio 的优势
- 适用场景判断

---

### 📖 第二步：掌握 async/await

**[02_async_basics.md](./02_async_basics.md)** - 异步编程基础

- async 和 await 关键字
- Future 是什么
- 并发执行
- 错误处理
- 生命周期

**关键要点**：
- `async fn` 创建 Future
- `.await` 等待 Future
- 并发 vs 顺序执行
- 使用 `join!` 和 `select!`

**实践练习**：
```rust
#[tokio::main]
async fn main() {
    let task1 = tokio::spawn(async { "任务1" });
    let task2 = tokio::spawn(async { "任务2" });
    
    let (r1, r2) = tokio::join!(task1, task2);
    println!("{:?}, {:?}", r1, r2);
}
```

---

### ⚙️ 第三步：深入 Runtime

**[03_tokio_runtime.md](./03_tokio_runtime.md)** - Tokio Runtime 详解

- Runtime 类型（单线程 vs 多线程）
- 创建和配置 Runtime
- 任务调度
- 性能调优
- 生命周期管理

**关键要点**：
- 选择合适的 Runtime
- 使用 `spawn_blocking` 处理阻塞操作
- 配置工作线程数
- 优雅关闭

**配置示例**：
```rust
use tokio::runtime::Builder;

let rt = Builder::new_multi_thread()
    .worker_threads(4)
    .enable_all()
    .build()
    .unwrap();
```

---

### 🔄 第四步：了解生态

**[04_tokio_vs_others.md](./04_tokio_vs_others.md)** - Tokio vs 其他运行时

- Tokio vs async-std vs smol
- 性能对比
- 生态系统对比
- 选择指南
- 迁移指南

**关键要点**：
- Tokio 是生产环境首选
- async-std 适合学习
- smol 适合快速编译
- 根据需求选择

**对比表**：

| 特性 | Tokio | async-std | smol |
|------|-------|-----------|------|
| 生态 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| 性能 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 易用 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

### 🛠️ 第五步：实战项目

**[05_projects.md](./05_projects.md)** - 实战项目

**6 个完整项目**：
1. 异步 HTTP 服务器（Axum）
2. 并发文件处理器
3. WebSocket 聊天服务器
4. 数据库连接池
5. 定时任务调度器
6. API 请求聚合器

**每个项目包含**：
- ✅ 完整可运行的代码
- ✅ 依赖配置
- ✅ 测试方法
- ✅ 最佳实践

---

## 🎯 学习目标

完成这套教程后，你将能够：

- ✅ 理解异步编程的核心概念
- ✅ 熟练使用 async/await 语法
- ✅ 配置和优化 Tokio Runtime
- ✅ 构建高性能的异步应用
- ✅ 选择合适的异步运行时
- ✅ 应用最佳实践
- ✅ 独立完成实战项目

---

## 📅 建议学习计划

### 第 1 天：基础入门（2-3 小时）
- 阅读 Tokio 入门
- 理解异步编程基础
- 完成简单的 async/await 练习

### 第 2 天：深入理解（3-4 小时）
- 学习 Runtime 概念
- 实践并发任务管理
- 了解其他运行时对比

### 第 3 天：实战练习（4-5 小时）
- 完成项目 1-3
- 理解 Web 服务器构建
- 掌握实时通信

### 第 4 天：进阶应用（4-5 小时）
- 完成项目 4-6
- 学习数据库集成
- 掌握任务调度

---

## 🔧 环境准备

### 1. 安装 Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### 2. 创建项目

```bash
cargo new tokio-demo
cd tokio-demo
```

### 3. 添加依赖

```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
```

### 4. 第一个程序

```rust
#[tokio::main]
async fn main() {
    println!("Hello, Tokio!");
}
```

---

## 🚀 快速开始

### 最简示例

```rust
use tokio::time::{sleep, Duration};

#[tokio::main]
async fn main() {
    println!("开始");
    sleep(Duration::from_secs(1)).await;
    println!("1 秒后");
}
```

### 并发示例

```rust
#[tokio::main]
async fn main() {
    let task1 = tokio::spawn(async {
        println!("任务 1");
    });
    
    let task2 = tokio::spawn(async {
        println!("任务 2");
    });
    
    task1.await.unwrap();
    task2.await.unwrap();
}
```

### HTTP 服务器示例

```rust
use axum::{routing::get, Router};

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(|| async { "Hello!" }));
    
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();
    
    axum::serve(listener, app).await.unwrap();
}
```

---

## 📖 补充资源

### 官方文档
- [Tokio 官方网站](https://tokio.rs/)
- [Tokio 教程](https://tokio.rs/tokio/tutorial)
- [API 文档](https://docs.rs/tokio/)

### 社区资源
- [Tokio Discord](https://discord.gg/tokio)
- [Rust 异步编程书](https://rust-lang.github.io/async-book/)
- [Tokio GitHub](https://github.com/tokio-rs/tokio)

### 相关库
- [Axum](https://github.com/tokio-rs/axum) - Web 框架
- [Tonic](https://github.com/hyperium/tonic) - gRPC
- [reqwest](https://github.com/seanmonstar/reqwest) - HTTP 客户端
- [sqlx](https://github.com/launchbadge/sqlx) - 异步 SQL

---

## 💡 学习技巧

1. **动手实践**：不要只看代码，一定要运行
2. **循序渐进**：按顺序学习，不要跳跃
3. **对比理解**：同步 vs 异步的区别
4. **调试技巧**：使用 `println!` 和 `dbg!` 调试
5. **阅读文档**：遇到问题查官方文档
6. **实战项目**：完成所有示例项目

---

## ❓ 常见问题

### Q1: 什么时候用异步？
**A**: I/O 密集型任务（网络、文件、数据库）

### Q2: 异步一定比同步快吗？
**A**: 不一定。CPU 密集型任务用同步更好。

### Q3: 如何处理阻塞操作？
**A**: 使用 `tokio::task::spawn_blocking`

### Q4: 如何调试异步代码？
**A**: 使用 `tokio-console` 或 `tracing`

### Q5: Tokio vs async-std 选哪个？
**A**: 生产环境优先选 Tokio

---

## 🎓 评估测试

完成学习后，尝试独立完成：

### 初级（掌握基础）
- [ ] 创建一个简单的异步程序
- [ ] 使用 `async/await` 编写函数
- [ ] 并发执行多个任务

### 中级（理解原理）
- [ ] 配置自定义 Runtime
- [ ] 实现超时和重试机制
- [ ] 构建简单的 HTTP 服务器

### 高级（实战应用）
- [ ] 构建完整的 Web API
- [ ] 实现 WebSocket 通信
- [ ] 集成数据库并处理并发

---

## 🌟 下一步

完成 Tokio 学习后，可以探索：

- **Web 框架**：Axum、Actix-web
- **数据库**：sqlx、tokio-postgres
- **消息队列**：lapin (RabbitMQ)
- **gRPC**：tonic
- **监控**：tracing、tokio-console

---

## 📝 反馈和贡献

如果你发现问题或有改进建议，欢迎：
- 提出 Issue
- 提交 Pull Request
- 分享学习心得

---

**祝你学习愉快！Happy Coding! 🦀⚡**

