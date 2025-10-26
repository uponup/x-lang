# Tokio vs 其他异步运行时

## Rust 异步运行时对比

Rust 生态中有多个异步运行时，各有特点。

### 主要运行时

```
┌─────────────────────────────────────────┐
│          Rust 异步生态系统              │
├─────────────────────────────────────────┤
│  Tokio        ← 最流行、功能最全        │
│  async-std    ← 标准库风格              │
│  smol         ← 小巧、简单              │
│  embassy      ← 嵌入式                  │
└─────────────────────────────────────────┘
```

## 1. Tokio

### 特点

```rust
use tokio;

#[tokio::main]
async fn main() {
    println!("Tokio - 最流行的选择");
}
```

**优势**：
- ✅ 生态最丰富（大量库支持）
- ✅ 性能优秀
- ✅ 功能最全（网络、文件、定时器等）
- ✅ 文档完善
- ✅ 生产验证（被大量公司使用）
- ✅ 活跃维护

**劣势**：
- ❌ 相对复杂
- ❌ 编译时间较长
- ❌ 依赖较多

**适用场景**：
- Web 服务器（Axum、Actix-web）
- 微服务
- 数据库应用
- 网络应用
- 生产环境

**依赖**：
```toml
[dependencies]
tokio = { version = "1", features = ["full"] }
```

## 2. async-std

### 特点

```rust
use async_std;

#[async_std::main]
async fn main() {
    println!("async-std - 标准库风格");
}
```

**优势**：
- ✅ API 与标准库一致（易学习）
- ✅ 简单易用
- ✅ 编译快
- ✅ 依赖少

**劣势**：
- ❌ 生态较小
- ❌ 性能略逊于 Tokio
- ❌ 维护不如 Tokio 活跃

**适用场景**：
- 学习异步编程
- 中小型项目
- 需要标准库风格 API

**依赖**：
```toml
[dependencies]
async-std = { version = "1", features = ["attributes"] }
```

### API 对比

```rust
// Tokio
use tokio::fs;
use tokio::io::AsyncReadExt;

#[tokio::main]
async fn main() {
    let mut file = fs::File::open("file.txt").await.unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).await.unwrap();
}

// async-std - 几乎相同的 API
use async_std::fs;
use async_std::io::ReadExt;

#[async_std::main]
async fn main() {
    let mut file = fs::File::open("file.txt").await.unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).await.unwrap();
}
```

## 3. smol

### 特点

```rust
use smol;

fn main() {
    smol::block_on(async {
        println!("smol - 小而美");
    })
}
```

**优势**：
- ✅ 极小的代码体积
- ✅ 非常快的编译速度
- ✅ 简单的 API
- ✅ 灵活性高

**劣势**：
- ❌ 生态较小
- ❌ 功能相对基础
- ❌ 文档较少

**适用场景**：
- 嵌入到其他应用
- CLI 工具
- 需要快速编译
- 小型项目

**依赖**：
```toml
[dependencies]
smol = "2"
```

## 4. embassy

### 特点

```rust
// embassy - 嵌入式
#[embassy_executor::main]
async fn main(spawner: Spawner) {
    // 嵌入式异步代码
}
```

**优势**：
- ✅ 专为嵌入式设计
- ✅ 无需操作系统
- ✅ 极低的内存占用
- ✅ 实时性好

**劣势**：
- ❌ 只适用于嵌入式
- ❌ 学习曲线陡峭

**适用场景**：
- 嵌入式系统
- IoT 设备
- 微控制器

## 详细对比表

| 特性 | Tokio | async-std | smol | embassy |
|------|-------|-----------|------|---------|
| **生态系统** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **性能** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **易用性** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **文档** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **编译速度** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **代码体积** | 大 | 中 | 小 | 极小 |
| **适用平台** | 服务器 | 通用 | 通用 | 嵌入式 |
| **维护状态** | 活跃 | 一般 | 活跃 | 活跃 |

## 性能测试

### 吞吐量对比

```rust
// 测试场景：处理 10万个并发请求

// Tokio
// 吞吐量: ~500,000 req/s
#[tokio::main]
async fn tokio_benchmark() {
    // ...
}

// async-std
// 吞吐量: ~450,000 req/s
#[async_std::main]
async fn async_std_benchmark() {
    // ...
}

// smol
// 吞吐量: ~480,000 req/s
fn smol_benchmark() {
    smol::block_on(async {
        // ...
    })
}
```

### 内存使用

```
Tokio:      ~2.5 MB
async-std:  ~2.0 MB
smol:       ~1.5 MB
```

### 编译时间

```
Tokio:      ~45s (首次编译)
async-std:  ~30s
smol:       ~15s
```

## 生态系统对比

### Web 框架支持

| 框架 | Tokio | async-std | smol |
|------|-------|-----------|------|
| axum | ✅ | ❌ | ❌ |
| actix-web | ✅ | ❌ | ❌ |
| warp | ✅ | ❌ | ❌ |
| tide | ❌ | ✅ | ❌ |
| poem | ✅ | ❌ | ❌ |

### HTTP 客户端

| 库 | Tokio | async-std | smol |
|----|-------|-----------|------|
| reqwest | ✅ | ✅ | ⚠️ |
| surf | ❌ | ✅ | ❌ |
| hyper | ✅ | ❌ | ❌ |

### 数据库

| 库 | Tokio | async-std | smol |
|----|-------|-----------|------|
| sqlx | ✅ | ✅ | ⚠️ |
| tokio-postgres | ✅ | ❌ | ❌ |
| async-postgres | ❌ | ✅ | ❌ |

## 选择指南

### 选择 Tokio 如果：

✅ 构建生产应用  
✅ 需要丰富的生态系统  
✅ 性能是关键  
✅ 使用流行的 Web 框架  
✅ 团队熟悉 Tokio

### 选择 async-std 如果：

✅ 学习异步编程  
✅ 喜欢标准库风格 API  
✅ 中小型项目  
✅ 需要快速原型  
✅ 简单性优先

### 选择 smol 如果：

✅ 需要小的二进制大小  
✅ 快速编译重要  
✅ CLI 工具  
✅ 嵌入到其他应用  
✅ 灵活性需求

### 选择 embassy 如果：

✅ 嵌入式开发  
✅ 无操作系统环境  
✅ IoT 设备  
✅ 微控制器

## 迁移指南

### 从 async-std 迁移到 Tokio

```rust
// async-std
use async_std::task;
use async_std::net::TcpListener;

#[async_std::main]
async fn main() {
    let listener = TcpListener::bind("127.0.0.1:8080").await.unwrap();
    // ...
}

// Tokio
use tokio::task;
use tokio::net::TcpListener;

#[tokio::main]
async fn main() {
    let listener = TcpListener::bind("127.0.0.1:8080").await.unwrap();
    // ...
}
```

主要改动：
1. 更换依赖
2. 替换 `use` 语句
3. 修改宏（`#[async_std::main]` → `#[tokio::main]`）

### 从 Tokio 迁移到 smol

```rust
// Tokio
#[tokio::main]
async fn main() {
    tokio::spawn(async {
        println!("任务");
    }).await.unwrap();
}

// smol
fn main() {
    smol::block_on(async {
        smol::spawn(async {
            println!("任务");
        }).await;
    })
}
```

## 兼容性

### futures crate

所有运行时都兼容 `futures` crate：

```rust
use futures::future::join_all;

// 可以在任何运行时使用
#[tokio::main]
async fn main() {
    let futures = vec![
        async { 1 },
        async { 2 },
        async { 3 },
    ];
    
    let results = join_all(futures).await;
    println!("{:?}", results);
}
```

### 运行时无关的代码

```rust
// 编写运行时无关的异步代码
async fn generic_async_function() {
    // 使用标准 Future 和 Stream
    // 不依赖特定运行时
}

// 可以在任何运行时使用
#[tokio::main]
async fn with_tokio() {
    generic_async_function().await;
}

#[async_std::main]
async fn with_async_std() {
    generic_async_function().await;
}
```

## 混合使用（不推荐）

虽然技术上可行，但不推荐在同一项目中混用运行时：

```rust
// ❌ 不推荐
fn main() {
    // Tokio runtime
    let tokio_rt = tokio::runtime::Runtime::new().unwrap();
    
    // async-std runtime
    async_std::task::block_on(async {
        // ...
    });
    
    // 可能导致问题
}
```

## 社区和支持

### GitHub Stars（2024）

- Tokio: ~20k+ ⭐
- async-std: ~3.5k+ ⭐
- smol: ~1.5k+ ⭐
- embassy: ~3k+ ⭐

### 企业使用

**Tokio**:
- Discord
- Amazon
- Microsoft
- Cloudflare

**async-std**:
- Surf
- 中小型项目

**smol**:
- 独立开发者
- CLI 工具

## 决策树

```
需要异步运行时？
│
├─ 嵌入式? → embassy
│
├─ 快速编译/小体积? → smol
│
├─ 学习/简单项目? → async-std
│
└─ 生产应用/性能/生态? → Tokio ✅
```

## 总结

**推荐优先选择 Tokio**，因为：

1. 🏆 **生态最好**：几乎所有异步库都支持
2. 🚀 **性能最优**：经过大规模验证
3. 📚 **文档完善**：学习资源丰富
4. 🏢 **生产就绪**：被大量企业使用
5. 🔧 **功能全面**：满足各种需求

**其他运行时的价值**：
- **async-std**：学习 + 简单项目
- **smol**：快速编译 + CLI 工具
- **embassy**：嵌入式开发

对于大多数应用开发，**Tokio 是最佳选择**！🦀⚡

